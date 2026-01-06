import reducer from './reducer';
import * as types from './types';

describe('products module', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      facets: [],
      meta: {},
      pages: null,
      products: [],
      scrollY: 0,
      slider: [],
      slug: '',
      sort: '',
      tracking: {},
      product: null
    });
  });

  it('should update products', () => {
    expect(reducer(undefined, {
      type: types.PRODUCTS_UPDATE_PRODUCTS,
      products: [1, 2, 3]
    }).products).toEqual([1, 2, 3]);
  });

  it('should update scrollY', () => {
    expect(reducer(undefined, {
      type: types.PRODUCTS_UPDATE_SCROLL_Y,
      scrollY: 100
    }).scrollY).toEqual(100);
  });

  it('should update slug', () => {
    expect(reducer(undefined, {
      type: types.PRODUCTS_UPDATE_SLUG,
      slug: 'baby'
    }).slug).toEqual('baby');
  });

  it('should update pages', () => {
    expect(reducer(undefined, {
      type: types.PRODUCTS_UPDATE_PAGES,
      pages: 1
    }).pages).toEqual(1);
  });
});
