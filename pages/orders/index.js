import React, { useState } from 'react';
import { InView } from 'react-intersection-observer';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Head from 'next/head';
import { formatMoney } from 'accounting-js';

import AccountNavigation from '../../molecules/account-navigation';
import PageHeading from '../../molecules/page-heading';
import Table from '../../molecules/table';
import Typography from '../../atoms/typography';
import OrderCard from '../../tissues/order-card';
import dateToString from '../../utils/dateToString';

import { getOrders as fetchOrders } from '../api';

import { Page, Content } from '../../theme/page';
import theme from '../../theme/theme';

import { withAuthComponent, withAuthServerSideProps } from '../../utils/auth/with-auth';
import hasError from '../../utils/hasError';
import Link from '../../utils/link';
import reformatTrackingUrl from '../../utils/reformatTrackingUrl';
import SCOPE_TYPES from '../../utils/sentryScopeTypes';

const Title = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  border-bottom: 1px solid ${(props) => props.theme.color.brand};
  padding-bottom: ${(props) => props.theme.modularScale.small};
  margin-bottom: ${(props) => props.theme.modularScale.xlarge};
  @media screen and (min-width: ${theme.breakpoint.small}) {
    border: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
`;

const Anchor = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  cursor: pointer;
  transition: color ${(props) => props.theme.animation.fast} ${(props) => props.theme.animation.easeInQuad};

  :hover {
    color: ${(props) => props.theme.color.brand};
  }
`;

const DesktopContent = styled(Content)`
  display: none;
  @media screen and (min-width: ${theme.breakpoint.small}) {
    display: block;
  }
`;

const MobileContent = styled(Content)`
  display: block;
  @media screen and (min-width: ${theme.breakpoint.small}) {
    display: none;
  }
`;

const TrackingLink = styled.a`
  display: block;
  text-decoration: none;
`;

const DataNumber = styled.span`
  text-decoration: underline;
`;

const IntersectionObserverElement = styled.span`
  height: 10rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
`;

const ShipmentStatus = styled.span`
  display: block;
  margin-bottom: 10px;
  color: ${(props) => props.theme.color.brand};

  &::first-letter {
    text-transform: uppercase;
  }
`;

const DefaultColor = styled.span`
  color: ${(props) => props.theme.color.brand};
  letter-spacing: ${(props) => props.spacing || 'auto'};
`;

const Container = styled.div`
  display: flex;
`;

const ShipmentWrapper = styled.div`
  color: ${(props) => props.theme.color.brand};
`;

const Margin = styled.div`
  margin: ${(props) => props.margin || '0 auto'};
`;

const CustomPage = styled(Page)`
  min-height: auto;
`;

const columns = [
  {
    name: '#',
    accessor: 'number',
    cell: (data) => (
      <Link href={`/orders/${data.number}`} passHref>
        <TrackingLink>
          <DataNumber>{`#${data.number}`}</DataNumber>
        </TrackingLink>
      </Link>
    )
  },
  {
    name: 'Order Date',
    accessor: 'completed_at',
    cell: (data) => (
      <DefaultColor>
        <time dateTime={data.completed_at}>
          {dateToString(data.completed_at, 'short-m-d-y')}
        </time>
      </DefaultColor>
    )
  },
  {
    name: 'Shipment Status',
    accessor: 'tracking',
    cell: (data) =>
      data.shipments instanceof Array
      && data.shipments[0] !== null
      && data.shipments.map((shipment, i) =>
        (shipment.tracking ? (
          <Container>
            <ShipmentWrapper>
Shipment
              {' '}
              {i + 1}
:
            </ShipmentWrapper>
            <Margin margin="0 0 0 10px">
              <Margin margin="0 0 5px 0">
                {shipment.tracking.includes(',') ? (
                  shipment.tracking
                    .split(',')
                    .map((tracking) => (
                      <TrackingLink
                        key={tracking}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={reformatTrackingUrl(shipment.tracking_url, tracking)}
                      >
                        <u>{tracking}</u>
                      </TrackingLink>
                    ))
                ) : (
                  <TrackingLink
                    key={shipment.number}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={shipment.tracking_url}
                  >
                    <u>{shipment.tracking}</u>
                  </TrackingLink>
                )}
              </Margin>
              {shipment.delivery_estimation && (
              <Margin margin="0 0 5px 0">
                <ShipmentWrapper>
                  ETA:
                  {' '}
                  {shipment.delivery_estimation}
                </ShipmentWrapper>
              </Margin>
              )}
            </Margin>
          </Container>
        ) : (
          <DefaultColor key={shipment.number} spacing="0.05rem">
            <Container>
              <div>
Shipment
                {' '}
                {i + 1}
:
              </div>
              <Margin margin="0 0 0 10px">
                <ShipmentStatus>
                  {shipment.state}
                </ShipmentStatus>
              </Margin>
            </Container>
          </DefaultColor>
        )))
  },
  {
    name: 'Order Status',
    accessor: 'state',
    cell: (data) => {
      const color = data.state.toLowerCase() === 'complete'
        ? theme.color.brandGreen
        : theme.color.brandA11yRed;

      return <span style={{ color }}>{data.state}</span>;
    }
  },
  {
    name: 'Amount',
    accessor: 'total',
    cell: (data) => <DefaultColor>{formatMoney(data.total)}</DefaultColor>
  },
  {
    name: 'Return',
    accessor: 'return',
    cell: (data) =>
      (data.eligible_for_return ? (
        <Anchor
          element="a"
          like="dec-1"
          href={data.narvar_return_url}
          target="_blank"
        >
          Make a Return
        </Anchor>
      ) : (
        <>
          <DefaultColor>
            Not eligible for Return
            {' ( '}
            <Link href="/returns-guide" passHref>
              <Anchor element="a" like="dec-1" target="_blank">
                View Return Policy
              </Anchor>
            </Link>
            {' )'}
          </DefaultColor>
        </>
      ))
  }
];

const media = [
  {
    breakpoint: theme.breakpoint.max('small'),
    columns: ['#', 'Date', 'Tracking #']
  }
];

const OrdersPage = (props) => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState(props.orders);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(props.pages);

  const handleOnIntersectionChange = (inView) => {
    if (!inView || page === pages) return;

    const fetchData = async () => {
      setLoading(true);

      const result = await fetchOrders({ page });
      setOrders([...orders, ...result.orders]);
      setPage(page + 1);
      setPages(result.pages);
      setLoading(false);
    };

    if (pages > 1) {
      fetchData();
    }
  };

  return (
    <>
      <Head>
        <title>{`${props.profile.first_name || 'Friend'}'s Orders`}</title>
        <link
          key="canonical"
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_CLIENT_HOST}/orders`}
        />
      </Head>
      <CustomPage id="maincontent">
        <PageHeading title={`Hi, ${props.profile.first_name || 'Friend'}!`} />
        <AccountNavigation active="/orders" />

        <DesktopContent>
          <Title element="h2" like="dec-1">
            Orders
          </Title>
          <Table
            columns={columns}
            tableData={orders}
            media={media}
            loading={loading}
          />
          <InView threshold={0} onChange={handleOnIntersectionChange}>
            {({ ref }) => <IntersectionObserverElement ref={ref} />}
          </InView>
        </DesktopContent>

        <MobileContent>
          <Title element="h2" like="heading-6">
            Orders
          </Title>
          {orders?.map((order) => (
            <OrderCard
              key={order.number}
              order={order}
            />
          ))}
        </MobileContent>
      </CustomPage>
    </>
  );
};

OrdersPage.defaultProps = {
  orders: [],
  pages: -1
};

OrdersPage.propTypes = {
  profile: PropTypes.object.isRequired,
  orders: PropTypes.array,
  pages: PropTypes.number
};

const getOrders = async (ctx) => {
  try {
    const orders = await fetchOrders({
      ctx,
      base: process.env.SOLIDUS_HOST,
      uri: '/api/orders/mine',
      scopes: [SCOPE_TYPES.SERVICES.SOLIDUS]
    });
    return hasError(orders) ? false : orders;
  } catch (error) {
    return false;
  }
};

export const getServerSideProps = withAuthServerSideProps(async (ctx) => {
  const orders = await getOrders(ctx);
  return { orders: orders.orders, pages: orders.pages };
});

export default withAuthComponent(OrdersPage);
