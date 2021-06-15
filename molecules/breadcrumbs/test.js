import React from 'react';
import { render } from '../../utils/tests/testTheming';
import BreadCrumbs from '.';

const breadcrumbs = [
  {
    name: 'Kids',
    url: '/category/kids'
  },
  {
    name: 'Girl Clothing',
    url: '/category/girl-clothing'
  },
  {
    name: 'Swim',
    url: '/category/swim'
  }
];

describe('the breadcrumb component', () => {
  let componentWrapper;
  let componentElement;

  beforeEach(() => {
    componentWrapper = render(
      <BreadCrumbs breadcrumbs={breadcrumbs} />
    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {

    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('renders all breadcrumbs', () => {
    const crumbs = componentElement.querySelectorAll('li');
    expect(crumbs.length).toEqual(breadcrumbs.length);
  });

  it('all breadcrumbs have href', () => {
    const anchors = componentElement.querySelectorAll('a');
    anchors.forEach((anchor) => {
      expect(anchor.href).toBeDefined();
    });
  });

  it('has styles', () => {
    const anchors = componentElement.querySelectorAll('a');

    for (let i = 0; i < anchors.length - 1; i++) {
      expect(anchors[i]).toHaveStyle('color: #9CB1DC');
    }
  });
});
