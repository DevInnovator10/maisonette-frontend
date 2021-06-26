import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useSelector, useDispatch } from 'react-redux';
import * as Sentry from '@sentry/browser';
import { css } from '@emotion/core';
import { toast, TOAST } from '../../utils/toastify';

import IconButton from '../../molecules/icon-button';
import IconHeart from '../../atoms/icon-heart';
import Checkbox from '../../atoms/checkbox';

import { createWishedProduct, deleteWishedProduct } from '../../pages/api';
import {
  addProductToList,
  removeProductFromList,
  addProductToShareableList,
  removeProductFromShareableList,
  removeProductFromAlgoliaList
} from '../../store/modules/lists/actions';
import { logAmplitude } from '../../utils/amplitude';

const Heart = styled(IconHeart)(({ theme }) => ({
  fill: theme.color.white,
  stroke: theme.color.brand,
  '&.is-active': {
    fill: theme.color.brand
  }
}));

const Wishlist = styled(IconButton)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.65)',
  borderRadius: '100%',
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '4rem',
  opacity: 1,
  position: 'absolute',
  right: '1rem',
  top: '1rem',
  width: '4rem',
  transition: `opacity ${theme.animation.slow} ${theme.animation.easeOutQuad},
    transform ${theme.animation.default} ${theme.animation.easeOutQuad}`,
  [Heart]: {
    height: '4rem',
    margin: 0,
    transform: 'scale(0.75)',
    width: '4rem'
  },
  i: { display: 'none' },
  ':hover': {
    transform: 'scale(1.15)'
  },
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    opacity: 0
  }
}));

const WishlistButton = ({ product, ...props }) => {
  const dispatch = useDispatch();
  const [wished_products, spree_api_key] = useSelector(
    (store) => [store.lists.wished_products, store.user.spree_api_key]
  );

  const isProductInWishlist = wished_products.some((p) => p.variant_id === +product.objectID);

  const [active, setActive] = useState(isProductInWishlist);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setActive(isProductInWishlist);
  }, [isProductInWishlist, wished_products]);

  const hasAuthError = (errors = []) => {
    if (!spree_api_key) return true;

    try {
      return errors.find(({ code }) => code === 401);
    } catch (error) {
      Sentry.captureException(error);
      return true;
    }
  };

  const add = async () => {
    setDisabled(true);

    await createWishedProduct({
      body: { wished_product: { variant_id: +product.objectID } }
    }).then((res) => {
      if (res.errors) {
        const isUnauthorized = hasAuthError(res.errors);

        if (isUnauthorized) {
          toast(
            <p>
            You must be
              <a href="/login">signed in</a>
              {' '}
              to add a product to your wishlist
            </p>,
            { type: TOAST.TYPE.INFO }
          );
        } else if (res.errors.find(({ message }) => message?.includes('has already been taken'))) {
          toast('This product has already been added to your wishlist, please refresh the page for updates', { type: TOAST.TYPE.ERROR });
        } else {
          toast('Something went wrong, please try again later', { type: TOAST.TYPE.ERROR });
        }
      }

      dispatch(addProductToList(res));
      // track when a product is added to wishlist using amplitude
      logAmplitude('Add to Wishlist', {
        productId: product?.objectID,
        productSku: product?.manufacturer_id,
        name: product?.title,
        badges: product?.trends,
        category: product?.product_type,
        brand: product?.brand
      });
    }).catch((error) => {
      Sentry.captureException(error);
    });

    setDisabled(false);
  };

  const remove = async () => {
    setDisabled(true);

    const { id } = wished_products.find((p) => p.variant_id === +product.objectID);

    await deleteWishedProduct({ id }).then(() => {
      dispatch(removeProductFromList(id));
      dispatch(removeProductFromAlgoliaList(product.objectID));
      // track when a product is removed from wishlist using amplitude
      logAmplitude('Removed from Wishlist', {
        productId: product?.objectID,
        productSku: product?.manufacturer_id,
        name: product?.title,
        badges: product?.trends,
        category: product?.product_type,
        brand: product?.brand
      });
    }).catch((error) => {
      Sentry.captureException(error);
    });

    setDisabled(false);
  };

  const onWishlistClicked = (e) => {
    // prevent wishlist from triggering anchor
    e.stopPropagation();
    if (active) remove();
    else add();
  };

  return (
    <Wishlist
      aria-label={
        active
          ? `remove "${product.title}", from wishlist`
          : `add "${product.title}", to wishlist`
      }
      text="Wishlist"
      onClick={onWishlistClicked}
      disabled={disabled}
      {...props}
    >
      <Heart className={active ? 'is-active' : undefined} />
    </Wishlist>
  );
};

WishlistButton.propTypes = {
  product: PropTypes.object.isRequired
};

const FILTERED_WISHLISTCHECKBOX_EMO_PROPS = new Set(['active', 'isShareableActive']);

const WishlistCheckbox = styled(Checkbox, {
  shouldForwardProp: (prop) => !FILTERED_WISHLISTCHECKBOX_EMO_PROPS.has(prop)
})`
  visibility: ${({ isShareableActive }) => (isShareableActive ? 'visible' : 'hidden')};
  ::before {
    border-color: ${({ theme }) => theme.color.bluePrimary};
    width: 1.6rem;
    height: 1.6rem;
    margin-top: -8px;
  }
  ::after {
    width: 0;
    transform: none;
    display: none;
    opacity: 0;
  }
  ${({ active, theme }) => active && css`
      ::before {
        background-color: ${theme.color.bluePrimary};
      }
      ::after {
        display: inline-block;
        content: url('data:image/svg+xml,%3Csvg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M9 1L4 6L1 3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"%2F%3E%3C%2Fsvg%3E');
        opacity: 1;
        background: none;
        height: 0px;
        left: 3px;
        opacity: 1;
        top: -1px;
        transform: none;
        transition-property: opacity;
      }
    `}
  height: 24px;
`;

// component created to share a product wished from "My Account"
// in this case is a custom checkbox
const WishlistShareButton = ({ product }) => {
  const dispatch = useDispatch();
  const [wishedProductsToShareStatus, wishedProductsToShare] = useSelector(
    (state) => [
      state.lists.wishedProductsToShareStatus,
      state.lists.wishedProductsToShare
    ]
  );

  // checks if the product exists in the list that was built for products to be shared.
  // Returns a boolean value.
  const isActive = wishedProductsToShare.some((productId) => productId === product.objectID);

  const handleSelectProduct = () => {
    if (isActive) {
      return dispatch(removeProductFromShareableList(product.objectID));
    }
    return dispatch(addProductToShareableList(product.objectID));
  };

  return (
    <WishlistCheckbox
      id={`wishlist-checkbox-${product.objectID}`}
      name={`wishlist-checkbox-${product.objectID}`}
      active={isActive}
      value={product.objectID}
      changed={handleSelectProduct}
      isShareableActive={wishedProductsToShareStatus}
    />
  );
};

WishlistShareButton.propTypes = {
  product: PropTypes.object.isRequired
};

export default WishlistButton;

export { WishlistShareButton };
