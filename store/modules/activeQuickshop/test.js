import reducer from './reducer';
import * as types from './types';

describe('active quickshop module', () => {
    it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      id: null,
      index: null
    });
  });

  it('should add product to active quickshop', () => {
    expect(reducer(undefined, {
      type: types.QUICK_SHOP_SET_ACTIVE,
      id: 123
    }).id).toEqual(123);
  });

  it('should update active product index', () => {
    expect(reducer(undefined, {
      type: types.QUICK_SHOP_UPDATE_INDEX,
      index: 5
    }).index).toEqual(5);
  });
});
