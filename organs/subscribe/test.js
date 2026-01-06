import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from '../../utils/tests/testTheming';
import Subscribe from '.';

describe('a subscribe modal', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <Subscribe isActive />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has a close button', () => {
    const closeButton = componentWrapper.getByLabelText('close modal');
    expect(closeButton.tagName).toBe('BUTTON');
    expect(closeButton).toBeDefined();
  });

  it('has an email input', () => {
    const emailInput = componentWrapper.getByLabelText('Email Address');
    expect(emailInput.tagName).toBe('INPUT');
    expect(emailInput).toBeDefined();
  });

  it('has a submit button', () => {
    const submitButton = componentWrapper.getByLabelText('submit join subscribe list');
    expect(submitButton.tagName).toBe('BUTTON');
    expect(submitButton).toBeDefined();
  });

  it('has a heading with Lets Be Email Buddies text', () => {
    const heading = componentWrapper.getByText("Let's Be Email Buddies");

    expect(heading.tagName).toBe('H1');
    expect(heading).toBeDefined();
  });

  it('has correct sub note text color', () => {
    const subNote = componentWrapper.getByText('10% off your first order*');
    expect(subNote).toBeDefined();
    expect(subNote).toHaveStyle('color: #F9BEC4');
  });

  it('sets cookie when closed', () => {
    const closeButton = componentWrapper.getByLabelText('close modal');
    expect(global.document.cookie).toBe('');
    fireEvent.click(closeButton);
    expect(global.document.cookie).toBe('subscribed_to_emails_suppression=1');
  });

  it('auto focuses on input', () => {
    const emailInput = componentWrapper.getByLabelText('Email Address');
    expect(emailInput).toBe(global.document.activeElement);
    expect(emailInput).toHaveFocus();
  });
});
