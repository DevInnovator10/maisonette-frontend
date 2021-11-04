import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from '../../utils/tests/testTheming';
import PLPFacet from '.';

const meta = {
  total: 71,
  this_page: 12,
  requested: 12
};

const slider = {
  id: 'sprice',
  name: 'Price',
  label: 'slider',
  values: {
    range_starts: 900,
    range_ends: 3000
  }
};

const facets = [
  {
    id: 'category',
    name: 'Category',
    total_count: 6,
    values: [
      {
        id: 'games',
        name: 'Games',
        count: 28,
        selected: true
      },
      {
        id: 'puzzles',
        name: 'Puzzles',
        count: 25
      },
      {
        id: 'books',
        name: 'Books',
        count: 8
      },
      {
        id: 'artscrafts',
        name: 'Arts & Crafts',
        count: 5
      },
      {
        id: 'costumes',
        name: 'Costumes',
        count: 4
      },
      {
        id: 'blocks',
        name: 'Blocks',
        count: 1
      }
    ]
  },
  {
    id: 'cat1',
    name: 'Category',
    total_count: 2,
    values: [
      {
        id: 'play',
        name: 'Play',
        count: 43
      },
      {
        id: 'gifts',
        name: 'Gifts',
        count: 9
      }
    ]
  },
  {
    id: 'cat2',
    name: 'Category',
    total_count: 2,
    values: [
      {
        id: 'play',
        name: 'Play',
        count: 43
      },
      {
        id: 'gifts',
        name: 'Gifts',
        count: 9
      }
    ]
  },
  {
    id: 'cat3',
    name: 'Category',
    total_count: 2,
    values: [
      {
        id: 'play',
        name: 'Play',
        count: 43
      },
      {
        id: 'gifts',
        name: 'Gifts',
        count: 9
      }
    ]
  }
];

const mockStore = configureMockStore();

const store = mockStore({
  profile: {
    email: 'email@email.com'
  },
  petites: {
    loading: false,
    active_mini: 0,
    minis: []
  }
});

const categories = {
  defaults: [
    {
      id: 'cat1',
      name: 'Category',
      total_count: 4,
      values: [
        {
          id: 'play',
          name: 'Play',
          count: 146
        },
        {
          id: 'gifts',
          name: 'Gifts',
          count: 17
        },
        {
          id: 'holiday',
          name: 'Holiday',
          count: 4
        },
        {
          id: 'home',
          name: 'Home',
          count: 1
        }
      ]
    },
    {
      id: 'cat2',
      name: 'Category',
      total_count: 8,
      parent_id: 'cat1',
      values: [
        {
          id: 'play_learning',
          name: 'Learning',
          count: 136
        },
        {
          id: 'gifts_byprice',
          name: 'By Price',
          count: 13
        },
        {
          id: 'play_kids',
          name: 'Kids',
          count: 8
        },
        {
          id: 'gifts_byage',
          name: 'By Age',
          count: 4
        },
        {
          id: 'holiday_gifts',
          name: 'Gifts',
          count: 4
        },
        {
          id: 'play_outdoor',
          name: 'Outdoor',
          count: 4
        },
        {
          id: 'home_decor',
          name: 'Decor',
          count: 1
        },
        {
          id: 'play_baby',
          name: 'Baby',
          count: 1
        }
      ]
    },
    {
      id: 'cat3',
      name: 'Category',
      total_count: 20,
      parent_id: 'cat2',
      values: [
        {
          id: 'play_learning_games',
          name: 'Games',
          count: 81
        },
        {
          id: 'play_learning_educationaltoys',
          name: 'Educational Toys',
          count: 30
        },
        {
          id: 'play_learning_puzzles',
          name: 'Puzzles',
          count: 10
        },
        {
          id: 'play_learning_books',
          name: 'Books',
          count: 7
        },
        {
          id: 'gifts_byprice_giftsunder50',
          name: 'Gifts Under $50',
          count: 6
        },
        {
          id: 'play_learning_artscrafts',
          name: 'Arts & Crafts',
          count: 6
        },
        {
          id: 'gifts_byprice_giftsunder250',
          name: 'Gifts Under $250',
          count: 3
        },
        {
          id: 'gifts_byprice_overthetop',
          name: 'Over the Top',
          count: 3
        },
        {
          id: 'holiday_gifts_overthetop',
          name: 'Over the Top!',
          count: 3
        },
        {
          id: 'play_learning_blockssortersstackers',
          name: 'Blocks, Sorters & Stackers',
          count: 3
        },
        {
          id: 'play_outdoor_sports',
          name: 'Sports',
          count: 3
        },
        {
          id: 'gifts_byage_giftsforkids',
          name: 'Gifts for Kids',
          count: 2
        },
        {
          id: 'play_kids_plush',
          name: 'Plush',
          count: 2
        },
        {
          id: 'play_learning_stemtoys',
          name: 'STEM Toys',
          count: 2
        },
        {
          id: 'play_outdoor_backyardpark',
          name: 'Backyard & Park',
          count: 2
        },
        {
          id: 'gifts_byage_giftsformoms',
          name: 'Gifts for Moms',
          count: 1
        },
        {
          id: 'gifts_byprice_giftsunder100',
          name: 'Gifts Under $100',
          count: 1
        },
        {
          id: 'home_decor_accents',
          name: 'Accents',
          count: 1
        },
        {
          id: 'play_baby_infantdevelopment',
          name: 'Infant Development',
          count: 1
        },
        {
          id: 'play_kids_playfoodaccessories',
          name: 'Play Food & Accessories',
          count: 1
        }
      ]
    }
  ],
  active: null
};

describe('a plp facet', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <PLPFacet
          activeFilters={['category:puzzles']}
          facets={facets}
          slider={slider}
          meta={meta}
          sort="score"
          page="/shop"
          categories={categories}
          mobileFilterActive={false}
          setMobileFilterActive={() => {}}
          mobileSortActive={false}
          setMobileSortActive={() => {}}
        />
      </Provider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper).toMatchSnapshot();
  });

  it('renders facet count', () => {
    const facetLabel = componentWrapper.getAllByText('Filter', { exact: false })[0];
    expect(facetLabel).toBeDefined();
  });
});
