import React from 'react';
import { render } from '../../utils/tests/testTheming';
import CartIcon from '.';

let wrapper;
let elem;
let count;

describe('a cart icon', () => {
  beforeEach(() => {
    wrapper = render(<CartIcon count={23} />).container;
    elem = wrapper.querySelector('button');
    count = elem.querySelector('span');
  });

  it('renders correctly', () => {
    expect(wrapper.nodeType === 1).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('has count', () => {
    expect(+count.textContent).toBeGreaterThanOrEqual(0);
  });

  it('has styles', () => {
    expect(elem).toHaveStyle('align-items: center');
    expect(elem).toHaveStyle('display: flex');
    expect(elem).toHaveStyle('justify-content: center');
    expect(elem).toHaveStyle('min-width: 4.4rem');
    expect(elem).toHaveStyle('padding: 0px');
    expect(elem).toHaveStyle('width: auto');

    expect(count).toHaveStyle('display: block');
    expect(count).toHaveStyle('text-align: center');
    expect(count).toHaveStyle('min-width: 1.2rem');
  });
});
