import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fireEvent } from '@testing-library/react';
import { render } from '../../utils/tests/testTheming';
import NavigationHeader from '.';

const mockStore = configureMockStore([thunk]);

const store = mockStore({
  activeFilterAccordion: {
    filter: 'age_range'
  },
  activeGlobalNavSelection: {
    id: null
  },
  activePdpDrawer: {
    drawer: null
  },
  activePetiteProfile: {
    id: 1
  },
  activePromo: {
    index: 1
  },
  activeQuickshop: {
    id: null
  },
  activeSortAccordion: {
    sort: 'best_match'
  },
  cart: {
    boutiques: [],
    brands: [],
    coupon: '',
    price: {},
    products: [],
    quantity: 0
  },
  checkout: {
    canSavePayment: false,
    giftMessage: null,
    giftRecipientEmail: null,
    isBillingAddressSame: false,
    isGift: true,
    paymentMethod: null,
    shippingMethod: 'ground',
    step: 'address',
    useStoreCredit: false
  },
  geo: {
    currency: 'USD',
    locale: 'EN'
  },
  interfaces: {
    isCartActive: false,
    isFilterModalActive: false,
    isPetiteDropdownActive: true,
    isPromoBarActive: true,
    isNavigationActive: false
  },
  products: {
    activeProducts: []
  },
  user: {
    searchTerm: ''
  },
  profile: {},
  petites: {
    loading: false
  }
});

const loggedInStore = mockStore({
  ...store.getState(),
  user: {
    activelyEditingPetiteProfiles: [],
    addresses: [
      {
        firstname: 'Eric',
        lastname: 'Goncalves',
        address1: '21-24 31st Street',
        address2: '1G',
        city: 'Astoria',
        state: 'New York',
        country: 'US',
        zipcode: '11105',
        phone: '6468246465',
        id: 4545
      },
      {
        firstname: 'Eric',
        lastname: 'Goncalves',
        address1: '21-24 31st Street',
        address2: '1G',
        city: 'Astoria',
        state: 'New York',
        country: 'US',
        zipcode: '11105',
        phone: '6468246465',
        id: 5152
      }
    ],
    email: 'eric@gnclvs.com',
    filters: {},
    firstName: 'Eric',
    isAddingNewPetiteProfile: false,
    isLoggedIn: false,
    isSubscribedToReceiveEmails: false,
    lastName: 'Goncalves',
    petiteProfiles: [
      {
        age_range_taxons: [
          {
            id: 969,
            name: '0-6m'
          }
        ],
        baby: true,
        birth_day: 5,
        birth_month: 3,
        birth_year: 2017,
        gender_boy: true,
        gender_girl: true,
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
        id: 1,
        name: 'Freddy Mercury'
      }
    ],
    selectedAddress: 4545,
    sort: 'best-match',
    wishlist: []
  },
  profile: {
    first_name: 'Eric',
    email: 'EmoneyGoncalves@email.com'
  },
  petites: {
    loading: false,
    active_mini: -1,
    minis: [
      {
        id: 4,
        user_id: 38,
        name: 'Freddy Mercury',
        birth_year: 2018,
        birth_month: null,
        birth_day: null,
        gender_boy: true,
        gender_girl: true
      },
      {
        id: 5,
        user_id: 38,
        name: 'Kirk Hammett',
        birth_year: 2018,
        birth_month: null,
        birth_day: null,
        gender_boy: true,
        gender_girl: true
      }
    ],
    count: 2,
    total_count: 2,
    current_page: 1,
    pages: 1,
    per_page: 25
  }
});

describe('a navigation header when not logged in', () => {
  let componentWrapper;
  let componentElement;

  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <NavigationHeader />
      </Provider>
    );

    // eslint-disable-next-line
    componentElement = componentWrapper.container.firstChild.children[0];
  });

  it('renders correctly', (done) => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
    done();
  });

  it('has 4 main sections', () => {
    const headerSections = componentElement.children;
    expect(headerSections.length).toEqual(4);
  });

  it('has 1 elements in the left section', () => {
    const headerSections = componentElement.children;
    const headerLeft = headerSections[0];
    expect(headerLeft.children.length).toEqual(1);
  });

  it('has 2 elements in the logo section', () => {
    const headerSections = componentElement.children;
    const headerLogo = headerSections[1];
    expect(headerLogo.children.length).toEqual(2);
  });

  it('has 3 elements in the right section', () => {
    const headerSections = componentElement.children;
    const headerRight = headerSections[3];
    expect(headerRight.children.length).toEqual(3);
  });

  it('does not render any petite profile elements', () => {
    const petiteProfileElements = componentWrapper.queryAllByTitle('Petite Profiles');
    expect(petiteProfileElements.length).toBe(0);
  });

  it('has styles', () => {
    expect(componentElement).toHaveStyle('background-color: #FCF8E8');
    expect(componentElement).toHaveStyle('display: grid');
    expect(componentElement).toHaveStyle('grid-template-columns: 1fr max-content 1fr');
    expect(componentElement).toHaveStyle('position: relative');
    expect(componentElement).toHaveStyle('padding-bottom: 1rem');

    const headerSections = componentElement.children;
    const [menuSection, logoSection, searchSection, rightSection] = headerSections;

    expect(menuSection).toHaveStyle('display: block');

    expect(logoSection).toHaveStyle('display: flex');
    expect(logoSection).toHaveStyle('align-items: center');
    expect(logoSection).toHaveStyle('align-self: flex-end');
    expect(logoSection).toHaveStyle('height: 4.4rem');
    expect(logoSection).toHaveStyle('justify-content: center');

    expect(searchSection).toHaveStyle('display: none');

    expect(rightSection).toHaveStyle('align-items: center');
    expect(rightSection).toHaveStyle('display: flex');
    expect(rightSection).toHaveStyle('justify-content: flex-end');
    expect(rightSection).toHaveStyle('white-space: nowrap');
  });
});

describe('a navigation header with navigation active', () => {
  let componentWrapper;
  let componentElement;

  beforeEach(() => {
    Object.assign(store, { interfaces: { isNavigationActive: false } });

    componentWrapper = render(
      <Provider store={store}>
        <NavigationHeader />
      </Provider>
    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('has visible overlay', () => {
    const navButton = componentElement.querySelector('[title="Toggle Navigation"]');
    const overlay = global.getComputedStyle(navButton, ':after');
    expect(+overlay.opacity).toEqual(1);
  });
});

describe('a navigation header when logged in', () => {
  let componentWrapper;
  let componentElement;

  beforeEach(() => {
    componentWrapper = render(
      <Provider store={loggedInStore}>
        <NavigationHeader />
      </Provider>
    );

    // eslint-disable-next-line
    componentElement = componentWrapper.container.firstChild.children[0];
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has 4 elements in the right section', () => {
    const headerSections = componentElement.children;
    const headerRight = headerSections[3];
    expect(headerRight.children.length).toEqual(4);
  });

  it('renders petite profile elements', () => {
    const petiteProfileElems = componentWrapper.queryAllByTitle('Petite Profiles');
    const desktopPetiteProfileElem = petiteProfileElems[0];
    const mobilePetiteProfileElem = petiteProfileElems[1];
    expect(desktopPetiteProfileElem).toBeDefined();
    expect(mobilePetiteProfileElem).toBeDefined();
  });

  it('has correct styles', () => {
    expect(componentElement).toHaveStyle('padding-bottom: 1rem');
  });

  it('mobile petite profile wrapper has correct styles', () => {
    const petiteProfileElems = componentWrapper.queryAllByTitle('Petite Profiles');
    const mobilePetiteProfileElem = petiteProfileElems[1];
    expect(mobilePetiteProfileElem).toHaveStyle('background-color: #FCF8E8');
    expect(mobilePetiteProfileElem).toHaveStyle('display: flex');
    expect(mobilePetiteProfileElem).toHaveStyle('height: 2.8rem');
    expect(mobilePetiteProfileElem).toHaveStyle('max-height: 2.8rem');
    expect(mobilePetiteProfileElem).toHaveStyle('transition: transform 600ms ease');
  });

  it('hides mobile petite profile elem when scrolled', () => {
    const petiteProfileElems = componentWrapper.queryAllByTitle('Petite Profiles');
    const mobilePetiteProfileElem = petiteProfileElems[1];
    expect(mobilePetiteProfileElem).toHaveStyle('transform: translate3d(0,0,0)');
    fireEvent.scroll(global.window, { target: { scrollY: 120 } });
    expect(mobilePetiteProfileElem).toHaveStyle('transform: translate3d(0, -97px, 0)');
  });
});
