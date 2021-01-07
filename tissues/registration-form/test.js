import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from '../../utils/tests/testTheming';
import RegistrationForm from '.';

let componentWrapper;

const mockStore = configureMockStore();

const store = mockStore({});

const handleOnSubmit = () => {};

describe('the registration form', () => {
  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <RegistrationForm onSubmit={handleOnSubmit} />
      </Provider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });
});
