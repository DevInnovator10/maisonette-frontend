import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from '../../utils/tests/testTheming';
import { standardCart, cartWithSameVariantDiffMonograms } from '../../utils/tests/cartData';
import CheckoutShippingStep from '.';

const mockStore = configureMockStore();

describe('the checkout shipping step', () => {
    const store = mockStore({ cart: standardCart });
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}><CheckoutShippingStep completedSteps={['address']} /></Provider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('renders title with proper step and label', () => {
    const title = componentWrapper.getByText('2. Shipping');
    expect(title).toBeDefined();
  });

  it('shows proper gift wrap details', () => {
    standardCart.shipments.forEach((shipment, idx) => {
      const giftWrapNote = componentWrapper.getByTestId(`gift-wrap-shipment-${idx}`);
      expect(giftWrapNote).toHaveTextContent('Gift Wrap Price: $5.00');
    });

    const giftWrapTotal = componentWrapper.getByText('Gift Wrap Total: $10.00');
    expect(giftWrapTotal).toBeDefined();
  });

  // TODO: update when dynamic (with real order data)
});

describe('an active checkout shipping step with two of the same variants with different monograms', () => {
  const store = mockStore({ cart: cartWithSameVariantDiffMonograms });
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}><CheckoutShippingStep completedSteps={['address']} active /></Provider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('renders the correct line items in a shipment', () => {
    // there should be two product cards with the same title and size (the same variant)
    const cards = componentWrapper.getAllByTestId('order-product-card');
    const titles = componentWrapper.getAllByTestId('order-product-title');
    const sizes = componentWrapper.getAllByTestId('order-product-info');
    expect(cards.length).toBe(2);
    expect(titles.length).toBe(2);
    expect(sizes.length).toBe(2);
    titles.forEach((title) => {
      expect(title).toHaveTextContent('Petite PlumeAmelia Nightgown, Indigo Floral');
    });
    sizes.forEach((size) => {
      expect(size).toHaveTextContent('Size: 2yQty: 1');
    });
    // there should only be one monogram component
    const monograms = componentWrapper.getAllByTestId('order-product-monogram');
    expect(monograms.length).toBe(1);
    const [monogram] = monograms;
    expect(monogram).toHaveTextContent('Monogram: Text: "tests2", Style: "Calligraphy I"');
  });
});
