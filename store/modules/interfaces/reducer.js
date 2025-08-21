import produce from '../../produce';

import * as types from './types';

const initialState = {
  isCartActive: false,
  isFilterModalActive: false,
  isGlobalSearchActive: false,
  isLoading: false,
  isNavigationActive: false,
  isPetiteDropdownActive: false,
  isPromoBarActive: true,
  isSortActive: false,
  isKustomerChatBotStarted: false,
  pageType: 'Page'
};

/* eslint-disable consistent-return */
/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
const reducer = produce((draft, action) => {
  switch (action.type) {
    case types.INTERFACES_SET_PETITE_DROPDOWN_STATE:
      draft.isPetiteDropdownActive = action.isActive;
      break;

    case types.INTERFACES_TOGGLE_GLOBAL_SEARCH_VISIBILITY:
      draft.isGlobalSearchActive = action.isActive;
      break;

    case types.INTERFACES_SET_IS_CART_ACTIVE:
      draft.isCartActive = action.isActive;
      break;

    case types.INTERFACES_SET_IS_NAVIGATION_ACTIVE:
      draft.isNavigationActive = action.isActive;
      break;

    case types.INTERFACES_SET_IS_SORT_ACTIVE:
      draft.isSortActive = action.isActive;
      break;

    case types.INTERFACES_TOGGLE_IS_LOADING:
      draft.isLoading = action.isLoading;
      break;

    case types.INTERFACES_SET_PAGE_TYPE:
      draft.pageType = action.pageType;
      break;

    case types.INTERFACES_KUSTOMER_CHATBOT_STARTED:
      draft.isKustomerChatBotStarted = action.isStarted;
      break;
  }
}, initialState);

export default reducer;
