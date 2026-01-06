import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Head from 'next/head';
import { formatMoney } from 'accounting-js';

import AccountNavigation from '../../molecules/account-navigation';
import PageHeading from '../../molecules/page-heading';
import Typography from '../../atoms/typography';
import Table from '../../molecules/table';

import theme from '../../theme/theme';
import { Page, Content } from '../../theme/page';

import hasError from '../../utils/hasError';
import Link from '../../utils/link';
import dateToString from '../../utils/dateToString';
import { withAuthComponent, withAuthServerSideProps } from '../../utils/auth/with-auth';

import { getReturns as fetchReturns } from '../api';
import SCOPE_TYPES from '../../utils/sentryScopeTypes';

const Text = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
`;

const TrackingLink = styled.a`
  display: block;
`;

const Intro = styled.div`
  margin: 0 auto;
  max-width: ${(props) => props.theme.width.medium};
  text-align: center;
  margin-bottom: 3rem;

  > h1 {
    margin-bottom: 2rem;
  }

  > p {
    line-height: 1.5;

    & ~ p {
      margin-top: 2rem;
    }

    > a {
      color: ${(props) => props.theme.color.brandLight};
      font-family: inherit;
    }
  }
`;

const columns = [
  {
    name: '#',
    accessor: 'number',
    cell: (data) => (
      <Link href={`/returns/${data.number}`} passHref>
        <TrackingLink>
          {`#${data.number}`}
        </TrackingLink>
      </Link>
    )
  },
  {
    name: 'Date',
    accessor: 'created_at',
    cell: (data) => (
      <time dateTime={data.created_at}>
        { dateToString(data.created_at) }
      </time>
    )
  },
  {
    name: 'Amount',
    accessor: 'return_amount',
    cell: (data) => (
      <>
        {formatMoney(data.return_amount)}
      </>
    )
  },
  {
    name: 'Order #',
    accessor: 'order_number',
    cell: (data) => (
      <Link href={`/orders/${data.order_number}`} passHref>
        <TrackingLink>
          {`#${data.order_number}`}
        </TrackingLink>
      </Link>
    )
  },
  {
    name: 'Status',
    accessor: 'state',
    cell: (data) => {
      const color = data.state.toLowerCase() === 'authorized'
        ? theme.color.brandGreen
        : theme.color.brandA11yRed;

      return (
        <font color={color}>{data.state}</font>
      );
    }
  }
];

const media = [
  {
    breakpoint: theme.breakpoint.max('small'),
    columns: ['#', 'Date']
  }
];

const ReturnsPage = (props) => (
  <>
    <Head>
      <title>{`Maisonette Returns page - ${props.profile.first_name || 'Friend'}'s Account`}</title>
      <link key="canonical" rel="canonical" href={`${process.env.NEXT_PUBLIC_CLIENT_HOST}/returns`} />
    </Head>
    <Page id="maincontent">
      <PageHeading title={`Hi, ${props.profile.first_name || 'Friend'}!`} />
      <AccountNavigation active="/returns" />

      <Content>
        <Intro>
          <Text element="h1" like="heading-4">How to make a Return</Text>
          <Text element="p" like="paragraph-2">
              To initiate a return, please check your
            {' '}
            <Link href="/orders" passHref>
              <Typography element="a" like="paragraph-2">
                  eligible orders here
              </Typography>
            </Link>
            {' '}
              and follow the link provided.
          </Text>
          <Text element="p" like="paragraph-2">
              In case you don’t have access to your printed return slip,
              one will be provided when you initiate your return.
              For any other issue, contact customer care by using the Help
              widget on the bottom right or email us at
            {' '}
            <a href="mailto:customercare@maisonette.com">customercare@maisonette.com</a>
          </Text>
        </Intro>

        <Text element="h2" like="heading-6">Returns</Text>
        <Table columns={columns} tableData={props.returns} media={media} />
      </Content>
    </Page>
  </>
);

ReturnsPage.defaultProps = {
  returns: []
};

ReturnsPage.propTypes = {
  profile: PropTypes.object.isRequired,
  returns: PropTypes.array
};

const getReturns = async (ctx) => {
  try {
    const returns = await fetchReturns({
      ctx,
      base: process.env.SOLIDUS_HOST,
      uri: '/api/returns/mine',
      scopes: [SCOPE_TYPES.SERVICES.SOLIDUS]
    });

    return hasError(returns) ? false : returns;
  } catch (error) {
    return false;
  }
};

export const getServerSideProps = withAuthServerSideProps(async (ctx) => {
  const returns = await getReturns(ctx);
  return { returns: returns.return_authorizations };
});

export default withAuthComponent(ReturnsPage);
