import React from 'react';
import { render } from '../../utils/tests/testTheming';
import FacetBreadcrumb from '.';

const categories = {
  defaults: [
    {
      id: 'cat1',
      name: 'Category',
      total_count: 9,
      values: [
        {
          id: 'kids',
          name: 'Kids',
          count: 4107,
          selected: true
        },
        {
          id: 'home',
          name: 'Home',
          count: 5152
        },
        {
          id: 'play',
          name: 'Play',
          count: 3178
        },
        {
          id: 'gifts',
          name: 'Gifts',
          count: 2992
        },
        {
          id: 'baby',
          name: 'Baby',
          count: 2498
        },
        {
          id: 'gear',
          name: 'Gear',
          count: 1488
        },
        {
          id: 'whatsnew',
          name: "What's New",
          count: 1090
        },
        {
          id: 'holiday',
          name: 'Holiday',
          count: 948
        },
        {
          id: 'sale',
          name: 'Sale',
          count: 305
        }
      ]
    },
    {
      id: 'cat2',
      name: 'Category',
      total_count: 4,
      parent_id: 'cat1',
      values: [
        {
          id: 'kids_girlclothing',
          name: 'Girl Clothing',
          count: 3916,
          selected: true
        },
        {
          id: 'kids_girlaccessories',
          name: 'Girl Accessories',
          count: 2338
        },
        {
          id: 'kids_boyclothing',
          name: 'Boy Clothing',
          count: 1383
        },
        {
          id: 'kids_boyaccessories',
          name: 'Boy Accessories',
          count: 545
        }
      ]
    },
    {
      id: 'cat3',
      name: 'Category',
      total_count: 10,
      parent_id: 'cat2',
      values: [
        {
          id: 'kids_girlclothing_dresses',
          name: 'Dresses',
          count: 1128,
          selected: true
        },
        {
          id: 'kids_girlclothing_tops',
          name: 'Tops',
          count: 1162
        },
        {
          id: 'kids_girlclothing_sleepwear',
          name: 'Sleepwear',
          count: 357
        },
        {
          id: 'kids_girlclothing_pants',
          name: 'Pants',
          count: 330
        },
        {
          id: 'kids_girlclothing_outerwear',
          name: 'Outerwear',
          count: 304
        },
        {
          id: 'kids_girlclothing_swim',
          name: 'Swim',
          count: 279
        },
        {
          id: 'kids_girlclothing_rompers',
          name: 'Rompers',
          count: 163
        },
        {
          id: 'kids_girlclothing_skirts',
          name: 'Skirts',
          count: 148
        },
        {
          id: 'kids_girlclothing_shorts',
          name: 'Shorts',
          count: 91
        },
        {
          id: 'kids_girlclothing_basics',
          name: 'Basics',
          count: 34
        }
      ]
    }
  ],
  active: {
    cat1: {
      id: 'kids',
      name: 'Kids',
      count: 4107,
      selected: true
    },
    cat2: {
      id: 'kids_girlclothing',
      name: 'Girl Clothing',
      count: 3916,
      selected: true
    },
    cat3: {
      id: 'kids_girlclothing_dresses',
      name: 'Dresses',
      count: 1128,
      selected: true
    }
  }
};

describe('a facet breadcrumb', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <FacetBreadcrumb categories={categories} page="/shop/kids/girl-clothing/dresses" />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('category 1 equals "Kids"', () => {
    const cat1 = componentWrapper.getByText('Kids');
    expect(cat1).toBeDefined();
  });

  it('category 2 equals "Girl Clothing"', () => {
    const cat2 = componentWrapper.getByText('Girl Clothing');
    expect(cat2).toBeDefined();
  });

  it('category 3 equals "Dresses"', () => {
    const cat3 = componentWrapper.getByText('Dresses');
    expect(cat3).toBeDefined();
  });
});
