import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { fireEvent, act } from '@testing-library/react';
import { render } from '../../utils/tests/testTheming';
import AddToCart from '.';
import { ProductProvider } from '../../utils/context/product-provider';

let componentWrapper;
let componentElement;

const mockStore = configureMockStore([thunk]);
const store = mockStore({
  profile: {},
  product: { price: 0 },
  user: {
    spree_api_key: ''
  },
  lists: {
    wished_products: [
      {
        id: 1,
        wishlist_id: 1,
        variant_id: 4,
        quantity: 1,
        remark: null
      },
      {
        id: 2,
        wishlist_id: 1,
        variant_id: 6,
        quantity: 1,
        remark: null
      },
      {
        id: 3,
        wishlist_id: 1,
        variant_id: 8,
        quantity: 1,
        remark: null
      }
    ],
    count: 3,
    total_count: 3,
    current_page: 1,
    pages: 1,
    per_page: 25
  }
});

const product = {
  id: 31,
  name: 'Eric Goncalves\' Product',
  description: 'Best. Product. Ever.',
  price: '666.5',
  display_price: '$666.50',
  available_on: '2019-05-02T00:00:00.000Z',
  available: true,
  discontinued: false,
  slug: 'eric-goncalves',
  meta_description: '',
  meta_keywords: '',
  shipping_category_id: 3,
  taxon_ids: [
    85,
    88,
    90
  ],
  total_on_hand: 14,
  meta_title: '',
  trends: [
    {
      type: 'sellingfast',
      value: 'Selling Fast'
    },
    {
      type: 'exclusive',
      value: 'Exclusive'
    }
  ],
  brand: 'Eric',
  brand_description: 'Featuring neon fabrics, ruffles, and poms galore, Italian-made swimsuit line Piccoli Principi is perfect for little ones looking to have fun in the sun.  The best part? The collection is made from high quality, eco-friendly, UPF 50 fabric',
  has_variants: true,
  master: {
    id: 64,
    name: 'Eric Goncalves\' Product',
    sku: 'ERIC-GONCALVES-23',
    price: '666.5',
    weight: '6.66',
    height: '6.66',
    width: '6.66',
    depth: '6.66',
    is_master: true,
    slug: 'eric-goncalves',
    description: 'Best. Product. Ever.',
    track_inventory: true,
    cost_price: '0.67',
    display_price: '$666.50',
    options_text: '',
    in_stock: false,
    is_backorderable: false,
    total_on_hand: 0,
    is_destroyed: false,
    option_values: [],
    images: [
      {
        id: 5,
        position: 1,
        attachment_content_type: 'image/png',
        attachment_file_name: 'wqewq.png',
        type: 'Spree::Image',
        attachment_updated_at: '2019-07-11T17:32:38.169Z',
        attachment_width: 362,
        attachment_height: 362,
        alt: 'Grumpy Cat',
        viewable_type: 'Spree::Variant',
        viewable_id: 64,
        mini_url: '/spree/products/5/mini/wqewq.png?1562866358',
        small_url: '/spree/products/5/small/wqewq.png?1562866358',
        product_url: '/spree/products/5/product/wqewq.png?1562866358',
        large_url: '/spree/products/5/large/wqewq.png?1562866358'
      }
    ]
  },
  variants: [
    {
      id: 65,
      name: 'Eric Goncalves\' Product',
      sku: 'ERIC-GONCALVES-23-1',
      price: '23.0',
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
      display_price: '$23.00',
      options_text: 'Size: 0-3M',
      in_stock: true,
      is_backorderable: false,
      total_on_hand: 1,
      is_destroyed: false,
      option_values: [
        {
          id: 1,
          name: '0-3M',
          presentation: '0-3M',
          option_type_name: 'Size',
          option_type_id: 1,
          option_type_presentation: 'Size'
        }
      ],
      images: [],
      variant_properties: [
        {
          id: 1,
          property_id: 2,
          value: 'test',
          property_name: 'Care Instructions'
        }
      ],
      stock_items: [
        {
          id: 193,
          count_on_hand: 0,
          stock_location_id: 2,
          backorderable: false,
          backorder_date: null,
          available: false,
          stock_location_name: 'Maisonette',
          vendor_id: 1,
          international_shipping: false
        },
        {
          id: 195,
          count_on_hand: 0,
          stock_location_id: 4,
          backorderable: false,
          backorder_date: null,
          available: false,
          stock_location_name: 'Mirakl',
          vendor_id: null,
          international_shipping: true
        },
        {
          id: 194,
          count_on_hand: 0,
          stock_location_id: 3,
          backorderable: false,
          backorder_date: null,
          available: false,
          stock_location_name: 'RevCascade',
          vendor_id: null,
          international_shipping: false
        },
        {
          id: 203,
          count_on_hand: 1,
          stock_location_id: 20,
          backorderable: false,
          backorder_date: null,
          available: true,
          stock_location_name: 'Petit Pehr',
          vendor_id: 17,
          international_shipping: true
        }
      ],
      prices: [
        {
          id: 78,
          price: '23.0',
          vendor_id: 7,
          display_price: '$23.00',
          total_on_hand: 0,
          country_iso: null,
          final_sale: false
        },
        {
          id: 75,
          price: '434.0',
          vendor_id: 17,
          display_price: '$434.00',
          total_on_hand: 1,
          country_iso: null,
          final_sale: false
        }
      ]
    },
    {
      id: 66,
      name: 'Eric Goncalves\' Product',
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
      in_stock: false,
      is_backorderable: false,
      total_on_hand: 0,
      is_destroyed: false,
      option_values: [
        {
          id: 2,
          name: '3-6M',
          presentation: '3-6M',
          option_type_name: 'Size',
          option_type_id: 1,
          option_type_presentation: 'Size'
        }
      ],
      images: [],
      variant_properties: [],
      stock_items: [
        {
          id: 197,
          count_on_hand: 0,
          stock_location_id: 3,
          backorderable: false,
          backorder_date: null,
          available: false,
          stock_location_name: 'RevCascade',
          vendor_id: null,
          international_shipping: false
        },
        {
          id: 198,
          count_on_hand: 0,
          stock_location_id: 4,
          backorderable: false,
          backorder_date: null,
          available: false,
          stock_location_name: 'Mirakl',
          vendor_id: null,
          international_shipping: true
        },
        {
          id: 196,
          count_on_hand: 0,
          stock_location_id: 2,
          backorderable: false,
          backorder_date: null,
          available: false,
          stock_location_name: 'Maisonette',
          vendor_id: 1,
          international_shipping: false
        }
      ],
      prices: [
        {
          id: 72,
          price: '300.0',
          vendor_id: 1,
          display_price: '$300.00',
          total_on_hand: 0,
          country_iso: null,
          final_sale: true
        }
      ]
    },
    {
      id: 67,
      name: 'Eric Goncalves\' Product',
      sku: 'ERIC-GONCALVES-23-3',
      price: '765.0',
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
      display_price: '$765.00',
      options_text: 'Size: 6-9M',
      in_stock: true,
      is_backorderable: true,
      total_on_hand: 13,
      is_destroyed: false,
      option_values: [
        {
          id: 3,
          name: '6-9M',
          presentation: '6-9M',
          option_type_name: 'Size',
          option_type_id: 1,
          option_type_presentation: 'Size'
        }
      ],
      images: [],
      variant_properties: [],
      stock_items: [
        {
          id: 200,
          count_on_hand: 1,
          stock_location_id: 3,
          backorderable: true,
          backorder_date: null,
          available: true,
          stock_location_name: 'RevCascade',
          vendor_id: null,
          international_shipping: false
        },
        {
          id: 201,
          count_on_hand: 0,
          stock_location_id: 4,
          backorderable: false,
          backorder_date: null,
          available: false,
          stock_location_name: 'Mirakl',
          vendor_id: null,
          international_shipping: true
        },
        {
          id: 199,
          count_on_hand: 0,
          stock_location_id: 2,
          backorderable: false,
          backorder_date: null,
          available: false,
          stock_location_name: 'Maisonette',
          vendor_id: 1,
          international_shipping: false
        },
        {
          id: 202,
          count_on_hand: 12,
          stock_location_id: 20,
          backorderable: true,
          backorder_date: null,
          available: true,
          stock_location_name: 'Petit Pehr',
          vendor_id: 17,
          international_shipping: true
        }
      ],
      prices: [
        {
          id: 74,
          price: '8000.0',
          vendor_id: 1,
          display_price: '$8,000.00',
          total_on_hand: 0,
          country_iso: null,
          final_sale: false
        },
        {
          id: 79,
          price: '765.0',
          vendor_id: 17,
          display_price: '$765.00',
          total_on_hand: 12,
          country_iso: null,
          final_sale: true
        }
      ]
    }
  ],
  option_types: [
    {
      id: 1,
      name: 'Size',
      presentation: 'Size',
      position: 1
    }
  ],
  product_properties: [
    {
      id: 4,
      product_id: 31,
      property_id: 2,
      value: '100% cotton',
      property_name: 'Care Instructions'
    },
    {
      id: 5,
      product_id: 31,
      property_id: 2,
      value: 'Cold or warm wash. Normal wash cycle. Iron-able. Regular detergent. Dryer on the low setting.',
      property_name: 'Care Instructions'
    },
    {
      id: 6,
      product_id: 31,
      property_id: 5,
      value: '123123123',
      property_name: 'Maisonette Product ID'
    },
    {
      id: 7,
      product_id: 31,
      property_id: 6,
      value: 'State Shipping Restrictions',
      property_name: 'State Shipping Restrictions'
    },
    {
      id: 8,
      product_id: 31,
      property_id: 1,
      value: 'Yes',
      property_name: 'Assembly Required'
    },
    {
      id: 9,
      product_id: 31,
      property_id: 4,
      value: 'Yes',
      property_name: 'Made to Order'
    },
    {
      id: 10,
      product_id: 31,
      property_id: 7,
      value: 'Handmade in India',
      property_name: 'Country of Origin'
    },
    {
      id: 11,
      product_id: 31,
      property_id: 8,
      value: 'Perfect Fit',
      property_name: 'Sizing Notes'
    }
  ],
  classifications: [
    {
      taxon_id: 85,
      position: 1,
      taxon: {
        id: 85,
        name: 'Eric',
        pretty_name: 'Brand -> Eric',
        permalink: 'brand/eric',
        parent_id: 84,
        taxonomy_id: 8
      }
    },
    {
      taxon_id: 88,
      position: 1,
      taxon: {
        id: 88,
        name: 'Selling Fast',
        pretty_name: 'Trends -> Selling Fast',
        permalink: 'trends/selling-fast',
        parent_id: 86,
        taxonomy_id: 9
      }
    },
    {
      taxon_id: 90,
      position: 1,
      taxon: {
        id: 90,
        name: 'Exclusive',
        pretty_name: 'Trends -> Exclusive',
        permalink: 'trends/exclusive',
        parent_id: 86,
        taxonomy_id: 9
      }
    }
  ]
};

describe('a product add to cart form', () => {
  beforeEach(async () => {
    await act(async () => {
      componentWrapper = await render(
        <ProductProvider value={{}}>
          <Provider store={store}>
            <AddToCart product={product} onVariantChange={() => {}} token="" vendor={1} />
          </Provider>
        </ProductProvider>
      );
    });

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('renders 3 variant options', () => {
    const options = componentElement.querySelectorAll('input[type="radio"]');
    expect(options.length).toEqual(3);
  });

  it('renders 1 variant option disabled', () => {
    const disabledOptions = componentElement.querySelectorAll('label[disabled]');
    expect(disabledOptions.length).toEqual(1);
  });

  it('shows waitlist form when disabled clicked', () => {
    const waitlistForm = componentElement.querySelectorAll('form')[1];
    const disabledOptions = componentElement.querySelectorAll('label[disabled]');
    const disabledOption = disabledOptions[0];

    fireEvent.click(disabledOption);

    expect(waitlistForm).toHaveStyle('max-height: 0px');
  });

  it('has aria-labels describing availability of option', () => {
    // for screen readers to notify users of visual clues that options are out of stock
    const outOfStock = componentWrapper.getByLabelText('3-6M option is out of stock.');
    const inStock = componentWrapper.getByLabelText('6-9M');
    expect(outOfStock).toBeDefined();
    expect(inStock).toBeDefined();
  });

  it('has a hidden label for the quantity select that describes the availability', () => {
    // when no option is selected
    let quantitySelectLabel = componentWrapper.getByText('Quantity Select is disabled. Please select a Size to enable.');
    expect(quantitySelectLabel).toBeDefined();
    expect(quantitySelectLabel).toHaveStyle('opacity: 0');
    expect(quantitySelectLabel).toHaveStyle('pointer-events: none');
    expect(quantitySelectLabel).toHaveStyle('position: absolute');

    // content changes to out of stock when option is selected, but out of stock
    const disabledOptions = componentElement.querySelectorAll('label[disabled]');
    const disabledOption = disabledOptions[0];

    fireEvent.click(disabledOption);

    const quantitySelectOOSLabel = componentWrapper.getByText('Add to Bag button and Quantity Select is disabled. Size is out of stock.');
    quantitySelectLabel = componentWrapper.queryByText('Quantity Select is disabled. Please select a Size to enable.');
    expect(quantitySelectOOSLabel).toBeDefined();
    expect(quantitySelectLabel).toBe(null);
  });

  it('has a hidden label for the add to bag button that says to select an option', () => {
    const addToBagLabel = componentWrapper.getByText('Quantity Select is disabled. Please select a Size to enable.');
    expect(addToBagLabel).toBeDefined();
    expect(addToBagLabel).toHaveStyle('opacity: 0');
    expect(addToBagLabel).toHaveStyle('pointer-events: none');
    expect(addToBagLabel).toHaveStyle('position: absolute');
  });

  it('has a hidden label for the add to bag button that says when out of stock', () => {
    const disabledOptions = componentElement.querySelectorAll('label[disabled]');
    const disabledOption = disabledOptions[0];

    fireEvent.click(disabledOption);

    const addToBagOOSLabel = componentWrapper.getByText('Add to Bag button and Quantity Select is disabled. Size is out of stock.');
    const addToBagLabel = componentWrapper.queryByText('Quantity Select is disabled. Please select a Size to enable.');
    expect(addToBagOOSLabel).toBeDefined();
    expect(addToBagOOSLabel).toHaveStyle('opacity: 0');
    expect(addToBagOOSLabel).toHaveStyle('pointer-events: none');
    expect(addToBagOOSLabel).toHaveStyle('position: absolute');
    expect(addToBagLabel).toBe(null);
  });

  it('has a hidden label for the add to bag button that says when there are no more items left', () => {
    const inStockOption = componentWrapper.getByLabelText('6-9M');

    fireEvent.click(inStockOption);
    const addToBagLabel = componentWrapper.getByText('Add to Bag button and Quantity Select is disabled. No more items left.');
    expect(addToBagLabel).toHaveStyle('opacity: 0');
    expect(addToBagLabel).toHaveStyle('pointer-events: none');
    expect(addToBagLabel).toHaveStyle('position: absolute');
    expect(addToBagLabel).toBeDefined();
  });

  it('has a hidden label for add to wishlist button', () => {
    // when not logged in
    const addToWishlistButton = componentWrapper.getByText('Add to Wishlist Button is disabled. Sign in to add this to your wishlist.');
    expect(addToWishlistButton).toBeDefined();
    expect(addToWishlistButton).toHaveStyle('opacity: 0');
    expect(addToWishlistButton).toHaveStyle('pointer-events: none');
    expect(addToWishlistButton).toHaveStyle('position: absolute');
  });
});
