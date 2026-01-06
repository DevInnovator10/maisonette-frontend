import React from 'react';
import { wait } from '@testing-library/react';
import { render } from '../../utils/tests/testTheming';

import ShippingBoutiqueText from '.';

let container;
let elem;

describe('shipping boutique text', () => {
  beforeEach(async () => {
    container = render(<ShippingBoutiqueText boutique="Chronicle Books" country="us" />).container;
    await wait(() => expect(container.textContent).toContain('Chronicle Books'));
    elem = container.querySelector('div');
  });

  afterEach(() => {
    container = null;
  });

  it('renders correctly', () => {
    expect(container.nodeType === 1).toEqual(true);
    expect(container).toMatchSnapshot();
  });

  it('has boutique name', () => {
    expect(elem.querySelector('p').textContent).toContain('Chronicle Books');
  });

  it('has flag', () => {
    expect(elem.querySelector('svg')).toBeDefined();
  });

  it('has styles', () => {
    expect(elem).toHaveStyle('line-height: 1.3');
    expect(elem).toHaveStyle('color: #3150a2');
    expect(elem).toHaveStyle('align-items: center');

    const styles = global.window.getComputedStyle(elem.querySelector('p'));
    expect(styles['font-family']).toEqual('GT Walsheim Web,Helvetica,Trebuchet MS,sans-serif');

    expect(elem.querySelector('p')).toHaveStyle('font-size: 1.2rem');
    expect(elem.querySelector('p')).toHaveStyle('font-size: 1.2rem');
    expect(elem.querySelector('p')).toHaveStyle('color: #9cb1dc');
  });
});
