import getCheckoutSubPage from '.';

describe('getCheckoutSubPage', () => {
    let router = {};

  beforeEach(() => {
    router = {
      pathname: ''
    };
  });

  it('returns undefined when an invalid pathname is supplied', () => {
    router.pathname = '/';
    expect(getCheckoutSubPage(router)).toBe(undefined);
  });

  it('returns the correct value for the review page', () => {
    router.pathname = '/checkout';
    expect(getCheckoutSubPage(router)).toBe('checkout-review');
  });

  it('returns the correct value for the gift message page', () => {
    router.pathname = '/checkout/gift-message';
    expect(getCheckoutSubPage(router)).toBe('checkout-gift-message');
  });

  it('returns the correct value for the delivery address page', () => {
    router.pathname = '/checkout/delivery-address';
    expect(getCheckoutSubPage(router)).toBe('checkout-delivery-address');
  });

  it('returns the correct value for the payment page', () => {
    router.pathname = '/checkout/payment';
    expect(getCheckoutSubPage(router)).toBe('checkout-payment');
  });
});
