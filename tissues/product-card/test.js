import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { render } from '../../utils/tests/testTheming';
import { ProductCard } from '.';

const mockStore = configureMockStore();

const store = mockStore({
  lists: {
    wished_products: []
  },
  user: {
    spree_api_key: ''
  }
});

const product = {
  brand: 'Mott50 x Margherita Missoni',
  clickURL: 'https://maisonette.resultsdemo.com/search/go?isort=score&lgkey=https%3a%2f%2fwww.maisonette.com%2fwhats-new%2fshops%2fsun-shop%2fwomen-lucia-viola&lgsku=women_lucia2_fw18&lot=json&method=and&p=R&rk=1&rsc=UrQtb8AdmNnHaMjH&ts=json-full&uid=255477378&url=https%3a%2f%2fwww.maisonette.com%2fwhats-new%2fshops%2fsun-shop%2fwomen-lucia-viola&w=women',
  image: 'https://maisonette-prod-app-dependenci-s3maisonetteassets-1gmo1ldvtvuqp.s3.amazonaws.com/media/products/378278/product/yvtxtdtvzokibhcjhs5o.jpg?1540570233',
  main_category: 'Swimwear;One Pieces',
  maisonette_product_id: 'women_lucia2_fw18',
  maisonette_sku: 'women_lucia2_fw18',
  price_max: '175.00',
  price_min: '175.00',
  price_quickview: '175.00',
  product_id_wishlist: '148560',
  quickview_info: '@@@@@',
  quickview_sizes: 'XS@S@M@L@XL@',
  rank: 1,
  s_id: 0,
  side_image: 'https://maisonette-prod-app-dependenci-s3maisonetteassets-1gmo1ldvtvuqp.s3.amazonaws.com/media/products/378279/product/fbhb0b83byowuo6kybbm.jpg?1540570252',
  sizes: 'XS@S@M@L@XL@',
  text: 'The Lucia one piece is the perfect sporty suit to match your mini in. With long sleeves and a mock neck, you can protect your skin from the sun while still looking chic.',
  title: 'Women Lucia, Viola',
  url: 'https://www.maisonette.com/whats-new/shops/sun-shop/women-lucia-viola'
};

let componentWrapper;
let componentElement;

describe('a product card', () => {
  beforeEach(() => {
    componentWrapper = render(

      <Provider store={store}>
        <ProductCard
          module="test"
          product={product}
          index={1}
          addProductToList={() => {}}
          addProductToAlgoliaList={() => {}}
          removeProductFromAlgoliaList={() => {}}
          removeProductFromList={() => {}}
          updateProduct={() => {}}
          lists={{
            wished_products: []
          }}
          token=""
        />
      </Provider>

    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('should display a brand', () => {
    expect(componentWrapper.getByText(product.brand)).toBeDefined();
  });

  it('should display a name', () => {
    expect(componentWrapper.getByText(product.title)).toBeDefined();
  });

  it('should display a price', () => {
    expect(componentWrapper.getByText(product.price_min, { exact: false })).toBeDefined();
  });

  it('should display a picture', () => {
    expect(componentWrapper.getAllByAltText(product.title)[0]).toBeDefined();
    expect(componentWrapper.getAllByAltText(product.title)[1]).toBeDefined();
  });

  it('should have quick shop button', () => {
    expect(componentWrapper.getByText('Quick Shop')).toBeDefined();
  });

  it('should have styles', () => {
    const card = componentElement;
    const imageWrapper = card.querySelector('figure');
    const image = card.querySelector('img');

    expect(card).toHaveStyle('display: flex');
    expect(card).toHaveStyle('flex-direction: column');

    expect(imageWrapper).toHaveStyle('text-align: center');
    expect(imageWrapper).toHaveStyle('padding-top: 100%');
    expect(imageWrapper).toHaveStyle('position: relative');
    expect(imageWrapper).toHaveStyle('margin-bottom: 3rem');

    expect(image).toHaveStyle('opacity: 1');
    expect(image).toHaveStyle('position: absolute');
    expect(image).toHaveStyle('top: 0');
    expect(image).toHaveStyle('left: 0');
    expect(image).toHaveStyle('width: 100%');
  });
});
