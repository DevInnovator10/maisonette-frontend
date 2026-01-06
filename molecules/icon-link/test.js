import React from 'react';
import { render } from '../../utils/tests/testTheming';
import IconLink from '.';
import IconCirclePlus from '../../atoms/icon-circle-plus';

let wrapper;
let elem;
let text;
let svg;

describe('an icon link', () => {
  beforeEach(() => {
    wrapper = render(
      <IconLink text="Add/Edit Profiles" svg="onsale" link="#">
        <IconCirclePlus />
      </IconLink>
    ).container;
    elem = wrapper.querySelector('div');
    svg = wrapper.querySelector('svg');
    text = wrapper.querySelector('p');
  });

  it('renders correctly', () => {
    expect(wrapper.nodeType === 1).toEqual(true);
  });

  it('loads an SVG', () => {
    expect(svg).toBeTruthy();
  });

  it('has text', () => {
    expect(text.firstChild.nodeType === 3).toEqual(true);
  });

  it('has styles', () => {
    expect(elem).toHaveStyle('align-items: center');
    expect(elem).toHaveStyle('cursor: pointer');
    expect(elem).toHaveStyle('display: flex');
    expect(elem).toHaveStyle('flex-direction: column');

    expect(elem).toHaveStyle('opacity: 0.75');
    expect(elem).toHaveStyle('text-align: center');
    expect(elem).toHaveStyle('transition: opacity 400ms');

    expect(svg).toHaveStyle('height: 26px');
    expect(svg).toHaveStyle('width: 26px');

    const styles = global.window.getComputedStyle(text);
    expect(styles['font-family']).toEqual('GT Pressura Web,Arial Narrow,Arial,sans-serif');
    expect(text).toHaveStyle('font-size: 1.2rem');
    expect(text).toHaveStyle('letter-spacing: 0.2em');
    expect(text).toHaveStyle('text-transform: uppercase');
    expect(text).toHaveStyle('color: #3150A2');
  });
});
