import reducer from './reducer';
import * as types from './types';

describe('active filter accordion state module', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      filter: null
    });
  });

  it('filter should be set to age_range', () => {
    expect(reducer(undefined, {
      type: types.ACTIVE_FILTER_ACCORDION_TOGGLE_FILTER,
      filter: 'age_range'
    }).filter).toEqual('age_range');
  });
});
