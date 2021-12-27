import React from 'react';
import { render } from '../../utils/tests/testTheming';
import Logo from '.';

let componentWrapper;
let componentElement;

describe('a logo component', () => {
  beforeEach(() => {
    componentWrapper = render(<Logo />);
    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has two SVG elements by default', () => {
    const SVGElements = componentWrapper.container.querySelectorAll('svg');
    expect(SVGElements.length).toEqual(2);
    SVGElements.forEach((svg) => expect(svg.nodeType === 1).toEqual(true));
  });

  it('has only house SVG element when "small"', () => {
    componentWrapper = render(<Logo small />);
    const SVGElements = componentWrapper.container.querySelectorAll('svg');
    expect(SVGElements.length).toEqual(1);
    SVGElements.forEach((svg) => expect(svg.nodeType === 1).toEqual(true));
  });

  it('has styles', () => {
    expect(componentElement).toHaveStyle('display: flex');
    expect(componentElement).toHaveStyle('flex-direction: column');
    expect(componentElement).toHaveStyle('align-items: center');

    expect(componentElement.querySelectorAll('svg')[1]).toHaveStyle('padding: 2rem 0');
    expect(componentElement.querySelectorAll('svg')[1]).toHaveStyle('height: 4.8rem');
  });
});
