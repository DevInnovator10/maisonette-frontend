import React, { useState } from 'react';
import { InView } from 'react-intersection-observer';
import PropTypes from 'prop-types';
import Head from 'next/head';
import styled from '@emotion/styled';
import { formatMoney } from 'accounting-js';

import AccountNavigation from '../molecules/account-navigation';
import PageHeading from '../molecules/page-heading';
import Typography from '../atoms/typography';
import Table from '../molecules/table';
import theme from '../theme/theme';

import { getCredits as fetchCredits } from './api';
import { Page, Content } from '../theme/page';

import dateToString from '../utils/dateToString';
import { withAuthComponent, withAuthServerSideProps } from '../utils/auth/with-auth';
import hasError from '../utils/hasError';
import SCOPE_TYPES from '../utils/sentryScopeTypes';

const Title = styled(Typography)`
    color: ${(props) => props.theme.color.brand};

  > span {
    color: ${(props) => props.theme.color.brandLight};
    display: block;
  }
`;

const IntersectionObserverElement = styled.span`
  height: 10rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Intro = styled.div`
  margin: 0 auto;
  max-width: 50rem;
  text-align: center;
  margin-bottom: 3rem;

  > h1 {
    margin-bottom: 2rem;
  }

  > p {
    line-height: 1.5;
  }
`;

const columns = [
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
    name: 'Description',
    accessor: 'category'
  },
  {
    name: 'Amount',
    accessor: 'amount',
    cell: (data) => formatMoney(data.amount)
  },
  {
    name: 'Amount Used',
    accessor: 'amount_used',
    cell: (data) => formatMoney(data.amount_used)
  }
];

const media = [
  {
    breakpoint: theme.breakpoint.max('small'),
    columns: ['#', 'Date']
  }
];

const CreditsPage = (props) => {
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(props.credits);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(-1);

  const handleOnIntersectionChange = (inView) => {
    if (!inView || page === pages) return;

    const fetchData = async () => {
      setLoading(true);
      const result = await fetchCredits({ page });
      const resultData = result?.data ?? result;
      setCredits([...credits, ...resultData.store_credits]);
      setPage(page + 1);
      setPages(resultData.pages);

      setLoading(false);
    };

    if (pages > 1) {
      fetchData();
    }
  };

  return (
    <>
      <Head>
        <title>{`Maisonette - ${props.profile.first_name || 'Friend'}'s Account Credits`}</title>
        <link key="canonical" rel="canonical" href={`${process.env.NEXT_PUBLIC_CLIENT_HOST}/credits`} />
      </Head>
      <Page id="maincontent">
        <PageHeading title={`Hi, ${props.profile.first_name || 'Friend'}!`} />
        <AccountNavigation active="/credits" />

        <Content>
          <Intro>
            <Title element="h1" like="heading-4">
              Your current balance is
              <span>{formatMoney(props.balance)}</span>
            </Title>
          </Intro>

          {
            credits?.length > 0 ? (
              <>
                <Title element="h2" like="heading-6">Past Credits</Title>
                <Table columns={columns} tableData={credits} media={media} loading={loading} />
                <InView threshold={0} onChange={handleOnIntersectionChange}>
                  { ({ ref }) => <IntersectionObserverElement ref={ref} /> }
                </InView>
              </>
            ) : ''
          }
        </Content>
      </Page>
    </>
  );
};

CreditsPage.defaultProps = {
  credits: [],
  balance: 0
};

CreditsPage.propTypes = {
  profile: PropTypes.object.isRequired,
  credits: PropTypes.array,
  balance: PropTypes.number
};

const getCredits = async (ctx) => {
  try {
    const credits = await fetchCredits({
      ctx,
      page: 1,
      base: process.env.SOLIDUS_HOST,
      uri: 'api/store_credits/mine',
      scopes: [SCOPE_TYPES.SERVICES.SOLIDUS]
    });

    return hasError(credits) ? false : credits;
  } catch (error) {
    return false;
  }
};

export const getServerSideProps = withAuthServerSideProps(async (ctx) => {
  const credits = await getCredits(ctx);
  return { credits: credits.store_credits, balance: credits.current_balance };
});

export default withAuthComponent(CreditsPage);
