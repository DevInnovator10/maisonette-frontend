import produce from '../../produce';

import * as types from './types';

const initialState = {
  filter: null
};

/* eslint-disable consistent-return */
/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
const reducer = produce((draft, action) => {
  switch (action.type) {
    case types.ACTIVE_FILTER_ACCORDION_TOGGLE_FILTER:
      draft.filter = draft.filter === action.filter ? null : action.filter;
      break;
  }
}, initialState);

export default reducer;
