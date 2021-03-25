import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';

import AddFreeShipping from '../../molecules/add-for-free-shipping';
import Button from '../../atoms/button';
import OrderProductCard from '../../tissues/order-product-card';
import OrderSummary from '../../tissues/order-summary';
import Typography from '../../atoms/typography';

import { updateCart } from '../../store/modules/cart/actions';
import getGiftwrapPriceByVariantId from '../../utils/getGiftwrapPriceByVariantId';
import trackEvent from '../../utils/tracking';
import getPayment from '../../utils/getPayment';

const Form = styled.form`
  grid-area: confirm;
`;

const FreeShipping = styled(AddFreeShipping)`
  margin-bottom: 1.5rem;
`;

const HeadingWrapper = styled('div', { shouldForwardProp: (prop) => prop !== 'active' })`
  display: flex;
  border-bottom: 1px solid ${({ active, theme }) => (active ? theme.color.brand : theme.color.brandLight)};
  color: ${({ active, theme }) => (active ? theme.color.brand : theme.color.brandLight)};
`;

const EditStep = styled(Button)`
  line-height: 2.5rem;
  height: 2.5rem;
  border: 0;
  padding: 0;
  margin: 0 0 0 auto;
  flex: 1 0 auto;
  align-self: center;
  outline: 0;
  text-decoration: underline;
`;

const Step = styled(Typography)`
  width: 100%;
`;

const Fieldset = styled.fieldset`
  position: sticky;
  top: 180px;
`;

const CompleteWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const CartList = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.color.brand};
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 1.5rem;
  max-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
`;

const CartTotals = styled.div``;

const TermsConditionsText = styled(Typography)`
  &&, a {
    color: ${({ theme }) => theme.color.brandLight};
  }

  margin-bottom: 1.5rem;
`;

const ConfirmButton = styled(Button)`
  width: 100%;
`;

const PriceInfo = styled(OrderSummary)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: 3rem;
`;

const ProductCard = styled(OrderProductCard)`
  &:first-of-type {
    border-top: 0;
  }

  &:last-of-type {
    border-bottom: 0;
  }
`;

const ShippingPaymentSummary = styled.div`
  width: 50%;
  padding: ${(props) => props.theme.modularScale.base} 0;
`;

const ShipPayHeading = styled(Typography)`
  letter-spacing: 0.24rem;
  line-height: ${(props) => props.theme.modularScale.large};
`;

const ShipPayContent = styled(Typography)``;

const CheckoutConfirm = (props) => {
  useEffect(() => {
    if (props.active) {
      trackEvent({
        eventCategory: 'Purchase',
        eventAction: 'Complete purchase',
        eventLabel: 'Shown'
      });
    }
  }, [props.active]);

  return (
    <Form id="confirm" tabIndex="0">
      <Fieldset active={props.active} disabled={props.loading}>
        <HeadingWrapper active={props.active ? 'true' : undefined}>
          <Step role="heading" aria-level="2" element="legend" like="heading-4" step={4}>
            Summary
          </Step>
          <EditStep outline onClick={() => props.handleOnEditClick('confirm')}>Edit Bag</EditStep>
        </HeadingWrapper>
        {
          props.cart?.ship_address
          && props.cart?.payments?.[0]
          && (
            <HeadingWrapper active={props.active ? 'true' : undefined}>
              <ShippingPaymentSummary>
                <ShipPayHeading element="h3" like="label-1">
                  SHIPPING
                </ShipPayHeading>
                <ShipPayContent element="p" like="dec-1">
                  {props.cart.ship_address.address1}
                  {props.cart.ship_address.address2 && `, ${props.cart.ship_address.address2}`}
                  <br />
                  {props.cart.ship_address.city}
                  ,
                  {' '}
                  {props.cart.ship_address.state_text}
                  {' '}
                  {props.cart.ship_address.zipcode}
                </ShipPayContent>
              </ShippingPaymentSummary>
              <ShippingPaymentSummary>
                <ShipPayHeading element="h3" like="label-1">
                  PAYMENT
                </ShipPayHeading>
                {
                  props.cart.payments
                    .filter((payment) => payment.state === 'checkout')
                    .map((payment) => <ShipPayContent key={payment.id} element="p" like="dec-1">{getPayment(payment, true)}</ShipPayContent>)
                }
              </ShippingPaymentSummary>
            </HeadingWrapper>
          )
        }
        <CompleteWrapper>
          <CartList>
            {
              props.cart.line_items?.map((item, i) => {
                const giftwrapPrice = getGiftwrapPriceByVariantId(
                  item.variant.id, props.cart.shipments
                );
                return (
                  <ProductCard
                    backorder={item.variant.is_backorderable && item.backordered}
                    brand={{ name: item.variant.brand, permalink: `/brands/${item.variant.brand_slug}` }}
                    cart={props.cart}
                    country={item.country_iso}
                    finalSale={item.final_sale}
                    image={item?.variant?.images[0]?.product_url}
                    inStock={item?.variant?.total_on_hand > 0}
                    isGiftCard={item.gift_cards ? item.gift_cards.length > 0 : []}
                    isMutatable={false}
                    item={{ ...item, index: i + 1, module: 'Checkout Summary Step' }}
                    key={item.id}
                    leadTime={item.monogram?.monogram_lead_time ?? item.variant.lead_time}
                    monogram={item.monogram}
                    option={item.variant.option_values.length > 0 ? item.variant.option_values[0].presentation : ''}
                    optionType={item.variant.option_values.length > 0 ? item.variant.option_values[0].option_type_presentation : ''}
                    price={item.price}
                    promotionable={item.promotionable}
                    adjustments={item.adjustments}
                    quantity={item.quantity}
                    showShipsFromLabel={false}
                    stock={item.variant.total_on_hand}
                    title={{ name: item.variant.name, permalink: `/product/${item.variant.slug}` }}
                    vendor={item.vendor_name}
                    giftwrapPrice={giftwrapPrice}
                    domesticOverride={item.domestic_override}
                  />
                );
              })
            }
          </CartList>

          {props.children}

          <CartTotals>
            <FreeShipping
              threshold={props.cart.free_shipping_threshold}
              subtotal={props.cart.item_total}
            />

            {props.cart.subtotals && (
              <PriceInfo
                gift={props.cart.subtotals.giftwrap_amount}
                miscellaneous={props.cart.subtotals.miscellaneous_adjustments}
                promotions={props.cart.subtotals.line_item_promotion_totals}
                shipping={props.cart.subtotals.shipments_total}
                subtotal={props.cart.subtotals.item_total}
                tax={props.cart.subtotals.tax_adjustments}
                total={props.cart.subtotals.order_total}
                state={props.cart.state}
              />
            )}
          </CartTotals>
        </CompleteWrapper>

        <TermsConditionsText element="p" like="dec-1">
          By placing this order, you agree with our
          {' '}
          <a href="/terms" target="_blank" rel="noopener">
            Terms &amp; Conditions
          </a>
        </TermsConditionsText>

        <ConfirmButton
          data-test-id="confirm-submit"
          disabled={!props.active || props.loading}
          onClick={(e) => props.onSubmit({ expected_total: props.cart.total }, e)}
          type="submit"
        >
          Complete Purchase
        </ConfirmButton>
      </Fieldset>
    </Form>
  );
};

CheckoutConfirm.defaultProps = {
  active: false,
  loading: false,
  children: '',
  onSubmit: () => { },
  handleOnEditClick: () => { }
};

CheckoutConfirm.propTypes = {
  cart: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  children: PropTypes.any,
  active: PropTypes.bool,
  onSubmit: PropTypes.func,
  handleOnEditClick: PropTypes.func
};

const mapStateToProps = (state) => ({
  cart: state.cart
});

const mapDispatchToProps = (dispatch) => ({
  updateCart: (cart) => dispatch(updateCart(cart))
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(CheckoutConfirm));
