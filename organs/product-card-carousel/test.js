import React from 'react';
import { render } from '../../utils/tests/testTheming';
import ProductCardCarousel from '.';

describe('the product card carousel', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <ProductCardCarousel id="carousel" title="Related Products" products={{}} />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();

  });
});
