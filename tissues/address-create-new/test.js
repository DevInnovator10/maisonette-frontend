import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from '../../utils/tests/testTheming';
import AddressCreateNew from '.';

const mockStore = configureMockStore();
const store = mockStore({
  profile: {
    email: 'email34@example.com',
    first_name: 'Eric',
    last_name: 'Goncalves',
    id: 35,
    subscribed: false,
    addresses: [
      {
        id: 20,
        firstname: 'John',
        lastname: null,
        full_name: 'John',
        address1: 'A Different Road',
        address2: 'Northwest',
        city: 'Herndon',
        zipcode: '10020',
        phone: '555-555-0199',
        company: 'Company',
        alternative_phone: '555-555-0199',
        country_id: 18,
        country_iso: 'US',
        state_id: 18,
        state_name: null,
        state_text: 'AL',
        country: {
          id: 18,
          iso_name: 'UNITED STATES',
          iso: 'US',
          iso3: 'USA',
          name: 'United States',
          numcode: 840
        },
        default: true
      }
    ],
    payment_sources: [
      {
        id: 3,
        default: true,
        source: {
          id: 3,
          payment_type: 'CreditCard',
          token: null,
          created_at: '2019-08-29T14:39:15.558Z',
          cc_type: null,
          last_digits: null,
          month: null,
          year: null
        }
      },
      {
        id: 4,
        default: false,
        source: {
          id: 4,
          payment_type: 'ApplePayCard',
          token: null,
          created_at: '2019-08-29T14:39:15.572Z',
          cc_type: null,
          last_digits: null,
          month: null,
          year: null
        }
      },
      {
        id: 5,
        default: false,
        source: {
          id: 5,
          payment_type: 'PayPalAccount',
          token: null,
          created_at: '2019-08-29T14:39:15.585Z',
          email: null
        }
      }

    ]
  }
});

describe('an address add action', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <AddressCreateNew />
      </Provider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });
});
