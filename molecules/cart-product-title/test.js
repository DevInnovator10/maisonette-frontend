import React from 'react';
import { render } from '../../utils/tests/testTheming';
import CartProductTitle from '.';

let componentWrapper;

const brand = {
    name: 'Alimrose',
  permalink: '/brands/alimrose'
};

const product = {
  name: 'Elephant Mini Rattle',
  permalink: '/product/elephant-mini-rattle'
};

describe('a cart product title', () => {
  beforeEach(() => {
    componentWrapper = render(<CartProductTitle brand={brand} product={product} />);
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('links to brand', () => {
    const brandLink = componentWrapper.getByText(brand.name);
    expect(brandLink.href).toContain('/brands');
  });

  it('links to product', () => {
    const productLink = componentWrapper.getByText(product.name);
    expect(productLink.href).toContain('/product');
  });

  it('has styles', () => {
    const productLink = componentWrapper.getByText(product.name);
    expect(productLink).toHaveStyle('font-size: 1.2rem');
  });
});
