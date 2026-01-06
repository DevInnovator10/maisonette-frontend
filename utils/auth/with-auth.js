import React from 'react';
import cookies from 'next-cookies';

import { setUserProfile } from '../../store/modules/profile/actions';
import { storeWrapper } from '../../store';
import hasError from '../hasError';

const getUser = async (token) => {
  try {
    const profile = await global.fetch(`${process.env.SOLIDUS_HOST}/api/users/mine`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    }).then((r) => r.json());
    return hasError(profile) ? null : profile;
  } catch (error) {
    return null;
  }
};

export const withAuthServerSideProps = (getServerSidePropsFunc) => storeWrapper.getServerSideProps(
  async (ctx) => {
    const token = cookies(ctx).maisonette_user_token ?? null;
    const profile = await getUser(token);

    if (profile) ctx.store.dispatch(setUserProfile(profile));

    if (!token || !profile) {
      if (ctx.resolvedUrl.split('?')[0] === '/returns') {
        return {
          redirect: {
            destination: '/returns-guide',
            permanent: false
          }
        };
      }

      return {
        redirect: {
          destination: `/login?referrer=${encodeURIComponent(ctx.resolvedUrl)}`,
          permanent: false
        }
      };
    }

    // Guard class against null gSSP()
    if (!getServerSidePropsFunc) return { props: { profile, token } };

    // Run gSSP() and merge results
    const props = await getServerSidePropsFunc(ctx, profile, token);
    return props?.redirect ?? props?.notFound ?? { props: { ...props, profile, token } };
  }
);

export const withAuthComponent = (Component) => (props) => <Component {...props} />;
