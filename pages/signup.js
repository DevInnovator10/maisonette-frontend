import React from 'react';
import styled from '@emotion/styled';
import Head from 'next/head';
import { useSelector } from 'react-redux';

import { Page } from '../theme/page';

import ButtonUrl from '../atoms/button-url';
import SignupForm from '../tissues/registration-form';
import Typography from '../atoms/typography';

const AuthContent = styled.div`
  margin: 0 auto;
  max-width: 50rem;
  padding: 3rem;
`;

const Signup = styled(SignupForm)`
  margin: 0 auto;
  max-width: 50rem;
`;

const Title = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: 2rem;
  text-align: center;
`;

const RegisterButton = styled(ButtonUrl)`
  background: transparent;
  margin-top: 1rem;
  outline: 0;
  text-align: center;
  width: 100%;
`;

const ButtonDivider = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  display: block;
  line-height: 4rem;
  margin-top: 1rem;
  text-align: center;
`;

const SignupImage = styled.img`
  display: block;
  margin: 0 auto 3rem auto;
  width: 10rem;
  height: 10rem;
`;

const SignupPage = () => {
  const loading = useSelector((state) => state.cart.loading);

  return (
    <>
      <Head>
        <title>Maisonette Account Sign Up - Log In</title>
        <link key="canonical" rel="canonical" href={`${process.env.NEXT_PUBLIC_CLIENT_HOST}/signup`} />
      </Head>
      <Page background="default" id="maincontent">
        <AuthContent>
          <SignupImage alt="child on wooden horse" src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-checkout-guest.png`} />

          <Title element="h1" like="heading-4">Sign Up</Title>

          {!loading && (
            <>
              <Signup />

              <ButtonDivider element="span" like="dec-1">or</ButtonDivider>

              <RegisterButton isLink outline href="login" passHref>
                Log In
              </RegisterButton>
            </>
          )}
        </AuthContent>
      </Page>
    </>
  );
};

export default SignupPage;
