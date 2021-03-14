import reducer from './reducer';

describe('product module', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({ price: 0 });
  });
});
