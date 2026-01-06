import React, { useState, useEffect, useRef } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { toast, TOAST } from '../../utils/toastify';

import Input from '../../atoms/input-email';
import Typography from '../../atoms/typography';
import Button from '../../atoms/button';
import { joinWaitlist } from '../../pages/api';

import { useProduct } from '../../utils/context/product-provider';

const WaitlistFormWrapper = styled.div`
  visibility: ${(props) => (props.active ? 'visible' : 'hidden')};
`;

const StyledForm = styled(Form)`
  height: 100%;
  max-height: ${(props) => (props.active ? `${props['data-height']}px` : 0)};
  overflow: hidden;
  opacity: ${(props) => (props.active ? 1 : 0)};
  transition: max-height ${(props) => props.theme.animation.default} ${(props) => props.theme.animation.easeIn},
    opacity ${(props) => props.theme.animation.default} ${(props) => props.theme.animation.easeIn} ${(props) => props.theme.animation.fast};
`;

const FormInner = styled.div`
  margin-top: 1rem;
`;

const InputWrapper = styled.div`
  margin-bottom: .4rem;
  position: relative;
`;

const EmailInput = styled(Input)`
  background-color: ${(props) => props.theme.color.white};
  border: 2px solid ${(props) => props.theme.color.brandError};
  color: ${(props) => props.theme.color.brandError};
  outline: none;
  padding: 0 1.5rem;

  ::placeholder {
    color: ${(props) => props.theme.color.brandError};
  }

  &:-internal-autofill-selected {
    /* remove chrome blue background */
    transition: all 1000s;
  }
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

const FormLabel = styled.label`
  opacity: 0;
  pointer-events: none;
  position: absolute;
`;

const ErrorText = styled.p`
  color: ${(props) => props.theme.color.brandError};
  line-height: 1.5;
  margin-bottom: 2rem;
`;

const ErrorBold = styled(Typography)`
  color: ${(props) => props.theme.color.brandError};
  letter-spacing: 0.2em;
  line-height: 2rem;
  text-transform: uppercase;
`;

const SubmitButton = styled(Button)`
  background-color: ${(props) => props.theme.color.brandError};
  border: 2px solid ${(props) => props.theme.color.brandError};
  margin-top: 2rem;
  outline: none;
  width: 100%;
`;

const WaitlistEmail = (props) => {
  const [inputRef, setInputRef] = useState(0);
  const [isJoiningWaitlist, setIsJoiningWaitlist] = useState(false);
  const componentRef = useRef(0);
  const { setWishListRef } = useProduct();

  const handleWaitlist = (email) => {
    const successMessage = 'Thanks! we will notify you as soon as the item is back in stock';

    setIsJoiningWaitlist(true);

    const waitlistRequest = {
      stock_request: {
        email,
        variant_id: props.variant
      }
    };

    joinWaitlist({ body: waitlistRequest })
      .then(() => toast(successMessage, { type: TOAST.TYPE.SUCCESS }))
      .catch((errors) => {
        if (errors.length > 0) {
          errors.forEach((error) => {
            // we receive a 422 when the email is already in the waitlist
            if (error?.status === 422) toast(successMessage, { type: TOAST.TYPE.SUCCESS });
            else toast('An error has occurred, please try again later', { type: TOAST.TYPE.ERROR });
          });
        }
      })
      .finally(() => setIsJoiningWaitlist(false));
  };

  useEffect(() => {
    setInputRef(componentRef.current.querySelector('input'));
  }, []);

  useEffect(() => {
    if (inputRef) {
      if (props.active) {
        setWishListRef(inputRef);

        inputRef.focus();
        global.window.scroll({
          left: 0,
          top: componentRef.current.getBoundingClientRect().top
            + global.window.scrollY
            - (global.window.innerHeight / 2),
          behavior: 'smooth'
        });
      } else inputRef.blur();
    }
  }, [props.active]);

  return (
    <WaitlistFormWrapper active={props.active}>
      <Formik
        initialValues={{ 'waitlist-email': '' }}
        validationSchema={
          Yup.object().shape({
            'waitlist-email': Yup.string().email('Please enter a valid Email Address').required('Email is required')
          })
        }
        onSubmit={async (model, actions) => {
          actions.setSubmitting(true);

          await handleWaitlist(model['waitlist-email']);

          actions.setSubmitting(false);
          actions.resetForm();
        }}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ isSubmitting }) => (
          <StyledForm
            active={props.active ? 'true' : undefined}
            ref={componentRef}
            data-height={componentRef.current.scrollHeight}
          >
            <FormInner>
              <ErrorText id="waitlist-message">
                <ErrorBold element="b" like="label-1">Oh no! It&apos;s out of stock! </ErrorBold>
              Join the waitlist and we&apos;ll email you as soon as this product or
              size becomes available again.
              </ErrorText>

              <FormLabel htmlFor="waitlist-email">Waitlist Email Input</FormLabel>

              <Field name="waitlist-email">
                {({ field, meta }) => (
                  <InputWrapper>
                    <EmailInput
                      disabled={!props.active}
                      aria-labelledby="waitlist-message waitlist-email"
                      id="waitlist-email"
                      type="email"
                      placeholder="Email Address"
                      component={Input}
                      underline
                      inverted
                      {...field}
                      aria-describedby={meta.touched && meta.error ? 'waitlist-email-error' : null}
                      autoComplete="email"
                    />
                    { meta.touched && meta.error && <ErrorMsg id="waitlist-email-error" role="alert">{meta.error}</ErrorMsg> }
                  </InputWrapper>
                )}
              </Field>

              <SubmitButton type="submit" disabled={isSubmitting || isJoiningWaitlist}>
                Email when Available
              </SubmitButton>
            </FormInner>
          </StyledForm>
        )}
      </Formik>
    </WaitlistFormWrapper>
  );
};

WaitlistEmail.defaultProps = {
  active: false,
  onSubmit: () => {},
  variant: null,
  setRef: null
};

WaitlistEmail.propTypes = {
  active: PropTypes.bool,
  onSubmit: PropTypes.func,
  variant: PropTypes.number,
  setRef: PropTypes.func
};

export default WaitlistEmail;
