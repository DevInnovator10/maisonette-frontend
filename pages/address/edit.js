import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Head from 'next/head';

import AccountNavigation from '../../molecules/account-navigation';
import PageHeading from '../../molecules/page-heading';
import AddressNew from '../../tissues/address-create-new';
import Typography from '../../atoms/typography';

import { withAuthComponent, withAuthServerSideProps } from '../../utils/auth/with-auth';
import { Page, Content } from '../../theme/page';

const Title = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  border-bottom: 1px solid ${(props) => props.theme.color.brand};
  margin-bottom: 2rem;
`;

const AddressNewPage = (props) => (
  <>
    <Head>
      <title>{`Edit ${props.profile.first_name || 'Friend'}'s Address`}</title>
      <link key="canonical" rel="canonical" href={`${process.env.NEXT_PUBLIC_CLIENT_HOST}/address/edit`} />
    </Head>
    <Page id="maincontent">
      <PageHeading title={`Hi, ${props.profile.first_name || 'Friend'}!`} />
      <AccountNavigation active="/account" />

      <Content layout="medium">
        <Title element="h2" like="heading-5">Edit Address</Title>
        <AddressNew buttonText="Save Address" address={props.address} profile={props.profile} token={props.token} />
      </Content>
    </Page>
  </>
);

AddressNewPage.propTypes = {
  address: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired
};

export const getServerSideProps = withAuthServerSideProps(async ({ query }, profile) => {
  const { id } = query;

  const address = profile.addresses.find((a) => a.id === parseInt(id, 10));

  if (address) return { address };

  return {
    redirect: {
      destination: '/account',
      permanent: false
    }
  };
});

export default withAuthComponent(AddressNewPage);
