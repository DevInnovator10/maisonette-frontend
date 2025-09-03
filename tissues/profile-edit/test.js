import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from '../../utils/tests/testTheming';
import ProfileEditAction from '.';

const loginResponse = {
  id: 330,
  email: 'email9@example.com',
  persistence_token: null,
  perishable_token: null,
  last_request_at: null,
  login: 'email9@example.com',
  ship_address_id: null,
  bill_address_id: null,
  created_at: '2019-07-18T14:24:16.466Z',
  updated_at: '2019-07-18T14:24:16.469Z',
  spree_api_key: '0cef1bad9cbdf0098a336a406690de1b88d22f6435b06c6a',
  authentication_token: null,
  deleted_at: null,
  first_name: '',
  last_name: '',
  receive_emails_agree: false,
  exemption_number: null,
  vat_id: null,
  avalara_entity_use_code_id: null,
  default_payment_method_token: null
};

const mockStore = configureMockStore();
const store = mockStore({
  profile: loginResponse
});

describe('the profile edit form', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <ProfileEditAction profile={loginResponse} token="123" />
      </Provider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });
});
