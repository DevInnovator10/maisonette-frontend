import deconstructURL from '.';

describe('deconstructURL correctly breaks down the URL', () => {
  let inputURL;
  let expectedObject;

  beforeEach(() => {
    inputURL = '';
    expectedObject = {};
  });

  it('/shop page with queries & taxonomy', () => {
    inputURL = '/shop/baby/girl-accessories/tights-socks?color=Pink&product_type=Socks';
    expectedObject = {
      pathString: '/shop/baby/girl-accessories/tights-socks',
      queryString: 'color=Pink&product_type=Socks',
      pageType: 'shop',
      hierarchicalMenu: ['baby', 'girl-accessories', 'tights-socks'],
      queries: {
        color: 'Pink',
        product_type: 'Socks'
      }
    };

    expect(deconstructURL(inputURL)).toEqual(expectedObject);
  });

  it('/shop page', () => {
    inputURL = '/shop';
    expectedObject = {
      pathString: '/shop',
      pageType: 'shop'
    };

    expect(deconstructURL(inputURL)).toEqual(expectedObject);
  });

  it('/trends page', () => {
    inputURL = '/trends/just-in/gifts?td=top-nav&gender=Boy';
    expectedObject = {
      pathString: '/trends/just-in/gifts',
      queryString: 'td=top-nav&gender=Boy',
      pageType: 'trends',
      pageValue: 'just-in',
      hierarchicalMenu: ['gifts'],
      queries: {
        td: 'top-nav',
        gender: 'Boy'
      }
    };

    expect(deconstructURL(inputURL)).toEqual(expectedObject);
  });

  it('/brands page', () => {
    inputURL = '/brands/ame-lulu/holiday';
    expectedObject = {
      pathString: '/brands/ame-lulu/holiday',
      pageType: 'brands',
      pageValue: 'ame-lulu',
      hierarchicalMenu: ['holiday']
    };

    expect(deconstructURL(inputURL)).toEqual(expectedObject);
  });

  it('/edits page', () => {
    inputURL = '/edits/easter-shop';
    expectedObject = {
      pathString: '/edits/easter-shop',
      pageType: 'edits',
      pageValue: 'easter-shop'
    };

    expect(deconstructURL(inputURL)).toEqual(expectedObject);
  });

  it('/le_scoop homepage', () => {
    inputURL = '/le_scoop';
    expectedObject = {
      pathString: '/le_scoop',
      pageType: 'le_scoop'
    };

    expect(deconstructURL(inputURL)).toEqual(expectedObject);
  });

  it('/le_scoop category page', () => {
    inputURL = '/le_scoop/parenting';
    expectedObject = {
      hierarchicalMenu: ['parenting'],
      pathString: '/le_scoop/parenting',
      pageType: 'le_scoop'
    };

    expect(deconstructURL(inputURL)).toEqual(expectedObject);
  });

  it('/le_scoop subcategory page', () => {
    inputURL = '/le_scoop/parenting/work-money';
    expectedObject = {
      hierarchicalMenu: ['parenting', 'work-money'],
      pathString: '/le_scoop/parenting/work-money',
      pageType: 'le_scoop'
    };

    expect(deconstructURL(inputURL)).toEqual(expectedObject);
  });

  it('/le_scoop tagged story page', () => {
    inputURL = '/le_scoop/parenting/work-money/story-title';
    expectedObject = {
      hierarchicalMenu: ['parenting', 'work-money', 'story-title'],
      pathString: '/le_scoop/parenting/work-money/story-title',
      pageType: 'le_scoop'
    };

    expect(deconstructURL(inputURL)).toEqual(expectedObject);
  });
});
