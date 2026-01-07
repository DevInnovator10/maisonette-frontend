import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from '../../utils/tests/testTheming';
import AccountAddressSection from '.';

const addresses = [
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
];

const mockStore = configureMockStore();
const store = mockStore({
  user: {
    spree_api_key: ''
  },
  profile: {
    id: 1
  }
});

describe('an account section', () => {
  let componentWrapper;
  let componentElement;

  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <AccountAddressSection user={0} token="" addresses={addresses} />
      </Provider>
    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('should render 1 addresses', () => {
    const addressInputs = componentElement.querySelectorAll('input');
    expect(addressInputs.length).toEqual(1);
  });

  it('should have address selected by default', () => {
    const addressInputs = componentElement.querySelectorAll('input');
    expect(addressInputs[0].checked).toEqual(true);
  });
});
