import React from 'react';
import { render } from '../../utils/tests/testTheming';
import ReturnDetails from '.';

const r = {
  id: 1,
  number: 'RA485315043',
  state: 'authorized',
  order_id: 5,
  memo: '',
  created_at: '2019-12-13T13:53:14.744-05:00',
  updated_at: '2019-12-13T13:53:14.744-05:00',
  reason: null,
  order: {
    id: 5,
    number: 'M204063505',
    item_total: '196.0',
    total: '205.95',
    state: 'complete',
    adjustment_total: '0.0',
    user_id: 33684,
    completed_at: '2019-12-13T13:48:35.761-05:00',
    bill_address_id: 619028,
    ship_address_id: 619028,
    payment_total: '205.95',
    shipment_state: 'shipped',
    payment_state: 'paid',
    email: 'eric@gnclvs.com',
    special_instructions: null,
    created_at: '2019-12-13T13:47:10.932-05:00',
    updated_at: '2019-12-13T13:52:53.463-05:00',
    currency: 'USD',
    last_ip_address: '172.93.13.78',
    created_by_id: 33684,
    shipment_total: '9.95',
    additional_tax_total: '0.0',
    promo_total: '0.0',
    channel: 'spree',
    included_tax_total: '0.0',
    item_count: 4,
    approver_id: 1,
    approved_at: '2019-12-13T13:50:54.031-05:00',
    confirmation_delivered: true,
    guest_token: 'yicG_IDIelXmCxcVplKtSQ',
    canceled_at: null,
    canceler_id: null,
    store_id: 1,
    approver_name: null,
    frontend_viewable: true,
    is_gift: false,
    gift_email: null,
    gift_message: null,
    gift_card_total: '0.0'
  },
  ship_address: {
    id: 619028,
    firstname: 'eric',
    lastname: 'goncalves',
    full_name: 'eric goncalves',
    address1: '27-11 Ditmars Blvd',
    address2: 'BSMT',
    city: 'Queens',
    zipcode: '11105',
    phone: '6468246465',
    company: null,
    alternative_phone: null,
    country_id: 232,
    country_iso: 'US',
    state_id: 3561,
    state_name: null,
    state_text: 'NY',
    country: {
      id: 232,
      iso_name: 'UNITED STATES',
      iso: 'US',
      iso3: 'USA',
      name: 'United States',
      numcode: 840
    },
    state: {
      id: 3561,
      name: 'New York',
      abbr: 'NY',
      country_id: 232
    }
  },
  bill_address: {
    id: 619028,
    firstname: 'eric',
    lastname: 'goncalves',
    full_name: 'eric goncalves',
    address1: '27-11 Ditmars Blvd',
    address2: 'BSMT',
    city: 'Queens',
    zipcode: '11105',
    phone: '6468246465',
    company: null,
    alternative_phone: null,
    country_id: 232,
    country_iso: 'US',
    state_id: 3561,
    state_name: null,
    state_text: 'NY',
    country: {
      id: 232,
      iso_name: 'UNITED STATES',
      iso: 'US',
      iso3: 'USA',
      name: 'United States',
      numcode: 840
    },
    state: {
      id: 3561,
      name: 'New York',
      abbr: 'NY',
      country_id: 232
    }
  },
  return_items: [
    {
      name: '"Artist" Storage Pillow, Olive/Charcoal',
      brand: {
        id: 207,
        parent_id: 3,
        position: 0,
        name: 'Mimish',
        permalink: 'brand/mimish',
        taxonomy_id: 3,
        lft: 280,
        rgt: 281,
        icon_file_name: null,
        icon_content_type: null,
        icon_file_size: null,
        icon_updated_at: null,
        description: null,
        created_at: '2019-12-13T04:39:52.920-05:00',
        updated_at: '2019-12-13T10:08:23.731-05:00',
        meta_title: null,
        meta_description: null,
        meta_keywords: null,
        depth: 1,
        hidden: false,
        highlight: false,
        header_link: false,
        url_override: null,
        add_flair: false,
        track_insights: false
      },
      image: 'https://assets.stg.env.maisonette.com/spree/images/attachments/000/001/782/small/n2xrcuvghnlnvsub5qmj.jpg?1576231355',
      cost: '49.0',
      option_values: [
        {
          type: 'Size',
          value: 'OS'
        }
      ]
    }
  ],
  payments: [
    {
      payment_method: {
        id: 3,
        name: 'Braintree'
      },
      source: {
        id: 2,
        payment_type: 'CreditCard',
        token: 'k6xpp9',
        created_at: '2019-12-13T13:48:15.025-05:00',
        cc_type: 'Visa',
        last_digits: '1111',
        month: '12',
        year: '2023'
      }
    }
  ],
  refunded_total: '0.0',
  subtotals: {
    order_total: '205.95',
    item_total: '196.0',
    shipments_total: '9.95',
    line_item_promotions: [],
    tax_adjustments: [],
    miscellaneous_adjustments: [],
    giftwrap_amount: 0
  }
};

describe('a order detail component', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(<ReturnDetails return={r} />);
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });
});
