import * as types from './types';

export const setActivePromo = (index) => (dispatch) => (
  dispatch({
    type: types.ACTIVE_PROMO_TOGGLE,

    index
  })
);
