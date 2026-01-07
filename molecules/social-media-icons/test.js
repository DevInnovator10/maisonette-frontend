import React from 'react';
import { waitForElement, fireEvent, act } from '@testing-library/react';
import { render } from '../../utils/tests/testTheming';

import SocialMediaIcons from '.';

let wrapper;
let elem;

const callbackMock = jest.fn();
const icons = [
  { icon: 'instagram', action: callbackMock }
];

describe('social media icons', () => {
  beforeEach(async () => {
    await act(async () => {
      wrapper = await render(<SocialMediaIcons icons={icons} />);
      elem = wrapper.container.querySelector('div');
    });
  });

  it('renders correctly', async () => {
    expect(wrapper.container.nodeType === 1).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('has href attr"', async () => {
    const link = await waitForElement(() => wrapper.container.querySelector('a'));
    expect(link.href.length).toBeGreaterThan(0);
  });

  it('properly calls callback', async () => {
    const icon = await waitForElement(() => wrapper.container.querySelector('a'));
    fireEvent.click(icon);
    expect(callbackMock).toBeCalled();
  });

  it('has styles', async () => {

    const link = await waitForElement(() => wrapper.container.querySelector('a'));
    const svg = link.querySelector('svg');

    expect(elem).toHaveStyle('display: flex');
    expect(elem).toHaveStyle('justify-content: center');

    expect(link).toHaveStyle('display: flex');
    expect(link).toHaveStyle('padding: 1rem 1rem 0');
    expect(link).toHaveStyle('width: 4.4rem');

    expect(svg).toHaveStyle('align-self: start');
    expect(svg).toHaveStyle('width: 100%');
  });
});
