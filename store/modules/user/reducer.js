import produce from '../../produce';

import * as types from './types';

const initialState = {
  activelyEditingPetiteProfiles: [],
  addresses: [],
  email: '',
  filters: [],
  priceFilter: {},
  firstName: '',
  isAddingNewPetiteProfile: false,
  isLoggedIn: false,
  isSubscribedToReceiveEmails: true,
  lastName: '',
  petiteProfiles: [],
  searchHint: [],
  searchTerm: '',
  areSearchResultsCorrected: false,
  searchResultsCount: null,
  searchResultsLoading: false,
  selectedAddress: null,
  sort: {
    name: 'Best Match',
    id: 'best-match',
    value: 'score'
  },
  token: '',
  wishlist: [],
  lastPageVisited: '/'
};

/* eslint-disable consistent-return */
/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
const reducer = produce((draft, action) => {
  switch (action.type) {
    case types.USER_REMOVE_MINI_FROM_PETITE_PROFILES:
      draft.petiteProfiles = draft.petiteProfiles.filter((mini) => mini.id !== action.id);
      break;

    case types.USER_UPDATE_PETITE_PROFILES:
      draft.petiteProfiles = action.minis;
      break;

    case types.USER_ADD_MINI_ACTIVELY_EDITING:
      draft.activelyEditingPetiteProfiles.push(action.id);
      break;

    case types.USER_UPDATE_ADDING_NEW_PETITE_PROFILE:
      draft.isAddingNewPetiteProfile = action.flag;
      break;

    case types.USER_UPDATE_FILTERS:
      draft.filters = action.filters;
      break;

    case types.USER_UPDATE_SORT_OPTION:
      draft.sort = action.sort;
      break;

    case types.USER_ADD_ADDRESS:
      draft.addresses.push(action.address);
      break;

    case types.USER_REMOVE_ADDRESS:
      draft.addresses = draft.addresses.filter((address) => address.id !== action.id);
      if (draft.selectedAddress === action.id) {
        draft.selectedAddress = draft.addresses
          .filter((address) => address.id !== action.id)[0].id || null;
      }
      break;

    case types.USER_UPDATE_ACTIVE_ADDRESS:
      draft.selectedAddress = action.id;
      break;

    case types.USER_UPDATE_FIRST_NAME:
      draft.firstName = action.fname;
      break;

    case types.USER_UPDATE_LAST_NAME:
      draft.lastName = action.lname;
      break;

    case types.USER_UPDATE_EMAIL:
      draft.email = action.email;
      break;

    case types.USER_UPDATE_SUBSCRIBED_TO_RECEIVE_EMAILS:
      draft.isSubscribedToReceiveEmails = action.flag === '1';
      break;

    case types.USER_UPDATE_SEARCH_TERM:
      draft.searchTerm = action.term;
      break;

    case types.USER_UPDATE_SEARCH_HINT:
      draft.searchHint = action.hint;
      break;

    case types.USER_UPDATE_SEARCH_RESULTS_CORRECTED:
      draft.areSearchResultsCorrected = action.flag;
      break;

    case types.USER_UPDATE_SEARCH_RESULTS_COUNT:
      draft.searchResultsCount = action.count;
      break;

    case types.USER_SET_TOKEN:
      draft[action.key] = action.token;
      break;

    case types.USER_SET_PAGE_VISITED:
      draft.lastPageVisited = action.page;
      break;

    case types.USER_RESET:
      return initialState;
  }
}, initialState);

export default reducer;
