import React from 'react';
import { render } from '../../utils/tests/testTheming';
import ProductTitle from '.';

let componentWrapper;
let componentElement;

const product1 = {
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

describe('a product title', () => {
  beforeEach(() => {
    componentWrapper = render(
      <ProductTitle product={product1} />
    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has a brand', () => {
    const brand = componentWrapper.getByText(product1.brand);
    expect(brand.textContent).toEqual(product1.brand);
  });

  it('has a name', () => {
    const name = componentWrapper.getByText(product1.title);
    expect(name.textContent).toEqual(product1.title);
  });

  it('has a price', () => {
    // The formatted price is added because the $ is added in another file
    const formattedPrice = `$${product1.price_min}`;
    const price = componentWrapper.getByText(formattedPrice);
    expect(price.textContent).toEqual(formattedPrice);
  });

  // TODO: Update test case for Algolia

  it.skip('has styles', () => {
    expect(componentElement).toHaveStyle('display: flex');
    expect(componentElement).toHaveStyle('flex-direction: column');
    expect(componentElement).toHaveStyle('align-items: center');
    expect(componentElement).toHaveStyle('color: #3150A2');
    expect(componentElement).toHaveStyle('line-height: 2.2rem');
    expect(componentElement).toHaveStyle('text-align: center');

    const brand = componentWrapper.getByText(product1.brand);
    expect(brand).toHaveStyle('font-size: 1.5rem');
    expect(brand).toHaveStyle('font-style: italic');

    const name = componentWrapper.getByText(product1.title);
    expect(name).toHaveStyle('font-size: 1.5rem');

    const price = componentWrapper.getByText(product1.price_min).parentElement;
    const styles = global.window.getComputedStyle(price);
    expect(styles['font-family']).toEqual('GT Pressura Web,Arial Narrow,Arial,sans-serif');
    expect(price).toHaveStyle('font-size: 1.2rem');
    expect(price).toHaveStyle('text-transform: uppercase');
    expect(price).toHaveStyle('letter-spacing: 0.24em');
    expect(price).toHaveStyle('display: flex');
    expect(price).toHaveStyle('justify-content: center');
    expect(price).toHaveStyle('text-transform: uppercase');
    expect(price).toHaveStyle('flex-direction: column');
  });
});

const product2 = {
  badges: 'On Sale^',
  brand: 'Mia + Finn',
  clickURL: 'https://maisonette.resultsdemo.com/search/go?af=undefined&isort=undefined&lgkey=https%3a%2f%2fwww.maisonette.com%2fgifts%2fby-age%2fgifts-for-kids%2fwomen-s-aisha-nightie-blue&lgsku=AISH&lot=json&method=and&p=R&rk=3&rsc=JwO1rLuRgKztlUpr&ts=json-full&uid=262365830&url=https%3a%2f%2fwww.maisonette.com%2fgifts%2fby-age%2fgifts-for-kids%2fwomen-s-aisha-nightie-blue&w=women',
  image: 'https://maisonette-prod-app-dependenci-s3maisonetteassets-1gmo1ldvtvuqp.s3.amazonaws.com/media/products/341301/product/cylspoxhbcdxjqjq3z3a.jpg?1536789617',
  main_category: 'Sleepwear',
  maisonette_product_id: 'MS00013836',
  maisonette_sku: 'AISH',
  price_max: '54.00',
  price_min: '32.50',
  onsale: 'yes',
  origprice: '$54.00',
  percent_off: '40% Off',
  price_quickview: '32.50',
  product_id_wishlist: '137052',
  quickview_info: '- Only 1 left@@- Out of stock@',
  quickview_sizes: 'S@M@L@',
  rank: 3,
  s_id: 0,
  side_image: 'https://maisonette-prod-app-dependenci-s3maisonetteassets-1gmo1ldvtvuqp.s3.amazonaws.com/media/products/341302/product/j3t1ja2xgw3rplj6rixv.jpg?1536789624',
  sizes: 'S@M@L@',
  title: 'Women\'s Aisha Nightie, Blue',
  url: 'https://www.maisonette.com/gifts/by-age/gifts-for-kids/women-s-aisha-nightie-blue'
};

describe('a sale product title', () => {
  beforeEach(() => {
    componentWrapper = render(
      <ProductTitle product={product2} />
    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has a brand', () => {
    const brand = componentWrapper.getByText(product2.brand);
    expect(brand.textContent).toEqual(product2.brand);
  });

  it('has a name', () => {
    const name = componentWrapper.getByText(product2.title);
    expect(name.textContent).toEqual(product2.title);
  });

  it('has a price range', () => {
    // The formatted price is added because the $ is added in another file
    const formattedPrice = `$${product2.price_min} - $${product2.price_max}`;
    const price = componentWrapper.getByText(formattedPrice);
    expect(price.textContent).toEqual(formattedPrice);
  });

  // TODO: Update test case for Algolia
  it.skip('has a sale price', () => {
    const price = componentWrapper.getByText(product2.price_min, { exact: false });
    const sale = componentWrapper.getByText(product2.percent_off, { exact: false });
    expect(price.textContent).toEqual(`${product2.origprice}${product2.price_min}`);
    expect(sale.textContent).toEqual(product2.percent_off);
  });

  // TODO: Update test case for Algolia

  it.skip('has styles', () => {
    expect(componentElement).toHaveStyle('display: flex');
    expect(componentElement).toHaveStyle('flex-direction: column');
    expect(componentElement).toHaveStyle('align-items: center');
    expect(componentElement).toHaveStyle('color: #3150A2');
    expect(componentElement).toHaveStyle('line-height: 2.2rem');
    expect(componentElement).toHaveStyle('text-align: center');

    const brand = componentWrapper.getByText(product2.brand);
    expect(brand).toHaveStyle('font-size: 1.5rem');
    expect(brand).toHaveStyle('font-style: italic');

    const name = componentWrapper.getByText(product2.title);
    expect(name).toHaveStyle('font-size: 1.5rem');

    const price = componentWrapper.getByText(product2.price_min, { exact: false }).parentElement;
    const styles = global.window.getComputedStyle(price);
    expect.skip(styles['font-family']).toEqual('GT Pressura Web,Arial Narrow,Arial,sans-serif');
    expect.skip(price).toHaveStyle('font-size: 1.2rem');
    expect(price).toHaveStyle('text-transform: uppercase');
    expect(price).toHaveStyle('letter-spacing: 0.24em');
    expect(price).toHaveStyle('display: flex');
    expect(price).toHaveStyle('justify-content: center');
    expect(price).toHaveStyle('text-transform: uppercase');
  });
});
