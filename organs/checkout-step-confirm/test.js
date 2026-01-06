import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { render } from '../../utils/tests/testTheming';
import CheckoutConfirmStep from '.';

const mockStore = configureMockStore();

const store = mockStore({
  cart: {
    id: 81,
    number: 'R378549472',
    item_total: '70.4',
    total: '54.21',
    ship_total: '5.0',
    state: 'confirm',
    adjustment_total: '-21.19',
    user_id: 1,
    created_at: '2019-08-22T18:12:44.582Z',
    updated_at: '2019-08-22T20:05:02.691Z',
    completed_at: null,
    payment_total: '0.0',
    shipment_state: null,
    payment_state: null,
    email: 'admin@maisonette.com',
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
    order_total_after_store_credit: '54.21',
    display_order_total_after_store_credit: '$54.21',
    total_applicable_store_credit: '0.0',
    display_total_available_store_credit: '$0.00',
    display_store_credit_remaining_after_capture: '$0.00',
    canceler_id: null,
    display_item_total: '$70.40',
    total_quantity: 1,
    display_total: '$54.21',
    display_ship_total: '$5.00',
    display_tax_total: '$0.00',
    token: 'eSkhbX5PKxl5QS8NP5gMSQ',
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
    bill_address: null,
    ship_address: {
      id: 96,
      firstname: 'Jon',
      lastname: 'K',
      full_name: 'Jon K',
      address1: '4236 Mohawk Pkwy',
      address2: null,
      city: 'Niagara Falls',
      zipcode: '14304',
      phone: '15555555555',
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
        id: 150,
        quantity: 1,
        price: '70.4',
        variant_id: 2,
        vendor_id: 2,
        single_display_amount: '$70.40',
        display_amount: '$70.40',
        total: '65.4',
        final_sale: false,
        backordered: null,
        promotionable: true,
        variant: {
          id: 2,
          name: 'Anna Dress',
          sku: 'LBS10066',
          weight: '0.0',
          height: null,
          width: null,
          depth: null,
          is_master: false,
          slug: 'anna-dress',
          description: 'She\'ll shine bright in this fun and festive black &amp; white chiffon star print dress from Lindsey Berns. A flutter sleeve adds a flirty detail while cotton lining makes it comfy.',
          track_inventory: true,
          cost_price: '22.0',
          price: '70.4',
          display_price: '$70.40',
          options_text: 'Size: 3-6M',
          in_stock: true,
          is_backorderable: false,
          total_on_hand: 5049,
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
          product_id: 1,
          brand: 'Lindsey Berns',
          brand_slug: 'lindsey-berns',
          brand_description: null
        },
        vendor_name: 'Lindsey Berns',
        country_iso: 'PT',
        adjustments: [
          {
            id: 152,
            source_type: 'Spree::PromotionAction',
            source_id: 2,
            adjustable_type: 'Spree::LineItem',
            adjustable_id: 150,
            amount: '-5.0',
            label: 'Promotion (Line Item Discount)',
            promotion_code_id: null,
            finalized: false,
            eligible: true,
            created_at: '2019-08-22T19:58:31.102Z',
            updated_at: '2019-08-22T19:58:31.102Z',
            display_amount: '-$5.00'
          }
        ]
      }
    ],
    payments: [
      {
        id: 2901,
        source_type: 'SolidusPaypalBraintree::Source',
        source_id: 939,
        amount: '156.4',
        display_amount: '$156.40',
        payment_method_id: 2,
        state: 'checkout',
        avs_response: null,
        created_at: '2021-07-12T11:32:32.928-04:00',
        updated_at: '2021-07-12T11:32:32.928-04:00',
        payment_method: {
          id: 2,
          name: 'Braintree'
        },
        source: {
          id: 939,
          payment_type: 'CreditCard',
          token: '999x3yb',
          created_at: '2021-07-12T11:32:32.926-04:00',
          cc_type: 'Visa',
          last_digits: '1111',
          month: '12',
          year: '2021'
        }
      },
      {
        id: 2919,
        source_type: 'Spree::StoreCredit',
        source_id: 134,
        amount: '50.0',
        display_amount: '$50.00',
        payment_method_id: 1,
        state: 'checkout',
        avs_response: null,
        created_at: '2021-07-12T14:27:20.192-04:00',
        updated_at: '2021-07-12T14:27:20.192-04:00',
        payment_method: {
          id: 1,
          name: 'Store Credit'
        },
        source: {
          id: 134,
          memo: '',
          created_at: '2021-07-12T14:24:41.737-04:00',
          created_by: 'daniel.fyfe@maisonette.com',
          category: {
            id: 1,
            name: 'Default'
          }
        }
      }
    ],
    shipments: [
      {
        id: 86,
        tracking: null,
        tracking_url: null,
        number: 'H80274233706',
        cost: '5.0',
        shipped_at: null,
        state: 'pending',
        order_id: 'R378549472',
        stock_location_name: 'Lindsey Berns',
        shipping_rates: [
          {
            id: 157,
            name: 'Ground',
            cost: '5.0',
            selected: true,
            shipping_method_id: 1,
            shipping_method_code: 'ground-domestic',
            display_cost: '$5.00'
          },
          {
            id: 158,
            name: 'Next Day',
            cost: '5.0',
            selected: false,
            shipping_method_id: 3,
            shipping_method_code: 'next-day',
            display_cost: '$5.00'
          }
        ],
        selected_shipping_rate: {
          id: 157,
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
            variant_id: 2,
            quantity: 1,
            states: {
              on_hand: 1
            }
          }
        ],
        adjustments: [],
        stock_location_address: 'Lindsey Berns, Lisboa, 11',
        country_iso: 'PT',
        international_shipping: true
      }
    ],
    adjustments: [
      {
        id: 150,
        source_type: 'Spree::PromotionAction',
        source_id: 1,
        adjustable_type: 'Spree::Order',
        adjustable_id: 81,
        amount: '-16.19',
        label: 'Promotion (Maisonette Bananas)',
        promotion_code_id: null,
        finalized: false,
        eligible: true,
        created_at: '2019-08-22T18:12:44.682Z',
        updated_at: '2019-08-22T19:58:31.056Z',
        display_amount: '-$16.19'
      }
    ],
    permissions: {
      can_update: false
    },
    credit_cards: [],
    subtotals: {
      order_total: '54.21',
      item_total: '70.4',
      shipments_total: '5.0',
      line_item_promotions: [
        {
          label: 'Promotion (Line Item Discount)',
          amount: '-5.0'
        }
      ],
      tax_adjustments: [],
      miscellaneous_adjustments: [
        {
          label: 'Promotion (Maisonette Bananas)',
          amount: '-16.19'
        }
      ],
      giftwrap_amount: 0
    },
    error: 'The order could not be transitioned. Please fix the errors and try again.',
    errors: {
      state: [
        'cannot transition via "next"'
      ]
    }
  }
});

describe('the checkout confirm step', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(<Provider store={store}><CheckoutConfirmStep /></Provider>);
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('renders title with proper label', () => {
    const title = componentWrapper.getByText('Summary');
    expect(title).toBeDefined();
  });

  it('renders complete button', () => {
    const complete = componentWrapper.getByText('Complete Purchase');
    expect(complete).toBeDefined();
  });

  it('has correct styles', () => {
    const componentElement = componentWrapper.container.firstChild;
    const fieldset = componentElement.querySelector('fieldset');
    expect(fieldset).toHaveStyle('position: sticky');
    expect(fieldset).toHaveStyle('top: 180px');
  });

  // TODO: update when dynamic (with real order data)
});

describe('the checkout confirm step with address and payment summary', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <Provider
        store={store}
      >
        <CheckoutConfirmStep />
      </Provider>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('renders title with proper label', () => {
    const title = componentWrapper.getByText('Summary');
    expect(title).toBeDefined();
  });

  it('renders complete button', () => {
    const complete = componentWrapper.getByText('Complete Purchase');
    expect(complete).toBeDefined();
  });

  it('renders the shipping address summary', () => {
    const shipping = componentWrapper.getByText('SHIPPING');
    expect(shipping).toBeDefined();
    expect(shipping.tagName).toBe('H3');
    const address = componentWrapper.getByText('4236 Mohawk', { exact: false });
    expect(address).toBeDefined();
    expect(address.tagName).toBe('P');
  });

  it('renders the payment summary', () => {
    const payment = componentWrapper.getByText('PAYMENT');
    expect(payment).toBeDefined();
    expect(payment.tagName).toBe('H3');
    const paymentInfo = componentWrapper.getByText('CC ending in 1111');
    expect(paymentInfo).toBeDefined();
    expect(paymentInfo.tagName).toBe('P');
    const storeCredit = componentWrapper.getByText('Store Credit ($50.00)');
    expect(storeCredit).toBeDefined();
    expect(storeCredit.tagName).toBe('P');
  });
});
