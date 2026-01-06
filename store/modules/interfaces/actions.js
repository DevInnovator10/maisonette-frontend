import * as types from './types';

export const togglePetiteDropdownState = (isActive) => (dispatch) => (
  dispatch({
    type: types.INTERFACES_SET_PETITE_DROPDOWN_STATE,
    isActive
  })
);

export const toggleGlobalSearchVisibility = (isActive) => (dispatch) => (
  dispatch({
    type: types.INTERFACES_TOGGLE_GLOBAL_SEARCH_VISIBILITY,
    isActive
  })
);

export const toggleCartModalVisibility = (isActive) => (dispatch) => (
  dispatch({
    type: types.INTERFACES_SET_IS_CART_ACTIVE,
    isActive
  })
);

export const toggleNavigationVisibility = (isActive) => (dispatch) => (
  dispatch({
    type: types.INTERFACES_SET_IS_NAVIGATION_ACTIVE,
    isActive
  })
);

export const toggleSortAccordionVisibility = (isActive) => (dispatch) => (
  dispatch({
    type: types.INTERFACES_SET_IS_SORT_ACTIVE,
    isActive
  })
);

export const toggleIsLoading = (isLoading) => (dispatch) => (
  dispatch({
    type: types.INTERFACES_TOGGLE_IS_LOADING,
    isLoading
  })
);

export const setGlobalPageType = (pageType) => (dispatch) => (
  dispatch({
    type: types.INTERFACES_SET_PAGE_TYPE,
    pageType
  })
);

export const setKustomerChatBotStarted = (isStarted) => (dispatch) => (
  dispatch({
    type: types.INTERFACES_KUSTOMER_CHATBOT_STARTED,
    isStarted
  })
);
