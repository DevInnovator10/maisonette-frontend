import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { render } from '../../utils/tests/testTheming';
import Loginform from '.';

const mockStore = configureMockStore();
const store = mockStore({});

let componentWrapper;

describe('the login form', () => {
  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <Loginform />
      </Provider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();

  });
});
