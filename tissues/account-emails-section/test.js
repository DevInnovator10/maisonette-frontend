import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from '../../utils/tests/testTheming';
import AccountEmailsSection from '.';

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

  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <AccountEmailsSection subscribed={false} />
      </Provider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('should be unsubscribed by default', () => {
    const subscribedRadio = componentWrapper.getByText('Subscribed').querySelector('input');
    const unsubscribedRadio = componentWrapper.getByText('Unsubscribed').querySelector('input');
    expect(subscribedRadio.checked).toEqual(false);
    expect(unsubscribedRadio.checked).toEqual(true);
  });

  it('should have styles', () => {
    const text = componentWrapper.getByText('Fresh arrivals', { exact: false });
    expect(text).toHaveStyle('color: #3150A2');
  });
});
