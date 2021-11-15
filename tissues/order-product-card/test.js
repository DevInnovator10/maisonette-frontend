import React from 'react';
import { unformat, formatMoney } from 'accounting-js';
import { render } from '../../utils/tests/testTheming';
import OrderProductCard from '.';

let originalPrice;
let promotionAdjustment;
let adjustedPrice;

describe('an order product card with adjustments', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <OrderProductCard
        backorder={null}
        image="https://d1tlpgo3r360y6.cloudfront.net/media/products/565022/small/b455dwbm3wpqsu3orny5.jpg?1561048377"
        leadTime={7}
        option="2y"
        optionType="Size"
        price="17.65"
        total="7.65"
        adjustments={[
          {
            id: 93,
            source_type: 'Spree::Promotion',
            source_id: 62,
            adjustable_type: 'Spree::Order',
            adjustable_id: 342,
            amount: '-10.0',
            label: 'adj1',
            promotion_code_id: null,
            finalized: false,
            eligible: true,
            created_at: '2019-07-26T16:37:27.869Z',
            updated_at: '2019-07-26T16:37:27.869Z',
            display_amount: '$10.00'
          }
        ]}
        item={{
          variant: {
            brand: 'Lindsey Berns',
            brand_slug: 'lindsey-berns',
            name: 'Anna Dress',
            slug: 'anna-dress'
          }
        }}
        promotionable
        quantity={1}
        vendor="Lindsay Berns"
        inStock
        showShipsFromLabel={false}
        giftwrapPrice={5.0}
      />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('displays original price correctly', () => {
    const originalPriceElem = componentWrapper.getByTitle('original price');
    originalPrice = unformat(originalPriceElem.textContent);
    expect(originalPriceElem).toHaveStyle('text-decoration: line-through');
    expect(originalPrice).toEqual(17.65);
  });

  it('displays promotion adjustment amount', () => {
    const promotionAdjustmentElem = componentWrapper.getByTitle('adj1 adjustment');
    expect(promotionAdjustmentElem).toHaveStyle('color: #4B8B52');
    promotionAdjustment = unformat(promotionAdjustmentElem.textContent) * -1;
    expect(promotionAdjustment).toEqual(10.00);
  });

  it('displays correct adjusted total', () => {
    adjustedPrice = componentWrapper.getByTitle('total adjusted price');
    expect(adjustedPrice).toHaveTextContent(formatMoney(originalPrice - promotionAdjustment));
  });

  it('displays correct lead time', () => {
    const leadTimeElem = componentWrapper.getByText('Shipping Note: Ships within 1 week');
    expect(leadTimeElem).toBeDefined();
  });
});

describe('an order product card without adjustments', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <OrderProductCard
        backorder={null}
        image="https://d1tlpgo3r360y6.cloudfront.net/media/products/565022/small/b455dwbm3wpqsu3orny5.jpg?1561048377"
        leadTime={9}
        option="2y"
        optionType="Size"
        price="17.65"
        total="7.65"
        adjustments={[]}
        item={{
          variant: {
            brand: 'Lindsey Berns',
            brand_slug: 'lindsey-berns',
            name: 'Anna Dress',
            slug: 'anna-dress'
          }
        }}
        promotionable
        quantity={1}
        vendor="Lindsay Berns"
        inStock
        showShipsFromLabel={false}
      />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('only displays original price with no adjustments', () => {
    originalPrice = componentWrapper.getByTitle('original price');
    expect(originalPrice.parentNode.children.length).toBe(1);
  });

  it('displays original price correctly', () => {
    originalPrice = componentWrapper.getByTitle('original price');
    expect(originalPrice).toHaveStyle('text-decoration: none');
    expect(originalPrice).toHaveStyle('color: #9CB1DC');
    expect(originalPrice).toHaveTextContent('$17.65');
  });

  it('displays correct lead time', () => {
    const leadTimeElem = componentWrapper.getByText('Shipping Note: Ships within 1 week and 2 days');
    expect(leadTimeElem).toBeDefined();
  });
});

describe('an order product card with a monogram', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <OrderProductCard
        backorder={null}
        image="https://d1tlpgo3r360y6.cloudfront.net/media/products/565022/small/b455dwbm3wpqsu3orny5.jpg?1561048377"
        leadTime={10}
        option="2y"
        optionType="Size"
        price="17.65"
        total="7.65"
        monogram={{
          text: 'Boop!!!',
          price: '20.0',
          customization: {
            color: {
              name: 'Green',
              value: '#008000'
            },
            font: {
              name: 'Modern Upper Full',
              value: 'GT Walsheim Web,Helvetica,Trebuchet MS,sans-serif'
            }
          },
          monogram_lead_time: 9
        }}
        adjustments={[]}
        item={{
          variant: {
            brand: 'Lindsey Berns',
            brand_slug: 'lindsey-berns',
            name: 'Anna Dress',
            slug: 'anna-dress'
          }
        }}
        promotionable
        quantity={1}
        vendor="Lindsay Berns"
        inStock
        showShipsFromLabel={false}
      />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('displays the correct monogram text and color', () => {
    const monogramText = componentWrapper.getByText('Boop!!!');
    expect(monogramText.tagName).toBe('SPAN');
    expect(monogramText).toHaveStyle('color: #008000');
  });
});
