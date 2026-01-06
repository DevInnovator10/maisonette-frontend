import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import IconButton from '../icon-button';
import { toast, TOAST } from '../../utils/toastify';
import { logAmplitude } from '../../utils/amplitude';
import HeartIcon from '../../atoms/icon-heart';

import { createWishedProduct, deleteWishedProduct } from '../../pages/api';

import {
  addProductToAlgoliaList,
  addProductToList,
  removeProductFromAlgoliaList,
  removeProductFromList
} from '../../store/modules/lists/actions';

const AddToWishlist = styled(IconButton)`
  border: 0;
  height: 2.5rem;
  line-height: 2.5rem;
  outline: 0 none;
  letter-spacing: 0;
  text-transform: none;

  &[disabled] {
    color: ${(props) => props.theme.color.bluePrimary};
    opacity: 1;
  }

  svg {
    margin-right: 0;
  }
`;

const Heart = styled(HeartIcon)`
  && {
    fill: ${(props) => (props.active ? props.theme.color.bluePrimary : props.theme.color.white)};
    stroke: ${(props) => props.theme.color.bluePrimary};
  }
`;

const AddToWishListLabel = styled.label`
  opacity: 0;
  pointer-events: none;
  position: absolute;
`;

const ADD_TO_WISHLIST_TEXT = [
  'Add to Wishlist',
  'Adding to Wishlist...',
  'Added to Wishlist ✓',
  'Problem Adding to Wishlist'
];

const REMOVE_FROM_WISHLIST_TEXT = [
  'Remove from Wishlist',
  'Removing from Wishlist...',
  'Removed from Wishlist ✓',
  'Problem Removing from Wishlist'
];

const MESSAGE_DELAY = 500;

const getInWishlist = (wishlist, id) => wishlist.find((p) => p.variant_id === id);

const AddToWishList = (props) => {
  const [product] = useState(props.product.master.id);
  const [wishlist, setWishlist] = useState(props.lists.wished_products);
  const [isDisabled, setIsDisabled] = useState(!props.token);
  const [inWishlist, setInWishlist] = useState(getInWishlist(wishlist, product));

  const [text, setText] = useState(() => {
    if (!props.token) {
      return 'Sign in to add this to your wishlist!';
    }
    if (inWishlist) {
      return REMOVE_FROM_WISHLIST_TEXT[0];
    }
    return ADD_TO_WISHLIST_TEXT[0];
  });

  const handleOnToggleWishlist = async () => {
    setIsDisabled(true);

    // user not logged in
    if (!props.token) {
      setText(inWishlist ? REMOVE_FROM_WISHLIST_TEXT[3] : ADD_TO_WISHLIST_TEXT[3]);
      toast('<a href="/login">Sign in</a> to add this to your wishlist!', { type: TOAST.TYPE.ERROR });

      setTimeout(() => {
        setText(ADD_TO_WISHLIST_TEXT[0]);
      }, MESSAGE_DELAY);

      return;
    }

    // remove from wishlist
    if (inWishlist) {
      setText(REMOVE_FROM_WISHLIST_TEXT[1]);
      const { id } = wishlist.find((p) => p.variant_id === props.product.master.id);
      await deleteWishedProduct({ id }).then((res) => {
        const resData = res?.data ?? res;

        setText(resData.errors ? REMOVE_FROM_WISHLIST_TEXT[3] : REMOVE_FROM_WISHLIST_TEXT[2]);
        props.removeProductFromList(id);
        props.removeProductFromAlgoliaList(String(id));
        // track when a product is removed from wishlist using amplitude
        logAmplitude('Removed from Wishlist', {
          productId: props?.product?.master?.id,
          productSku: props?.product?.master?.sku,
          name: props?.product?.name,
          badges: props?.product?.trends.map(({ value }) => value),
          category: props?.product?.product_type,
          brand: props?.product?.brand
        });
      });

    // add to wishlist
    } else {
      setText(ADD_TO_WISHLIST_TEXT[1]);
      await createWishedProduct({ body: { wished_product: { variant_id: product } } })
        .then((res) => {
          const resData = res?.data ?? res;
          if (resData.error) {
            if (resData.errors?.variant_id?.includes('has already been taken')) {
              toast('This product has already been added to your wishlist, please refresh the page for updates', { type: TOAST.TYPE.ERROR });
            }
            toast('Something went wrong, please try again later', { type: TOAST.TYPE.ERROR });
            return;
          }

          setText(resData.error ? ADD_TO_WISHLIST_TEXT[3] : ADD_TO_WISHLIST_TEXT[2]);

          const algoliaContent = {
            productId: props?.product?.master?.id,
            productSku: props?.product?.master?.sku,
            name: props?.product?.name,
            badges: props?.product?.trends.map(({ value }) => value),
            category: props?.product?.product_type,
            brand: props?.product?.brand
          };

          props.addProductToList(resData);
          props.addProductToAlgoliaList({ ...algoliaContent });
          // track when a product is added to wishlist using amplitude
          logAmplitude('Add to Wishlist', { ...algoliaContent });
        });
    }

    setTimeout(() => {
      setText(inWishlist ? ADD_TO_WISHLIST_TEXT[0] : REMOVE_FROM_WISHLIST_TEXT[0]);
    }, MESSAGE_DELAY);

    setIsDisabled(false);
  };

  useEffect(() => {
    const { wished_products } = props.lists;
    setWishlist(wished_products);
    setInWishlist(getInWishlist(wished_products, product));

    if (props.token
      && (text !== ADD_TO_WISHLIST_TEXT[2] && text !== REMOVE_FROM_WISHLIST_TEXT[2])) {
      setText(
        getInWishlist(wished_products, product)
          ? REMOVE_FROM_WISHLIST_TEXT[0]
          : ADD_TO_WISHLIST_TEXT[0]
      );
      setIsDisabled(false);
    }
  }, [props.lists, props.token]);

  return !props.product.error ? (
    <>
      <AddToWishListLabel
        htmlFor="add-to-wishlist-button"
        tabIndex={isDisabled ? '0' : '1'}
      >
        Add to Wishlist Button
        {isDisabled && ' is disabled. Sign in to add this to your wishlist.'}
      </AddToWishListLabel>
      <AddToWishlist
        clicked={handleOnToggleWishlist}
        disabled={isDisabled}
        text={text}
        id="add-to-wishlist-button"
        isWishlist
      >
        <Heart active={wishlist.find((p) => p.variant_id === product)} />
      </AddToWishlist>

    </>
  ) : null;
};

AddToWishList.defaultProps = {
  token: '',
  lists: {},
  product: null,
  addProductToList: () => {},
  addProductToAlgoliaList: () => {},
  removeProductFromList: () => {},
  removeProductFromAlgoliaList: () => {}
};

AddToWishList.propTypes = {
  token: PropTypes.string,
  lists: PropTypes.object,
  product: PropTypes.object,
  addProductToList: PropTypes.func,
  addProductToAlgoliaList: PropTypes.func,
  removeProductFromList: PropTypes.func,
  removeProductFromAlgoliaList: PropTypes.func
};

const mapStateToProps = (state) => ({
  token: state.user.spree_api_key,
  lists: state.lists
});

const mapDispatchToProps = (dispatch) => ({
  addProductToList: (product) => dispatch(addProductToList(product)),
  addProductToAlgoliaList: (product) => dispatch(addProductToAlgoliaList(product)),
  removeProductFromList: (product) => dispatch(removeProductFromList(product)),
  removeProductFromAlgoliaList: (product) => dispatch(removeProductFromAlgoliaList(product))
});

AddToWishList.displayName = 'AddToWishList';

const ConnectedAddToWishList = connect(mapStateToProps, mapDispatchToProps)(AddToWishList);

AddToWishList.displayName = 'AddToWishList';

export default ConnectedAddToWishList;
