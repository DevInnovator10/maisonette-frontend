import * as types from './types';

export const setDesktopNavigation = (payload) => (dispatch) => (
    dispatch({
    type: types.NAVIGATION_SET_DESKTOP,
    payload

  })
);

export const setMobileNavigation = (payload) => (dispatch) => (
  dispatch({
    type: types.NAVIGATION_SET_MOBILE,
    payload
  })
);
