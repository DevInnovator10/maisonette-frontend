import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from '../../utils/tests/testTheming';
import FilterRemove from '.';

const mockStore = configureMockStore();
const store = mockStore({
  activeFilterAccordion: {
    filter: null
  },
  user: {
    filters: ['gender:unisex'],
    sort: {
      name: 'Just In',
      id: 'just-in',
      value: 'date+rev'
    }
  },
  products: {
    slug: 'kids'
  },
  petites: {
    active_mini: 0,
    minis: []
  }
});

const facets = [
  {
    id: 'category',
    name: 'Category',
    total_count: 1,
    values: [
      {
        id: 'shoes',
        name: 'Shoes',
        count: 393,
        selected: true
      }
    ]
  }
];

const slider = {
  id: 'sprice',
  name: 'Price',
  label: 'slider',
  values: {
    range_starts: 0,
    range_ends: 750000,
    selected: true,
    selected_range: {
      start: 0,
      end: 1000
    }
  }
};

describe('an filter list remove remove', () => {
  let componentWrapper;
  let componentElement;

  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <FilterRemove facets={facets} count={1} slider={slider} onClear={() => {}} />
      </Provider>
    );
    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has styles', () => {
    expect(componentElement).toHaveStyle('cursor: pointer');
    expect(componentElement).toHaveStyle('display: flex');
    expect(componentElement).toHaveStyle('flex-direction: row');
    expect(componentElement).toHaveStyle('max-height: 3rem');
    expect(componentElement).toHaveStyle('position: relative');
    expect(componentElement).toHaveStyle('text-overflow: ellipsis');
  });
});
