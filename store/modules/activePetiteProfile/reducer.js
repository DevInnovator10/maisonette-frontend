import produce from '../../produce';

import * as types from './types';

const initialState = {
  id: null
};

/* eslint-disable consistent-return */
/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
const reducer = produce((draft, action) => {
  switch (action.type) {
    case types.PETITE_PROFILE_SET_ACTIVE:
      draft.id = action.id;
      break;
  }
}, initialState);

export default reducer;
