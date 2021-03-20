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
  margin-top: -1rem;

  &:-internal-autofill-selected {
    /* remove chrome blue background */
    transition: all 1000s;
  }
`;

const ErrorMsg = styled(Typography)`
  color: ${({ theme }) => theme.color.redError};
  margin-top: 0.5rem;
`;

const FormLabel = styled.label`
  opacity: 0;
  pointer-events: none;
  position: absolute;
`;

const Text = styled(Typography)`
  color: ${({ theme }) => theme.color.bluePrimary};
  line-height: 1.5;
  margin-bottom: 2rem;
`;

const SubmitButton = styled(Button)`
  margin-top: 2.5rem;
  font-size: ${({ theme }) => theme.modularScale.sixteen};
  width: 100%;
`;

const WaitlistEmailRevamp = (props) => {
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
        {({ isSubmitting, values }) => (
          <StyledForm
            active={props.active ? 'true' : undefined}
            ref={componentRef}
            data-height={componentRef.current.scrollHeight}
          >
            <FormInner>
              <Text
                element="p"
                like="dec-4"
                id="waitlist-message"
              >
              Join the waitlist and we&apos;ll email you as soon as this product or
              size becomes available again.
              </Text>

              <FormLabel htmlFor="waitlist-email">Waitlist Email Input</FormLabel>

              <Field name="waitlist-email">
                {({ field, meta }) => {
                  const { 'waitlist-email': emailInput } = values;

                  const displayError = () => {
                    if (meta.touched && meta.error) {
                      if (!emailInput.length) return true;

                      if (meta.error === 'Please enter a valid Email Address') return true;
                    }

                    return false;
                  };

                  return (
                    <InputWrapper>
                      <EmailInput
                        disabled={!props.active}
                        aria-labelledby="waitlist-message waitlist-email"
                        id="waitlist-email"
                        type="email"
                        placeholder="Enter email address"
                        component={Input}
                        revamp
                        {...field}
                        aria-describedby={meta.touched && meta.error ? 'waitlist-email-error' : null}
                        autoComplete="email"
                        warning={displayError()}
                      />
                      {
                        displayError()
                        && (
                          <ErrorMsg
                            id="waitlist-email-error"
                            role="alert"
                            element="p"
                            like="dec-5"
                          >
                            {meta.error}
                          </ErrorMsg>
                        )
                      }
                    </InputWrapper>
                  );
                }}
              </Field>

              <SubmitButton
                type="submit"
                disabled={isSubmitting || isJoiningWaitlist}
                green
              >
                Email me when available
              </SubmitButton>
            </FormInner>
          </StyledForm>
        )}
      </Formik>
    </WaitlistFormWrapper>
  );
};

WaitlistEmailRevamp.defaultProps = {
  active: false,
  onSubmit: () => {},
  variant: null,
  setRef: null
};

WaitlistEmailRevamp.propTypes = {
  active: PropTypes.bool,
  onSubmit: PropTypes.func,
  variant: PropTypes.number,
  setRef: PropTypes.func
};

export default WaitlistEmailRevamp;
