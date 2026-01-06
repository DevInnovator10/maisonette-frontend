import produce from '../../produce';

import * as types from './types';

const initialState = {
  active_mini: -1,
  loading: true,
  minis: []
};

/* eslint-disable consistent-return */
/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
const reducer = produce((draft, action) => {
  switch (action.type) {
    case types.PETITES_SET_PETITES:
      draft.minis = Array.isArray(action.petites?.minis) ? action.petites.minis : [];
      draft.loading = false;
      break;

    case types.PETITES_UPDATE_ACTIVE_MINI:
      draft.active_mini = action.id;
      break;
  }
}, initialState);

export default reducer;
