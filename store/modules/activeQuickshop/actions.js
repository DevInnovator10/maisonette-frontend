import * as types from './types';

export const updateQuickShopProduct = (id) => (dispatch) => (
  dispatch({
    type: types.QUICK_SHOP_SET_ACTIVE,
    id
  })
);

export const updateQuickShopIndex = (index) => (dispatch) => (
  dispatch({
    type: types.QUICK_SHOP_UPDATE_INDEX,
    index
  })
);
