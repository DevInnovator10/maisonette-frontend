import React from 'react';
import {
  waitForElement, fireEvent, act
} from '@testing-library/react';
import { render } from '../../utils/tests/testTheming';
import FormsyInputEmail from '.';

let wrapper;
let input;
let error;
let button;
let form;
describe('newsletter sign up', () => {
  beforeEach(async () => {
    await act(async () => {
      wrapper = await render(
        <FormsyInputEmail
          name="email"
          placeholder="Your Email"
          validations="isEmail"
          validationError="This is not a valid email"
          required
          inverted
          outline
        />
      );
    });
    form = wrapper.container.querySelector('form');
    input = wrapper.container.querySelector('input');
    error = wrapper.container.querySelector('span');
    button = wrapper.container.querySelector('button');
  });
  it('renders correctly', () => {
    expect(wrapper.container.nodeType === 1).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });
  it('displays error message on submit', async () => {
    button = await waitForElement(() => wrapper.container.querySelector('button'));
    input = await waitForElement(() => wrapper.container.querySelector('input'));
    await act(async () => {
      await fireEvent.change(input, { target: { value: 'bad-email@' } });
    });
    button.click();
    error = await waitForElement(() => wrapper.container.querySelector('span'));
    expect(error.textContent).toEqual('Please enter a valid Email Address');
  });
  it('enables button when valid', async () => {
    button = await waitForElement(() => wrapper.container.querySelector('button'));
    input = await waitForElement(() => wrapper.container.querySelector('input'));
    await act(async () => {
      await fireEvent.change(input, { target: { value: 'eric@maisonette.com' } });
    });
    expect(button.disabled).toBeFalsy();
  });
  it('has styles', () => {
    expect(form).toHaveStyle('display: flex');
    expect(input.parentNode).toHaveStyle('width: 100%;');
    expect(button).toHaveStyle('min-width: 145px');
    expect(button).toHaveStyle('flex: 1');
  });
});
