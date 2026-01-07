import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import styled from '@emotion/styled';

import AccountNavigation from '../../molecules/account-navigation';
import Address from '../../tissues/account-address-section';
import Email from '../../tissues/account-emails-section';
import PageHeading from '../../molecules/page-heading';
import Payment from '../../tissues/account-payment-section';
import Profile from '../../tissues/account-profile-section';

import { withAuthComponent, withAuthServerSideProps } from '../../utils/auth/with-auth';

import { Page, Content } from '../../theme/page';

const Grouped = styled.div`
  width: 100%;
  justify-content: space-between;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    width: calc(1/2 * 100% - (1 - 1/2) * 3rem);
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: flex;
    flex-direction: row;
  }
`;

const ProfileEmailGroup = styled(Grouped)`
  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    width: calc(1/3 * 100% - (1 - 1/3) * 5rem);
    flex-direction: column;
  }
`;

const AddressPaymentGroup = styled(Grouped)`
  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    width: calc(2/3 * 100% - (1 - 2/3) * 5rem);

    > section {
      width: calc(1/2 * 100% - (1 - 1/2) * 5rem);
    }
  }
`;

const Tabs = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    flex-direction: row;
  }
`;

const AccountPage = (props) => (
  <>
    <Head>
      <title>{`${props.profile.first_name || 'Friend'}'s Maisonette Account`}</title>
      <link key="canonical" rel="canonical" href={`${process.env.NEXT_PUBLIC_CLIENT_HOST}/account`} />
    </Head>
    <Page id="maincontent">
      <PageHeading title={`Hi, ${props.profile.first_name || 'Friend'}!`} />
      <AccountNavigation active="/account" />

      <Content>
        <Tabs>
          <ProfileEmailGroup>
            <Profile profile={props.profile} />
            <Email subscribed={props.profile.subscribed} />
          </ProfileEmailGroup>

          <AddressPaymentGroup>
            <Address
              user={props.profile.id}
              profile={props.profile}
              token={props.token}
              addresses={props.profile.addresses}
            />
            <Payment token={props.token} />
          </AddressPaymentGroup>
        </Tabs>
      </Content>
    </Page>
  </>
);

AccountPage.propTypes = {
  profile: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired
};

export const getServerSideProps = withAuthServerSideProps();

export default withAuthComponent(AccountPage);
