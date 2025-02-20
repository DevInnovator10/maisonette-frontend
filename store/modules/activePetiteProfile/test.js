import reducer from './reducer';
import * as types from './types';

describe('active petite profile module', () => {
    it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      id: null
    });
  });

  it('should add mini to active petite profile', () => {
    expect(reducer(undefined, {
      type: types.PETITE_PROFILE_SET_ACTIVE,
      id: 123
    }).id).toEqual(123);
  });
});
