import * as types from './types';

export const toggleActiveFilterAccordion = (filter) => (dispatch) => (
  dispatch({
    type: types.ACTIVE_FILTER_ACCORDION_TOGGLE_FILTER,
    filter
  })

);
