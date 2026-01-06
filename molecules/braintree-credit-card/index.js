import React, { useState, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { Braintree, HostedField } from 'react-braintree-fields';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import * as Sentry from '@sentry/node';
import { toast, TOAST } from '../../utils/toastify';

import GlobalTheme from '../../theme/theme';

import Typography from '../../atoms/typography';
import Button from '../../atoms/button';
import trackEvent from '../../utils/tracking';
import { logAmplitude } from '../../utils/amplitude';

const BraintreeWrapper = styled.div`
  position: relative;
  min-height: 5rem;
`;
const BraintreeForm = styled(Braintree, { shouldForwardProp: (prop) => prop !== 'isVisible' })`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
`;

const Loading = styled.span`
  bottom: 0;
  left: 0;
  opacity: 0.75;
  position: absolute;
  right: 0;
  top: 0;
  z-index: ${(props) => props.theme.layers.box};

  ${(props) => props.theme.loader()}
`;

const BrainTreeError = styled(Typography)`
  color: ${({ theme }) => theme.color.brandError};
  display: none;
  line-height: 2;
`;

const BrainTreeInput = styled(HostedField)`
  height: 4rem;
  padding: 0 1.5rem;
  background: ${GlobalTheme.color.background};
  &.braintree-hosted-fields-invalid {
    border: 0.2rem solid ${GlobalTheme.color.brandError};
  }
  &.braintree-hosted-fields-invalid + ${BrainTreeError} {
    display: block;
  }
`;

const BrainTreeLabel = styled(Typography)`
  color: ${({ theme }) => theme.color.brand};
  display: block;
`;

const BrainTreeInputWrapper = styled('div', { shouldForwardProp: (prop) => prop !== 'inputType' })`
  position: relative;

  ${({ inputType }) => inputType === 'number' && css`
    grid-area: cc;
  `}

  ${({ inputType }) => inputType === 'expirationDate' && css`
    grid-area: expiry;
  `}

  ${({ inputType }) => inputType === 'cvv' && css`
    grid-area: cvv;
  `}
`;

const FormGrid = styled.div`
  margin-bottom: 1rem;

  ${BrainTreeInputWrapper} {
    margin-bottom: 2rem;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: grid;
    grid-gap: 2rem;
    grid-template-areas: 'cc cc' 'expiry cvv';

    ${BrainTreeInputWrapper} {
      margin-bottom: 0;
    }
  }
`;

const FormButton = styled(Button)`
  margin-top: 1rem;
  outline: 0;
  width: 100%;
`;

const BrainTreeCreditCard = styled.div`
  position: absolute;
  top: 2.4rem;
  right: 1rem;
  width: 4.4rem;
  height: 2.8rem;
  background-image: url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/checkout/card-sprite.png);
  background-size: 86px 458px;
  border-radius: 4px;
  background-position: -100px 0;
  background-repeat: no-repeat;

  &.visa {
    background-position: 0 -398px;
  }

  &.master-card {
    background-position: 0 -281px;
  }

  &.american-express {
    background-position: 0 -370px;
  }

  &.discover {
    background-position: 0 -163px;
  }

  &.maestro {
    background-position: 0 -251px;
  }

  &.jcb {
    background-position: 0 -222px;
  }

  &.diners-club {
    background-position: 0 -133px;
  }
`;

const BraintreeCreditCard = (props) => {
  const [loading, setLoading] = useState(true);
  const [isBraintreeReady, setIsBraintreeReady] = useState(false);
  const [deviceData, setDeviceData] = useState(false);

  const braintreeRef = useRef();
  const cardImageEl = useRef(null);
  const cvvRef = useRef();
  let cardType = false;

  const onAuthorizationSuccess = () => {
    setIsBraintreeReady(true);
    setLoading(false);
  };

  const onDataCollectorInstanceReady = (err, dataCollectorInstance) => {
    if (!err) setDeviceData(dataCollectorInstance.deviceData);
  };

  const onCardTypeChange = (event) => {
    const element = cardImageEl.current;
    const cvvInput = cvvRef.current;
    const { isEmpty } = event.fields.number;

    // update card image type
    if (isEmpty) {
      element.classList.remove(cardType);
      cardType = false;

      return;
    }

    if (event.cards.length === 1) {
      const { type } = event.cards[0];

      if (cardType) {
        element.classList.remove(cardType);
      }

      element.classList.add(type);
      cardType = type;

      // update CVV for amex
      const cvvPlaceholder = event.cards[0].code.size === 4 ? '1234' : '123';
      cvvInput.setPlaceholder(cvvPlaceholder);
    }
  };

  const onSubmitError = (err) => {
    const { details } = err;

    if (details) {
      Object.keys(details.invalidFields).forEach((field) => {
        details.invalidFields[field].classList.add('braintree-hosted-fields-invalid');
        details.invalidFields[field].focus();
      });
    }
  };

  const handleOnBraintreeSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    logAmplitude('Submitted Checkout Payment', { cart: props.cart, method: 'Credit Card' });

    await braintreeRef.current.api.tokenize()
      .then((res) => {
        props.onSubmit(
          {
            payments_attributes: [
              {
                payment_method_id: props.cart.payment_methods.find((m) => m.name === 'Braintree').id,
                source_attributes: {
                  device_data: deviceData,
                  payment_type: res.type,
                  nonce: res.nonce
                }
              }
            ]
          },
          'confirm'
        );

        trackEvent({
          eventCategory: 'Payment',
          eventAction: 'Add Credit Card payment',
          eventLabel: 'Success'
        });
      })
      .catch((err) => {
        switch (err.code) {
          case 'HOSTED_FIELDS_FIELDS_EMPTY':
            // occurs when none of the fields are filled in
            toast('All of your payment fields are empty, please fill out the form to proceed to the next step.', { type: TOAST.TYPE.ERROR });
            break;

          case 'HOSTED_FIELDS_FIELDS_INVALID': {
            // occurs when certain fields do not pass client side validation
            const invalidFields = [];
            if (err.details.invalidFieldKeys.includes('number')) invalidFields.push('Credit Card Number');
            if (err.details.invalidFieldKeys.includes('expirationDate')) invalidFields.push('Expiration Date');
            if (err.details.invalidFieldKeys.includes('cvv')) invalidFields.push('CVV');

            if (invalidFields.length > 0) {
              if (invalidFields.length > 1) {
                const last = invalidFields.pop();
                toast(`The payment fields ${invalidFields.join(', ')} and ${last} are incorrect. Please double check that the information entered is correct before proceeding.`, { type: TOAST.TYPE.ERROR });
              } else {
                toast(`The payment field ${invalidFields[0]} is incorrect. Please double check that the information entered is correct before proceeding.`, { type: TOAST.TYPE.ERROR });
              }
            } else {
              toast('Some of your payment fields are incorrect. Please double check that the information entered is correct before proceeding.', { type: TOAST.TYPE.ERROR });
            }

            break;
          }

          case 'HOSTED_FIELDS_TOKENIZATION_FAIL_ON_DUPLICATE':
            // occurs when:
            //   * the client token used for client authorization was generated
            //     with a customer ID and the fail on duplicate payment method
            //     option is set to true
            //   * the card being tokenized has previously been vaulted (with any customer)
            // See: https://developers.braintreepayments.com/reference/request/client-token/generate/#options.fail_on_duplicate_payment_method
            toast('You have tried to save a payment method which already exists in your account. Please check your information to ensure this was the action you wanted to take.', { type: TOAST.TYPE.ERROR });
            break;

          case 'HOSTED_FIELDS_TOKENIZATION_CVV_VERIFICATION_FAILED':
            // occurs when:
            //   * the client token used for client authorization was generated
            //     with a customer ID and the verify card option is set to true
            //     and you have credit card verification turned on in the Braintree
            //     control panel
            //   * the cvv does not pass verfication (https://developers.braintreepayments.com/reference/general/testing/#avs-and-cvv/cid-responses)
            // See: https://developers.braintreepayments.com/reference/request/client-token/generate/#options.verify_card
            toast('The CVV field on your credit card is incorrect. Please double check the information before proceeding.', { type: TOAST.TYPE.ERROR });
            break;

          case 'HOSTED_FIELDS_FAILED_TOKENIZATION':
            // occurs for any other tokenization error on the server
            toast(
              <>
                There appears to be a problem verifying your credit card.
                Our engineering team has been notified and are looking into the issue.
                In the meantime, please contact Maisonette Customer Care for help in
                completing this order at
                <a href="tel:+18446247663">1 844 MAISONETTE</a>
              </>, { type: TOAST.TYPE.ERROR }
            );
            break;

          case 'HOSTED_FIELDS_TOKENIZATION_NETWORK_ERROR':
            // occurs when the Braintree gateway cannot be contacted
            toast(
              <>
                There appears to be a problem verifying your credit card.
                Our engineering team has been notified and are looking into the issue.
                In the meantime, please contact Maisonette Customer Care for help in
                completing this order at
                <a href="tel:+18446247663">1 844 MAISONETTE</a>
              </>, { type: TOAST.TYPE.ERROR }
            );
            break;

          default:
            toast(
              <>
                Were sorry but there appears to be an issue completing your order.
                Please reload this page and try again. If you continue having issues,
                please contact Maisonette Customer Care for help in completing this order at
                <a href="tel:+18446247663">1 844 MAISONETTE</a>
              </>, { type: TOAST.TYPE.ERROR }
            );
        }

        trackEvent({
          eventCategory: 'Payment',
          eventAction: 'Add Credit Card payment',
          eventLabel: 'Failure'
        });

        Sentry.captureException(err);

        setLoading(false);
      });
  };

  return (
    <>
      <BraintreeWrapper>
        {loading && <Loading />}
        <BraintreeForm
          isVisible={!loading}
          className={isBraintreeReady ? '' : 'disabled'}
          authorization={props.token}
          onAuthorizationSuccess={onAuthorizationSuccess}
          onDataCollectorInstanceReady={onDataCollectorInstanceReady}
          onCardTypeChange={onCardTypeChange}
          onError={onSubmitError}
          ref={braintreeRef}
          styles={{
            input: {
              'font-size': '12px',
              'font-family': GlobalTheme.font.sans,
              color: GlobalTheme.color.brand
            },
            'input.invalid': {
              color: GlobalTheme.color.brandError
            },
            '::-webkit-input-placeholder': {
              color: GlobalTheme.color.brandLight
            },
            ':-moz-placeholder': {
              color: GlobalTheme.color.brandLight
            },
            '::-moz-placeholder': {
              color: GlobalTheme.color.brandLight
            },
            ':-ms-input-placeholder': {
              color: GlobalTheme.color.brandLight
            }
          }}
        >
          <FormGrid>
            <BrainTreeInputWrapper inputType="number">
              <BrainTreeLabel element="label" like="dec-1">Credit Card Number (Required)</BrainTreeLabel>
              <BrainTreeInput placeholder="1111 1111 1111 1111" type="number" aria-describedby="cc-error" />
              <BrainTreeError id="cc-error" role="alert" element="span" like="dec-1">Please enter a valid credit card number</BrainTreeError>
              <BrainTreeCreditCard ref={cardImageEl} />
            </BrainTreeInputWrapper>

            <BrainTreeInputWrapper inputType="expirationDate">
              <BrainTreeLabel element="label" like="dec-1">Expiration Date (Required)</BrainTreeLabel>
              <BrainTreeInput placeholder="mm / yyyy" type="expirationDate" aria-describedby="exp-date-error" />
              <BrainTreeError id="exp-date-error" role="alert" element="span" like="dec-1">Please enter a valid expiration date</BrainTreeError>
            </BrainTreeInputWrapper>

            <BrainTreeInputWrapper inputType="cvv">
              <BrainTreeLabel element="label" like="dec-1">CVV (Required)</BrainTreeLabel>
              <BrainTreeInput placeholder="123" type="cvv" ref={cvvRef} aria-describedby="cvv-error" />
              <BrainTreeError id="cvv-error" role="alert" element="span" like="dec-1">Please enter a valid security code</BrainTreeError>
            </BrainTreeInputWrapper>
          </FormGrid>
        </BraintreeForm>
      </BraintreeWrapper>

      <FormButton data-test-id="payment-submit" type="submit" disabled={loading} onClick={handleOnBraintreeSubmit}>Review Order</FormButton>
    </>
  );
};

BraintreeCreditCard.propTypes = {
  cart: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  cart: state.cart
});

const mapDispatchToProps = () => ({});

const ConnectedBraintreeCreditCard = connect(
  mapStateToProps, mapDispatchToProps
)(memo(BraintreeCreditCard));

BraintreeCreditCard.displayName = 'BraintreeCreditCard';

export default ConnectedBraintreeCreditCard;
