import React from 'react';
import { render } from '../../utils/tests/testTheming';
import MobileNavigation from '.';

const navigationResponse = {
    id: 1,
  'Site Title': 'Maisonette',
  'Site URL': 'www.maisonette.com',
  'Trackers/Analytics': null,
  'Trackers/Analytics Active': null,
  created_at: '2019-01-09T17:57:04.124Z',
  updated_at: '2019-07-17T20:11:36.268Z',
  module: {
    id: 47,
    Title: 'Mobile Global Navigation',
    content: null,
    created_at: '2019-07-17T20:04:02.719Z',
    updated_at: '2019-07-17T20:04:02.770Z',
    Content: {
      nav: [
        {
          url: 'products/on-sale',
          name: 'sale',
          flair: true,
          image: {}
        },
        {
          url: 'products/just-in',
          name: 'new',
          flair: false,
          image: {}
        },
        {
          url: 'baby-home',
          name: 'baby',
          flair: false,
          image: {}
        },
        {
          url: 'clothing-home',
          name: 'kids',
          flair: false,
          image: {}
        },
        {
          url: 'toys-home',
          name: 'toys',
          flair: false,
          image: {}
        },
        {
          url: 'swim-home',
          name: 'new',
          flair: false,
          image: {}
        },
        {
          url: 'shoes-home',
          name: 'shoes',
          flair: false,
          image: {}
        },
        {
          url: 'girl-dresses',
          name: 'dresses',
          flair: false,
          image: {}
        },
        {
          url: 'home-home',
          name: 'home',
          flair: false,
          image: {}
        },
        {
          url: 'gifts-home',
          name: 'gifts',
          flair: false,
          image: {}
        },
        {
          url: 'maisonette-essentials',
          name: 'maisonette essentials',
          flair: false,
          image: {}
        }
      ]
    },
    modulename: 34
  }
};

describe('a mobile nav component', () => {
  let componentWrapper;
  let componentElement;

  const navigation = navigationResponse.module.Content.nav;

  beforeEach(() => {
    componentWrapper = render(
      <MobileNavigation navigation={navigation} />
    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('loads the correct number of nav items', () => {
    const navItemsLength = componentElement.querySelectorAll('a').length;
    expect(navItemsLength).toEqual(navigation.length);
  });
});
