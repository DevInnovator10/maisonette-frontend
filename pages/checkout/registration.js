import React from 'react';
import cookies from 'next-cookies';
import Head from 'next/head';
import styled from '@emotion/styled';

import { Page, Content } from '../../theme/page';

import LoginForm from '../../tissues/login-form';
import GuestForm from '../../tissues/guest-form';
import Typography from '../../atoms/typography';

import Layout from '../../layouts/checkout';

const FormsContainer = styled(Content)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const Login = styled(LoginForm)`
  margin: 0 auto;
  max-width: 50rem;
`;

const Title = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: 2rem;
  text-align: center;
`;

const FormSection = styled.section`
  padding-bottom: ${(props) => props.theme.modularScale['3xlarge']};
  padding-top: ${(props) => props.theme.modularScale['3xlarge']};
  width: 100%;

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    width: 35%;
  }
`;

const CheckoutRegistrationPage = () => (
  <>
    <Head>
      <title>Maisonette Account Login/Registration</title>
      <meta
        name="description"
        content="Maisonette Account Login Page, Maisonette Account Registration"
      />
      <link key="canonical" rel="canonical" href={`${process.env.NEXT_PUBLIC_CLIENT_HOST}/checkout/registration`} />
    </Head>
    <Page background="default" id="maincontent">
      <FormsContainer layout="large">
        <FormSection>
          <Title element="h1" like="heading-4">Guest?</Title>
          <GuestForm />
        </FormSection>

        <FormSection>
          <Title element="h1" like="heading-4">Got an Account?</Title>
          <Login buttonText="Log In & Checkout" redirect="/checkout" />
        </FormSection>
      </FormsContainer>
    </Page>
  </>
);

export async function getServerSideProps(ctx) {
  const orderToken = cookies(ctx).maisonette_order_token;

  if (!orderToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  return {
    props: {}
  };
}

CheckoutRegistrationPage.Layout = Layout;

export default CheckoutRegistrationPage;
