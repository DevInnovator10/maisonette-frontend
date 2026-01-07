import React from 'react';
import styled from '@emotion/styled';
import Head from 'next/head';
import Link from '../../utils/link';

import Button from '../../atoms/button';
import ForgotPasswordForm from '../../tissues/forgot-password-form';
import Typography from '../../atoms/typography';

import { Page } from '../../theme/page';

const AuthContent = styled.div`
    margin: 0 auto;
  max-width: 50rem;
  padding: 3rem;
`;

const ForgotPassword = styled(ForgotPasswordForm)`
  margin: 0 auto;
  max-width: 50rem;
`;

const Title = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: 2rem;
  text-align: center;
`;

const LoginButton = styled(Button)`
  margin-top: 1rem;
  outline: 0;
  text-align: center;
  width: 100%;
`;

const RegisterButton = styled(Button)`
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

const Subtitle = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  line-height: 1.5;
  margin-bottom: 1rem;
  text-align: center;
`;

const PasswordRecover = () => (
  <>
    <Head>
      <title>Reset Password - Maisonette</title>
      <link key="canonical" rel="canonical" href={`${process.env.NEXT_PUBLIC_CLIENT_HOST}/password/recover`} />
    </Head>
    <Page background="default" id="maincontent">
      <AuthContent>
        <LoginImage alt="child with balloons" src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-log-in.png`} />

        <Title element="h1" like="heading-4">Reset Password</Title>

        <Subtitle element="p" like="paragraph-2">
          Please enter your email below. If there is an associated account
          you will receive a message with a link to reset your password.
        </Subtitle>

        <ForgotPassword />

        <ButtonDivider element="span" like="dec-1">or</ButtonDivider>

        <Link href="/login" passHref>
          <LoginButton isLink>Log In</LoginButton>
        </Link>

        <Link href="/signup" passHref>
          <RegisterButton isLink outline>Create New Account</RegisterButton>
        </Link>
      </AuthContent>
    </Page>
  </>
);

PasswordRecover.defaultProps = {};
PasswordRecover.propTypes = {};

export default PasswordRecover;
