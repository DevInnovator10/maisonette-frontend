import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connect } from 'react-redux';

import { toast, TOAST } from '../../utils/toastify';
import IconButton from '../icon-button';
import HeartIcon from '../../atoms/icon-heart';

import { createWishedProduct, deleteWishedProduct } from '../../pages/api';

import { addProductToList, removeProductFromList } from '../../store/modules/lists/actions';

import WishlistToolTip from '../wishlist-tool-tip';

const AddToWishlist = styled(IconButton)`
  border: 0;
  color: ${({ theme }) => theme.color.bluePrimary};
  font-size: 1.6rem;
  font-family: ${(props) => props.theme.font.sans};
  height: 2.5rem;
  line-height: 2.5rem;
  letter-spacing: 0;
  outline: 0 none;
  overflow: visible;
  position: relative;
  padding-top: 0.5rem;

  text-transform: none;
  text-decoration: underline;

  :hover{
    opacity: 1;
  }
`;

const Heart = styled(HeartIcon)`
  && {
    align-self: baseline;
    fill: ${(props) => (props.active ? props.theme.color.brand : props.theme.color.white)};
    stroke: ${(props) => props.theme.color.brand};
    margin-right: 2px;
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
  const [showToolTip, setShowToolTip] = useState(false);
  const [text, setText] = useState(() => {
    if (!props.token) {
      return 'Add to wishlist';
    }
    if (inWishlist) {
      return REMOVE_FROM_WISHLIST_TEXT[0];
    }
    return ADD_TO_WISHLIST_TEXT[0];
  });

  // eslint-disable-next-line consistent-return
  const handleOnToggleWishlist = async () => {
    setIsDisabled(true);

    // user not logged in
    if (!props.token) {
      setShowToolTip((prevState) => !prevState);
      return false;
    }

    // remove from wishlist
    if (inWishlist) {
      setText(REMOVE_FROM_WISHLIST_TEXT[1]);
      const { id } = wishlist.find((p) => p.variant_id === props.product.master.id);
      await deleteWishedProduct({ id }).then((res) => {
        const resData = res?.data ?? res;

        setText(resData.errors ? REMOVE_FROM_WISHLIST_TEXT[3] : REMOVE_FROM_WISHLIST_TEXT[2]);
        props.removeProductFromList(id);
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
          props.addProductToList(resData);
        });
    }

    setTimeout(() => {
      setText(inWishlist ? ADD_TO_WISHLIST_TEXT[0] : REMOVE_FROM_WISHLIST_TEXT[0]);
    }, MESSAGE_DELAY);

    setIsDisabled(false);
  };

  useEffect(() => {
    if (props.token && !getInWishlist(props.lists.wished_products, props.product.master.id)) {
      setText(ADD_TO_WISHLIST_TEXT[0]);
      setIsDisabled(false);
    }
  }, [props.token]);

  useEffect(() => {
    const { wished_products } = props.lists;
    setWishlist(wished_products);
    setInWishlist(getInWishlist(wished_products, product));
  }, [props.lists]);

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
      {!props.token
        ? (
          <AddToWishlist
            onMouseEnter={() => setShowToolTip(true)}
            onMouseLeave={() => setShowToolTip(false)}
            onClick={(e) => {
              e.stopPropagation();
              setShowToolTip(true);
            }}
          >
            <Heart active={wishlist.find((p) => p.variant_id === product)} />
            {text}
            {showToolTip && <WishlistToolTip showToolTip={setShowToolTip} />}
          </AddToWishlist>
        )
        : (
          <AddToWishlist
            clicked={handleOnToggleWishlist}
            id="add-to-wishlist-button"
          >
            <Heart active={wishlist.find((p) => p.variant_id === product)} />
            {text}
          </AddToWishlist>
        )}

    </>
  ) : null;
};

AddToWishList.defaultProps = {
  token: '',
  lists: {},
  product: null,
  addProductToList: () => {},
  removeProductFromList: () => {}
};

AddToWishList.propTypes = {
  token: PropTypes.string,
  lists: PropTypes.object,
  product: PropTypes.object,
  addProductToList: PropTypes.func,
  removeProductFromList: PropTypes.func
};

const mapStateToProps = (state) => ({
  token: state.user.spree_api_key,
  lists: state.lists
});

const mapDispatchToProps = (dispatch) => ({
  addProductToList: (product) => dispatch(addProductToList(product)),
  removeProductFromList: (product) => dispatch(removeProductFromList(product))
});

AddToWishList.displayName = 'AddToWishList';

const ConnectedAddToWishList = connect(mapStateToProps, mapDispatchToProps)(AddToWishList);

AddToWishList.displayName = 'AddToWishList';

export default ConnectedAddToWishList;
