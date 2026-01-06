import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import styled from '@emotion/styled';

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
      <title>{`New Address for ${props.profile.first_name || 'Friend'}`}</title>
      <link key="canonical" rel="canonical" href={`${process.env.NEXT_PUBLIC_CLIENT_HOST}/address/new`} />
    </Head>
    <Page id="maincontent">
      <PageHeading title={`Hi, ${props.profile.first_name || 'Friend'}!`} />
      <AccountNavigation active="/account" />

      <Content layout="medium">
        <Title element="h2" like="heading-5">New Address</Title>
        <AddressNew profile={props.profile} token={props.token} />
      </Content>
    </Page>
  </>
);

AddressNewPage.propTypes = {
  profile: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired
};

export const getServerSideProps = withAuthServerSideProps();

export default withAuthComponent(AddressNewPage);
