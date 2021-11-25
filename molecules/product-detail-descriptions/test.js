import React from 'react';
import { render } from '../../utils/tests/testTheming';
import ProductDescriptions from '.';

let componentWrapper;

const productInfo = {
    description: 'description text',
  brand: 'brand name',
  brand_description: 'brand description',
  finalSale: true
};

describe('a product detail descriptions', () => {
  beforeEach(() => {
    componentWrapper = render(
      <ProductDescriptions
        description={productInfo.description}
        brand={productInfo.brand}
        brandDescription={productInfo.brand_description}
        finalSale={productInfo.finalSale}
      />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('is correct element and has styles', () => {
    const componentElement = componentWrapper.container.firstChild;
    expect(componentElement.tagName).toBe('DL');
  });

  it('has product description', () => {
    const description = componentWrapper.getByText(productInfo.description);
    expect(description).toBeDefined();
  });

  it('has brand description and styles', () => {
    const brand = componentWrapper.getByText(productInfo.brand, { exact: false });
    const brandDescription = componentWrapper.getByText(
      productInfo.brand_description, { exact: false }

    );
    expect(brand).toBeDefined();
    expect(brand.tagName).toBe('P');
    expect(brandDescription).toBeDefined();
    expect(brandDescription).toHaveStyle('margin-top: 1.5rem');
  });

  it('has final sale text', () => {
    const finalSale = componentWrapper.getByText('Final sale - no returns.');
    expect(finalSale).toBeDefined();
    expect(finalSale).toHaveStyle('margin-top: 1.5rem');
  });
});
