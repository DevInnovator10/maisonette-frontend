import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import cookies from 'next-cookies';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Head from 'next/head';
import styled from '@emotion/styled';
import * as Sentry from '@sentry/node';
import { toast, TOAST } from '../../utils/toastify';
import { storeWrapper } from '../../store';

import {
  getCart,
  getUser,
  updateCheckout,
  nextCheckout,
  completeCheckout,
  getCurrentCart
} from '../api';
import { toggleCartModalVisibility } from '../../store/modules/interfaces/actions';
import { updateCart } from '../../store/modules/cart/actions';
import { setToken } from '../../store/modules/user/actions';
import { setUserProfile } from '../../store/modules/profile/actions';

import {
  trackNewCustomer,
  trackPurchase,
  trackCheckout,
  trackCheckoutStep,
  trackCheckoutOption,
  trackPurchaseCompleteAlgolia,
  trackMovableInkConversion
} from '../../utils/tracking';

import theme from '../../theme/theme';
import { Page, Content } from '../../theme/page';
import getCartAfterError from '../../utils/getCartAfterError';
import { logAmplitude, logRevenueAmplitude, setFirstPurchaseAmplitude } from '../../utils/amplitude';
import { isCoveredByStoreCredit } from '../../utils/paymentMethodHelpers';

import Layout from '../../layouts/checkout';

import Button from '../../atoms/button';
import Typography from '../../atoms/typography';
import CheckoutEmailInput from '../../tissues/checkout-email-input';
import ShipPayCheckoutSummary from '../../molecules/ship-pay-checkout-summary';
import OrderSummary from '../../tissues/order-summary';
import CheckoutDeliverySection from '../../molecules/checkout-delivery-section';
import CheckoutPaymentSection from '../../molecules/checkout-payment-section';
import CheckoutPromoCode from '../../tissues/checkout-promo-code';
import CheckoutShipments from '../../organs/checkout-shipments';
import CheckoutAddGiftSection from '../../molecules/checkout-add-gift-section';
import { ShippingCutoffProvider } from '../../utils/hooks/useShippingCutoff';

const Loading = styled.div`
  background-color: ${(props) => props.theme.color.background};
  bottom: 0;
  left: 0;
  opacity: 0.75;
  position: fixed;
  right: 0;
  top: 0;
  visibility: visible;
  z-index: ${(props) => props.theme.layers.balcony};

  ${(props) => props.theme.loader()}
`;

const CheckoutPage = styled(Page)`
  min-height: unset;
  overflow: auto;
  max-width: ${(props) => props.theme.width.extraLarge};
  margin: 0 auto;
`;

const CheckoutContent = styled(Content)`
  display: grid;
  grid-gap: 6.4rem;
  padding: 6.4rem 1.6rem;
  color: ${(props) => props.theme.color.brand};

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    padding: 6.4rem;
    grid-template-columns: 0.70fr 0.30fr;
    grid-template-rows: min-content;
    grid-column-gap: ${(props) => props.theme.modularScale.sixtyFour};
    grid-template-areas:  'heading       .'
                          'delivery      summary'
                          'gift          summary'
                          'shipments     summary'
                          'payment       summary';
  }
`;

const PageHeading = styled(Typography)`
  font-size: 3.2rem;
  text-align: center;

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    grid-area: heading;
    text-align: left;
    margin-left: 4.8rem;
  }
`;

const CheckoutOrderSummary = styled(OrderSummary)`
  display: grid;
`;

const TermsConditionsText = styled(Typography)`
  text-align: center;
  color: ${(props) => props.theme.color.brand};
  font-size: 1.4rem;
`;

const HR = styled.hr`
  width: 50%;
  border-bottom: 1px solid ${(props) => props.theme.color.brandLight};

  ${TermsConditionsText} + div {
    display: grid;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: none;

    ${TermsConditionsText} + div {
      display: none;
    }
  }
`;

const PlaceOrderButton = styled(Button)`
  width: 100%;
  margin: ${(props) => props.theme.modularScale.thirtyTwo} 0 1rem;

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    grid-area: summary;
  }
`;

const OrderSummaryArea = styled.section`
  display: flex;
  flex-direction: column;

  ${TermsConditionsText} + div {
    display: none;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    grid-area: summary;

    ${TermsConditionsText} + div {
      display: grid;
      margin-top: ${(props) => props.theme.modularScale.xlarge};
    }
  }
`;

const SummaryPlaceOrderWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.color.brand};
  padding: ${(props) => props.theme.modularScale.sixteen};
`;

const SummaryHeading = styled(Typography)`
  font-size: ${(props) => props.theme.modularScale.twentyFour};
  margin-bottom: ${(props) => props.theme.modularScale.thirtyTwo};
`;

const handleErrors = (errors) => {
  errors.forEach((error) => {
    if (typeof error.message === 'string') {
      toast(error.message, { type: TOAST.TYPE.ERROR });
      logAmplitude('Encountered Transaction Error', {
        message: error.message,
        step: 'payment'
      });
    }
  });
};

const renderCheckout = (props) => {
  const [loading, setLoading] = useState(false);
  // set totalQuantity with checkout value initially, later to be changed to use cart when updated.
  // hack for difference in cart and checkout prop from server so we can compare up to date values
  const [totalQuantity, setTotalQuantity] = useState(props.checkout?.total_quantity);
  const hasAddresses = () => !!props.cart?.ship_address && !!props.cart?.bill_address;
  const getGiftCard = () => props.cart?.adjustments?.find((a) => a.source_type === 'Spree::GiftCard');
  const giftCardCoversTotal = () => getGiftCard() && +props.cart?.subtotals?.order_total === 0;
  const hasPayment = (payments) => payments?.filter((payment) => payment.state === 'checkout' && payment.source_type !== 'Spree::StoreCredit')?.length > 0;
  const hasShipments = () => props.cart?.shipments?.length > 0;
  const hasValidEmail = (email) => email !== 'test@test.com';
  const orderCovered = () =>
    hasPayment(props.cart.payments) || giftCardCoversTotal() || isCoveredByStoreCredit(props.cart);
  const canCheckout = () =>
    hasAddresses() && orderCovered() && hasShipments() && hasValidEmail(props.cart?.email);

  const sameBilling = () => props.cart?.ship_address?.id === props.cart?.bill_address?.id;

  useEffect(() => {
    if (props.isStartingCheckout) logAmplitude('Started Checkout', { cart: props.cart });
    if (props.cart) trackCheckout({ cart: props.cart, user: props.user });
    // we need to use the checkout prop returned by the server for registered users
    // we also want to use the redux cart to update certain fields
    // this updates the cart with the checkout prop
    // to avoid issue with our server side state not matching on the client
    if (Object.keys(props.checkout ?? {}).length > 0) {
      if (props.checkout.errors) {
        handleErrors(props.checkout.errors);
      }

      if (props?.checkout?.direct_checkout) {
        trackCheckoutOption({ step: props.cart.state, option: 'Direct Checkout' });
      }

      props.updateCart(props.checkout);
    }

    // check for saved scroll position (persisted through page navigation)
    // only want to scroll to previous position when mobile
    const scrollY = global?.sessionStorage?.getItem?.('maisonette_checkout_scrollY');
    const isMobile = global?.window?.matchMedia(`(max-width: ${theme.breakpoint.max('medium')})`).matches;

    if (scrollY && isMobile) {
      global.window.scrollTo(0, scrollY);
      // remove item so value is not used again elsewhere in session
      global.sessionStorage.removeItem('maisonette_checkout_scrollY');
    }

    if (!hasValidEmail(props.checkout?.email)) {
      // [TEC-7028] Send message to Sentry when test@test.com is set as the order's email
      // on first load.
      // checkout prop will be most up to date order data on page load
      // TODO: revisit when server/client store issues are fixed
      Sentry.withScope((scope) => {
        scope.setContext('cart', props.checkout);
        Sentry.captureMessage('Invalid Email in Order');
      });
    }
  }, []);

  useEffect(() => {
    // this GTM call is important for marketing,
    // it is used as a trigger that adds the Facebook 'InitiateCheckout' pixel.

    // TODO: this will need to be updated when we fix the server/client store issues.
    // it is triggered when the state is 'address'.
    // it will work now if the cart is updated from another page
    // but a server side solution will be needed once props.checkout is removed
    // since props.cart will be progressed on server before loading the page.
    // see investigation comments in TEC-5199.
    trackCheckoutStep({ step: props.cart.state, products: props.cart.line_items });
  }, [props.cart.state]);

  const sendToPayment = async (cart) => {
    // called when user updates cart items from checkout
    // which sets the state back to address.
    // call next until state is payment.
    // in the event an order is covered by promotion or gift-card, the BE
    // skips the payment state and goes directly to confirm,
    // so we need to check for address or delivery state only or this call will throw an error
    // attempting to progress past confirm state.
    if (cart.state === 'address' || cart.state === 'delivery') {
      await nextCheckout({ id: props.cart.number }).then((nextRes) => {
        if (nextRes.errors) {
          handleErrors(nextRes.errors);
          // If an error happens at this point, the user is shown an error message
          // that is hopefully descriptive enough for them to fix the issue.
          // Attempting to rectify or re-fetch a broken order will cause a loop.
          setLoading(false);
        } else {
          sendToPayment(nextRes);
        }
      });
    } else if (cart.state === 'payment' || cart.state === 'confirm') {
      setTotalQuantity(cart.total_quantity);
      props.updateCart(cart);
      setLoading(false);
    }
  };

  useEffect(() => {
    // TODO: Fix server and client state difference
    // hack for cart and checkout being different because of mismatch in server and client stores.
    // totalQuantity state is initially set with checkout prop, but is changed to use cart prop
    // when cart is updated below, so we can compare with live cart data.
    const quantityChanged = props.cart.total_quantity !== totalQuantity;

    if (quantityChanged && props.cart.state === 'address' && props.cart.ship_address) {
      // handles case where user updates cart while on checkout page
      // which sets the state back to address.
      // if there is a shipping address, we can assume they have been through the address step
      // progress step to calculate shipments and return to payment state
      setLoading(true);
      sendToPayment(props.cart);
    }
  }, [props.cart]);

  useEffect(() => {
    // If User uses store credit only and then increases total amount to more than store credit,
    // then toast error will notify them

    // checks the difference in payments in cart and checkout props and selects which to use.
    // // needed because of the server and client store difference on initial load.
    // // there will be more in props.checkout after adding a payment from payment page
    // // there will be more in props.cart when updating from the checkout page
    // // it will default to props.checkout on initial page load
    const useCart = props.cart?.payments?.length > props.checkout?.payments?.length;
    const payments = useCart ? props.cart.payments : props.checkout.payments;
    const storeCreditCheck = props.cart.use_store_credits && !props.cart.covered_by_store_credit;

    if (storeCreditCheck && !hasPayment(payments)) {
      toast('Order total no longer covered by store credit. Please add a payment method.', { type: TOAST.TYPE.ERROR });
    }
  }, [props.cart.subtotals.order_total]);

  const completeOrder = async () => {
    setLoading(true);
    // if logged in with addresses, initial state of order will be payment

    // need to have initial state of order payment for applying coupon
    // this sets order to confirm step so order can be completed
    // transition order to next state to checkout and complete order
    await updateCheckout({
      id: props.cart.number,
      body: {
        order: {
          forter_connection_info: {
            user_agent: props.userAgent,
            token: global.window.forterToken
          },
          channel: 'Web'
        }
      }
    }).then(async () => {
      logAmplitude('Submitted Checkout Order', { cart: props.cart });

      await completeCheckout({
        id: props.cart.number,
        body: { expected_total: props.cart.total, channel: 'Web' }
      })
        .then(async (checkoutRes) => {
          const checkoutResData = checkoutRes?.data ?? checkoutRes;
          const { errors } = checkoutResData;

          if (errors?.length > 0) {
            setLoading(false);

            Sentry.withScope((scope) => {
              scope.setLevel(Sentry.Severity.Info);
              errors.forEach((error) => {
                Object.keys(error).forEach((key) => {
                  scope.setExtra(key, error[key]);
                });
              });
              Sentry.captureException(new Error('Failed to complete purchase'));
            });

            // TODO: update error message with generic Afterpay copy, if we decide to do that
            // will have to make sure error array contains the message:
            // Payment declined. Please contact the Afterpay
            // Customer Service team for more information.
            const errorMessage = 'We were unable to process your payment. Please review your payment information and try again. If you are unable to complete your payment, please contact Customer Care at +1 (844) 624-7663.';

            toast(errorMessage, { type: TOAST.TYPE.ERROR, autoClose: false });

            logAmplitude('Encountered Transaction Error', {
              message: errorMessage,
              step: props.cart.state
            });

            await getCartAfterError()
              .then((cartRes) => {
                const cartResData = cartRes?.data ?? cartRes;
                props.updateCart(cartResData);
              });
          } else {
            global.document.cookie = 'maisonette_order_number=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

            props.updateCart(checkoutResData);

            trackNewCustomer(checkoutResData);
            trackPurchase({ order: checkoutResData });

            // Used for Algolia Personalization Purchase Complete Event
            trackPurchaseCompleteAlgolia(checkoutResData, props.user);

            // Used for MovableInk Conversion tracking
            trackMovableInkConversion(checkoutResData);

            const { line_items, number, first_order } = checkoutResData;

            setFirstPurchaseAmplitude({ first_order });

            line_items.forEach((lineItem) => {
              logRevenueAmplitude({ lineItem, orderNumber: number });
            });

            const payment = checkoutResData.payments?.find((p) => p.state === 'completed')?.source?.payment_type;
            if (payment) trackCheckoutOption({ step: props.cart.state, option: payment });

            logAmplitude('Confirmed Purchase', { cart: checkoutResData, user: props.user });

            // [TEC-7028] The UI should not allow for test@test.com to be used to complete checkout,
            // but we want to be alerted if some other process is overriding the order's email
            if (!hasValidEmail(checkoutResData.email)) {
              Sentry.withScope((scope) => {
                scope.setContext('cart', checkoutResData);
                Sentry.captureMessage('Invalid Email Completed Checkout');
              });
            }

            Router.push(
              '/checkout/confirmation/[id]',
              `/checkout/confirmation/${checkoutResData.number}`
            ).then(() => {
              setLoading(false);
              global.window.scrollTo(0, 0);
            });
          }
        });
    });
  };

  return (
    <ShippingCutoffProvider timestamp={props.timestamp}>
      <Head>
        <title>Maisonette Checkout - Review &amp; Place Order</title>
        <link key="canonical" rel="canonical" href={`${process.env.NEXT_PUBLIC_CLIENT_HOST}/checkout`} />
        <script
          // Track a specific Crazy Egg snapshot by name
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: 'var CE_SNAPSHOT_NAME = "checkouts"' }}
        />
      </Head>
      <CheckoutPage background={'white'} id="maincontent">
        <CheckoutContent>

          <PageHeading element="h1" like="heading-1">Review &amp; Place Order</PageHeading>

          <CheckoutDeliverySection
            address={props.cart.ship_address}
          />

          <CheckoutAddGiftSection
            isGift={props.cart.is_gift}
            recipient={props.cart.gift_email}
            message={props.cart.gift_message}
          />

          <CheckoutShipments
            lineItems={props.cart.line_items}
            shipments={props.cart.shipments}
            cartNumber={props.cart.number}
            cartState={props.cart.state}
            updateCart={props.updateCart}
            loading={loading}
            setLoading={setLoading}
            toggleCart={props.toggleCart}
            user={props.user}
            payments={props.cart.payments}
          />

          <CheckoutPaymentSection
            hasPayment={hasPayment(props.cart.payments)}
            hasAddresses={hasAddresses()}
            payments={props.cart.payments}
            sameBilling={sameBilling()}
            billAddress={props.cart.bill_address}
            applicableStoreCredit={props.cart.total_applicable_store_credit}
            availableStoreCredit={props.cart.display_total_available_store_credit}
            useStoreCredit={props.cart.use_store_credits}
            giftCard={getGiftCard()}
            giftCardCoversTotal={giftCardCoversTotal()}
            isCoveredByStoreCredit={isCoveredByStoreCredit(props.cart)}
          />

          <HR />

          <OrderSummaryArea id="checkout-order-summary-section">
            <CheckoutEmailInput
              email={props.cart.email}
              setLoading={setLoading}
              cartNumber={props.cart.number}
              updateCart={props.updateCart}
            />

            <CheckoutPromoCode
              coupons={props.cart.applied_promotion_codes}
              adjustments={props.cart.adjustments}
              cartNumber={props.cart.number}
              cartState={props.cart.state}
              updateCart={props.updateCart}
              setLoading={setLoading}
              hasAddresses={hasAddresses()}
            />

            <SummaryHeading element="h2" like="heading-2">Order summary</SummaryHeading>

            <ShipPayCheckoutSummary
              shippingAddress={props.cart.ship_address}
              payments={props.cart.payments}
            />

            <SummaryPlaceOrderWrapper
              data-test-id="order-summary-wrapper"
              id="checkout-order-summary-wrapper"
            >

              <CheckoutOrderSummary
                id="checkout-index-order-summary"
                newCheckout
                shipping={props.cart.subtotals.shipments_total}
                subtotal={props.cart.subtotals.item_total}
                total={props.cart.subtotals.order_total}
                tax={props.cart.subtotals.tax_adjustments}
                promotions={props.cart.subtotals.line_item_promotion_totals}
                miscellaneous={props.cart.subtotals.miscellaneous_adjustments}
                gift={props.cart.subtotals.giftwrap_amount}
                state={props.cart.state}
                threshold={props.cart.free_shipping_threshold}
                useStoreCredit={props.cart.use_store_credits}
                applicableStoreCredit={props.cart.total_applicable_store_credit}
                totalAfterStoreCredit={props.cart.order_total_after_store_credit}
              />

              <PlaceOrderButton
                disabled={!canCheckout()}
                onClick={completeOrder}
                data-test-id="place-order-btn"
              >
                Place Order
              </PlaceOrderButton>

              <TermsConditionsText element="p" like="dec-1">
                By placing this order, you agree with our
                {' '}
                <a href="/terms" target="_blank" rel="noopener">
                  Terms &amp; Conditions
                </a>
              </TermsConditionsText>
            </SummaryPlaceOrderWrapper>
          </OrderSummaryArea>
        </CheckoutContent>
        {(loading || props.cart.loading) && <Loading data-test-id="blocking-loader" />}
      </CheckoutPage>
    </ShippingCutoffProvider>
  );
};

const Checkout = (props) => {
  if (!props.cart.loading && props.cart.state) {
    return renderCheckout(props);
  }

  return <Loading data-test-id="blocking-loader" />;
};

renderCheckout.defaultProps = {
  isStartingCheckout: false,
  checkout: {},
  user: false
};

renderCheckout.propTypes = {
  isStartingCheckout: PropTypes.bool,
  cart: PropTypes.object.isRequired,
  updateCart: PropTypes.func.isRequired,
  checkout: PropTypes.object,
  toggleCart: PropTypes.func.isRequired,
  user: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  userAgent: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired
};

Checkout.defaultProps = {
  cart: {}
};

Checkout.propTypes = {
  cart: PropTypes.object
};

export const getServerSideProps = storeWrapper.getServerSideProps(async (ctx) => {
  // set checkout variable to be updated with order data
  // as we progress through the checkout steps on the server
  let checkout;
  const { paypal } = ctx.query;
  const userToken = cookies(ctx).maisonette_user_token;
  const orderToken = cookies(ctx).maisonette_order_token;
  const orderNumber = cookies(ctx).maisonette_order_number;
  // Nullish coelescing added just in case
  const userAgent = ctx.req.headers['user-agent'] ?? null;

  const cartIsOnlyError = (cart) => (
    Object.keys(cart).every((key) => key === 'error')
  );

  const handleResponse = (response) => {
    if (!response.errors) {
      // set checkout to updated order from response.
      checkout = response;
      ctx.store.dispatch(updateCart(checkout));
    } else {
      // if the call fails, the response is an object with a key of errors
      // and no order data. Fold in existing data with errors to be used on client
      checkout = { ...checkout, errors: response.errors };
    }
  };

  // user is logged in
  if (userToken) {
    const requests = [];
    requests.push(getCurrentCart({ ctx }));
    requests.push(getUser({ ctx }));

    let cartData;
    let userData;
    await Promise.all(requests)
      .then(async ([cart, user]) => {
        cartData = cart;
        userData = user;

        if (userToken && userData) {
          ctx.store.dispatch(setToken('spree_api_key', userToken));
          ctx.store.dispatch(setUserProfile(userData));
        }

        if (!cartData.errors) {
          ctx.store.dispatch(updateCart(cartData));
        }
      });

    if (paypal) {
      checkout = ctx.store.getState().cart;
    } else {
      checkout = cartData;
    }

    // check if cart is not empty
    if (checkout.line_items?.length === 0 || cartIsOnlyError(checkout)) {
      // redirect to homepage if cart empty
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      };
    }

    const { number } = checkout;
    let isStartingCheckout = false;

    if (checkout.state === 'cart') {
      await nextCheckout({ id: number, ctx })
        .then((res) => {
          isStartingCheckout = true;
          handleResponse(res);
        });
    }

    if (checkout.state === 'address') {
      // addresses should already be in order
      // progress order if cart has ship and bill address
      if (checkout.ship_address && checkout.bill_address) {
        await nextCheckout({ id: number, ctx })
          .then((res) => {
            isStartingCheckout = false;
            handleResponse(res);
          });
      } else {
        // need to also allow for users who log in after adding to cart
        // there will not be any addresses in the order
        // grab the user's default address or select first in list
        const address = userData.addresses.find((a) => a.default) ?? userData.addresses?.[0];

        if (address) {
          const { country, state, ...restOfAddress } = address;

          const order = {
            ship_address_attributes: restOfAddress,
            use_billing: true
          };

          await updateCheckout({ id: number, ctx, body: { order } })
            .then((res) => {
              isStartingCheckout = false;
              handleResponse(res);
            });
        }
      }
    }

    if (checkout.state === 'delivery' && checkout.ship_address) {
      // update order to progress state and ensure order
      // details are re-calculated
      await updateCheckout({ id: number, ctx })
        .then((res) => {
          isStartingCheckout = false;
          handleResponse(res);
        });
    }

    return {
      props: {
        checkout,
        isStartingCheckout,
        userAgent,
        timestamp: Date.now() ?? -1 // TODO: Refactor this
      }
    };
  }

  // when guest user
  if (orderToken && orderNumber) {
    let isStartingCheckout = false;
    checkout = await getCart({ order_number: orderNumber, ctx });
    if (!checkout.error) {
      ctx.store.dispatch(updateCart(checkout));
    }

    if (checkout.line_items?.length === 0 || cartIsOnlyError(checkout)) {
      // redirect to homepage if cart empty
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      };
    }

    const { email, number } = checkout;

    if (email) {
      if (checkout.state === 'cart') {
        await nextCheckout({ id: number, ctx })
          .then((res) => {
            isStartingCheckout = true;
            handleResponse(res);
          });
      }

      if (checkout.state === 'address' && checkout.ship_address) {
        // handles when the user updates items in cart and returns to checkout
        // need to progress steps to re-create shipments
        await nextCheckout({ id: number, ctx })
          .then((res) => {
            isStartingCheckout = false;
            handleResponse(res);
          });
      }

      if (checkout.state === 'delivery' && checkout.ship_address) {
        // update order to progress state and ensure order
        // details are re-calculated
        await updateCheckout({ id: number, ctx })
          .then((res) => {
            isStartingCheckout = false;
            handleResponse(res);
          });
      }

      return {
        props: {
          checkout,
          isStartingCheckout,
          userAgent,
          timestamp: Date.now() ?? -1 // TODO: Refactor this
        }
      };
    }
  }

  // redirect to checkout/registration
  // if no email associated with order
  return {
    redirect: {
      destination: '/checkout/registration',
      permanent: false
    }
  };
});

const mapStateToProps = (state) => ({
  cart: state.cart,
  user: state.profile
});

const mapDispatchToProps = (dispatch) => ({
  updateCart: (cart) => dispatch(updateCart(cart)),
  toggleCart: (isActive) => dispatch(toggleCartModalVisibility(isActive))
});

Checkout.Layout = Layout;

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
