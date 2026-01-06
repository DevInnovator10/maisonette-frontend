import produce from '../../produce';

import * as types from './types';

const initialState = {
  loading: true
};

/* eslint-disable consistent-return */
/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
const reducer = produce((draft, action) => {
  switch (action.type) {
    case types.PROFILE_SET_PROFILE:
      Object.entries(action.user).forEach(([key, value]) => {
        draft[key] = value;
      });
      break;

    case types.PROFILE_DELETE_PAYMENT_SOURCE:
      draft.payment_sources = draft.payment_sources.filter((payment_source) => (
        payment_source.id !== action.payment_source_id
      ));

      break;

    case types.PROFILE_SET_DEFAULT_PAYMENT_SOURCE:
      draft.payment_sources = draft.payment_sources.map((ps) => {
        const payment_source = { ...ps };
        payment_source.default = ps.id === action.payment_source_id;

        return payment_source;
      });

      break;

    case types.PROFILE_TOGGLE_LOADING:
      // Original code was forcing loading to toggle even when explicitly set to false
      // New code allows toggling only if param isn't provided for loading
      draft.loading = action.loading ?? !draft.loading;
      break;

    case types.PROFILE_SET_ALGOLIA_GUEST_TOKEN:
      draft.algoliaGuestUserToken = action.algoliaGuestUserToken;
      break;

    case types.PROFILE_RESET_PROFILE:
      return initialState;
  }
}, initialState);

export default reducer;
