import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { formatMoney } from 'accounting-js';

import Typography from '../../atoms/typography';

const Total = styled(Typography)`
  flex: 1;
  letter-spacing: 0.2em;
  min-width: 5rem;
  padding-right: 1rem;
  text-transform: uppercase;
`;

const ListWrapper = styled(Typography, { shouldForwardProp: (prop) => prop !== 'newCheckout' })`
  color: ${(props) => props.theme.color[props.color ?? 'brand']};
  display: flex;

  ${(props) => (props.newCheckout && css`
    font-size: 1.6rem;
    margin-bottom: 0.4rem;

    ${Total} {
      font-family: ${props.theme.font.sans};
      font-size: 1.8rem;
      text-transform: none;
      letter-spacing: normal;
      margin-top: ${props.theme.modularScale.xlarge};
    }

    ${Total} + dd {
      margin-top: ${props.theme.modularScale.xlarge};
    }

    span {
      font-size: 1.4rem;
      color: ${props.theme.color.brandLightBlue};
    }
  `)}

  dt {
    min-width: 5rem;
    padding-right: 1rem;
    flex: 1
  }
`;

const HR = styled.hr`
  border: 0;
  border-top: 1px solid ${(props) => props.theme.color.brand};
  margin: 1rem 0;
`;

const FreeShipping = styled(Typography)`
  font-family: ${({ theme }) => theme.font.sans};
  color: ${(props) => props.theme.color.brandA11yRed};
  letter-spacing: 0.1em;
  margin-right: -0.1em;
  min-width: 5rem;
  text-transform: uppercase;
  display: block;
`;

const calculateTotalBeforeTax = (taxes, total) => {
  const tax = taxes.reduce((a, c) => a + parseFloat(c.amount), 0);
  const totalBeforeTax = +total - tax;
  return formatMoney(totalBeforeTax, { precision: 2 });
};

const getGiftCard = (miscellaneous) => miscellaneous?.find?.((m) => m.label === 'Promotion (E-Gift Cards)');

const filterOutGiftCard = (miscellaneous) => miscellaneous?.filter?.((m) => m.label !== 'Promotion (E-Gift Cards)');

const OrderSummary = (props) => {
  const renderNewCheckoutOrderTotal = () => (props.useStoreCredit && props.totalAfterStoreCredit ? (
    <ListWrapper newCheckout element="div" like="dec-1">
      <Total element="p" like="label-1">Order total:</Total>
      <dd data-test-id="order-total-minus-store-credit">{formatMoney(props.totalAfterStoreCredit, { precision: 2 })}</dd>
    </ListWrapper>
  )
    : (
      <ListWrapper newCheckout element="div" like="dec-1">
        <Total element="p" like="label-1">{props.newCheckout ? 'Order total:' : 'Total'}</Total>
        <dd data-test-id="order-total">{formatMoney(props.total, { precision: 2 })}</dd>
      </ListWrapper>
    ));

  return (
    <dl className={props.className} data-test-id="order-summary" id={props.id}>
      <ListWrapper newCheckout={props.newCheckout} element="div" like="dec-1">
        <dt>{props.newCheckout ? 'Items:' : 'Subtotal'}</dt>
        <dd data-test-id="order-subtotal">{formatMoney(props.subtotal, { precision: 2 })}</dd>
      </ListWrapper>
      <ListWrapper newCheckout={props.newCheckout} element="div" like="dec-1">
        <dt>
        Shipping
          {' '}
          {props.newCheckout && '& Handling:'}
        </dt>
        <dd data-test-id="order-shipping-total">
          {
          // eslint-disable-next-line no-nested-ternary
          ['delivery', 'payment', 'confirm'].includes(props.state)
            ? (
              <>
                {
                  props.shipping > 0
                    ? formatMoney(props.shipping, { precision: 2 })
                    : <FreeShipping element="span" like="label-1">Free Shipping</FreeShipping>
                }
              </>
            )
            : props.newCheckout ? 'TBD' : 'Shipping Calculated at Checkout'
        }
        </dd>
      </ListWrapper>

      {
        props.newCheckout && +props.subtotal < +props.threshold && (
          <ListWrapper newCheckout element="div" like="dec-1"><span>{`Free ground shipping on orders ${formatMoney(props.threshold, { precision: 0 })} or more`}</span></ListWrapper>
        )
      }

      {
        props.gift > 0 && (
          <ListWrapper newCheckout={props.newCheckout} element="div" like="dec-1">
            <dt>Gift wrap</dt>
            <dd data-test-id="order-gift-wrap-total">{formatMoney(props.gift, { precision: 2 })}</dd>
          </ListWrapper>
        )
      }

      {
        !props.newCheckout
          && props.miscellaneous.length > 0 && props.miscellaneous.map((miscellaneous) => (
            <ListWrapper newCheckout={props.newCheckout} color="brandGreen" key={`miscellaneous-${miscellaneous.label}`} element="div" like="dec-1">
              <dt>{miscellaneous.label}</dt>
              <dd>
              -
                {formatMoney(miscellaneous.amount * -1, { precision: 2 })}
              </dd>
            </ListWrapper>
        ))
      }

      {/* separation needed for checkout revamp positioning
            filter out gift cards to display below */}
      {
        props.newCheckout && filterOutGiftCard(props.miscellaneous)?.map((miscellaneous) => (
          <ListWrapper newCheckout={props.newCheckout} color="brandGreen" key={`miscellaneous-${miscellaneous.label}`} element="div" like="dec-1">
            <dt>{miscellaneous.label}</dt>
            <dd>
            -
              {formatMoney(miscellaneous.amount * -1, { precision: 2 })}
            </dd>
          </ListWrapper>
        ))
      }

      {
        props?.promotions?.length > 0 && props?.promotions?.map((promotions, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <ListWrapper newCheckout={props.newCheckout} color="brandGreen" key={`promotions-${promotions.label}-${i}`} element="div" like="dec-1">
            <dt>{promotions.label}</dt>
            <dd>
              -
              {formatMoney(promotions.total * -1, { precision: 2 })}
            </dd>
          </ListWrapper>
        ))
      }

      {/* new gift card only position and text for checkout revamp */}
      {
        props.newCheckout && getGiftCard(props.miscellaneous) && (
          <ListWrapper newCheckout color="brandGreen" element="div" like="dec-1">
            <dt>Gift card:</dt>
            <dd>
              -
              {formatMoney(getGiftCard(props.miscellaneous).amount * -1, { precision: 2 })}
            </dd>
          </ListWrapper>
        )
      }

      {
        props.newCheckout && (
          <ListWrapper newCheckout element="div" like="dec-1">
            <dt>Subtotal:</dt>
            <dd data-test-id="order-before-tax-total">
              {
                calculateTotalBeforeTax(props.tax, props.total)
              }
            </dd>
          </ListWrapper>
        )
      }

      {
        props.tax.length > 0 && (
          <ListWrapper newCheckout={props.newCheckout} key="tax" element="div" like="dec-1">
            <dt>{props.newCheckout ? 'Estimated tax:' : 'Taxes'}</dt>
            <dd data-test-id="order-tax-total">
              {
                formatMoney(

                  props.tax.reduce((a, c) => a + parseFloat(c.amount), 0),
                  { precision: 2 }
                )
              }
            </dd>
          </ListWrapper>
        )
      }

      {
        props.newCheckout && props.useStoreCredit && props.applicableStoreCredit && (
          <ListWrapper newCheckout color="brandGreen" element="div" like="dec-1">
            <dt>Store credit:</dt>
            <dd>
              -
              {formatMoney(props.applicableStoreCredit)}
            </dd>
          </ListWrapper>
        )
      }

      {
        !props.newCheckout
          && <HR />
      }

      {
        !props.newCheckout ? (
          <ListWrapper element="div" like="dec-1">
            <Total element="p" like="label-1">Total</Total>
            <dd data-test-id="order-total">{formatMoney(props.total, { precision: 2 })}</dd>
          </ListWrapper>
        ) : (
          renderNewCheckoutOrderTotal()
        )
      }

    </dl>
  );
};

OrderSummary.defaultProps = {
  className: '',
  state: 'address',
  promotions: [],
  newCheckout: false,
  threshold: '',
  useStoreCredit: false,
  applicableStoreCredit: '',
  totalAfterStoreCredit: '',
  id: 'order-summary'
};

OrderSummary.propTypes = {
  className: PropTypes.string,
  gift: PropTypes.number.isRequired,
  miscellaneous: PropTypes.array.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  promotions: PropTypes.array,
  shipping: PropTypes.string.isRequired,
  subtotal: PropTypes.string.isRequired,
  tax: PropTypes.array.isRequired,
  state: PropTypes.oneOf(['cart', 'address', 'delivery', 'payment', 'confirm', 'complete']),
  total: PropTypes.string.isRequired,
  newCheckout: PropTypes.bool,
  threshold: PropTypes.string,
  useStoreCredit: PropTypes.bool,
  applicableStoreCredit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // eslint-disable-next-line react/no-unused-prop-types
  totalAfterStoreCredit: PropTypes.string,
  id: PropTypes.string
};

OrderSummary.whyDidYouRender = true;

export default OrderSummary;
