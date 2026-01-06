import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { act } from '@testing-library/react';
import { render } from '../../utils/tests/testTheming';
import QuickShop from '.';
import { ProductProvider } from '../../utils/context/product-provider';

const response = {
  id: 31,
  name: 'Eloise Baby Dress, Abstract Shapes',
  description: 'Simple and sweet, the Eloise Baby Dress is the perfect addition to your minis wardrobe. Featuring a traditional Peter Pan collar, an empire waist, and matching included bloomer, she will never want to take it off. Made of 100% cotton.',
  price: '42.0',
  display_price: '$42.00',
  available_on: '2019-07-15T00:00:00.000Z',
  available: true,
  discontinued: false,
  slug: 'eloise-baby-dress-abstract-shapes',
  meta_description: '',
  meta_keywords: '',
  shipping_category_id: 1,
  taxon_ids: [
    102,
    109,
    113,
    111,
    114
  ],
  total_on_hand: 39,
  meta_title: '',
  trends: [
    {
      type: 'sellingfast',
      value: 'Selling Fast'
    },
    {
      type: 'onsale',
      value: 'On Sale'
    }
  ],
  brand: 'Maisonette Essentials',
  brand_description: 'Introducing Maisonette Essentials: our debut collection of well-priced, comfortable, and adorable clothing for your mini. Each piece, made of 100% softer-than-soft cotton.',
  has_variants: true,
  master: {
    id: 60,
    name: 'Eloise Baby Dress, Abstract Shapes',
    sku: 'MAIS00121072',
    price: '42.0',
    weight: '1.0',
    height: '1.0',
    width: '1.0',
    depth: '1.0',
    is_master: true,
    slug: 'eloise-baby-dress-abstract-shapes',
    description: 'Simple and sweet, the Eloise Baby Dress is the perfect addition to your minis wardrobe. Featuring a traditional Peter Pan collar, an empire waist, and matching included bloomer, she will never want to take it off. Made of 100% cotton.',
    track_inventory: true,
    cost_price: '1.0',
    display_price: '$42.00',
    options_text: '',
    in_stock: true,
    is_backorderable: false,
    total_on_hand: 10,
    is_destroyed: false,
    option_values: [

    ],
    images: [
      {
        id: 6,
        position: 1,
        attachment_content_type: 'image/jpeg',
        attachment_file_name: 'aywxlcytnsesifna3pz5.jpg',
        type: 'Spree::Image',
        attachment_updated_at: '2019-07-16T16:36:49.716Z',
        attachment_width: 1620,
        attachment_height: 1620,
        alt: 'image-1',
        viewable_type: 'Spree::Variant',
        viewable_id: 60,
        mini_url: '/spree/products/6/mini/aywxlcytnsesifna3pz5.jpg?1563295009',
        small_url: '/spree/products/6/small/aywxlcytnsesifna3pz5.jpg?1563295009',
        product_url: '/spree/products/6/product/aywxlcytnsesifna3pz5.jpg?1563295009',
        large_url: '/spree/products/6/large/aywxlcytnsesifna3pz5.jpg?1563295009'
      },
      {
        id: 7,
        position: 2,
        attachment_content_type: 'image/jpeg',
        attachment_file_name: 'gi2x4rqllrfncswgoe72.jpg',
        type: 'Spree::Image',
        attachment_updated_at: '2019-07-16T16:36:50.039Z',
        attachment_width: 1620,
        attachment_height: 1620,
        alt: 'image-2',
        viewable_type: 'Spree::Variant',
        viewable_id: 60,
        mini_url: '/spree/products/7/mini/gi2x4rqllrfncswgoe72.jpg?1563295010',
        small_url: '/spree/products/7/small/gi2x4rqllrfncswgoe72.jpg?1563295010',
        product_url: '/spree/products/7/product/gi2x4rqllrfncswgoe72.jpg?1563295010',
        large_url: '/spree/products/7/large/gi2x4rqllrfncswgoe72.jpg?1563295010'
      },
      {
        id: 5,
        position: 3,
        attachment_content_type: 'image/jpeg',
        attachment_file_name: 'foxhyafmdxrtxauiktxe.jpg',
        type: 'Spree::Image',
        attachment_updated_at: '2019-07-16T16:36:49.611Z',
        attachment_width: 1620,
        attachment_height: 1620,
        alt: 'image-3',
        viewable_type: 'Spree::Variant',
        viewable_id: 60,
        mini_url: '/spree/products/5/mini/foxhyafmdxrtxauiktxe.jpg?1563295009',
        small_url: '/spree/products/5/small/foxhyafmdxrtxauiktxe.jpg?1563295009',
        product_url: '/spree/products/5/product/foxhyafmdxrtxauiktxe.jpg?1563295009',
        large_url: '/spree/products/5/large/foxhyafmdxrtxauiktxe.jpg?1563295009'
      },
      {
        id: 4,
        position: 4,
        attachment_content_type: 'image/jpeg',
        attachment_file_name: 'mj7syjxdhx2sdipfn898.jpg',
        type: 'Spree::Image',
        attachment_updated_at: '2019-07-16T16:36:49.872Z',
        attachment_width: 812,
        attachment_height: 812,
        alt: 'image-4',
        viewable_type: 'Spree::Variant',
        viewable_id: 60,
        mini_url: '/spree/products/4/mini/mj7syjxdhx2sdipfn898.jpg?1563295009',
        small_url: '/spree/products/4/small/mj7syjxdhx2sdipfn898.jpg?1563295009',
        product_url: '/spree/products/4/product/mj7syjxdhx2sdipfn898.jpg?1563295009',
        large_url: '/spree/products/4/large/mj7syjxdhx2sdipfn898.jpg?1563295009'
      }
    ]
  },
  variants: [
    {
      id: 61,
      name: 'Eloise Baby Dress, Abstract Shapes',
      sku: 'MAIS00121072-1',
      price: '42.0',
      weight: '1.0',
      height: '1.0',
      width: '1.0',
      depth: '1.0',
      is_master: false,
      slug: 'eloise-baby-dress-abstract-shapes',
      description: 'Simple and sweet, the Eloise Baby Dress is the perfect addition to your minis wardrobe. Featuring a traditional Peter Pan collar, an empire waist, and matching included bloomer, she will never want to take it off. Made of 100% cotton.',
      track_inventory: true,
      cost_price: '1.0',
      lead_time: 2,
      display_price: '$42.00',
      options_text: 'Size: 0-3M',
      in_stock: false,
      is_backorderable: false,
      total_on_hand: 0,
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
      images: [

      ],
      variant_properties: [

      ],
      stock_items: [
        {
          id: 23,
          count_on_hand: 0,
          stock_location_id: 1,
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
          id: 67,
          vendor_id: 1,
          price: '42.0',
          original_price: '42.0',
          discount_percent: 0,
          total_on_hand: 0,
          country_iso: null,
          final_sale: false,
          on_sale: false
        }
      ]
    },
    {
      id: 62,
      name: 'Eloise Baby Dress, Abstract Shapes',
      sku: 'MAIS00121072-2',
      price: '42.0',
      weight: '1.0',
      height: '1.0',
      width: '1.0',
      depth: '1.0',
      is_master: false,
      slug: 'eloise-baby-dress-abstract-shapes',
      description: 'Simple and sweet, the Eloise Baby Dress is the perfect addition to your minis wardrobe. Featuring a traditional Peter Pan collar, an empire waist, and matching included bloomer, she will never want to take it off. Made of 100% cotton.',
      track_inventory: true,
      cost_price: '1.0',
      lead_time: 2,
      display_price: '$42.00',
      options_text: 'Size: 3-6M',
      in_stock: true,
      is_backorderable: false,
      total_on_hand: 5,
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
      images: [

      ],
      variant_properties: [

      ],
      stock_items: [
        {
          id: 22,
          count_on_hand: 5,
          stock_location_id: 1,
          backorderable: false,
          backorder_date: null,
          available: true,
          stock_location_name: 'Maisonette',
          vendor_id: 1,
          international_shipping: false
        }
      ],
      prices: [
        {
          id: 68,
          vendor_id: 1,
          price: '42.0',
          original_price: '42.0',
          discount_percent: 0,
          total_on_hand: 5,
          country_iso: null,
          final_sale: false,
          on_sale: false
        }
      ]
    },
    {
      id: 63,
      name: 'Eloise Baby Dress, Abstract Shapes',
      sku: 'MAIS00121072-3',
      price: '12.0',
      weight: '1.0',
      height: '1.0',
      width: '1.0',
      depth: '1.0',
      is_master: false,
      slug: 'eloise-baby-dress-abstract-shapes',
      description: 'Simple and sweet, the Eloise Baby Dress is the perfect addition to your minis wardrobe. Featuring a traditional Peter Pan collar, an empire waist, and matching included bloomer, she will never want to take it off. Made of 100% cotton.',
      track_inventory: true,
      cost_price: '1.0',
      lead_time: 2,
      display_price: '$12.00',
      options_text: 'Size: 6-9M',
      in_stock: true,
      is_backorderable: false,
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
      images: [

      ],
      variant_properties: [

      ],
      stock_items: [
        {
          id: 21,
          count_on_hand: 12,
          stock_location_id: 1,
          backorderable: false,
          backorder_date: null,
          available: true,
          stock_location_name: 'Maisonette',
          vendor_id: 1,
          international_shipping: false
        },
        {
          id: 25,
          count_on_hand: 1,
          stock_location_id: 2,
          backorderable: false,
          backorder_date: null,
          available: true,
          stock_location_name: 'Little House',
          vendor_id: 2,
          international_shipping: true
        }
      ],
      prices: [
        {
          id: 69,
          vendor_id: 1,
          price: '42.0',
          original_price: '42.0',
          discount_percent: 0,
          total_on_hand: 12,
          country_iso: null,
          final_sale: false,
          on_sale: false
        },
        {
          id: 72,
          vendor_id: 2,
          price: '12.0',
          original_price: '12.0',
          discount_percent: 0,
          total_on_hand: 1,
          country_iso: null,
          final_sale: false,
          on_sale: false
        }
      ]
    },
    {
      id: 64,
      name: 'Eloise Baby Dress, Abstract Shapes',
      sku: 'MAIS00121072-4',
      price: '42.0',
      weight: '1.0',
      height: '1.0',
      width: '1.0',
      depth: '1.0',
      is_master: false,
      slug: 'eloise-baby-dress-abstract-shapes',
      description: 'Simple and sweet, the Eloise Baby Dress is the perfect addition to your minis wardrobe. Featuring a traditional Peter Pan collar, an empire waist, and matching included bloomer, she will never want to take it off. Made of 100% cotton.',
      track_inventory: true,
      cost_price: '1.0',
      lead_time: 2,
      display_price: '$42.00',
      options_text: 'Size: 12-18M',
      in_stock: true,
      is_backorderable: true,
      total_on_hand: 10,
      is_destroyed: false,
      option_values: [
        {
          id: 5,
          name: '12-18M',
          presentation: '12-18M',
          option_type_name: 'Size',
          option_type_id: 1,
          option_type_presentation: 'Size'
        }
      ],
      images: [

      ],
      variant_properties: [

      ],
      stock_items: [
        {
          id: 20,
          count_on_hand: 10,
          stock_location_id: 1,
          backorderable: true,
          backorder_date: null,
          available: true,
          stock_location_name: 'Maisonette',
          vendor_id: 1,
          international_shipping: false
        }
      ],
      prices: [
        {
          id: 70,
          vendor_id: 1,
          price: '42.0',
          original_price: '42.0',
          discount_percent: 0,
          total_on_hand: 10,
          country_iso: null,
          final_sale: false,
          on_sale: false
        }
      ]
    },
    {
      id: 65,
      name: 'Eloise Baby Dress, Abstract Shapes',
      sku: 'MAIS00121072-5',
      price: '42.0',
      weight: '1.0',
      height: '1.0',
      width: '1.0',
      depth: '1.0',
      is_master: false,
      slug: 'eloise-baby-dress-abstract-shapes',
      description: 'Simple and sweet, the Eloise Baby Dress is the perfect addition to your minis wardrobe. Featuring a traditional Peter Pan collar, an empire waist, and matching included bloomer, she will never want to take it off. Made of 100% cotton.',
      track_inventory: true,
      cost_price: '1.0',
      lead_time: 2,
      display_price: '$42.00',
      options_text: 'Size: 18-24M',
      in_stock: true,
      is_backorderable: false,
      total_on_hand: 1,
      is_destroyed: false,
      option_values: [
        {
          id: 6,
          name: '18-24M',
          presentation: '18-24M',
          option_type_name: 'Size',
          option_type_id: 1,
          option_type_presentation: 'Size'
        }
      ],
      images: [

      ],
      variant_properties: [

      ],
      stock_items: [
        {
          id: 19,
          count_on_hand: 1,
          stock_location_id: 1,
          backorderable: false,
          backorder_date: null,
          available: true,
          stock_location_name: 'Maisonette',
          vendor_id: 1,
          international_shipping: false
        }
      ],
      prices: [
        {
          id: 71,
          vendor_id: 1,
          price: '42.0',
          original_price: '42.0',
          discount_percent: 0,
          total_on_hand: 1,
          country_iso: null,
          final_sale: false,
          on_sale: false
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

  ],
  classifications: [
    {
      taxon_id: 102,
      position: 1,
      taxon: {
        id: 102,
        name: 'Maisonette Essentials',
        pretty_name: 'Brand -> Maisonette Essentials',
        permalink: 'brand/maisonette-essentials',
        parent_id: 2,
        taxonomy_id: 2
      }
    },
    {
      taxon_id: 109,
      position: 2,
      taxon: {
        id: 109,
        name: 'Selling Fast',
        pretty_name: 'Trends -> Selling Fast',
        permalink: 'trends/selling-fast',
        parent_id: 108,
        taxonomy_id: 7
      }
    },
    {
      taxon_id: 113,
      position: 1,
      taxon: {
        id: 113,
        name: 'Exclusives',
        pretty_name: 'Trends -> Exclusives',
        permalink: 'trends/new-node',
        parent_id: 108,
        taxonomy_id: 7
      }
    },
    {
      taxon_id: 111,
      position: 1,
      taxon: {
        id: 111,
        name: 'On Sale',
        pretty_name: 'Trends -> On Sale',
        permalink: 'trends/on-sale',
        parent_id: 108,
        taxonomy_id: 7
      }
    },
    {
      taxon_id: 114,
      position: 1,
      taxon: {
        id: 114,
        name: 'Best Sellers',
        pretty_name: 'Trends -> Best Sellers',
        permalink: 'trends/new-node',
        parent_id: 108,
        taxonomy_id: 7
      }
    }
  ]
};

let componentWrapper;

const mockStore = configureMockStore([thunk]);
const store = mockStore({
  product: { price: 0 },
  profile: {},
  user: {
    spree_api_key: ''
  },
  lists: {
    wished_products: []
  }
});

describe('a quick shop tissue', () => {
  beforeEach(async () => {
    await act(async () => {
      componentWrapper = await render(
        <ProductProvider value={{}}>
          <Provider store={store}>
            <QuickShop slug={response.slug} product={response} token="" quickShopIndex={1} />
          </Provider>
        </ProductProvider>
      );
    });
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has brand', () => {
    const brand = componentWrapper.getByText(response.brand);
    expect(brand).toBeDefined();
  });

  it('has name', () => {
    const name = componentWrapper.getByText(response.name);
    expect(name).toBeDefined();
  });

  it('has price', () => {
    const price = componentWrapper.getByText(response.price, { exact: false });
    expect(price).toBeDefined();
  });

  it('has size options', () => {
    const sizeLabel = componentWrapper.getByText('Size:');
    const sizes = sizeLabel.nextSibling.querySelectorAll('input');
    expect(sizeLabel).toBeDefined();
    expect(sizes.length).toEqual(response.variants.length);
  });

  it('has disabled size options', () => {
    const sizeLabel = componentWrapper.getByText('Size:');
    const sizes = sizeLabel.nextSibling.querySelectorAll('label[disabled]');
    expect(sizes.length).toEqual(response.variants.filter((v) => v.total_on_hand === 0).length);
  });

  it('has checkout button', () => {
    const checkout = componentWrapper.getByText('Add to bag');
    expect(checkout).toBeDefined();
  });

  it('has wishlist button', () => {
    const checkout = componentWrapper.getByText('Sign in to add this to your wishlist!');
    expect(checkout).toBeDefined();
  });
});
