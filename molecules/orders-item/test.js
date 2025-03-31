import React from 'react';
import { render } from '../../utils/tests/testTheming';
import OrderItem from '.';

describe('a order item component', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <OrderItem title="Order Item">
        <p>order item content</p>
      </OrderItem>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('renders proper title', () => {
    expect(componentWrapper.getByText('Order Item')).toBeDefined();
  });
});
