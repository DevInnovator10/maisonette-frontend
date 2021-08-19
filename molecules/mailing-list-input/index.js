import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import styled from '@emotion/styled';
import { toast, TOAST } from '../../utils/toastify';

import Input from '../../atoms/input-email';
import Button from '../../atoms/button';
import IconCircleArrow from '../../atoms/icon-circle-arrow';

import { subscribeToEmails } from '../../pages/api';

const InputWrapper = styled.div`
    position: relative;
`;

const EmailInput = styled(Input)`
    outline: 0;
  padding: 0;
  text-transform: uppercase;
  width: 100%;
`;

const Submit = styled(Button)`
  border: 0;
  height: 32px;
  overflow: visible;
  position: absolute;
  right: 0;
  top: 6px;
  width: 32px;

  svg {
    fill: transparent;
    height: 27px;
    stroke-width: 4;
    stroke: #fff;
    width: 27px;

    path {
      transform: translate3d(0, 0, 0);
    }
  }

  :hover:not(:disabled) {
    svg {
      path {
        animation: arrow-head;
        animation-duration: ${(props) => props.theme.animation.slow};
        animation-timing-function: ${(props) => props.theme.animation.easeMove};
        animation-delay: 0s;
        animation-iteration-count: 1;
        animation-direction: normal;
        animation-fill-mode: forwards;
        animation-play-state: running;
      }
    }
  }

  :disabled {
    opacity: 1;
  }
`;

const FormLabel = styled.label`
  color: ${(props) => props.theme.color.white};
  display: block;
  font-size: 1.5rem;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 2rem;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    text-align: left;
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

const MailingListInput = () => (
  <Formik
    initialValues={{ email: '', source: 'Footer' }}
    validateOnBlur={false}
    validateOnChange={false}
    validationSchema={
      Yup.object().shape({
        email: Yup.string().email('Please enter a valid Email Address').required('Email is required')
      })
    }
    onSubmit={async (model, actions) => {
      actions.setSubmitting(true);

      await subscribeToEmails({
        body: {
          subscriber: {
            ...model,
            first_name: '',
            last_name: ''
          }
        }
      })
        .then(() => {
          toast('Thank you!', { type: TOAST.TYPE.SUCCESS });
          global.document.cookie = 'subscribed_to_emails=1; path=/';
          actions.setSubmitting(false);
          actions.resetForm();
        })
        .catch((err) => {
          console.error(err);
        });
    }}
  >
    {({ isSubmitting }) => (
      <Form>
        <FormLabel htmlFor="mailing-list-email">
          Fresh arrivals, new and new-to-you brands, and expert edits.
          Basically, a bundle of joy in email form.
        </FormLabel>

        <InputWrapper>
          <Field name="email">
            {({ field, meta }) => (
              <div>
                <EmailInput
                  id="mailing-list-email"
                  type="email"
                  placeholder="join our mailing list"
                  component={Input}
                  underline
                  inverted
                  {...field}
                  aria-describedby={meta.touched && meta.error ? 'mailing-list-error' : null}
                  autoComplete="email"
                />
                {meta.touched && meta.error && <ErrorMsg id="mailing-list-error" role="alert">{meta.error}</ErrorMsg>}
              </div>
            )}
          </Field>
          <Submit aria-label="submit join mailing list" type="submit" isIcon disabled={isSubmitting}><IconCircleArrow /></Submit>
        </InputWrapper>
      </Form>
    )}
  </Formik>
);

export default MailingListInput;
