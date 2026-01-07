import React from 'react';
import { render } from '../../utils/tests/testTheming';
import SectionHeading from '.';

let wrapper;
let elem;
let title;
let dec;

describe('section heading', () => {
  beforeEach(() => {
    wrapper = render(
      <SectionHeading title="Holiday Gift Bundles" dec="Shop All Bundles" href="#" type="taxon" />
    ).container;

    elem = wrapper.querySelector('a');
    title = wrapper.querySelector('h1');
    dec = title.nextSibling;
  });

  it('renders correctly', () => {
    expect(wrapper.nodeType === 1).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('has title', () => {
    expect(title.firstChild.nodeType === 3).toBe(true);
  });

  it('has anchor', () => {
    expect(elem.href).toBeDefined();
  });

  it('has styles', () => {
    expect(elem).toHaveStyle('display: flex');
    expect(elem).toHaveStyle('align-items: center');
    expect(elem).toHaveStyle('text-align: center');

    let styles = global.window.getComputedStyle(title);
    expect(styles['font-family']).toEqual('Canela Web,Big Caslon,Times New Roman,Times,serif');
    expect(title).toHaveStyle('line-height: 1');

    styles = global.window.getComputedStyle(dec);
    expect(styles['font-family']).toEqual('GT Pressura Web,Arial Narrow,Arial,sans-serif');
    expect(styles['border-bottom']).toEqual('0.2rem solid #3150A2');
    expect(dec).toHaveStyle('font-size: 1.2rem');
    expect(dec).toHaveStyle('letter-spacing: 0.25em');
    expect(dec).toHaveStyle('line-height: 1.4rem');
    expect(dec).toHaveStyle('text-decoration: none');
    expect(dec).toHaveStyle('text-transform: uppercase');
    expect(dec).toHaveStyle('padding-bottom: 0.8rem');
    expect(dec).toHaveStyle('margin-top: 2rem');
  });
});
