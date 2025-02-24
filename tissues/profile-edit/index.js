import React from 'react';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Router from 'next/router';
import { toast, TOAST } from '../../utils/toastify';

import Button from '../../atoms/button';
import InputField from '../../molecules/input-field';
import Typography from '../../atoms/typography';

import {
  getCurrentCart,
  getMinis,
  getUser,
  login,
  updateUser,
  identifyKustomer
} from '../../pages/api';

import { setToken } from '../../store/modules/user/actions';
import { setPetiteProfiles } from '../../store/modules/petites/actions';
import { setUserProfile } from '../../store/modules/profile/actions';
import { updateCart } from '../../store/modules/cart/actions';
import { setUser as setUserAmplitude } from '../../utils/amplitude';

const GridForm = styled(Form)`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 2rem;

  input {
    outline: 0;
  }
`;

const FormSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
`;

const InputWrapperHalf = styled.div`
  grid-column: -1 / 1;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    grid-column: auto;
  }
`;

const InputWrapperFull = styled.div`
  grid-column: 1 / span 2;
`;

const ChangePasswordLabel = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  line-height: 1;
  margin-top: 3rem;
  grid-column: 1 / span 2;
`;

const StyledButton = styled(Button)`
  outline: 0;
  width: 100%;
`;

const AccountEdit = (props) => (
  <Formik
    initialValues={{
      email: props.profile.email,
      first_name: props.profile.first_name,
      last_name: props.profile.last_name,
      current_password: '',
      password: '',
      password_confirmation: ''
    }}

    initialStatus={{ button: props.buttonText }}

    validationSchema={
        Yup.object().shape({
          email: Yup.string().email('Please enter a valid Email Address').required('Email is required'),
          first_name: Yup.string().required('First Name is required'),
          last_name: Yup.string().required('Last Name is required'),
          current_password: Yup.string()
            .test('is-empty', 'You must enter your current password to change it with a new one', function checkFields(value) {
              /*
                * This check fails if the password OR password_confirmation
                * fields are filled but the current_password field is empty.
                *
                * This because in order to submit the form all these three fields
                * must be filled in case.
                */
              const currentPassword = !!value;
              /* eslint-disable react/no-this-in-sfc */
              const password = !!this.parent.password;
              const passwordConfirmation = !!this.parent.password_confirmation;
              /* eslint-enable react/no-this-in-sfc */

              if (!currentPassword && (password || passwordConfirmation)) return false;

              return true;
            }),
          password: Yup.string().min(6, 'The new password must be at least 6 characters long'),
          password_confirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .when('password', (password, schema) => (password ? schema.required('Password confirmation is required') : schema))
        })
      }

    onSubmit={async (model, actions) => {
      const isChangingPassword = model.current_password
          && model.password
          && model.password_confirmation;

      actions.setStatus({ button: 'Updating Account...' });

      const newUserDetails = {
        email: model.email,
        first_name: model.first_name,
        last_name: model.last_name
      };

      /* change password if user filled out password fields */
      if (isChangingPassword) {
        newUserDetails.current_password = model.current_password;
        newUserDetails.password = model.password;
        newUserDetails.password_confirmation = model.password_confirmation;
      }

      const userUpdated = await updateUser({
        id: props.profile.id,
        body: { user: newUserDetails }
      });

      const userUpdatedData = userUpdated?.data ?? userUpdated;
      if (userUpdatedData?.error || userUpdatedData?.errors) {
        if (userUpdatedData?.errors?.current_password) {
          const err = userUpdatedData.errors.current_password[0];
          toast(`Your current password ${err}`, { type: TOAST.TYPE.ERROR });
        }

        // Looks like the error response changed?
        // above may not be returned anymore, leaving for now as to not break any toasts
        if (userUpdatedData?.errors) {
          const { message } = userUpdatedData?.errors?.find((x) => x.code === 422);
          if (message) toast(message, { type: TOAST.TYPE.ERROR });
        }

        actions.setSubmitting(false);
        actions.setStatus({ button: props.buttonText });
        return;
      }

      /* spree_api_token is reset - log user out and in again */
      if (isChangingPassword) {
        /* logout */
        global.document.cookie = 'maisonette_user_token=; Max-Age=0; path=/;';
        global.document.cookie = 'maisonette_user_data=; Max-Age=0; path=/;';
        global.document.cookie = 'maisonette_cart_count=; Max-Age=0; path=/;';
        global.document.cookie = 'maisonette_order_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

        await login({ body: { user: { email: model.email, password: model.password } } })
          .then(async (res) => {
            // NOTE: Maybe we can remove this check?
            // It already validates the credentials on line 118
            if (res.errors || !res.email || !res) {
              toast('Username or password is invalid.', { type: TOAST.TYPE.ERROR });
              return;
            }

            global.document.cookie = `maisonette_user_token=${res.spree_api_key}; Max-Age=${process.env.NEXT_PUBLIC_COOKIE_MAX_AGE}; path=/;`;

            /* kustomer */
            if (process.env.NEXT_PUBLIC_KUSTOMER_ACTIVE === 'true') { await identifyKustomer({ id: res.id }); }

            /* load user data */
            await Promise.all([
              getUser(),
              getCurrentCart(),
              getMinis()
            ])
              .then(([user, cart, minis]) => {
                const userData = user?.data ?? user;
                const cartData = cart?.data ?? cart;
                const minisData = minis?.data ?? minis;

                /* if cart exists, set maisonette_order_token */
                if (!cartData.error && cartData.token && cartData.token !== 'undefined') {
                  props.updateCart(cartData);
                  global.document.cookie = `maisonette_order_token=${cartData.token}; max-age=15768017; path=/;`;
                }

                // set Amplitude user
                setUserAmplitude({ user: userData });

                /* create profile state */
                props.setToken('spree_api_key', res.spree_api_key);
                props.setUserProfile({ ...res, ...userData });

                /* create minis state */
                props.setPetiteProfiles(minisData);

                /* check if user is subscribed */
                if (userData.subscribed) global.document.cookie = 'subscribed_to_emails=1; path=/';
              });

            toast('Account has been updated.', { type: TOAST.TYPE.SUCCESS });
            Router.push('/account');
          })
          .finally(() => {
            actions.setStatus({ button: props.buttonText });
          });
      } else {
        await getUser().then((res) => {
          const resData = res?.data ?? res;
          props.setUserProfile(resData);
        });
        actions.setStatus({ button: props.buttonText });
        Router.push('/account');
        toast('Account has been updated.', { type: TOAST.TYPE.SUCCESS });
      }
    }}
  >
    {({ status, isSubmitting, isValid }) => (
      <GridForm>
        <FormSection role="group">
          <InputWrapperHalf>
            <InputField
              label="First Name (required)"
              name="first_name"
              id="account-fname"
              placeholder="John"
              type="text"
              autoComplete="given-name"
            />
          </InputWrapperHalf>

          <InputWrapperHalf>
            <InputField
              label="Last Name (required)"
              name="last_name"
              id="account-lname"
              placeholder="Smith"
              type="text"
              autoComplete="family-name"
            />
          </InputWrapperHalf>

          <InputWrapperFull>
            <InputField
              label="Email Address (required)"
              name="email"
              id="account-email"
              placeholder="email@example.com"
              type="email"
              autoComplete="username"
            />
          </InputWrapperFull>
        </FormSection>

        <FormSection role="group">
          <ChangePasswordLabel element="legend" like="heading-6">Change Password</ChangePasswordLabel>

          <InputWrapperFull>
            <InputField
              label="Current Password"
              name="current_password"
              id="account-password"
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
            />
          </InputWrapperFull>

          <InputWrapperHalf>
            <InputField
              label="New Password"
              name="password"
              id="account-password-new"
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
            />
          </InputWrapperHalf>

          <InputWrapperHalf>
            <InputField
              label="Confirm New Password"
              name="password_confirmation"
              id="account-password-new-confirmation"
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
            />
          </InputWrapperHalf>
        </FormSection>

        <StyledButton type="submit" disabled={isSubmitting || !isValid}>{status.button}</StyledButton>
      </GridForm>
    )}
  </Formik>
);

AccountEdit.defaultProps = {
  buttonText: 'Update Account'
};

AccountEdit.propTypes = {
  buttonText: PropTypes.string,
  setToken: PropTypes.func.isRequired,
  setPetiteProfiles: PropTypes.func.isRequired,
  setUserProfile: PropTypes.func.isRequired,
  updateCart: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};
const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  setToken: (key, token) => dispatch(setToken(key, token)),
  setPetiteProfiles: (petites) => dispatch(setPetiteProfiles(petites)),
  setUserProfile: (user) => dispatch(setUserProfile(user)),
  updateCart: (cart) => dispatch(updateCart(cart))
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountEdit);
