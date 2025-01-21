import React from 'react';
import { render } from '../../utils/tests/testTheming';
import ForgotPasswordForm from '.';

let componentWrapper;

describe('a password reset form', () => {
  beforeEach(() => {
    componentWrapper = render(

      <ForgotPasswordForm token="123" />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });
});
