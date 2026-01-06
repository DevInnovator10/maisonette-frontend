import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { render } from '../../utils/tests/testTheming';
import GuestForm from '.';

const mockStore = configureMockStore();

const store = mockStore({
  cart: {}
});

let componentWrapper;

const handleOnSubmit = () => {};

describe('an address add action', () => {
  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <GuestForm onSubmit={handleOnSubmit} />
      </Provider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });
});
