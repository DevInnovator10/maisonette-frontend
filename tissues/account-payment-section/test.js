import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { render } from '../../utils/tests/testTheming';

import AccountPaymentSection from '.';

const mockStore = configureMockStore();
const store = mockStore({
  profile: {
    payment_sources: [
      {
        id: 13,
        default: false,
        source: {
          id: 18,
          payment_type: 'CreditCard',
          token: 'dbnj9v',
          created_at: '2019-08-26T19:48:00.065Z',
          cc_type: 'Visa',
          last_digits: '1111',
          month: '12',
          year: '2022'
        }
      },
      {
        id: 12,
        default: false,
        source: {
          id: 19,
          payment_type: 'CreditCard',
          token: 'dbnj9v',
          created_at: '2019-08-26T19:48:00.065Z',
          cc_type: 'Visa',
          last_digits: '1111',
          month: '12',
          year: '2022'
        }
      }
    ]
  }
});

describe('an payment section', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <AccountPaymentSection token="123" />
      </Provider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });
});
