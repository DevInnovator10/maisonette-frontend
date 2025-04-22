import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';
import { connect } from 'react-redux';
import { formatMoney } from 'accounting-js';
import sha1 from 'sha1';

import OrderAddress from '../../../tissues/order-address';
import OrderDetails from '../../../tissues/order-details';
import OrderItem from '../../../molecules/orders-item';
import OrderShipment from '../../../organs/order-shipment';
import OrderSummary from '../../../tissues/order-summary';
import PageHeading from '../../../molecules/page-heading';
import Typography from '../../../atoms/typography';

import copyToClipboard from '../../../utils/copyToClipboard';

import { Page, Content } from '../../../theme/page';
import { getCart } from '../../api';
import { removeCart } from '../../../store/modules/cart/actions';

import getPayment from '../../../utils/getPayment';
import { LUX } from '../../../utils/tracking';
import getCanonicalUrl from '../../../utils/getCanonicalUrl';

const Wrapper = styled(Page)`
    padding-top: 0;
`;

const PageTitle = styled(Typography)`
  border-bottom: 1px solid ${(props) => props.theme.color.brandLight};
  padding-bottom: 1rem;
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
  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    border-top: 1px solid ${(props) => props.theme.color.brandLight};
    border-bottom: none;
    padding-top: 2rem;
  }

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
`;

const OrderNumber = styled.p`
  display: inline;
`;

const Image = styled.img`
  display: block;
  margin: 0 auto 3rem auto;
  width: 10rem;
  height: 10rem;
`;

const wunderkindPayment = (payment) => {
  switch (payment) {
    case 'CreditCard':
      return 'CARD';
    case 'PayPalAccount':
      return 'PAYPAL';
    default:
      return 'OTHER';
  }
};

const ConfirmationPage = (props) => {
  const router = useRouter();
  // eslint-disable-next-line no-unused-vars
  const wPaymentString = wunderkindPayment(props.order.payments[0]?.source?.payment_type);
  const bouncexConversionObject = {
    order_id: props.order.number,
    email: props.order.email,
    phone: props.order.bill_address.phone,
    goal: 'purchase',
    transaction_origin: 'online',
    currency: 'USD',
    coupon: props.order?.adjustments.map?.((adj) => adj.label) ?? [],
    total_discount: props.order?.adjustment_total ?? '0',
    tax: props.order.tax_total,
    shipping: props.order.ship_total,
    amount: props.order.total,
    pay_method: wPaymentString,
    item: props.order?.line_items.map((item) =>
      ({
        sku: item.variant.sku,
        product_id: item.variant.product_id,
        price: item.price,
        quantity: item.quantity
      }))
  };

  useEffect(() => {
    LUX.converted();

    const getOrderDiscount = () => {
      const { line_item_promotion_totals } = props.order.subtotals;
      if (line_item_promotion_totals?.length) {
        return +line_item_promotion_totals[0].total * -1;
      }
      return '';
    };

    global.ire('trackConversion', 24768, {
      orderId: props.order.number,
      customerId: props.order.user_id,
      customerEmail: props.order.email ? sha1(props.order.email) : '',
      customerStatus: props.order.first_order ? 'New' : 'Returning',
      currencyCode: props.order.currency,
      orderPromoCode: props.order.applied_promotion_codes?.[0]?.value ?? '',
      orderDiscount: getOrderDiscount(),
      items: props.order?.line_items.map((item) => ({
        subTotal: +item.price,
        // category: '', No product category
        sku: item.variant.sku,
        quantity: item.quantity,
        name: item.variant.name
      }))
    },
    {
      verifySiteDefinitionMatch: true
    });

    global.window.onbeforeunload = () => {
      setTimeout(() => props.removeCart(), 0);
    };

    Router.events.on('routeChangeStart', props.removeCart);
    return () => Router.events.off('routeChangeStart', props.removeCart);
  }, []);

  return props.order.id ? (
    <>
      <Head>
        {/* For VWO Insights */}
        <script
          type="text/javascript"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
                window.VWO = window.VWO || [];
                window.VWO.push(['track.revenueConversion', ${props.order.subtotals.order_total}]);
                `
          }}
        />

        {/* For VWO Testing */}
        <script
          type="text/javascript"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
                window._vis_opt_queue = window._vis_opt_queue || [];
                window._vis_opt_queue.push(function() {
                  _vis_opt_revenue_conversion(${props.order.subtotals.order_total});
                });
                `
          }}
        />

        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
                  window.top.bouncex = window.top.bouncex || [];
                    window.top.bouncex.push(["conversion", ${JSON.stringify(
              bouncexConversionObject
            )} ]);
                `
          }}
        />
        <script
          // Track a specific Crazy Egg snapshot by name
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: 'var CE_SNAPSHOT_NAME = "checkouts"'
          }}
        />

        <title>{`Maisonette Confirmation Page for Order # ${props.order.number}`}</title>
        <link key="canonical" rel="canonical" href={getCanonicalUrl(router)} />
      </Head>
      <img
        alt="wunderkind"
        height="1"
        width="1"
        border="0"
        style={{ display: 'none' }}
        src={`//api.bounceexchange.com/capture/convert2.gif?website_id=4822&order_id=${props.order.id}&email=${props.order.email}&amount=${props.order.total}&currency=USD&goal=purchase`}
      />
      <Wrapper id="maincontent">
        <PageHeading
          title={(
            <>
              <Image
                alt="maisonette receipt"
                src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-receipt.png`}
              />
              <p data-test-id="order_confirmation_message">
                Something adorable is on its way...
              </p>
            </>
          )}
        />

        <Content>
          <PageTitle element="h2" like="heading-5">
            Order #
            <OrderNumber
              data-test-id="order-number"
              onClick={() =>
                copyToClipboard(
                  props.order.number,
                  'Order number successfully copied to clipboard'
                )}
            >
              {props.order.number}
            </OrderNumber>
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

            {props?.order?.is_gift && (
              <OrderGiftSummary title="Gift Message">
                <Text element="dl" like="dec-1">
                  {props.order.gift_email && (
                    <div>
                      <dt>Gift email:</dt>
                      <dd data-test-id="gift-email">
                        {props?.order?.gift_email}
                      </dd>
                    </div>
                  )}

                  {props.order.gift_message && (
                    <div>
                      <dt>Gift message:</dt>
                      <dd data-test-id="gift-message">
                        {props?.order?.gift_message}
                      </dd>
                    </div>
                  )}
                </Text>
              </OrderGiftSummary>
            )}

            <OrderSummaryWrapper title="Summary">
              <OrderSummary
                id="confirmation-order-summary"
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
      </Wrapper>
    </>
  ) : null;
};

export async function getServerSideProps(ctx) {
  const order = await getCart({ order_number: ctx.query.id, ctx });

  if (!order.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  return {
    props: { order }
  };
}

ConfirmationPage.propTypes = {
  order: PropTypes.object.isRequired,
  removeCart: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  removeCart: () => dispatch(removeCart())
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationPage);
