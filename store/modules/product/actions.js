import * as types from './types';

export const setProductDisplayPrice = (price) => (dispatch) => (
    dispatch({
    type: types.PRODUCT_SET_DISPLAY_PRICE,
    price
  })
);
