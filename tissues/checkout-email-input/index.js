import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import * as Yup from 'yup';
import { Formik, Field, Form as FormikForm } from 'formik';
import * as Sentry from '@sentry/node';
import { toast, TOAST } from '../../utils/toastify';
import { logAmplitude } from '../../utils/amplitude';

import Typography from '../../atoms/typography';
import Button from '../../atoms/button';
import { updateCheckout } from '../../pages/api';

const Wrapper = styled('div', { shouldForwardProp: (prop) => prop !== 'editing' })`
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme.font.sans};
  color: ${({ theme }) => theme.color.brand};

  // adjust margin to prevent layout shift when rendering larger input
  // margin - (input - static) = 4.6rem
  margin-bottom: ${({ editing }) => (editing ? '4.6rem' : '6.4rem')};
`;

const Label = styled(Typography)`
  margin-bottom: ${({ theme }) => theme.modularScale.sixteen};
  font-size: ${({ theme }) => theme.modularScale.twentyFour};
`;

const Form = styled(FormikForm)`
  display: flex;
  position: relative;
`;

const StyledInput = styled(Field, { shouldForwardProp: (prop) => prop !== 'error' })`
  height: 4.5rem;
  border: 1px solid ${({ theme }) => theme.color.brandLightBlue};
  font-size: ${({ theme }) => theme.modularScale.eighteen};
  background: ${({ theme }) => theme.color.backgroundLightBlue};
  color: ${({ theme }) => theme.color.brand};
  padding: 0 1.5rem;
  width: 100%;

  ${({ error, theme }) => error && css`
    border-color: ${theme.color.redError};
  `}
`;

const CTA = styled(Button)`
  width: 16rem;
  height: 4.5rem;
  font-size: ${({ theme }) => theme.modularScale.fourteen};
  margin-left: 1rem;
  text-align: center;
  padding: 0;
`;

const Error = styled.span`
  position: absolute;
  top: 5rem;
  color: ${({ theme }) => theme.color.redError};
`;

const StaticWrapper = styled.div`
  display: flex;

  // The following code is to prevent the email from causing
  // additional space when its too long for the screen size.
  // Overflow needs a width to know where to break
  // TODO: Figure out a better fix for email breaks
  max-width: 300px;

  @media (${(props) => props.theme.breakpoint.medium}) {
    max-width: 220px;
  }

  @media (min-width: 1000px) {
    max-width: 240px;
  }
  @media (min-width: 1250px) {
    max-width: 300px;
  }

  @media (min-width: 1436px) {
    max-width: 370px;
  }

  @media (min-width: 1585px) {
    max-width: 407.594px;
  }
  @media (min-width: 1685px) {
    max-width: 412.391px;
  }
`;

const StaticEmail = styled(Typography)`
  font-size: ${({ theme }) => theme.modularScale.eighteen};

  // The following code is to prevent the email from causing
  // additional space when its too long for the screen size.
  // The flex and min-width ensure the "edit" button doesn't
  // Get cut off

  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EditButton = styled(Button)`
  margin-left: 1rem;
  font-size: ${({ theme }) => theme.modularScale.sixteen};

  // The following code is to prevent the email from causing
  // additional space when its too long for the screen size.
  // the white-space ensures the "edit" button doesn't
  // Get cut off
  white-space: nowrap;
  flex-shrink: 0;
`;

const CheckoutEmailInput = (props) => {
  // [TEC-7029] sporadically found test@test.com in cart email
  // in order to prevent clear it out and allow user add
  const inValidEmail = 'test@test.com';
  const [editing, setEditing] = useState(props.email === inValidEmail);
  const [email, setEmail] = useState(props.email && props.email === inValidEmail ? '' : props.email);

  const submitEmail = async (values) => {
    props.setLoading(true);

    const order = {
      email: values.email
    };

    await updateCheckout({ id: props.cartNumber, body: { order }, hold_state: true })
      .then((res) => {
        const resData = res?.data ?? res;
        if (resData.errors?.length > 0) {
          props.setLoading(false);
          resData.errors.forEach(({ message = null }) => {
            if (typeof message === 'string') {
              toast(message, { type: TOAST.TYPE.ERROR });
              logAmplitude('Encountered Transaction Error', {
                message,
                step: 'delivery'
              });
            }
          });

          Sentry.withScope((scope) => {
            scope.setLevel(Sentry.Severity.Info);

            resData.errors.forEach((error) => {
              Object.keys(error).forEach((key) => {
                scope.setExtra(key, error[key]);
              });
            });

            scope.setExtra('email', values.email);

            const emailError = new global.window.Error('Add checkout email failure');
            Sentry.captureException(emailError);
          });
        } else {
          setEditing(false);
          setEmail(resData.email);
          global.document.cookie = `maisonette_guest_email=${resData.email}; max-age=${process.env.NEXT_PUBLIC_COOKIE_MAX_AGE}; path=/;`;
          props.updateCart(resData);
        }
      }).then(() => props.setLoading(false));
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleEnterPress = (e, dirty) => {
    // prevents form from submitting when user has not changed email input
    // and presses enter
    if (e.key === 'Enter' && !dirty) {
      e.preventDefault();
      setEditing(false);
    }
  };

  return (
    <Wrapper editing={editing}>
      <Label htmlFor="checkout-email-input" element="label" like="heading-2">Email</Label>
      {
        editing
          ? (
            <Formik
              initialValues={{
                email
              }}
              validateOnMount
              onSubmit={(values, actions, other) => submitEmail(values, actions, other)}
              validationSchema={
                Yup.object().shape({
                  email: Yup
                    .string()
                    .email('Please enter a valid Email Address')
                    .required('Email is required')
                    .test(
                      'email',
                      'Please enter a valid Email Address',
                      (value) => value !== inValidEmail
                    )
                })
              }

            >

              {({
                values,
                isSubmitting,
                errors,
                dirty
              }) => (
                <Form onKeyDown={(e) => handleEnterPress(e, dirty)}>
                  <StyledInput
                    required
                    name="email"
                    id="checkout-email-input"
                    type="email"
                    autoComplete="email"
                    error={errors.email ? 'true' : undefined}
                  />
                  {
                    dirty || email === ''
                      ? (
                        <CTA
                          type="submit"
                          text="update"
                          aria-label="update order email"
                          outline
                          disabled={!values.email || isSubmitting || !!errors.email}
                        />
                      )
                      : (
                        <CTA
                          type="button"
                          text="cancel"
                          aria-label="cancel update order email"
                          onClick={handleCancel}
                          outline
                        />
                      )
                  }
                  {
                    errors.email && <Error role="alert">{errors.email}</Error>
                  }
                </Form>
              )}
            </Formik>
          )
          : (
            <StaticWrapper
              data-test-id="checkout-submitted-email-address"
            >
              <StaticEmail element="p" like="dec-2">
                {email}
              </StaticEmail>
              <EditButton
                aria-label="edit order email"
                text="Edit"
                styledLikeLink
                onClick={handleEdit}
              />
            </StaticWrapper>
          )
      }
    </Wrapper>
  );
};

CheckoutEmailInput.defaultProps = {
  email: '',
  updateCart: () => { },
  setLoading: () => { }
};

CheckoutEmailInput.propTypes = {
  email: PropTypes.string,
  cartNumber: PropTypes.string.isRequired,
  updateCart: PropTypes.func,
  setLoading: PropTypes.func
};

export default CheckoutEmailInput;
