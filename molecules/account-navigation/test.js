import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from '../../utils/tests/testTheming';
import AccountNavigation from '.';

let componentWrapper;
let componentElement;

const mockStore = configureMockStore();

const store = mockStore({});

describe('an account section', () => {
  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <AccountNavigation active="/returns" />
      </Provider>
    );
    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('sets active state to select', () => {
    const select = componentElement.querySelector('select');
    expect(select.value).toEqual('/returns');
  });

  it('sets active state to nav', () => {
    const active = componentWrapper.getByText('Returns', { selector: 'a' });
    expect(active).toHaveStyle('color: #9CB1DC');
    expect(active).toHaveStyle('background-position: bottom center');
  });
});
