import produce from '../../produce';

import * as types from './types';

const initialState = {
  id: null,
  index: null
};

/* eslint-disable consistent-return */
/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
const reducer = produce((draft, action) => {
  switch (action.type) {
    case types.QUICK_SHOP_SET_ACTIVE:
      draft.id = action.id;
      break;

    case types.QUICK_SHOP_UPDATE_INDEX:
      draft.index = action.index;
      break;
  }
}, initialState);

export default reducer;
