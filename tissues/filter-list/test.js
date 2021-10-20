import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from '../../utils/tests/testTheming';
import FilterList from '.';

const mockStore = configureMockStore();
const store = mockStore({
  petites: {
    active_mini: 0,
    minis: []
  }
});

const filters = [
  {
    id: 'category',
    name: 'Category',

    total_count: 1,
    values: [
      {
        count: 1,
        id: 'dresses',
        name: 'Dresses'
      }
    ]
  },
  {
    id: 'gender',
    name: 'Gender',
    total_count: 1,
    values: [
      {
        count: 1,
        id: 'unisex',
        name: 'Unisex'
      }
    ]
  },
  {
    id: 'agerange',
    name: 'Age Range',
    total_count: 1,
    values: [
      {
        count: 1,
        id: '1month',
        name: '1 month'
      }
    ]
  }
];

describe('a filter list', () => {
  let componentWrapper;
  let componentElement;

  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <FilterList
          filters={filters}
          isOpened={false}
          facet={filters[0]}
          setOpened={() => {}}
        />
      </Provider>
    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('should render 3 checkboxes', () => {
    const checkboxes = componentElement.querySelectorAll('input');
    expect(checkboxes.length).toEqual(3);
  });

  it('should render all checkboxes unchecked by default', () => {
    const checkboxes = componentElement.querySelectorAll('input');
    checkboxes.forEach((checkbox) => {
      expect(checkbox.checked).toEqual(false);
    });
  });
});
