import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { toast, TOAST } from '../../utils/toastify';

import trackEvent from '../../utils/tracking';
import NewsletterFlavor from '../newsletter-flavor-copy';
import Button from '../../atoms/button';
import Input from '../../atoms/input-email';
import Typography from '../../atoms/typography';

import { subscribeToEmails } from '../../pages/api';

const FormMain = styled(Form)`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    margin: 0 auto;
    max-width: 520px;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    flex-direction: row;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  text-align: center;
  width: 100%;

  > span {
    color: white;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    flex-direction: row;
    text-align: left;
  }
`;

const EmailInput = styled(Input)`
  background-color: transparent;
  margin-bottom: 1rem;
  outline: 0;
  padding: 0 3.6rem;
  text-align: center;
  width: 100%;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    margin-bottom: 0;
    text-align: left;
  }
`;

const Submit = styled(Button)`
  color: ${(props) => props.theme.color.brand};
  background: ${(props) => props.theme.color.white};
  border-color: ${(props) => props.theme.color.white};
  flex: 1;
  height: 4.7rem;
  max-height: 4.7rem;
  min-width: 145px;
`;

const FormLabel = styled(Typography)`
  color: ${(props) => props.theme.color.white};
  display: block;
  flex: 0 100%;
  line-height: 1.2;
  margin-bottom: 2rem;
  text-align: center;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.large}) {
    margin-bottom: 3rem;
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

const PromotionWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  z-index: ${({ theme }) => theme.layers.backstage};
`;

const Benefits = styled.div`
  display: none;
  margin: 0 auto 3rem auto;
  max-width: 60rem;
  width: 100%;
  @media screen and (min-width: ${(props) => props.theme.breakpoint.large}) {
    display: flex;
    justify-content: center;
  }
`;

const BenefitsItemTest = styled(NewsletterFlavor)`
  &:nth-child(2) {
    border-left: 1px solid ${(props) => props.theme.color.white};
    border-right: 1px solid ${(props) => props.theme.color.white};
  }
`;

const isBenefitValid = (benefit) => (
  benefit.newsletter_cta && benefit.newsletter_url && benefit.newsletter_icon
);

const NewsletterSignUp = (props) => (
  <Formik
    initialValues={{ email: '', source: 'Landing Page' }}
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
          trackEvent({
            eventCategory: 'Content Engagement',
            eventAction: 'Homepage',
            eventLabel: 'Content Slot 6 (Email Signup)'
          });

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
      <FormMain>
        <PromotionWrapper>
          <FormLabel element="label" htmlFor="newsletter-email" like="heading-5">{props.title}</FormLabel>
          {props?.promos
            && props?.promos[0]
            && (
              props?.promos[0].newsletter_icon_alt
              || props?.promos[0].newsletter_cta
              || props?.promos[0].newsletter_url)
            && (
              <Benefits>
                {
                  Object.values(props.promos).map((elem, index) => (
                    isBenefitValid(elem)
                    && (
                      <BenefitsItemTest
                        // eslint-disable-next-line react/no-array-index-key
                        key={`newsletter-icon-${index}`}
                        title={elem.newsletter_cta}
                        href={`/${elem.newsletter_url}`}
                        image={elem?.newsletter_icon}
                        alt={elem.newsletter_icon_alt}
                      />
                    )
                  ))
                }
              </Benefits>
            )}
          <InputWrapper>
            <Field name="email">
              {({ field, meta }) => (
                <>
                  <EmailInput
                    id="newsletter-email"
                    type="email"
                    placeholder="Your Email"
                    component={Input}
                    outline
                    inverted
                    {...field}
                    aria-describedby={meta.error ? 'newsletter-signup-error' : null}
                    autoComplete="email"
                  />
                  {meta.error && <ErrorMsg id="newsletter-signup-error" role="alert">{meta.error}</ErrorMsg>}
                </>
              )}
            </Field>
            <Submit aria-label="submit join newsletter list" type="submit" disabled={isSubmitting}>Sign Up</Submit>
          </InputWrapper>
        </PromotionWrapper>
      </FormMain>
    )}
  </Formik>
);

NewsletterSignUp.defaultProps = {
  title: 'Inspiration in your inbox',
  submit: () => { },
  promos: {}
};

NewsletterSignUp.propTypes = {
  title: PropTypes.string,
  submit: PropTypes.func,
  promos: PropTypes.object
};

export default NewsletterSignUp;
