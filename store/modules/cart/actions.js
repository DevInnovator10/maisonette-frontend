import * as types from './types';

export const updateCart = (cart) => (dispatch) => {
  const cartCount = cart.line_items && cart.state !== 'complete'
    ? cart.line_items.reduce((acc, curr) => acc + curr.quantity, 0)
    : 0;

  if (global?.document) {
    global.document.cookie = `maisonette_cart_count=${cartCount}; Max-Age=${process.env.NEXT_PUBLIC_COOKIE_MAX_AGE}; path=/;`;
  }

  const cartWithCount = { ...cart, count: cartCount };

  return dispatch({
    type: types.CART_UPDATE_CART,
    cart: cartWithCount
  });
};

export const updateCount = (count) => (dispatch) => (
  dispatch({
    type: types.CART_UPDATE_COUNT,
    count
  })
);

export const updateCartLoading = (loading) => (dispatch) => (
  dispatch({
    type: types.CART_UPDATE_LOADING,
    loading
  })
);

export const removeCart = () => (dispatch) => (

  dispatch({
    type: types.CART_REMOVE_CART
  })
);
