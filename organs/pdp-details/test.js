import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { fireEvent } from '@testing-library/react';
import { render } from '../../utils/tests/testTheming';
import ProductDetails from '.';
import {
  monogrammableProduct,
  monogramOnlyProduct,
  promotionProduct,
  nonPromotionProduct,
  expiredPromotionProduct
} from '../../utils/tests/productData';
import { ProductProvider } from '../../utils/context/product-provider';

const mockStore = configureMockStore([thunk]);
const store = mockStore({
  product: { price: 0 },
  cart: {},
  lists: {
    wished_products: []
  },
  user: {
    spree_api_key: ''
  },
  profile: {}
});

describe('a pdp details component that is not monogram only', () => {
  let componentWrapper;

  beforeAll(() => {
    // mocking the Intersection Observer that sticky mobile needs
    // eslint-disable-next-line func-names
    global.window.IntersectionObserver = jest.fn(function () {
      this.observe = jest.fn();
      this.unobserve = jest.fn();
      this.disconnect = jest.fn();
    });
  });

  beforeEach(() => {
    componentWrapper = render(
      <ProductProvider value={{}}>
        <Provider store={store}>
          <ProductDetails product={monogrammableProduct} />
        </Provider>
      </ProductProvider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('renders the correct lead time when a monogram is not selected', () => {
    // this handles products that are not monogrammable as well
    const variant = componentWrapper.getAllByText('8y - Monogram')[0];
    fireEvent.click(variant);
    const leadTime = componentWrapper.getByText('Usually ships within 2 weeks');
    expect(leadTime).toBeDefined();
  });

  it('renders the correct lead time when a monogram is selected', () => {
    const variant = componentWrapper.getAllByText('8y - Monogram')[0];

    fireEvent.click(variant);
    // variant lead time should display after variant is selected
    let originalLeadTime = componentWrapper.queryByText('Usually ships within 2 weeks');
    expect(originalLeadTime).toBeDefined();
    const addMonogram = componentWrapper.getByLabelText('Add monogram +$20.00');
    fireEvent.click(addMonogram);
    // monogram lead time should display after adding monogram
    originalLeadTime = componentWrapper.queryByText('Usually ships within 2 weeks');
    const monogramLeadTime = componentWrapper.queryByText('Usually ships within 1 week');
    expect(monogramLeadTime).toBeDefined();
    expect(originalLeadTime).toBe(null);
  });
});

describe('a pdp details component that is monogram only', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <ProductProvider value={{}}>
        <Provider store={store}>
          <ProductDetails product={monogramOnlyProduct} />
        </Provider>
      </ProductProvider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('renders the correct lead time', () => {
    const variant = componentWrapper.getAllByText('2')[0];

    fireEvent.click(variant);
    const leadTime = componentWrapper.getByText('Usually ships within 4 weeks and 2 days');
    expect(leadTime).toBeDefined();
  });
});

describe('a pdp details component that has an active promotion', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <ProductProvider value={{}}>
        <Provider store={store}>
          <ProductDetails product={promotionProduct} />
        </Provider>
      </ProductProvider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('renders the correct promotion text', () => {
    const promotionText = componentWrapper.getByText('Additional 5% OFF, 10% OFF $75+, 15% OFF $300+ with BLACKFRIDAY2023 promo');
    expect(promotionText).toBeDefined();
    expect(promotionText.textContent).toEqual('Additional 5% OFF, 10% OFF $75+, 15% OFF $300+ with BLACKFRIDAY2023 promo');
    expect(promotionText).toHaveStyle('color: #CC3112');
    expect(promotionText).toHaveStyle('font-family: GT Walsheim Web,Helvetica,Trebuchet MS,sans-serif');
  });
});

describe('a pdp details component that does not have an active promotion', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <ProductProvider value={{}}>
        <Provider store={store}>
          <ProductDetails product={nonPromotionProduct} />
        </Provider>
      </ProductProvider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('does not render the promotion text', () => {
    const promotionText = componentWrapper.queryByText('Additional 5% OFF, 10% OFF $75+, 15% OFF $300+ with BLACKFRIDAY2023 promo');
    expect(promotionText).toBeFalsy();
  });
});

describe('a pdp details component that has an expired promotion', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <ProductProvider value={{}}>
        <Provider store={store}>
          <ProductDetails product={expiredPromotionProduct} />
        </Provider>
      </ProductProvider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('does not render the promotion text', () => {
    const promotionText = componentWrapper.queryByText('Additional 5% OFF, 10% OFF $75+, 15% OFF $300+ with BLACKFRIDAY2022 promo');
    expect(promotionText).toBeFalsy();
  });
});
