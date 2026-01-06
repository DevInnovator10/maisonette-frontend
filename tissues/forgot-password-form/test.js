import React from 'react';
import { fireEvent, act, waitForElement } from '@testing-library/react';
import { render } from '../../utils/tests/testTheming';
import ForgotPasswordForm from '.';

let componentWrapper;

const handleOnSubmit = () => {};

describe('a password reset form', () => {
  beforeEach(async () => {
    await act(async () => {
      componentWrapper = await render(
        <ForgotPasswordForm onSubmit={handleOnSubmit} />
      );
    });
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('rejects bad email', async () => {
    const emailInput = await waitForElement(() => componentWrapper.getByPlaceholderText('email@website.com'));
    await act(async () => {
      await fireEvent.change(emailInput, { target: { value: 'bad-email@' } });
    });
    const inputError = await waitForElement(() => emailInput.nextSibling);
    const SubmitButton = await waitForElement(() => componentWrapper.getByText('Reset Password'));
    expect(inputError.textContent).toEqual('Please enter a valid Email Address');
    expect(SubmitButton.disabled).toEqual(true);
  });
});
