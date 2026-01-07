import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Link from '../../utils/link';
import Button from '../../atoms/button';
import ResetPasswordForm from '../../tissues/reset-password-form';
import Typography from '../../atoms/typography';
import { Page } from '../../theme/page';

const AuthContent = styled.div`
  margin: 0 auto;
  max-width: 50rem;
  padding: 3rem;
`;

const UpdatePassword = styled(ResetPasswordForm)`
  margin: 0 auto;
  max-width: 50rem;
`;

const Title = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: 2rem;
  text-align: center;
`;

const LoginButton = styled(Button)`
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

const PasswordReset = (props) => {
  const router = useRouter();

  useEffect(() => {
    if (!props.token) { router.push('/password/recover'); }
  }, []);

  return props.token ? (
    <>
      <Head>
        <title>Maisonette - Change Password</title>
        <link key="canonical" rel="canonical" href={`${process.env.NEXT_PUBLIC_CLIENT_HOST}/password/reset`} />
      </Head>
      <Page background="default" id="maincontent">
        <AuthContent>
          <LoginImage alt="child with balloons" src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-log-in.png`} />

          <Title element="h1" like="heading-4">Change your password</Title>

          <UpdatePassword token={props.token} />

          <ButtonDivider element="span" like="dec-1">or</ButtonDivider>

          <Link href="/login" passHref>
            <LoginButton isLink outline>Log In</LoginButton>
          </Link>
        </AuthContent>
      </Page>
    </>
  ) : null;
};

export const getServerSideProps = ({ query: { token = null } }) => ({
  props: {
    token
  }
});

PasswordReset.defaultProps = {
  token: null
};

PasswordReset.propTypes = {
  token: PropTypes.string
};

export default PasswordReset;
