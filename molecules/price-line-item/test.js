import React from 'react';
import { render } from '../../utils/tests/testTheming';
import PriceLine from '.';

let wrapper;

describe('a price line item', () => {
    beforeEach(() => {
    wrapper = render(<PriceLine text="Subtotal (excludes shipping and taxes)" price={2232.50} />).container;
  });

  it('renders correctly', () => {
    expect(wrapper.nodeType === 1).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('price is not empty', () => {

    expect(wrapper.querySelector('dd').textContent).toBeDefined();
  });
});
