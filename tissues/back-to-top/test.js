import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from '../../utils/tests/testTheming';
import BackToTop from '.';

describe('a back to top component with background prop set to false', () => {
  let componentWrapper;
  let componentElement;
  let button;
  let buttonWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <BackToTop />
    );

    componentElement = componentWrapper.container.firstChild;
    buttonWrapper = componentElement.querySelector('span');
    button = componentElement.querySelector('button');
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has styles', () => {
    const svg = componentElement.querySelector('svg');
    const text = componentElement.querySelector('i');

    expect(componentElement.tagName).toBe('DIV');

    expect(componentElement).toHaveStyle('position: sticky');
    expect(componentElement).toHaveStyle('z-index: 2999');
    expect(componentElement).toHaveStyle('bottom: 0');
    expect(componentElement).toHaveStyle('height: 0');
    expect(buttonWrapper.tagName).toBe('SPAN');
    expect(buttonWrapper).toHaveStyle('transition: visibility 200ms cubic-bezier(0.550,0.085,0.68,0.530),opacity 200ms cubic-bezier(0.550,0.085,0.68,0.530)');
    expect(buttonWrapper).toHaveStyle('position: absolute');
    expect(buttonWrapper).toHaveStyle('bottom: 0');
    expect(buttonWrapper).toHaveStyle('right: 0');
    expect(buttonWrapper).toHaveStyle('visibility: hidden');
    expect(button).toBeDefined();
    expect(button).toHaveStyle('align-items: center');
    expect(button).toHaveStyle('background-color: #FFFFFF');
    expect(button).toHaveStyle('border: 0');
    expect(button).toHaveStyle('bottom: 0');
    expect(button).toHaveStyle('color: #3150A2');
    expect(button).toHaveStyle('display: inline-flex');
    expect(button).toHaveStyle('flex-direction: column');
    expect(button).toHaveStyle('left: 0');
    expect(button).toHaveStyle('max-height: fit-content');
    expect(button).toHaveStyle('outline: 0');
    expect(button).toHaveStyle('padding-top: 1rem');
    expect(button).toHaveStyle('width: 6rem');

    expect(svg).toHaveStyle('transform: rotate(-90deg)');
    expect(svg).toHaveStyle('margin: 0');
    expect(svg).toHaveStyle('stroke: #3150A2');

    expect(text).toHaveStyle('margin-top: 0.5rem');
    expect(text).toHaveStyle('line-height: 1.5');
  });

  it('animates correctly when window is scrolled', () => {
    expect(buttonWrapper).toHaveStyle('visibility: hidden');
    expect(buttonWrapper).toHaveStyle('opacity: 0');
    fireEvent.scroll(global.window, { target: { scrollY: 350 } });
    expect(buttonWrapper).toHaveStyle('visibility: hidden');
    expect(buttonWrapper).toHaveStyle('opacity: 0');
    fireEvent.scroll(global.window, { target: { scrollY: 250 } });
    expect(buttonWrapper).toHaveStyle('visibility: visible');
    expect(buttonWrapper).toHaveStyle('opacity: 1');
    fireEvent.scroll(global.window, { target: { scrollY: 0 } });
    expect(buttonWrapper).toHaveStyle('visibility: hidden');
    expect(buttonWrapper).toHaveStyle('opacity: 0');
  });

  it('scrolls to top when clicked', () => {
    fireEvent.scroll(global.window, { target: { scrollY: 350 } });
    fireEvent.click(button);
    expect(global.window.scrollTo).toHaveBeenCalled();
    expect(global.window.scrollY).toBe(0);
  });
});

describe('a back to top component with background prop set to true', () => {
  let componentWrapper;
  let componentElement;

  beforeEach(() => {
    componentWrapper = render(
      <BackToTop background />
    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has styles', () => {
    // the rest of the styling was tested in tests above, no need to test again
    // only check that the background-color is correct
    const button = componentElement.querySelector('button');
    expect(button).toHaveStyle('background-color: #FAEFD9');
  });
});
