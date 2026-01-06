import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Router from 'next/router';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import * as Sentry from '@sentry/node';

import { toast, TOAST } from '../../utils/toastify';
import {
    getCart, nextCheckout, updateLineItem, removeLineItem
} from '../../pages/api';
import { toggleCartModalVisibility } from '../../store/modules/interfaces/actions';
import { updateCart } from '../../store/modules/cart/actions';

import trackEvent, { trackRemoveFromCart, LUX } from '../../utils/tracking';
import { logAmplitude } from '../../utils/amplitude';

import getCookie from '../../utils/getCookie';
import { useEventListener } from '../../utils/hooks';
import getGiftwrapPriceByVariantId from '../../utils/getGiftwrapPriceByVariantId';
import manageFocus from '../../utils/manageFocus';
import manageBodyOverflow from '../../utils/manageBodyOverflow';

import Button from '../../atoms/button';
import ButtonUrl from '../../atoms/button-url';
import CrossIcon from '../../atoms/icon-cross';

import Typography from '../../atoms/typography';
import OrderSummary from '../../tissues/order-summary';
import OrderProductCard from '../../tissues/order-product-card';
import AddFreeShipping from '../../molecules/add-for-free-shipping';
import BNPLCombinedMessaging from '../../molecules/bnpl-combined-messaging';

const ApplePayButton = dynamic(() => import('../../molecules/braintree-apple-pay'));
const PaypalButton = dynamic(() => import('../../molecules/braintree-paypal-cart'));

const FreeShipping = styled(AddFreeShipping)`
  margin-bottom: 1.5rem;
`;

const Loading = styled.div`
  background: ${(props) => props.theme.color.background};
  bottom: 0;
  left: 0;
  opacity: 0.75;
  position: absolute;
  right: 0;
  top: 0;
  z-index: ${(props) => props.theme.layers.balcony};

  ${(props) => props.theme.loader()}
`;

const Cart = styled.aside`
  background: ${(props) => props.theme.color.white};
  bottom: 0;
  display: flex;
  flex-direction: column;
  left: 0;
  padding: 2rem;
  position: fixed;
  right: 0;
  top: 0;
  transform: ${(props) => (props.active ? 'translateX(0)' : 'translateX(100%)')};
  visibility: ${(props) => (props.active ? 'visible' : 'hidden')};
  transition: transform ${(props) => props.theme.animation.fast} linear,
    visibility ${(props) => props.theme.animation.default};
  z-index: ${(props) => props.theme.layers.balcony};

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    left: 50%;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.large}) {
    left: 65%;
  }
`;

const HeadingWrapper = styled.div`
  display: flex;
`;

const Close = styled(Button)`
  background-color: ${(props) => props.theme.color.white};
  border: 0;
  height: 4rem;
  left: 1rem;
  outline: 0;
  position: absolute;

  svg {
    padding: 1rem;
    stroke-width: 6;
    stroke: ${(props) => props.theme.color.brand};
  }
`;

const Title = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  position: relative;
  text-align: center;
  margin: 0 auto 2rem;
`;

const Text = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  position: relative;
  text-align: center;
  margin: 0 auto 3rem;
  max-width: 40rem;
`;

const StyledButton = styled(Button)`
  text-align: center;
  width: 26rem;
`;

const StyledButtonUrl = styled(ButtonUrl)`
  text-align: center;
  width: 26rem;
`;

const ButtonSeparator = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  display: block;
  margin: 2rem 0;
  text-align: center;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: auto;
  position: relative;

  &:after {
    background: linear-gradient(180deg,hsla(0,0%,100%,0) 0,#fff);
    content: "";
    height: 20px;
    left: 0;
    position: absolute;
    top: -3.6rem;
    width: 100%;
  }
`;

const CheckoutButton = styled(Button)`
  margin-bottom: 1rem;
  outline: 0;
  text-align: center;

  ${({ theme }) => css`
    font-family: ${theme.font.sans};
    font-size: ${theme.modularScale.eighteen};
  `}
`;

const BackToCheckoutButton = styled(CheckoutButton)`
  margin-bottom: 0;
`;

const PriceInfo = styled(OrderSummary)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: ${(props) => props.theme.modularScale.base};
`;

const Products = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.color.brand};
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 1.5rem;
  max-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
`;

const Overlay = styled.span`
  background: ${(props) => props.theme.color.black};
  bottom: 0;
  height: 0;
  opacity: 0;
  position: fixed;
  right: 0;
  top: 0;
  transition: opacity ${(props) => props.theme.animation.fast} ${(props) => props.theme.animation.easeOutQuad};
  width: 100%;
  z-index: ${(props) => props.theme.layers.balcony};

  ${(props) => props.active && css`
    opacity: 0.5;
    height: 100%;
  `}
`;

const NoItems = styled.div`
  padding-top: 2.5rem;
  overflow: auto;
  text-align: center;

  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    padding-top: 5rem;
  }
`;

const EmptyCartImage = styled.img`
  margin-bottom: 3rem;
  width: 10rem;
`;

const OutOfStockLabel = styled(Typography)`
  color: ${(props) => props.theme.color.brandError};
  margin-bottom: 1em;
  text-align: center;
  transform: translateY(-0.5em);
`;

const PaymentButtons = styled.div`
  display: ${(props) => (props.hasOutOfStockProducts ? 'none' : 'block')};
`;

const PayPalButtonWrapper = styled.div`
  display: flex;

  > div {
    flex: 1 1 50%;
  }

  > div + div {
    margin: 0 0 0 1rem;
  }
`;

const StyledApplePayButton = styled(ApplePayButton)`
  margin-top: 1rem;
`;

const CartDrawer = (props) => {
  const [loading, setLoading] = useState(false);
  const [prevElement, setPrevElement] = useState(null);
  const cartRef = useRef();

  const isCheckout = () => global?.window?.location?.pathname === '/checkout';

  useEffect(() => {
    manageBodyOverflow(props.cartActive);

    const { current } = cartRef;
    const previousElement = global.document.activeElement;
    if (props.cartActive) {
      setPrevElement(previousElement);
    }
    manageFocus(current, props.cartActive, prevElement, 400);
  }, [props.cartActive]);

  const handleOnCartClose = () => {
    logAmplitude('Clicked Button In Cart', { buttonName: 'X button' });
    props.setIsCartActive(false);
  };

  const handleBackToCheckout = () => {
    logAmplitude('Clicked Button In Cart', { buttonName: 'Go back button' });
    props.setIsCartActive(false);
  };

  const handleEscKeypress = ({ code }) => {
    if (code !== 'Escape') return;
    props.setIsCartActive(false);
  };

  useEventListener('keyup', handleEscKeypress);

  const handleRemoveProduct = async (item) => {
    setLoading(true);

    const orderToken = props.cart?.token || getCookie('maisonette_order_token');

    LUX.removedFromCart();

    if (orderToken && props.cart.number) {
      await removeLineItem({ order_number: props.cart.number, id: item.id })
        .then(async () => {
          await getCart({ order_number: props.cart.number })
            .then((res) => {
              if (res.errors) {
                res.errors.forEach((error) => {
                  if (typeof error.message === 'string') {
                    toast(error.message, { type: TOAST.TYPE.ERROR });
                  }
                });

                setLoading(false);

                return;
              }

              LUX.cartValue(res);
              LUX.cartSize(res);

              props.updateCart(res);

              if (Object.prototype.hasOwnProperty.call(res, 'line_items') === false || res.line_items.length === 0) {
                props.setIsCartActive(false);

                if (isCheckout()) {
                  Router.push('/').then(() => {
                    props.setIsCartActive(false);
                  });
                } else {
                  props.setIsCartActive(false);
                  global.window.scrollTo(0, 0);
                }
              }

              logAmplitude('Removed From Cart', { product: item, cart: res });

              trackRemoveFromCart({ product: item, cart: res });

              setLoading(false);
            });
        });
    } else {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (quantity, product) => {
    setLoading(true);

    const orderToken = props.cart?.token || getCookie('maisonette_order_token');

    if (orderToken && props.cart.number) {
      await updateLineItem({ order_number: props.cart.number, id: product, quantity })
        .then(async () => {
          await getCart({ order_number: props.cart.number })
            .then((res) => {
              if (res.errors) {
                res.errors.forEach((error) => {
                  if (typeof error.message === 'string') {
                    toast(error.message, { type: TOAST.TYPE.ERROR });
                  }
                });

                setLoading(false);

                return;
              }

              LUX.cartValue(res.total);
              LUX.cartSize(res.total_quantity);

              props.updateCart(res);
              setLoading(false);
            });
        });
    } else {
      setLoading(false);
    }
  };

  const handleCheckoutLinkClick = async (e) => {
    e.preventDefault();

    trackEvent({
      eventCategory: 'Cart',
      eventAction: 'Submit cart',
      eventLabel: 'Attempt'
    });

    logAmplitude('Clicked Button In Cart', {
      buttonName: 'Proceed to checkout'
    });

    if (props.cart.state === 'cart') {
      const cart = await nextCheckout({ id: props.cart.number });
      const cartData = cart?.data ?? cart;
      logAmplitude('Started Checkout', { cart });
      props.updateCart(cartData);
    }

    Router.push('/checkout').then(() => {
      props.setIsCartActive(false);
      global.window.scrollTo(0, 0);
    }).catch((err) => Sentry.captureException(err));
  };

  const hasOutOfStockProducts = props.cart?.line_items?.some((item) => !item.variant.in_stock);

  if (props.cart.loading) {
    return (
      <>
        {props.cartActive && <Overlay active={props.cartActive} onClick={handleOnCartClose} />}
        <Cart active={props.cartActive}>
          <Loading />
        </Cart>
      </>
    );
  }

  const renderPaymentCTAs = () => (
    <>
      <CheckoutButton
        data-test-id="checkout"
        isLink
        href={'/checkout'}
        button
        onClick={handleCheckoutLinkClick}
        disabled={hasOutOfStockProducts}
        green
      >
        Proceed to checkout
      </CheckoutButton>

      <PaymentButtons hasOutOfStockProducts={hasOutOfStockProducts}>
        <PayPalButtonWrapper>
          <PaypalButton
            id="paypal-cart-paylater"
            token={process.env.NEXT_PUBLIC_BRAINTREE_TOKEN}
            isCart
            fundingSource="PAYLATER"
          />
          <PaypalButton
            id="paypal-cart-paypal"
            token={process.env.NEXT_PUBLIC_BRAINTREE_TOKEN}
            isCart
            fundingSource="PAYPAL"
          />
        </PayPalButtonWrapper>
        <StyledApplePayButton
          token={process.env.NEXT_PUBLIC_BRAINTREE_TOKEN}
          isCart
        />
      </PaymentButtons>
    </>
  );

  return (
    <>
      {props.cartActive && <Overlay active={props.cartActive} onClick={handleOnCartClose} />}

      <Cart
        ref={cartRef}
        active={props.cartActive}
      >
        {loading && <Loading />}

        <HeadingWrapper>
          <Close aria-label="close bag" type="button" onClick={handleOnCartClose} isIcon>
            <CrossIcon />
          </Close>

          <Title element="h2" like="heading-4">
            My Bag
          </Title>
        </HeadingWrapper>

        {
          hasOutOfStockProducts && (
            <OutOfStockLabel element="p" like="dec-1">
              Some products in your cart are out of stock, please remove them to checkout.
            </OutOfStockLabel>
          )
        }

        {
          Object.keys(props.cart).length
            && props.cart.state !== 'complete'
            && props.cart.line_items
            && props.cart.line_items.length > 0
            ? (
              <>
                <Products>
                  {
                    props.cart.line_items.map((item, i) => {
                      const giftwrapPrice = getGiftwrapPriceByVariantId(
                        item.variant.id, props.cart.shipments
                      );
                      return (
                        <OrderProductCard
                          isCart
                          backorder={item.variant.is_backorderable && item.backordered}
                          cart={props.cart}
                          country={item.country_iso}
                          finalSale={item.final_sale}
                          image={(item.variant.images[0] && item.variant.images[0].product_url)}
                          inStock={item.variant.in_stock}
                          isGiftCard={item.gift_cards.length > 0}
                          isMutatable
                          item={{ ...item, index: i + 1, module: 'Cart' }}
                          key={item.id}
                          leadTime={item.monogram?.monogram_lead_time ?? item.variant.lead_time}
                          monogram={item.monogram}
                          onProductRemove={handleRemoveProduct}
                          onQuantityChange={handleUpdateProduct}
                          option={item.variant.option_values.length > 0 ? item.variant.option_values[0].presentation : ''}
                          optionType={item.variant.option_values.length > 0 ? item.variant.option_values[0].option_type_presentation : ''}
                          price={item.price}
                          promotionable={item.promotionable}
                          adjustments={item.adjustments}
                          quantity={item.quantity}
                          showShipsFromLabel
                          stock={item.variant.total_on_hand}
                          vendor={item.vendor_name}
                          giftwrapPrice={giftwrapPrice}
                          domesticOverride={item.domestic_override}
                        />
                      );
                    })
                  }
                </Products>

                <Footer>
                  <FreeShipping
                    threshold={props.cart.free_shipping_threshold}
                    progressTotal={props.cart.subtotals.free_shipping_progress_total}
                  />

                  <PriceInfo
                    id="cart-order-summary"
                    gift={props.cart.subtotals.giftwrap_amount}
                    miscellaneous={props.cart.subtotals.miscellaneous_adjustments}
                    promotions={props.cart.subtotals.line_item_promotion_totals}
                    shipping={props.cart.subtotals.shipments_total}
                    subtotal={props.cart.subtotals.item_total}
                    tax={props.cart.subtotals.tax_adjustments}
                    total={props.cart.subtotals.order_total}
                    state={props.cart.state}
                  />

                  <BNPLCombinedMessaging
                    amount={props.cart.subtotals.order_total}
                  />

                  {
                    isCheckout() ? (
                      <BackToCheckoutButton
                        type="button"
                        onClick={handleBackToCheckout}
                        green
                      >
                        Go back to checkout
                      </BackToCheckoutButton>
                    ) : renderPaymentCTAs()
                  }

                </Footer>
              </>
            ) : (
              <NoItems>
                <EmptyCartImage src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-cart-empty.png`} alt="Empty Cart" />

                <Title element="h3" like="heading-5">
                  It’s in the bag. This way to the good stuff...
                </Title>

                {props.profile?.id ? (
                  <Link passHref href="/">
                    <StyledButton isLink outline>
                      Start shopping
                    </StyledButton>
                  </Link>
                ) : (
                  <>
                    <Text element="p" like="paragraph-1">
                      Forgetting anything? Log into your account to view the items
                      you saved in your bag!
                    </Text>

                    <StyledButtonUrl outline passHref href="/login">
                      Log in
                    </StyledButtonUrl>
                    <ButtonSeparator element="span" like="label-1">
                      or
                    </ButtonSeparator>
                    <StyledButtonUrl passHref href="/signup">
                      Create new account
                    </StyledButtonUrl>
                  </>
                )}
              </NoItems>
            )
        }
      </Cart>
    </>
  );
};

const mapStateToProps = (state) => ({
  cartActive: state.interfaces.isCartActive,
  cart: state.cart,
  profile: state.profile
});

const mapDispatchToProps = (dispatch) => ({
  setIsCartActive: (flag) => dispatch(toggleCartModalVisibility(flag)),
  updateCart: (cart) => dispatch(updateCart(cart))
});

CartDrawer.propTypes = {
  cart: PropTypes.object.isRequired,
  cartActive: PropTypes.bool.isRequired,
  profile: PropTypes.object.isRequired,
  setIsCartActive: PropTypes.func.isRequired,
  updateCart: PropTypes.func.isRequired
};

const ConnectedCartDrawer = connect(mapStateToProps, mapDispatchToProps)(CartDrawer);

ConnectedCartDrawer.displayName = 'CartDrawer';

ConnectedCartDrawer.whyDidYouRender = true;

export default ConnectedCartDrawer;
