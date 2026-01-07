import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import Head from 'next/head';
import cookies from 'next-cookies';

import { Page } from '../theme/page';
import ButtonUrl from '../atoms/button-url';
import LoginForm from '../tissues/login-form';
import Typography from '../atoms/typography';

const AuthContent = styled.div`
  margin: 0 auto;
  max-width: 50rem;
  padding: 3rem;
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

const LoginImage = styled.img`
  display: block;
  margin: 0 auto 3rem auto;
  width: 10rem;
  height: 10rem;
`;

const LoginPage = (props) => {
  const loading = useSelector((state) => state.cart.loading);

  return (
    <Page background="default" id="maincontent">
      <Head>
        <title>Maisonette Account Log In / New Account</title>
        <link key="canonical" rel="canonical" href={`${process.env.NEXT_PUBLIC_CLIENT_HOST}/login`} />
      </Head>

      <AuthContent>
        <LoginImage alt="child with balloons" src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-log-in.png`} />
        <Title element="h1" like="heading-4">Log In</Title>

        {
          !loading && (
            <>
              <Login redirect={props.history[props.history.length - 1]} />

              <ButtonDivider element="span" like="dec-1">or</ButtonDivider>

              <RegisterButton isLink outline href="/signup" passHref>
                Create New Account
              </RegisterButton>
            </>
          )
        }
      </AuthContent>
    </Page>
  );
};

LoginPage.propTypes = {
  history: PropTypes.array.isRequired
};

export async function getServerSideProps(ctx) {
  const userToken = cookies(ctx).maisonette_user_token;

  if (userToken) {
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

export default LoginPage;
