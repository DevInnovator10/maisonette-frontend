import React from 'react';
import { fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { render } from '../../utils/tests/testTheming';
import CartDrawer from '.';

const mockStore = configureMockStore([thunk]);

describe('an opened cart drawer', () => {
  let componentWrapper;
  let componentElement;

  const store = mockStore({
    cart: {
      loading: false,
      id: 3675,
      number: 'M610384802',
      item_total: '50.0',
      total: '50.0',
      ship_total: '0.0',
      state: 'address',
      adjustment_total: '0.0',
      user_id: 67,
      created_at: '2021-08-05T15:55:48.319-04:00',
      updated_at: '2021-08-05T18:15:40.698-04:00',
      completed_at: null,
      payment_total: '0.0',
      shipment_state: null,
      payment_state: null,
      email: 'daniel.fyfe@maisonette.com',
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
      order_total_after_store_credit: '50.0',
      display_order_total_after_store_credit: '$50.00',
      total_applicable_store_credit: '0.0',
      display_total_available_store_credit: '$0.00',
      display_store_credit_remaining_after_capture: '$0.00',
      canceler_id: null,
      gift_email: null,
      gift_message: null,
      is_gift: false,
      use_store_credits: false,
      first_order: false,
      display_item_total: '$50.00',
      total_quantity: 1,
      display_total: '$50.00',
      display_ship_total: '$0.00',
      display_tax_total: '$0.00',
      token: 'yaFJM1947zFBu6YgKGI9zg',
      checkout_steps: [
        'address',
        'delivery',
        'payment',
        'confirm',
        'complete'
      ],
      eligible_for_return: null,
      narvar_return_url: 'https://returns-st01.narvar.qa/maisonette/returns?order=M610384802&bzip=10004&init=true',
      free_shipping_threshold: '75.0',
      payment_methods: [
        {
          id: 2,
          name: 'Braintree'
        }
      ],
      bill_address: {
        id: 4013,
        firstname: '3444',
        lastname: '3333',
        full_name: '3444 3333',
        address1: '42 Broadway',
        address2: '',
        city: 'New York',
        zipcode: '10004',
        phone: '+1 (333) 333-____',
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
        id: 4014,
        firstname: 'NAME',
        lastname: 'NAME',
        full_name: 'NAME NAME',
        address1: '290 Somewhere Else',
        address2: '',
        city: 'Boston',
        zipcode: '11215',
        phone: '+1 (333) 3__-____',
        company: null,
        alternative_phone: null,
        country_id: 233,
        country_iso: 'US',
        state_id: 3365,
        state_name: null,
        state_text: 'MA',
        country: {
          id: 233,
          iso_name: 'UNITED STATES',
          iso: 'US',
          iso3: 'USA',
          name: 'United States',
          numcode: 840
        },
        state: {
          id: 3365,
          name: 'Massachusetts',
          abbr: 'MA',
          country_id: 233
        }
      },
      line_items: [
        {
          id: 5522,
          quantity: 1,
          price: '50.0',
          variant_id: 182501,
          vendor_id: 3,
          single_display_amount: '$50.00',
          display_amount: '$50.00',
          total: '50.0',
          on_sale: false,
          final_sale: false,
          backordered: null,
          promotionable: true,
          variant: {
            id: 182501,
            name: 'Robot Monkey',
            sku: '631b9daee11a2f9c31ae397a4a95f21c',
            is_master: false,
            slug: 'robot-monkey',
            description: 'Brought to us by Los Angeles based furniture company, Monroe Workshop- this bespoke robot is made from salvaged maple hardwood and sturdy cotton rope. Perch him on a shelf or invite him to play, he is flexible in both mind and body and is the perfect companion for all sorts of imaginative play.  Made of solid maple and cotton . Made in the US. 4.5" x 3" x 4.5". Ages 3+.',
            track_inventory: true,
            cost_price: null,
            price: '50.0',
            display_price: '$50.00',
            options_text: 'Size: OS',
            in_stock: true,
            is_backorderable: false,
            total_on_hand: 50,
            is_destroyed: false,
            option_values: [
              {
                id: 9,
                name: 'OS',
                presentation: 'OS',
                option_type_name: 'Size',
                option_type_id: 1,
                option_type_presentation: 'Size',
                position: 389
              }
            ],
            images: [
              {
                id: 160601,
                position: 1,
                attachment_content_type: 'image/jpeg',
                attachment_file_name: 'zq9ahunarmexiod1dqxn.jpg',
                type: 'Spree::Image',
                attachment_updated_at: '2020-11-11T17:04:51.810-05:00',
                attachment_width: 580,
                attachment_height: 580,
                alt: null,
                viewable_type: 'Spree::Variant',
                viewable_id: 182500,
                mini_url: 'https://assets.gotdoodle.com/spree/images/attachments/000/160/601/mini/zq9ahunarmexiod1dqxn.jpg?1605132291',
                small_url: 'https://assets.gotdoodle.com/spree/images/attachments/000/160/601/small/zq9ahunarmexiod1dqxn.jpg?1605132291',
                product_url: 'https://assets.gotdoodle.com/spree/images/attachments/000/160/601/product/zq9ahunarmexiod1dqxn.jpg?1605132291',
                large_url: 'https://assets.gotdoodle.com/spree/images/attachments/000/160/601/large/zq9ahunarmexiod1dqxn.jpg?1605132291',
                product_large_url: 'https://assets.gotdoodle.com/spree/images/attachments/000/160/601/product_large/zq9ahunarmexiod1dqxn.jpg?1605132291',
                product_retina_url: 'https://assets.gotdoodle.com/spree/images/attachments/000/160/601/product_retina/zq9ahunarmexiod1dqxn.jpg?1605132291',
                product_zoom_url: 'https://assets.gotdoodle.com/spree/images/attachments/000/160/601/product_zoom/zq9ahunarmexiod1dqxn.jpg?1605132291'
              }
            ],
            videos: [],
            product_id: 40655,
            lead_time: 1,
            brand: 'Monroe Workshop',
            brand_slug: 'monroe-workshop',
            brand_description: 'Shop for Monroe Workshop at maisonette.com. Your favorite children’s luxury brands and independent boutiques for your boy or girl. Shop Maisonette for the best in kid and baby clothing, accessories, home, furniture, decor, or toys.'
          },
          monogram: null,
          gift_cards: [],
          vendor_name: 'Acorn Toy Shop',
          country_iso: 'US',
          domestic_override: false,
          adjustments: []
        }
      ],
      payments: [],
      shipments: [],
      adjustments: [
        {
          id: 9983,
          source_type: 'Spree::PromotionAction',
          source_id: 77,
          adjustable_type: 'Spree::Order',
          adjustable_id: 3675,
          amount: '-10.0',
          label: 'Promotion (Influencer Friends & Family)',
          promotion_code_id: null,
          finalized: false,
          eligible: false,
          created_at: '2021-08-05T15:55:48.552-04:00',
          updated_at: '2021-08-05T18:15:40.607-04:00',
          display_amount: '-$10.00'
        }
      ],
      permissions: {
        can_update: true
      },
      gift_card_total: '0.0',
      applied_promotion_codes: [],
      subtotals: {
        order_total: '50.0',
        item_total: '50.0',
        shipments_total: '0.0',
        line_item_promotion_totals: [],
        tax_adjustments: [],
        miscellaneous_adjustments: [],
        giftwrap_amount: 0
      },
      count: 1
    },
    profile: {},
    interfaces: {
      isCartActive: true
    }
  });

  const actions = store.getActions();

  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <CartDrawer />
      </Provider>
    );

    // thanks eslint, i hate it.
    [, componentElement] = componentWrapper.container.children;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('dispatches cart active action when close button pressed', () => {
    const closeButton = componentWrapper.getByLabelText('close bag');
    fireEvent.click(closeButton);

    expect(actions).toEqual([{ type: 'INTERFACES_SET_IS_CART_ACTIVE', isActive: false }]);
  });

  it('dispatches cart active action when ESC key pressed', () => {
    fireEvent.keyDown(componentElement, { key: 'Escape', code: 'Escape' });

    expect(actions).toEqual([{ type: 'INTERFACES_SET_IS_CART_ACTIVE', isActive: false }]);
  });

  it('has appropriate opened styles', () => {
    expect(componentElement).toHaveStyle('transform: translateX(0)');
  });

  it('is not hidden', () => {
    expect(componentElement).toHaveStyle('visibility: visible');
  });

  it('renders a PayLater container', () => {
    const payLater = componentElement.querySelector('#paypal-cart-paylater');
    expect(payLater).toBeDefined();
  });

  it('renders a PayPal container', () => {
    const payPal = componentElement.querySelector('#paypal-cart-paypal');
    expect(payPal).toBeDefined();
  });

  it('renders a proceed to checkout link', () => {
    const checkoutLink = componentWrapper.getByText('Proceed to checkout');
    expect(checkoutLink).toBeDefined();
    expect(checkoutLink.tagName).toBe('A');
    expect(checkoutLink).toHaveStyle('font-family: GT Walsheim Web,Helvetica,Trebuchet MS,sans-serif');
    expect(checkoutLink).toHaveStyle('font-size: 1.8rem');
    expect(checkoutLink).toHaveStyle('background-color: #008761');
    expect(checkoutLink).toHaveStyle('border-color: #008761');
    expect(checkoutLink).toHaveStyle('color: #FFFFFF');
  });

  it('renders a proceed to checkout link', () => {
    const checkoutLink = componentWrapper.getByText('Proceed to checkout');
    expect(checkoutLink).toBeDefined();
    expect(checkoutLink.tagName).toBe('A');
    expect(checkoutLink).toHaveStyle('font-family: GT Walsheim Web,Helvetica,Trebuchet MS,sans-serif');
    expect(checkoutLink).toHaveStyle('font-size: 1.8rem');
    expect(checkoutLink).toHaveStyle('background-color: #008761');
    expect(checkoutLink).toHaveStyle('border-color: #008761');
    expect(checkoutLink).toHaveStyle('color: #FFFFFF');
  });

  it('renders BNPL message', () => {
    const message = componentWrapper.getByText('Pay in 4', { exact: false });
    expect(message).toBeDefined();
    expect(message.tagName).toBe('P');
    expect(message).toHaveStyle('font-family: GT Walsheim Web,Helvetica,Trebuchet MS,sans-serif');
    expect(message).toHaveStyle('font-size: 1.4rem');
    expect(message).toHaveStyle('color: #3150A2');
  });
});

describe('a closed cart drawer', () => {
  let componentWrapper;
  let componentElement;

  const store = mockStore({
    cart: {},
    profile: {},
    interfaces: {
      isCartActive: false
    }
  });

  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <CartDrawer />
      </Provider>
    );

    [componentElement] = componentWrapper.container.children;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has appropriate closed styles', () => {
    expect(componentElement).toHaveStyle('transform: translateX(100%)');
  });

  it('is hidden', () => {
    expect(componentElement).toHaveStyle('visibility: hidden');
  });
});
