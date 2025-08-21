import React from 'react';
import { Formik } from 'formik';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { render } from '../../utils/tests/testTheming';
import ShippingMethod from '.';

const mockStore = configureMockStore();

const cart = {
  id: 122,
  number: 'R899270125',
  item_total: '70.4',
  total: '70.4',
  ship_total: '5.0',
  state: 'delivery',
  adjustment_total: '-5.0',
  user_id: 23,
  created_at: '2019-08-29T19:49:24.760Z',
  updated_at: '2019-08-30T17:59:04.139Z',
  completed_at: null,
  payment_total: '0.0',
  shipment_state: null,
  payment_state: null,
  email: 'eric@gnclvs.com',
  special_instructions: null,
  channel: 'spree',
  included_tax_total: '0.0',
  additional_tax_total: '0.0',
  display_included_tax_total: '$0.00',
  display_additional_tax_total: '$0.00',
  tax_total: '0.0',
  currency: 'USD',
  covered_by_store_credit: false,
  display_total_applicable_store_credit: '$0.00',
  order_total_after_store_credit: '70.4',
  display_order_total_after_store_credit: '$70.40',
  total_applicable_store_credit: '0.0',
  display_total_available_store_credit: '$0.00',
  display_store_credit_remaining_after_capture: '$0.00',
  canceler_id: null,
  display_item_total: '$70.40',
  total_quantity: 1,
  display_total: '$70.40',
  display_ship_total: '$5.00',
  display_tax_total: '$0.00',
  token: '9_Pj-L2eoOMiELN569l4Iw',
  checkout_steps: [
    'address',
    'delivery',
    'payment',
    'confirm',
    'complete'
  ],
  payment_methods: [
    {
      id: 2,
      name: 'Credit Card',
      partial_name: 'paypal_braintree',
      method_type: 'paypal_braintree'
    },
    {
      id: 3,
      name: 'Braintree',
      partial_name: 'paypal_braintree',
      method_type: 'paypal_braintree'
    }
  ],
  bill_address: {
    id: 120,
    firstname: 'Eric',
    lastname: 'Goncalves',
    full_name: 'Eric Goncalves',
    address1: '1403 5th ave',
    address2: '1G',
    city: 'new york',
    zipcode: '10029',
    phone: '6468246465',
    company: null,
    alternative_phone: null,
    country_id: 233,
    country_iso: 'US',
    state_id: 3381,
    state_name: null,
    state_text: 'NY',
    country: {
      id: 233,
      iso_name: 'UNITED STATES',
      iso: 'US',
      iso3: 'USA',
      name: 'United States',
      numcode: 840
    },
    state: {
      id: 3381,
      name: 'New York',
      abbr: 'NY',
      country_id: 233
    }
  },
  ship_address: {
    id: 120,
    firstname: 'Eric',
    lastname: 'Goncalves',
    full_name: 'Eric Goncalves',
    address1: '1403 5th ave',
    address2: '1G',
    city: 'new york',
    zipcode: '10029',
    phone: '6468246465',
    company: null,
    alternative_phone: null,
    country_id: 233,
    country_iso: 'US',
    state_id: 3381,
    state_name: null,
    state_text: 'NY',
    country: {
      id: 233,
      iso_name: 'UNITED STATES',
      iso: 'US',
      iso3: 'USA',
      name: 'United States',
      numcode: 840
    },
    state: {
      id: 3381,
      name: 'New York',
      abbr: 'NY',
      country_id: 233
    }
  },
  line_items: [
    {
      id: 204,
      quantity: 1,
      price: '70.4',
      variant_id: 9,
      vendor_id: 2,
      single_display_amount: '$70.40',
      display_amount: '$70.40',
      total: '65.4',
      final_sale: false,
      backordered: null,
      promotionable: true,
      variant: {
        id: 9,
        name: 'Anna Dress',
        sku: 'LBS10073',
        weight: '0.0',
        height: null,
        width: null,
        depth: null,
        is_master: false,
        slug: 'anna-dress',
        description: 'She\'ll shine bright in this fun and festive black &amp; white chiffon star print dress from Lindsey Berns. A flutter sleeve adds a flirty detail while cotton lining makes it comfy.',
        track_inventory: true,
        price: '70.4',
        display_price: '$70.40',
        options_text: 'Size: 7T',
        in_stock: true,
        is_backorderable: false,
        total_on_hand: 795,
        is_destroyed: false,
        option_values: [
          {
            id: 12,
            name: '7T',
            presentation: '7T',
            option_type_name: 'Size',
            option_type_id: 1,
            option_type_presentation: 'Size'
          }
        ],
        images: [
          {
            id: 139,
            position: 1,
            attachment_content_type: 'image/jpeg',
            attachment_file_name: 'ofzznzmvmzi50jzodqfw.jpg',
            type: 'Spree::Image',
            attachment_updated_at: '2019-08-28T16:54:35.144Z',
            attachment_width: 580,
            attachment_height: 580,
            alt: '12',
            viewable_type: 'Spree::Variant',
            viewable_id: 1,
            mini_url: 'https://maisonette-stg.s3.amazonaws.com/spree/images/attachments/000/000/139/mini/ofzznzmvmzi50jzodqfw.jpg?1567011275',
            small_url: 'https://maisonette-stg.s3.amazonaws.com/spree/images/attachments/000/000/139/small/ofzznzmvmzi50jzodqfw.jpg?1567011275',
            product_url: 'https://maisonette-stg.s3.amazonaws.com/spree/images/attachments/000/000/139/product/ofzznzmvmzi50jzodqfw.jpg?1567011275',
            large_url: 'https://maisonette-stg.s3.amazonaws.com/spree/images/attachments/000/000/139/large/ofzznzmvmzi50jzodqfw.jpg?1567011275'
          },
          {
            id: 140,
            position: 2,
            attachment_content_type: 'image/jpeg',
            attachment_file_name: 'a5oasgmq9uscasoqdxmj.jpg',
            type: 'Spree::Image',
            attachment_updated_at: '2019-08-28T16:54:35.006Z',
            attachment_width: 1620,
            attachment_height: 1620,
            alt: '23',
            viewable_type: 'Spree::Variant',
            viewable_id: 1,
            mini_url: 'https://maisonette-stg.s3.amazonaws.com/spree/images/attachments/000/000/140/mini/a5oasgmq9uscasoqdxmj.jpg?1567011275',
            small_url: 'https://maisonette-stg.s3.amazonaws.com/spree/images/attachments/000/000/140/small/a5oasgmq9uscasoqdxmj.jpg?1567011275',
            product_url: 'https://maisonette-stg.s3.amazonaws.com/spree/images/attachments/000/000/140/product/a5oasgmq9uscasoqdxmj.jpg?1567011275',
            large_url: 'https://maisonette-stg.s3.amazonaws.com/spree/images/attachments/000/000/140/large/a5oasgmq9uscasoqdxmj.jpg?1567011275'
          },
          {
            id: 141,
            position: 3,
            attachment_content_type: 'image/gif',
            attachment_file_name: 'tenor-1.gif',
            type: 'Spree::Image',
            attachment_updated_at: '2019-08-28T16:54:49.975Z',
            attachment_width: 250,
            attachment_height: 154,
            alt: '34',
            viewable_type: 'Spree::Variant',
            viewable_id: 1,
            mini_url: 'https://maisonette-stg.s3.amazonaws.com/spree/images/attachments/000/000/141/mini/tenor-1.gif?1567011289',
            small_url: 'https://maisonette-stg.s3.amazonaws.com/spree/images/attachments/000/000/141/small/tenor-1.gif?1567011289',
            product_url: 'https://maisonette-stg.s3.amazonaws.com/spree/images/attachments/000/000/141/product/tenor-1.gif?1567011289',
            large_url: 'https://maisonette-stg.s3.amazonaws.com/spree/images/attachments/000/000/141/large/tenor-1.gif?1567011289'
          }
        ],
        product_id: 1,
        brand: 'Lindsey Berns',
        brand_slug: 'lindsey-berns',
        brand_description: null
      },
      vendor_name: 'Lindsey Berns',
      country_iso: 'US',
      adjustments: [
        {
          id: 246,
          source_type: 'Spree::PromotionAction',
          source_id: 2,
          adjustable_type: 'Spree::LineItem',

          adjustable_id: 204,
          amount: '-5.0',
          label: 'Promotion (Line Item Discount)',
          promotion_code_id: null,
          finalized: false,
          eligible: true,
          created_at: '2019-08-29T19:49:24.869Z',
          updated_at: '2019-08-29T19:49:24.869Z',
          display_amount: '-$5.00'
        }
      ]
    }
  ],
  payments: [
    {
      id: 35,
      source_type: 'SolidusPaypalBraintree::Source',
      source_id: 20,
      amount: '0.0',
      display_amount: '$0.00',
      payment_method_id: 3,
      state: 'checkout',
      avs_response: null,
      created_at: '2019-08-30T16:32:54.549Z',
      updated_at: '2019-08-30T16:32:54.549Z',
      payment_method: {
        id: 3,
        name: 'Braintree'
      },
      source: {
        id: 20,
        payment_type: 'CreditCard',
        token: '7n3bwz',
        created_at: '2019-08-29T19:11:47.659Z',
        cc_type: 'Visa',
        last_digits: '1111',
        month: '12',
        year: '2022'
      }
    }
  ],
  shipments: [
    {
      id: 153,
      tracking: null,
      tracking_url: null,
      number: 'H32247505102',
      cost: '5.0',
      shipped_at: null,
      state: 'pending',
      order_id: 'R899270125',
      stock_location_name: 'Lindsey Berns',
      shipping_rates: [
        {
          id: 287,
          name: 'Ground',
          cost: '5.0',
          selected: true,
          shipping_method_id: 1,
          shipping_method_code: 'ground-domestic',
          display_cost: '$5.00'
        },
        {
          id: 288,
          name: 'Next Day',
          cost: '20.0',
          selected: false,
          shipping_method_id: 3,
          shipping_method_code: 'next-day',
          display_cost: '$20.00'
        }
      ],
      selected_shipping_rate: {
        id: 287,
        name: 'Ground',
        cost: '5.0',
        selected: true,
        shipping_method_id: 1,
        shipping_method_code: 'ground-domestic',
        display_cost: '$5.00'
      },
      shipping_methods: [
        {
          id: 1,
          code: 'ground-domestic',
          name: 'Ground',
          zones: [
            {
              id: 3,
              name: 'United States',
              description: 'USA'
            }
          ],
          shipping_categories: [
            {
              id: 1,
              name: 'Default'
            },
            {
              id: 2,
              name: 'Free Shipping'
            },
            {
              id: 3,
              name: 'Freight'
            }
          ]
        },
        {
          id: 3,
          code: 'next-day',
          name: 'Next Day',
          zones: [
            {
              id: 3,
              name: 'United States',
              description: 'USA'
            }
          ],
          shipping_categories: [
            {
              id: 1,
              name: 'Default'
            },
            {
              id: 2,
              name: 'Free Shipping'
            },
            {
              id: 3,
              name: 'Freight'
            }
          ]
        }
      ],
      manifest: [
        {
          variant_id: 9,
          quantity: 1,
          states: {
            on_hand: 1
          }
        }
      ],
      adjustments: [],
      stock_location_address: 'Lindsey Berns, BROOKLYN, NY',
      country_iso: 'US',
      international_shipping: false
    }
  ],
  adjustments: [
    {
      id: 245,
      source_type: 'Spree::PromotionAction',
      source_id: 1,
      adjustable_type: 'Spree::Order',
      adjustable_id: 122,
      amount: '-16.19',
      label: 'Promotion (Maisonette Bananas)',
      promotion_code_id: null,
      finalized: false,
      eligible: false,
      created_at: '2019-08-29T19:49:24.840Z',
      updated_at: '2019-08-30T17:47:29.856Z',
      display_amount: '-$16.19'
    }
  ],
  permissions: {
    can_update: false
  },
  credit_cards: [],
  subtotals: {
    order_total: '70.4',
    item_total: '70.4',
    shipments_total: '5.0',
    line_item_promotions: [
      {
        label: 'Promotion (Line Item Discount)',
        amount: '-5.0'
      }
    ],
    tax_adjustments: [],
    miscellaneous_adjustments: [],
    giftwrap_amount: 0
  },
  error: 'The order could not be transitioned. Please fix the errors and try again.',
  errors: {
    state: [
      'cannot transition via "next"'
    ]
  }
};

const store = mockStore({
  cart
});

describe('the checkout shipping method', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <Formik>
          <ShippingMethod shipment={cart.shipments[0]} handleLoading={() => { }} />
        </Formik>
      </Provider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });
});
