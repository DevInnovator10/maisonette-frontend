import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import styled from '@emotion/styled';
import * as Yup from 'yup';
import { toast, TOAST } from '../../utils/toastify';

import formData from '../../theme/forms';
import Input from '../../atoms/input-email';
import Button from '../../atoms/button';
import Typography from '../../atoms/typography';

import { createForgotPassword } from '../../pages/api';

const InputWrapper = styled.div`
  margin-bottom: 2rem;
  position: relative;
`;

const StyledInput = styled(Input)`
  background: transparent;
  border-bottom: 2px solid ${(props) => props.theme.color.brand};
  outline: 0;
  padding: 0;
`;

const FormLabel = styled(Typography)`
  color: ${({ theme }) => theme.color.brand};
  ::placeholder {
    color: ${(props) => props.theme.color.brandLight};
    opacity: 1;
  }
`;

const StyledButton = styled(Button)`
  margin-top: 1rem;
  outline: 0;
  width: 100%;
`;

const ErrorMsg = styled.span`
  color: ${(props) => props.theme.color.brandError};
  display: block;
  font-family: ${(props) => props.theme.font.sans};
  font-size: 1.2rem;
  left: 0;
  margin-top: 0.25rem;
  position: absolute;
  top: 100%;
  width: 100%;
`;

const ForgotPasswordForm = () => {
  const [emailValues] = useState(formData.email(true).label);
  const [submitted, setSubmitted] = useState(false);

  return (
    <Formik
      initialValues={{ email: '' }}
      initialErrors={{ email: '' }}
      validationSchema={
        Yup.object().shape({
          email: Yup.string().email('Please enter a valid Email Address').required('Email is required')
        })
      }
      onSubmit={async (model, actions) => {
        actions.setSubmitting(true);

        await createForgotPassword({ body: { user: { email: model.email } } })
          .then(() => {
            setSubmitted(true);

            toast(
              'If this account exists, you will receive an email with instructions about how to reset the password in a few minutes',
              { type: TOAST.TYPE.SUCCESS }
            );
          });
      }}
    >
      {({ isSubmitting, isValid }) => (
        <Form>
          <FormLabel htmlFor="reset-email" element="label" like="dec-1">{ emailValues }</FormLabel>

          <Field name="email">
            {({ field, meta }) => (
              <InputWrapper>
                <StyledInput
                  id="reset-email"
                  type="email"
                  placeholder="email@website.com"
                  component={Input}
                  {...field}
                  aria-describedby={meta.error ? 'reset-email-error' : null}
                  autoComplete="username"
                />
                { meta.error && <ErrorMsg id="reset-email-error" role="alert">{meta.error}</ErrorMsg> }
              </InputWrapper>
            )}
          </Field>
          <StyledButton
            aria-label="submit reset password"
            type="submit"
            disabled={submitted || isSubmitting || !isValid}
          >
            Reset Password
          </StyledButton>
        </Form>
      )}
    </Formik>
  );
};

export default ForgotPasswordForm;
