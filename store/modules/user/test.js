import reducer from './reducer';
import * as types from './types';

describe('user module', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      activelyEditingPetiteProfiles: [],
      addresses: [],
      areSearchResultsCorrected: false,
      email: '',
      filters: [],
      firstName: '',
      isAddingNewPetiteProfile: false,
      isLoggedIn: false,
      isSubscribedToReceiveEmails: true,
      lastName: '',
      petiteProfiles: [],
      priceFilter: {},
      searchHint: [],
      searchTerm: '',
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
    });
  });

  it('should remove mini from array of petite profiles by ID', () => {
    expect(reducer({
      petiteProfiles: [{
        age_range_taxons: [
          {
            id: 969,
            name: '0-6m'
          }
        ],
        baby: true,
        birth_day: 18,
        birth_month: 12,
        birth_year: 2018,
        gender_boy: true,
        gender_girl: false,
        gender_taxons: [
          {
            id: 140,
            name: 'Boy'
          },
          {
            id: 833,
            name: 'Baby Boy'
          }
        ],
        id: 582,
        name: 'Freddy Mercury'
      }]
    }, {
      type: types.USER_REMOVE_MINI_FROM_PETITE_PROFILES,
      id: 582
    }).petiteProfiles).toHaveLength(0);
  });

  it('should add an ID to activelyEditingPetiteProfiles', () => {
    expect(reducer(undefined, {
      type: types.USER_ADD_MINI_ACTIVELY_EDITING,
      id: 1
    }).activelyEditingPetiteProfiles).toContain(1);
  });

  it('should update isAddingNewPetiteProfile to true', () => {
    expect(reducer({
      isAddingNewPetiteProfile: false
    }, {
      type: types.USER_UPDATE_ADDING_NEW_PETITE_PROFILE,
      flag: true
    }).isAddingNewPetiteProfile).toEqual(true);
  });

  it('should update selected filters', () => {
    expect(reducer({
      filters: []
    }, {
      type: types.USER_UPDATE_FILTERS,
      filters: [
        {
          id: 'swimwear',
          name: 'Swimwear',
          selected: true,
          parent_id: 'category',
          parent_iname: 'Category'
        }
      ]
    }).filters).toEqual(
      [
        {
          id: 'swimwear',
          name: 'Swimwear',
          selected: true,
          parent_id: 'category',
          parent_iname: 'Category'
        }
      ]
    );
  });

  it('should update selected sort option', () => {
    expect(reducer(undefined, {
      type: types.USER_UPDATE_SORT_OPTION,
      sort: 'best-sellers'
    }).sort).toContain('best-sellers');
  });

  it('should add an address to addresses', () => {
    expect(reducer(undefined, {
      type: types.USER_ADD_ADDRESS,
      address: {
        id: 1,
        firstname: 'John',
        lastname: 'Lennon',
        address1: '1 West 72nd Street',
        address2: 'Suite 23',
        city: 'New York',
        state: 'NY',
        country: 'United States',
        zipcode: '10023',
        phone: '212-456-7890'
      }
    }).addresses).toContainEqual({
      id: 1,
      firstname: 'John',
      lastname: 'Lennon',
      address1: '1 West 72nd Street',
      address2: 'Suite 23',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipcode: '10023',
      phone: '212-456-7890'
    });
  });

  it('should remove an address from addresses', () => {
    expect(reducer({
      addresses: [{
        id: 1,
        firstname: 'John',
        lastname: 'Lennon',
        address1: '1 West 72nd Street',
        address2: 'Suite 23',
        city: 'New York',
        state: 'NY',
        country: 'United States',
        zipcode: '10023',
        phone: '212-456-7890'
      }]
    }, {
      type: types.USER_REMOVE_ADDRESS,
      id: 1
    }).addresses).toEqual([]);
  });

  it('should update active address', () => {
    expect(reducer(undefined, {
      type: types.USER_UPDATE_ACTIVE_ADDRESS,
      id: 1
    }).selectedAddress).toEqual(1);
  });

  it('should update first name', () => {
    expect(reducer(undefined, {
      type: types.USER_UPDATE_FIRST_NAME,
      fname: 'Ralph'
    }).firstName).toEqual('Ralph');
  });

  it('should update last name', () => {
    expect(reducer(undefined, {
      type: types.USER_UPDATE_LAST_NAME,
      lname: 'Macchio'
    }).lastName).toEqual('Macchio');
  });

  it('should update email', () => {
    expect(reducer(undefined, {
      type: types.USER_UPDATE_EMAIL,
      email: 'macchio-man@aol.com'
    }).email).toEqual('macchio-man@aol.com');
  });

  // the value for flag is being retrieved from a cookie, cookies are strings only
  it('should update isSubscribedToReceiveEmails to true', () => {
    expect(reducer(undefined, {
      type: types.USER_UPDATE_SUBSCRIBED_TO_RECEIVE_EMAILS,
      flag: '1'
    }).isSubscribedToReceiveEmails).toEqual(true);
  });

  it('should update isSubscribedToReceiveEmails to false', () => {
    expect(reducer(undefined, {
      type: types.USER_UPDATE_SUBSCRIBED_TO_RECEIVE_EMAILS,
      flag: 'false'
    }).isSubscribedToReceiveEmails).toEqual(false);

    expect(reducer(undefined, {
      type: types.USER_UPDATE_SUBSCRIBED_TO_RECEIVE_EMAILS,
      flag: 'true'
    }).isSubscribedToReceiveEmails).toEqual(false);
  });

  it('should update exisiting search term', () => {
    expect(reducer({
      searchTerm: ''
    }, {
      type: types.USER_UPDATE_SEARCH_TERM,
      term: 'dre'
    }).searchTerm).toEqual('dre');
  });

  it('should update exisiting search hint', () => {

    expect(reducer({
      searchHint: ''
    }, {
      type: types.USER_UPDATE_SEARCH_HINT,
      hint: 'dress'
    }).searchHint).toEqual('dress');
  });

  it('should update the search results count', () => {
    expect(reducer({
      searchResultsCount: null
    }, {
      type: types.USER_UPDATE_SEARCH_RESULTS_COUNT,
      count: 1776
    }).searchResultsCount).toEqual(1776);
  });

  it('should update the Spree API key', () => {
    expect(reducer({
      user: {}
    }, {
      type: types.USER_SET_TOKEN,
      key: 'spree_api_key',
      token: '1234'
    }).spree_api_key).toEqual('1234');
  });
});
