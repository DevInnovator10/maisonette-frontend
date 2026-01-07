import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Head from 'next/head';
import { connect } from 'react-redux';
import { formatMoney } from 'accounting-js';

import { useRouter } from 'next/router';
import AccountNavigation from '../../molecules/account-navigation';
import OrderAddress from '../../tissues/order-address';
import OrderDetails from '../../tissues/order-details';
import OrderItem from '../../molecules/orders-item';
import OrderShipment from '../../organs/order-shipment';
import OrderSummary from '../../tissues/order-summary';
import PageHeading from '../../molecules/page-heading';
import Typography from '../../atoms/typography';
import Error from '../_error';

import { withAuthComponent, withAuthServerSideProps } from '../../utils/auth/with-auth';
import copyToClipboard from '../../utils/copyToClipboard';
import getPayment from '../../utils/getPayment';
import hasError from '../../utils/hasError';
import Link from '../../utils/link';

import { Page, Content } from '../../theme/page';
import { removeCart } from '../../store/modules/cart/actions';

import { getOrder as fetchOrder } from '../api';
import SCOPE_TYPES from '../../utils/sentryScopeTypes';
import getCanonicalUrl from '../../utils/getCanonicalUrl';

const PageTitle = styled(Typography)`
  border-bottom: 1px solid ${(props) => props.theme.color.brand};
  color: ${(props) => props.theme.color.brand};
  margin-bottom: 2rem;
`;

const Text = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  line-height: 1.5;

  & ~ & {
    margin-top: 0.5rem;
  }
`;

const OrderInfo = styled.div`
  display: grid;
  grid-gap: 2rem;

  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    grid-template-areas:  'order-status     payment'
                          'shipping-address billing-address'
                          'shipments        payment-summary';
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    grid-template-areas:  'order-status shipping-address billing-address payment'
                          'shipments shipments payment-summary payment-summary';
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    grid-template-areas:  'order-status shipping-address billing-address payment'
    grid-template-columns: repeat(4, 1fr);
    column-gap: 0;
  }

`;

const Status = styled(OrderDetails)`
  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    grid-area: order-status;
  }
  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    border-bottom: 1px solid ${(props) => props.theme.color.brandLight};
    padding-bottom: 2rem;
  }
`;

const ShippingAddress = styled(OrderAddress)`
  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    grid-area: shipping-address;
  }
  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    border-bottom: 1px solid ${(props) => props.theme.color.brandLight};
    padding-bottom: 2rem;
  }
`;

const BillingAddress = styled(OrderAddress)`
  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    grid-area: billing-address;
  }
  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    border-bottom: 1px solid ${(props) => props.theme.color.brandLight};
    padding-bottom: 2rem;
  }
`;

const PaymentMethod = styled(OrderItem)`
  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    grid-area: payment;
  }
  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    border-bottom: 1px solid ${(props) => props.theme.color.brandLight};
    padding-bottom: 2rem;
  }
`;

const Shipments = styled(OrderShipment)`
  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    grid-area: shipments;
  }
  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    padding-bottom: 2rem;
  }
`;

const OrderSummaryWrapper = styled(OrderItem)`
  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    grid-area: payment-summary;
  }
`;

const OrderGiftSummary = styled(OrderItem)`
  margin-top: 2rem;
  padding: 2rem 0;
  border-bottom: 1px solid ${(props) => props.theme.color.brandLight};
  border-top: 1px solid ${(props) => props.theme.color.brandLight};

  > dl > div {
    display: flex;
  }

  dd {
    color: ${(props) => props.theme.color.brand};
    flex: 1;
  }

  dt {
    color: ${(props) => props.theme.color.brand};
    min-width: 5rem;
    padding-right: 1rem;
  }
  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    border-top: 1px solid ${(props) => props.theme.color.brandLight};
    border-bottom: none;
    padding-top: 2rem;
  }
`;

const OrderNumber = styled.p`
  display: inline;
`;

const Eligible = styled(Typography)`
  color: ${(props) => props.theme.color.brandLight};

  display: block;
  line-height: 2;
  margin-bottom: 0.5rem;

  > a {
    color: inherit;
    cursor: pointer;
    transition: color ${(props) => props.theme.animation.fast} ${(props) => props.theme.animation.easeInQuad};
    :hover {
      color: ${(props) => props.theme.color.brand};
    }
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: inline-block;
    margin-left: 2rem;
    margin-bottom: 0;
  }
`;

const OrderPage = (props) => {
  const router = useRouter();

  if (!props.order) return <Error statusCode="404" />;

  return (
    <>
      <Head>
        {props.profile?.id === props.order?.user_id ? (
          <title>
            {`Order # ${props.order.number} - ${
              props.profile.first_name || 'Friend'
            }'s Account`}
          </title>
        ) : (
          <title>{`Order # ${props.order.number}`}</title>
        )}

        <link key="canonical" rel="canonical" href={getCanonicalUrl(router)} />
      </Head>

      <Page id="maincontent">
        {props.profile && (
          <>
            {props.profile?.id === props.order?.user_id ? (
              <PageHeading
                title={`Hi, ${props.profile.first_name || 'Friend'}`}
              />
            ) : (
              <PageHeading title={`Order #${props.order.number}`} />
            )}

            <AccountNavigation active="/orders" />
          </>
        )}

        <Content>
          <PageTitle element="h2" like="heading-5">
            Order #
            <OrderNumber
              onClick={() =>
                copyToClipboard(
                  props.order.number,
                  'Order number successfully copied to clipboard'
                )}
            >
              {props.order.number}
            </OrderNumber>
            <Eligible element="span" like="dec-1">
              {props.order.eligible_for_return ? (
                <Text
                  element="a"
                  like="dec-1"
                  href={props.order.narvar_return_url}
                  target="_blank"
                >
                  Make a Return
                </Text>
              ) : (
                <>
                  Not eligible for Return
                  {' ( '}
                  <Link href="/returns-guide" passHref>
                    <Text element="a" like="dec-1" target="_blank">
                      View Return Policy
                    </Text>
                  </Link>
                  {' )'}
                </>
              )}
            </Eligible>
          </PageTitle>

          <OrderInfo>
            <Status
              placedAt={props.order.completed_at}
              status={props.order.shipment_state}
            />
            <ShippingAddress
              title="Shipping Address"
              address={props.order.ship_address}
            />
            <BillingAddress
              title="Billing Address"
              address={props.order.bill_address}
            />

            <PaymentMethod title="Payment">
              {props.order?.gift_card_total
                && Math.abs(+props.order.gift_card_total) > 0 && (
                  <Text element="p" like="dec-1">
                    {`Gift Card (${formatMoney(
                      Math.abs(+props.order.gift_card_total)
                    )})`}
                  </Text>
                )}

              {props.order.payments
                .filter(
                  (payment) =>
                    payment.state === 'completed' || payment.state === 'pending'
                )
                .map((payment) => (
                  <Text key={payment.id} element="p" like="dec-1">
                    {getPayment(payment)}
                  </Text>
                ))}
            </PaymentMethod>

            <Shipments
              shipments={props.order.shipments}
              items={props.order.line_items}
            />

            {props.order.is_gift && (
              <OrderGiftSummary title="Gift Message">
                <Text element="dl" like="dec-1">
                  {props.order.gift_email && (
                    <div>
                      <dt>Gift email:</dt>
                      <dd>{props.order.gift_email}</dd>
                    </div>
                  )}

                  {props.order.gift_message && (
                    <div>
                      <dt>Gift message:</dt>
                      <dd>{props.order.gift_message}</dd>
                    </div>
                  )}
                </Text>
              </OrderGiftSummary>
            )}

            <OrderSummaryWrapper title="Summary">
              <OrderSummary
                id="order-order-summary"
                shipping={props.order.subtotals.shipments_total}
                subtotal={props.order.subtotals.item_total}
                total={props.order.subtotals.order_total}
                tax={props.order.subtotals.tax_adjustments}
                promotions={props.order.subtotals.line_item_promotion_totals}
                miscellaneous={props.order.subtotals.miscellaneous_adjustments}
                gift={props.order.subtotals.giftwrap_amount}
                state="confirm"
              />
            </OrderSummaryWrapper>
          </OrderInfo>
        </Content>
      </Page>
    </>
  );
};

OrderPage.defaultProps = {
  order: {},
  profile: null
};

OrderPage.propTypes = {
  order: PropTypes.object,
  profile: PropTypes.object
};

const mapStateToProps = (state) => ({
  cart: state.cart
});

const mapDispatchToProps = (dispatch) => ({
  removeCart: () => dispatch(removeCart())
});

const getOrder = async (ctx, id) => {
  try {
    const order = await fetchOrder({
      ctx,
      base: process.env.SOLIDUS_HOST,
      uri: `/api/orders/${id}`,
      scopes: [SCOPE_TYPES.SERVICES.SOLIDUS]
    });
    return hasError(order) ? false : order;
  } catch (error) {
    return false;
  }
};

export const getServerSideProps = withAuthServerSideProps(async (ctx, profile, token) => {
  const { query: { id } } = ctx;
  const order = await getOrder(ctx, id);

  if (!order) ctx.res.statusCode = 404;

  return {
    profile,
    order,
    token
  };
});

export default withAuthComponent(connect(mapStateToProps, mapDispatchToProps)(OrderPage));
