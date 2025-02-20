import reducer from './reducer';

describe('lists module', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      wished_products: [],
      wishedProductsFromAlgolia: [],
      wishedProductsToShare: [],

      wishedProductsToShareStatus: false,
      wishedProductsShareableStatus: false
    });
  });
});
