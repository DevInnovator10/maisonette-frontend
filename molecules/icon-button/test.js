import React from 'react';

import { render } from '../../utils/tests/testTheming';
import IconButton from '.';
import Heart from '../../atoms/icon-heart';

let componentWrapper;
let componentElement;

describe('a footer copy component', () => {
  beforeEach(() => {
    componentWrapper = render(
      <IconButton text="Wishlist">
        <Heart />
      </IconButton>
    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has an SVG', () => {
    const svgElement = componentElement.querySelector('svg');
    expect(svgElement.nodeType === 1).toEqual(true);
  });

  it('has text', () => {
    const SVG = componentElement.querySelector('i');
    expect(SVG.firstChild.nodeType === 3).toEqual(true);
  });

  it('has styles', () => {
    const svg = componentElement.querySelector('svg');

    expect(componentElement).toHaveStyle('display: flex');

    expect(svg).toHaveStyle('align-self: center');
    expect(svg).toHaveStyle('fill: transparent');
    expect(svg).toHaveStyle('height: 2.7rem');

    expect(svg).toHaveStyle('width: 2.7rem');
  });
});
