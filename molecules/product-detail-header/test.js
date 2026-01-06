import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from '../../utils/tests/testTheming';

import ProductHeader from '.';

import { ProductProvider } from '../../utils/context/product-provider';

let componentWrapper;

const mockStore = configureMockStore();
const store = mockStore({
  product: { price: 0 }
});

// TODO : Update this productResponse to pull from utils/tests/productData
const productResponse = {
  id: 31,
  name: "Eric Goncalves' Product",
  description: 'Best. Product. Ever.',
  price: '666.66',
  display_price: '$666.66',
  available_on: '2019-05-02T00:00:00.000Z',
  slug: 'eric-goncalves',
  meta_description: '',
  meta_keywords: '',
  shipping_category_id: 1,
  taxon_ids: [85],
  total_on_hand: 118,
  meta_title: '',
  trends: [],
  brand: 'Eric',
  brand_description: 'Featuring neon fabrics, ruffles, and poms galore, Italian-made swimsuit line Piccoli Principi is perfect for little ones looking to have fun in the sun.  The best part? The collection is made from high quality, eco-friendly, UPF 50 fabric',
  has_variants: true,
  master: {
    id: 64,
    name: "Eric Goncalves' Product",
    sku: 'ERIC-GONCALVES-23',
    price: '666.66',
    weight: '6.66',
    height: '6.66',
    width: '6.66',
    depth: '6.66',
    is_master: true,
    slug: 'eric-goncalves',
    description: 'Best. Product. Ever.',
    track_inventory: true,
    cost_price: '0.67',
    display_price: '$666.66',
    options_text: '',
    in_stock: true,
    is_backorderable: false,
    total_on_hand: 100,
    is_destroyed: false,
    option_values: [],
    images: [{
      id: 5, position: 1, attachment_content_type: 'image/png', attachment_file_name: 'wqewq.png', type: 'Spree::Image', attachment_updated_at: '2019-07-11T17:32:38.169Z', attachment_width: 362, attachment_height: 362, alt: 'Grumpy Cat', viewable_type: 'Spree::Variant', viewable_id: 64, mini_url: '/spree/products/5/mini/wqewq.png?1562866358', small_url: '/spree/products/5/small/wqewq.png?1562866358', product_url: '/spree/products/5/product/wqewq.png?1562866358', large_url: '/spree/products/5/large/wqewq.png?1562866358'
    }]
  },
  variants: [{
    id: 65,
    name: "Eric Goncalves' Product",
    sku: 'ERIC-GONCALVES-23-1',
    price: '200.0',
    weight: '6.66',
    height: '6.66',
    width: '6.66',
    depth: '6.66',
    is_master: false,
    slug: 'eric-goncalves',
    description: 'Best. Product. Ever.',
    track_inventory: true,
    cost_price: '0.67',
    lead_time: 2,
    display_price: '$200.00',
    options_text: 'Size: 0-3M',
    in_stock: true,
    is_backorderable: false,
    total_on_hand: 6,
    is_destroyed: false,
    option_values: [{
      id: 1, name: '0-3M', presentation: '0-3M', option_type_name: 'Size', option_type_id: 1, option_type_presentation: 'Size'
    }],
    images: [],
    variant_properties: [{
      id: 1, property_id: 2, value: 'test', property_name: 'Care Instructions'
    }],
    stock_items: [{
      id: 194, count_on_hand: 0, stock_location_id: 3, backorderable: false, backorder_date: null, available: false, stock_location_name: 'RevCascade', vendor_id: null, international_shipping: false
    }, {
      id: 195, count_on_hand: 0, stock_location_id: 4, backorderable: false, backorder_date: null, available: false, stock_location_name: 'Mirakl', vendor_id: null, international_shipping: true
    }, {
      id: 193, count_on_hand: 6, stock_location_id: 2, backorderable: false, backorder_date: null, available: true, stock_location_name: 'Maisonette', vendor_id: null, international_shipping: false
    }],
    prices: [{
      id: 71, price: '200.0', vendor_id: 1, display_price: '$200.00', total_on_hand: 0, country_iso: null, final_sale: true
    }]
  }, {
    id: 66,
    name: "Eric Goncalves' Product",
    sku: 'ERIC-GONCALVES-23-2',
    price: '300.0',
    weight: '6.66',
    height: '6.66',
    width: '6.66',
    depth: '6.66',
    is_master: false,
    slug: 'eric-goncalves',
    description: 'Best. Product. Ever.',
    track_inventory: true,
    cost_price: '0.67',
    lead_time: 2,
    display_price: '$300.00',
    options_text: 'Size: 3-6M',
    in_stock: true,
    is_backorderable: false,
    total_on_hand: 6,
    is_destroyed: false,
    option_values: [{
      id: 2, name: '3-6M', presentation: '3-6M', option_type_name: 'Size', option_type_id: 1, option_type_presentation: 'Size'
    }],
    images: [],
    variant_properties: [],
    stock_items: [{
      id: 197, count_on_hand: 0, stock_location_id: 3, backorderable: false, backorder_date: null, available: false, stock_location_name: 'RevCascade', vendor_id: null, international_shipping: false
    }, {
      id: 198, count_on_hand: 0, stock_location_id: 4, backorderable: false, backorder_date: null, available: false, stock_location_name: 'Mirakl', vendor_id: null, international_shipping: true
    }, {
      id: 196, count_on_hand: 6, stock_location_id: 2, backorderable: false, backorder_date: null, available: true, stock_location_name: 'Maisonette', vendor_id: null, international_shipping: false
    }],
    prices: [{
      id: 72, price: '300.0', vendor_id: 1, display_price: '$300.00', total_on_hand: 0, country_iso: null, final_sale: true
    }]
  }, {
    id: 67,
    name: "Eric Goncalves' Product",
    sku: 'ERIC-GONCALVES-23-3',
    price: '8000.0',
    weight: '6.66',
    height: '6.66',
    width: '6.66',
    depth: '6.66',
    is_master: false,
    slug: 'eric-goncalves',
    description: 'Best. Product. Ever.',
    track_inventory: true,
    cost_price: '0.67',
    lead_time: 2,
    display_price: '$8,000.00',
    options_text: 'Size: 6-9M',
    in_stock: true,
    is_backorderable: false,
    total_on_hand: 6,
    is_destroyed: false,
    option_values: [{
      id: 3, name: '6-9M', presentation: '6-9M', option_type_name: 'Size', option_type_id: 1, option_type_presentation: 'Size'
    }],
    images: [],
    variant_properties: [],
    stock_items: [{
      id: 200, count_on_hand: 0, stock_location_id: 3, backorderable: false, backorder_date: null, available: false, stock_location_name: 'RevCascade', vendor_id: null, international_shipping: false
    }, {
      id: 201, count_on_hand: 0, stock_location_id: 4, backorderable: false, backorder_date: null, available: false, stock_location_name: 'Mirakl', vendor_id: null, international_shipping: true
    }, {
      id: 199, count_on_hand: 6, stock_location_id: 2, backorderable: false, backorder_date: null, available: true, stock_location_name: 'Maisonette', vendor_id: null, international_shipping: false
    }],
    prices: [{
      id: 74, price: '8000.0', vendor_id: 1, display_price: '$8,000.00', total_on_hand: 0, country_iso: null, final_sale: false
    }]
  }],
  option_types: [{
    id: 1, name: 'Size', presentation: 'Size', position: 1
  }],
  product_properties: [],
  classifications: [{
    taxon_id: 85,
    position: 1,
    taxon: {
      id: 85, name: 'Eric', pretty_name: 'Brand -> Eric', permalink: 'brand/eric', parent_id: 84, taxonomy_id: 8
    }
  }]
};

const productErrorResponse = {
  error: 'The resource you were looking for could not be found.'
};

describe('a product detail header', () => {
  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <ProductProvider>
          <ProductHeader
            title={productResponse.name}
            brand={productResponse.brand}
            prices={productResponse.variants.map((v) => v.prices[0])}
            finalSale={productResponse.variants.map((v) => v.prices[0].final_sale)}
          />
        </ProductProvider>
      </Provider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has brand', () => {
    const brand = componentWrapper.getByText(productResponse.brand);
    expect(brand).toBeDefined();
  });

  it('has title', () => {
    const title = componentWrapper.getByText(productResponse.name);
    expect(title).toBeDefined();
  });

  it('has price', () => {
    const price = componentWrapper.getByText('$200.00 - $8,000.00', { exact: false });
    expect(price).toBeDefined();
  });

  it('has final sale restriction', () => {
    expect(componentWrapper.getByText('Final sale!')).toBeDefined();
  });

  it('has styles', () => {
    const brand = componentWrapper.getByText(productResponse.brand);
    const title = componentWrapper.getByText(productResponse.name);

    expect(brand).toHaveStyle('color: #2F4DA1');
    expect(brand).toHaveStyle('line-height: 1.6rem');
    expect(brand).toHaveStyle('text-align: left');

    expect(title).toHaveStyle('color: #2F4DA1');
    expect(title).toHaveStyle('line-height: 3.2rem');
    expect(title).toHaveStyle('text-align: left');
  });
});

describe('a not found product', () => {
  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <ProductProvider>
          <ProductHeader
            title={productErrorResponse?.name}
            brand={productErrorResponse?.brand}
            prices={productErrorResponse?.variants?.map((v) => v.prices[0]) ?? []}
          />
        </ProductProvider>
      </Provider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('doesn\'t have brand', () => {
    const brand = componentWrapper.queryByText(productErrorResponse?.brand ?? 'No Brand');
    expect(brand).toBeNull();
  });

  it('doesn\'t have title', () => {
    const title = componentWrapper.queryByText(productErrorResponse?.name ?? 'No title');
    expect(title).toBeNull();
  });

  it('doesn\'t have price', () => {
    const price = componentWrapper.queryByText('$200.00 - $8,000.00');
    expect(price).toBeNull();
  });

  it('doesn\'t have styles', () => {
    const brand = componentWrapper.queryByText(productErrorResponse?.brand ?? 'No Brand');
    const title = componentWrapper.queryByText(productErrorResponse?.name ?? 'No title');

    expect(brand).toBeNull();
    expect(title).toBeNull();
  });
});
