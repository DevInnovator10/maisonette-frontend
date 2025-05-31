import * as types from './types';

export const setPromotions = (payload) => (dispatch) => (
  dispatch({
    type: types.PROMOTIONS_SET_PROMOS,
    payload
  })
);
