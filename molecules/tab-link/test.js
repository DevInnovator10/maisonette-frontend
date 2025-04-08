import React from 'react';
import { render } from '../../utils/tests/testTheming';
import TabLink from '.';

let componentWrapper;
let componentElement;

describe('a tab link', () => {
  beforeEach(() => {
    componentWrapper = render(
      <TabLink href="#22" text="Just In" />
    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has styles', () => {
    expect(componentElement).toHaveStyle('cursor: pointer');
    expect(componentElement).toHaveStyle('letter-spacing: 0.24em');
    expect(componentElement).toHaveStyle('line-height: 5rem');
    expect(componentElement).toHaveStyle('overflow: hidden');
    expect(componentElement).toHaveStyle('position: relative');
    expect(componentElement).toHaveStyle('text-align: center');
    expect(componentElement).toHaveStyle('text-decoration: none');
    expect(componentElement).toHaveStyle('text-transform: uppercase');
    expect(componentElement).toHaveStyle('transition: color 600ms ease');
  });
});
