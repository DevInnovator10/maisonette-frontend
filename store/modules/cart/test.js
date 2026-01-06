import reducer from './reducer';
import * as types from './types';

describe('active quickshop module', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({ loading: true });
  });

  it('should update cart', () => {
    expect(reducer(undefined, {
      type: types.CART_UPDATE_CART,
      cart: {}
    })).toEqual({ loading: false });
  });
});
