import reducer from './reducer';
import * as types from './types';

describe('interfaces module', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      isCartActive: false,
      isFilterModalActive: false,
      isGlobalSearchActive: false,
      isLoading: false,
      isNavigationActive: false,
      isPetiteDropdownActive: false,
      isPromoBarActive: true,
      isSortActive: false,
      pageType: 'Page',
      isKustomerChatBotStarted: false
    });
  });

  it('should set isPetiteDropdownActive to true', () => {
    expect(reducer(undefined, {
      type: types.INTERFACES_SET_PETITE_DROPDOWN_STATE,
      isActive: true
    }).isPetiteDropdownActive).toEqual(true);
  });

  it('should set isGlobalSearchActive to true', () => {
    expect(reducer(undefined, {
      type: types.INTERFACES_TOGGLE_GLOBAL_SEARCH_VISIBILITY,
      isActive: true
    }).isGlobalSearchActive).toEqual(true);
  });

  it('should set isGlobalSearchActive to false', () => {
    expect(reducer(undefined, {
      type: types.INTERFACES_TOGGLE_GLOBAL_SEARCH_VISIBILITY,
      isActive: false
    }).isGlobalSearchActive).toEqual(false);
  });

  it('should set isCartActive to true', () => {
    expect(reducer(undefined, {
      type: types.INTERFACES_SET_IS_CART_ACTIVE,
      isActive: true
    }).isCartActive).toEqual(true);
  });

  it('should set isNavigationActive to false', () => {
    expect(reducer(undefined, {
      type: types.INTERFACES_SET_IS_NAVIGATION_ACTIVE,
      isActive: false
    }).isNavigationActive).toEqual(false);
  });

  it('should set isSortActive to true', () => {
    expect(reducer(undefined, {
      type: types.INTERFACES_SET_IS_SORT_ACTIVE,
      isActive: true
    }).isSortActive).toEqual(true);
  });

  it('should set isLoading to true', () => {
    expect(reducer(undefined, {
      type: types.INTERFACES_TOGGLE_IS_LOADING,
      isLoading: true
    }).isLoading).toEqual(true);
  });

  it('should set the page type', () => {
    expect(reducer(undefined, {
      type: types.INTERFACES_SET_PAGE_TYPE,
      pageType: 'Homepage'
    }).pageType).toEqual('Homepage');
  });

  it('should not break if the page type is undefined', () => {
    expect(reducer(undefined, {

      type: types.INTERFACES_SET_PAGE_TYPE,
      pageType: undefined
    }).pageType).toEqual(undefined);
  });

  it('should set isKustomerChatBotLoaded to true', () => {
    expect(
      reducer(undefined, {
        type: types.INTERFACES_KUSTOMER_CHATBOT_STARTED,
        isStarted: true
      }).isKustomerChatBotStarted
    ).toEqual(true);
  });

  it('should set isKustomerChatBotLoaded to false', () => {
    expect(
      reducer(undefined, {
        type: types.INTERFACES_KUSTOMER_CHATBOT_STARTED,
        isStarted: false
      }).isKustomerChatBotStarted
    ).toEqual(false);
  });
});
