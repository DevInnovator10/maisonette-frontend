import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import cookies from 'next-cookies';
import PropTypes from 'prop-types';
import Head from 'next/head';
import styled from '@emotion/styled';
import { storeWrapper } from '../../store';

import {
  getCart,
  getUser,
  nextCheckout,
  getCurrentCart
} from '../api';
import { updateCart } from '../../store/modules/cart/actions';
import { setToken } from '../../store/modules/user/actions';
import { setUserProfile } from '../../store/modules/profile/actions';

import { Page, Content } from '../../theme/page';

import Layout from '../../layouts/checkout';

import Button from '../../atoms/button';
import CheckoutPaymentSection from '../../organs/checkout-payment';
import OrderSummary from '../../tissues/order-summary';
import Typography from '../../atoms/typography';

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
  min-height: 50vh;
  overflow: auto;
  max-width: ${(props) => props.theme.width.extraLarge};
  margin: 0 auto;
`;

const CheckoutContent = styled(Content)`
  display: grid;
  padding: 6.4rem 1.6rem 5rem;
  min-height: none;
  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    padding: 6.4rem 6.4rem 10rem;
    grid-template-columns: 0.70fr 0.30fr;
    grid-column-gap: 10rem;
    grid-template-areas:  'form summary';
  }
`;

const BackContainer = styled.div`
  display: flex;
  padding: 3.2rem 1.6rem 0;
  :hover {
    opacity: 0.75;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    padding: 3.2rem 6.4rem 0;
  }
`;

const ArrowSign = styled.div`
  margin: 11px 5px 13px 3px;
  display:inline-block;
  width: 7.78px;
  height: 7.78px;
  border: solid ${({ theme }) => theme.color.bluePrimary};
  border-width: 0 2px 2px 0;
  display: inline-block;
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
`;

const BackButton = styled(Button)`
  text-decoration: underline;
  text-decoration-thickness: 0.05em;
  border: 0 none;
  background: none;
  color: ${({ theme }) => theme.color.bluePrimary};
  cursor: pointer;
  font-family: ${(props) => props.theme.font.sans};
  font-size: ${(props) => props.theme.modularScale.sixteen};
  font-weight: 300;
  padding: 0 0 2px 0;
  display: flex;
  align-items: center;
  text-transform: none;
  letter-spacing: normal;
`;

const SummaryPlaceOrderWrapper = styled.div`
  display: none;

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: block;
    grid-area: summary;
  }
`;

const CheckoutOrderSummary = styled(OrderSummary)`
  border: 1px solid ${({ theme }) => theme.color.brand};
  padding: ${({ theme }) => theme.modularScale.sixteen};
`;

const SummaryHeading = styled(Typography)`
  color: ${({ theme }) => theme.color.brand};
  font-size: ${({ theme }) => theme.modularScale.twentyFour};
  margin-bottom: ${({ theme }) => theme.modularScale.sixteen};
`;

const renderPaymentPage = (props) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // we need to use the checkout prop returned by the server for registered users
    // we also want to use the redux cart to update certain fields
    // this updates the cart with the checkout prop
    // to avoid issue with our server side state not matching on the client
    if (Object.keys(props.checkout ?? {}).length > 0) {
      props.updateCart(props.checkout);
    }
  }, []);

  return (
    <>
      <Head>
        <title>{'Maisonette Checkout - Payment page'}</title>
        <link key="canonical" rel="canonical" href={`${process.env.NEXT_PUBLIC_CLIENT_HOST}/payment`} />

        <script
            // Track a specific Crazy Egg snapshot by name
            // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: 'var CE_SNAPSHOT_NAME = "checkouts"' }}
        />
      </Head>
      <CheckoutPage background={'white'} id="maincontent">
        <BackContainer>
          <BackButton
            isLink
            styledLikeLink
            href="/checkout"
          >
            <ArrowSign />
            {' '}
            Go back to “Review &amp; Place Order”
          </BackButton>
        </BackContainer>

        <CheckoutContent>
          <CheckoutPaymentSection
            payments={props.cart.payments}
            paymentMethod={props.cart.payment_methods}
            setLoading={setLoading}
            cart={props.cart}
            updateCart={props.updateCart}
          />
          <SummaryPlaceOrderWrapper>
            <SummaryHeading element="h2" like="heading-2">Order summary</SummaryHeading>

            <CheckoutOrderSummary
              id="checkout-payment-order-summary"
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
          </SummaryPlaceOrderWrapper>
        </CheckoutContent>
        {(loading || props.cart.loading) && <Loading data-test-id="blocking-loader" />}
      </CheckoutPage>
    </>
  );
};

const PaymentPage = (props) => {
  if (!props.cart.loading && props.cart.state) {
    return renderPaymentPage(props);
  }

  return <Loading data-test-id="blocking-loader" />;
};

renderPaymentPage.defaultProps = {
  checkout: {}
};

renderPaymentPage.propTypes = {
  cart: PropTypes.object.isRequired,
  checkout: PropTypes.object,
  updateCart: PropTypes.func.isRequired
};

PaymentPage.defaultProps = {
  cart: {}
};

PaymentPage.propTypes = {
  cart: PropTypes.object
};

export const getServerSideProps = storeWrapper.getServerSideProps(async (ctx) => {
  const userToken = cookies(ctx).maisonette_user_token;
  const orderToken = cookies(ctx).maisonette_order_token;
  const orderNumber = cookies(ctx).maisonette_order_number;

  const cartIsOnlyError = (cart) => (
    Object.keys(cart ?? {}).every((key) => key === 'error')
  );

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

    const cart = cartData;

    // check if cart is not empty
    if (cart?.line_items?.length === 0 || cartIsOnlyError(cart)) {
      // redirect to homepage if cart empty
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      };
    }

    return {
      props: {
        checkout: cart,
        user: userData
      }
    };
  }

  // when guest user
  if (orderToken && orderNumber) {
    const cart = await getCart({ order_number: orderNumber, ctx });
    let cartData = cart?.data ?? cart;
    if (cartData && !cartData.error) {
      ctx.store.dispatch(updateCart(cartData));
    }

    if (cartData.line_items?.length === 0 || cartIsOnlyError(cartData)) {
      // redirect to homepage if cart empty
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      };
    }

    const { email, state, number } = cartData;

    if (email) {
      if (state === 'cart') {
        await nextCheckout({ id: number, ctx })
          .then((res) => {
            cartData = res;
            ctx.store.dispatch(updateCart(cartData));
          });
      }

      return {
        props: {
          cart: cartData
        }
      };
    }
  }

  // redirect to checkout/registration
  // user will be able to login/continue as guest
  // will then be sent to checkout page
  // // handles edge case where user somehow winds up on
  // // this page without navigating
  return {
    redirect: {
      destination: '/checkout/registration',
      permanent: false
    }
  };
});

const mapStateToProps = (state) => ({
  cart: state.cart
});

const mapDispatchToProps = (dispatch) => ({
  updateCart: (cart) => dispatch(updateCart(cart))
});

PaymentPage.Layout = Layout;

export default connect(mapStateToProps, mapDispatchToProps)(PaymentPage);
