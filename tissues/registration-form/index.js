import React from 'react';
import { connect } from 'react-redux';
import { Formik, Form as FormikForm, Field } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import Router from 'next/router';
import styled from '@emotion/styled';
import { toast, TOAST } from '../../utils/toastify';

import Button from '../../atoms/button';
import { StyledCheckbox as Checkbox } from '../../atoms/checkbox';

import {
  register,
  login,
  identifyKustomer,
  getCurrentCart,
  getUser,
  getMinis
} from '../../pages/api';

import { setToken } from '../../store/modules/user/actions';
import { setUserProfile } from '../../store/modules/profile/actions';
import { updateCart } from '../../store/modules/cart/actions';
import { setPetiteProfiles } from '../../store/modules/petites/actions';
import { useSearch } from '../../utils/context/search-provider';

import InputField from '../../molecules/input-field';
import { setUser as setUserAmplitude } from '../../utils/amplitude';

const Inputs = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    flex-direction: row;

    > div {
      flex: 0 50%;

      &:first-of-type {
        margin-right: 1rem;
      }

      &:last-of-type {
        margin-left: 1rem;
      }
    }
  }
`;

const StyledButton = styled(Button)`
  outline: 0;
  width: 100%;
`;

const FormButtonSpacing = styled.span`
  display: block;
  height: 4rem;
  width: 100%;
`;

const Form = styled(FormikForm)`
  display: grid;
  grid-gap: 1rem;
`;

const OptInCheckbox = styled(Checkbox, { shouldForwardProp: (prop) => prop !== 'active' })`
  margin-top: 2.4rem;
`;

const SignupForm = (props) => {
  const { state: { abTests } } = useSearch();

  return (
    <Formik
      initialValues={{
        user: {
          email: '',
          first_name: '',
          last_name: '',
          password: '',
          password_confirmation: ''
        },
        subscribe: true
      }}

      initialStatus={{ button: props.buttonText }}

      validationSchema={
        Yup.object().shape({
          user: Yup.object().shape({
            email: Yup.string().email('Please enter a valid Email Address').required('Email is required'),
            first_name: Yup.string().required('First Name is required'),
            last_name: Yup.string().required('Last Name is required'),
            password: Yup.string().min(6).required('Password is required'),
            password_confirmation: Yup.string()
              .oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required')
          })
        })
      }

      onSubmit={(model, actions) => {
        actions.setStatus({ button: 'Creating Account...' });

        register({ body: model, order_number: props.cart.number })
          .then((registerResponse) => {
            if (
              !registerResponse
              || (registerResponse?.errors && Array.isArray(registerResponse.errors))
            ) {
              registerResponse.errors.forEach(({ message = null, code = 0 }) => {
                if (typeof message === 'string') {
                  if (code > 0) toast(message, { type: TOAST.TYPE.ERROR });
                  else toast('There was a problem, please try again.', { type: TOAST.TYPE.ERROR });
                }
              });

              return;
            }

            toast('Registration successful', { type: TOAST.TYPE.SUCCESS });

            const body = {
              user: {
                email: model.user.email,
                password: model.user.password
              }
            };

            login({ body, order_number: props.cart.number })
              .then(async (res) => {
                if (res.errors || !res.email || !res) {
                  toast('Username or password is invalid.', { type: TOAST.TYPE.ERROR });
                  return;
                }

                /* remove all previous data */
                global.document.cookie = 'maisonette_order_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                global.document.cookie = `maisonette_user_token=${res.spree_api_key}; Max-Age=${process.env.NEXT_PUBLIC_COOKIE_MAX_AGE}; path=/;`;
                props.setToken('spree_api_key', res.spree_api_key);

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
                    const cartData = cart.data ?? cart;
                    const minisData = minis?.data ?? minis;
                    /* if cart exists, set maisonette_order_token */
                    if (!cartData.error && cartData.token && cartData.token !== 'undefined') {
                      props.updateCart(cartData);
                      global.document.cookie = `maisonette_order_token=${cartData.token}; max-age=15768017; path=/;`;
                    }

                    // set Amplitude user
                    setUserAmplitude({ user: userData, abTests });

                    /* create profile state */
                    props.setUserProfile({ ...res, ...userData });

                    /* create minis state */
                    props.setPetiteProfiles(minisData);

                    /* check if user is subscribed */
                    if (userData.subscribed) global.document.cookie = 'subscribed_to_emails=1; path=/';
                  })
                  .finally(() => {
                    toast('Login successful', { type: TOAST.TYPE.SUCCESS });

                    const params = new URLSearchParams(global.window.location.search);
                    const referrer = params.get('referrer');

                    let redirectLink = referrer || '/petite-profiles';
                    if (redirectLink.charAt(0) !== '/') redirectLink = `/${redirectLink}`;

                    actions.setSubmitting(false);
                    Router.push(redirectLink)
                      .then(() => global.window.scrollTo(0, 0));
                  });
              })
              .finally(() => {
                actions.setSubmitting(false);
                actions.setStatus({ button: props.buttonText });
              });
          })
          .finally(() => {
            actions.setSubmitting(false);
            actions.setStatus({ button: props.buttonText });
          });
      }}

      validateOnChange={false}
    >
      {({ status, isSubmitting, values }) => (
        <Form>
          <Inputs>
            <InputField
              label="First Name (required)"
              name="user.first_name"
              id="signup-fname"
              placeholder="John"
              type="text"
              isWireframe
              autoComplete="given-name"
            />

            <InputField
              label="Last Name (required)"
              name="user.last_name"
              id="signup-lname"
              placeholder="Smith"
              type="text"
              isWireframe
              autoComplete="family-name"
            />
          </Inputs>

          <InputField
            label="Email Address (required)"
            name="user.email"
            id="signup-email"
            placeholder="email@example.com"
            type="email"
            isWireframe
            autoComplete="email"
          />

          <InputField
            label="Password (required)"
            name="user.password"
            id="signup-password"
            placeholder="••••••••"
            type="password"
            isWireframe
            autoComplete="new-password"
          />

          <InputField
            label="Password Confirmation (required)"
            name="user.password_confirmation"
            id="signup-password-confirmation"
            placeholder="••••••••"
            type="password"
            isWireframe
            autoComplete="new-password"
          />

          <OptInCheckbox active={values?.subscribe ?? undefined} htmlFor="signup-subscribe-checkbox">
            <Field
              as="input"
              id="signup-subscribe-checkbox"
              name="subscribe"
              type="checkbox"
            />
            I would like to receive emails from Maisonette
          </OptInCheckbox>

          <FormButtonSpacing />

          <StyledButton type="submit" disabled={isSubmitting}>{status.button}</StyledButton>
        </Form>
      )}
    </Formik>
  );
};

SignupForm.defaultProps = {
  buttonText: 'Sign Up',
  cart: {
    number: null,
    token: null
  }
};

SignupForm.propTypes = {
  buttonText: PropTypes.string,
  cart: PropTypes.object,
  setToken: PropTypes.func.isRequired,
  setPetiteProfiles: PropTypes.func.isRequired,
  setUserProfile: PropTypes.func.isRequired,
  updateCart: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  cart: state.cart
});

const mapDispatchToProps = (dispatch) => ({
  setToken: (key, token) => dispatch(setToken(key, token)),
  setPetiteProfiles: (petites) => dispatch(setPetiteProfiles(petites)),
  setUserProfile: (user) => dispatch(setUserProfile(user)),
  updateCart: (cart) => dispatch(updateCart(cart))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);
