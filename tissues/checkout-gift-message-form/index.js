import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Router from 'next/router';
import { css } from '@emotion/core';
import * as Yup from 'yup';
import { Formik, Field, Form as FormikForm } from 'formik';
import * as Sentry from '@sentry/node';
import { toast, TOAST } from '../../utils/toastify';
import { logAmplitude } from '../../utils/amplitude';

import Typography from '../../atoms/typography';
import Button from '../../atoms/button';
import { updateCheckout } from '../../pages/api';
import Icon from '../../atoms/icon-cross';

const Wrapper = styled.div`
    display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.color.brand};

  input, textarea {
    background: ${(props) => props.theme.color.backgroundLightBlue};
    color: ${(props) => props.theme.color.brand};
    font-family: ${(props) => props.theme.font.sans};
    border: 1px solid ${(props) => props.theme.color.brandLightBlue};
    font-size: 1.8rem;
    padding: 1rem 1.5rem;
    width: 100%;
  }


  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    grid-area: form;
  }
`;

const Heading = styled(Typography)`
  font-size: 2.4rem;
`;

const Label = styled(Typography)`
  margin: ${(props) => props.theme.modularScale.large} 0 1rem;
`;

const Form = styled(FormikForm)`
  display: flex;
  flex-direction: column;
`;

const EmailInput = styled(Field)`
  height: 4.5rem;
`;

const InputErrorWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    width: 50%;
  }

  ${(props) => props.error && css`
    input {
      border-color: ${props.theme.color.redError};
    }
  `}
`;

const Error = styled(Typography)`
  position: absolute;
  top: 4.5rem;
  color: ${(props) => props.theme.color.redError};
  font-size: 1.4rem;
`;

const MessageInput = styled(Field)`
  height: 14rem;
  resize: vertical;
`;

const AddMessageButton = styled(Button)`

@media (min-width: ${(props) => props.theme.breakpoint.medium}) {
  width: calc(65% - 0.5rem);
}
`;

const LimitText = styled(Typography)`
  margin-left: auto;
`;

const ButtonWrapper = styled.div`
  display: grid;
  margin-top: ${(props) => props.theme.modularScale.sixtyFour};

  button, a {
    font-size: 1.4rem;
    padding: 0;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    width: 35%;
  }
`;

const GiftReceiptMessage = styled(Typography)``;

const RemoveGiftButton = styled(Button)`
  display: flex;
  justify-content: flex-start;
  border: none;
  font-family: ${(props) => props.theme.font.sans};
  color: ${(props) => props.theme.color.redError};
  text-align: left;
  align-items: center;
  padding: 0;
  font-size: ${(props) => props.theme.modularScale.sixteen};
  line-height: normal;
  margin: ${(props) => props.theme.modularScale.thirtyTwo} 0 0;

  svg {
    height: ${(props) => props.theme.modularScale.small};
    width: ${(props) => props.theme.modularScale.small};
    margin-right: 1rem;
    stroke-width: 20;
    stroke: ${(props) => props.theme.color.redError};
  }
`;

const CheckoutGiftMessageForm = (props) => {
  const getRemainingCharacters = (giftMessage) => {
    const LIMIT = 500;
    const { length } = giftMessage;
    const difference = LIMIT - length;
    return difference;
  };

  const submitGift = async (values) => {
    props.setLoading(true);
    // only log even when adding - not when editing
    if (!props.isGift) logAmplitude('Submitted Gift Message', { removed_gift_message: false });

    const order = values;

    await updateCheckout({ id: props.cartNumber, body: { order }, hold_state: true })
      .then((res) => {
        const resData = res?.data ?? res;
        if (resData?.errors && resData.errors?.length > 0) {
          props.setLoading(false);
          resData.errors.forEach(({ message = null }) => {
            if (typeof message === 'string') {
              toast(message, { type: TOAST.TYPE.ERROR });
              logAmplitude('Encountered Transaction Error', {
                message,
                step: props.cartState
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

            scope.setExtra('is_gift', values.is_gift);
            scope.setExtra('gift_email', values.gift_email);
            scope.setExtra('gift_message', values.gift_message);

            const giftError = new global.window.Error('Add checkout gift info failure');
            Sentry.captureException(giftError);
          });
        } else {
          props.updateCart(resData);
          Router.push('/checkout').then(() => props.setLoading(false));
        }
      });
  };

  const removeGift = async () => {
    props.setLoading(true);
    logAmplitude('Submitted Gift Message', { removed_gift_message: true });

    const order = {
      is_gift: false
    };

    await updateCheckout({ id: props.cartNumber, body: { order }, hold_state: true })
      .then((res) => {
        const resData = res?.data ?? res;
        if (resData?.errors && resData.errors?.length > 0) {
          props.setLoading(false);
          resData.errors.forEach(({ message = null }) => {
            if (typeof message === 'string') {
              toast(message, { type: TOAST.TYPE.ERROR });
              logAmplitude('Encountered Transaction Error', {
                message,
                step: props.cartState
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

            scope.setExtra('is_gift', false);

            const giftError = new global.window.Error('Remove checkout gift info failure');
            Sentry.captureException(giftError);
          });
        } else {
          props.updateCart(resData);
          Router.push('/checkout').then(() => props.setLoading(false));
        }
      });
  };

  return (
    <Wrapper>
      <Heading element="h1" like="heading-2">Gift message</Heading>
      <GiftReceiptMessage element="span" like="dec-2">* all shipments will be shipped with gift receipts</GiftReceiptMessage>
      <Formik
        initialValues={{
          is_gift: true,
          gift_email: props.recipient ?? '',
          gift_message: props.message ?? ''
        }}

        onSubmit={(values) => submitGift(values)}

        validationSchema={
          Yup.object().shape({
            gift_email: Yup.string().email('Please enter a valid Email Address')
          })
        }
      >
        {({
          values,
          isSubmitting,
          errors
        }) => (
          <Form id="gift-message">
            <Label htmlFor="gift-message-email-input" element="label" like="dec-2">Recipient email</Label>
            <InputErrorWrapper
              error={errors.gift_email}
            >
              <EmailInput
                name="gift_email"
                id="gift-message-email-input"
                type="email"
                autoComplete="email"
              />

              {
                errors.gift_email && <Error element="span" like="dec-2" role="alert">{errors.gift_email}</Error>
              }
            </InputErrorWrapper>

            <Label htmlFor="gift-message-text-area" element="label" like="dec-2">Message</Label>

            <MessageInput
              as="textarea"
              name="gift_message"
              id="gift-message-text-area"
              maxLength="500"
            />

            <LimitText element="span" like="dec-2">{`${getRemainingCharacters(values.gift_message)} characters left`}</LimitText>

            {
              props.isGift && (
                <RemoveGiftButton
                  styledLikeLink
                  onClick={removeGift}
                >
                  <Icon />
                  Remove gift message
                </RemoveGiftButton>
              )
            }

            <ButtonWrapper>
              <AddMessageButton
                type="submit"
                text={`${props.isGift ? 'Edit' : 'Add'} gift message`}
                disabled={
                  isSubmitting
                  || !!errors.gift_email
                  || !values.gift_email
                  || !values.gift_message
                }
                data-test-id="add-gift-message-btn"
              />
            </ButtonWrapper>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

CheckoutGiftMessageForm.defaultProps = {
  isGift: false,
  recipient: '',
  message: '',
  updateCart: () => { },
  setLoading: () => { }
};

CheckoutGiftMessageForm.propTypes = {
  isGift: PropTypes.bool,
  recipient: PropTypes.string,
  message: PropTypes.string,
  cartNumber: PropTypes.string.isRequired,
  cartState: PropTypes.string.isRequired,
  updateCart: PropTypes.func,
  setLoading: PropTypes.func
};

export default CheckoutGiftMessageForm;
