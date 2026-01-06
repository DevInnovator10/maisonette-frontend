import React from 'react';
import { act } from '@testing-library/react';
import { render } from '../../utils/tests/testTheming';
import MailingListInput from '.';

let wrapper;
let button;
let form;
let icon;

describe('mailing list submit', () => {
  beforeEach(async () => {
    await act(async () => {
      wrapper = render(
        <MailingListInput
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
    button = wrapper.container.querySelector('button');
    icon = wrapper.container.querySelector('svg');
  });

  it('renders correctly', () => {
    expect(wrapper.container.nodeType === 1).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('has styles', () => {
    expect(form).toHaveStyle('display: block');

    expect(button).toHaveStyle('height: 32px');
    expect(button).toHaveStyle('overflow: visible');
    expect(button).toHaveStyle('position: absolute');
    expect(button).toHaveStyle('top: 6px');
    expect(button).toHaveStyle('width: 32px');

    expect(icon).toHaveStyle('fill: transparent');
    expect(icon).toHaveStyle('height: 27px');
    expect(icon).toHaveStyle('stroke-width: 4');
    expect(icon).toHaveStyle('stroke: #fff');
    expect(icon).toHaveStyle('width: 27px');
  });
});
