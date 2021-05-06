import React, {
  useState, useRef, memo, forwardRef, useEffect
} from 'react';
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
import { logAmplitude } from '../../utils/amplitude';

const BraintreeWrapper = styled.div`
  position: relative;
  grid-area: inputs;
  min-height: 5rem;
  margin-bottom: ${(props) => props.theme.modularScale.sixtyFour};

  .disabled {
    opacity: 0.5;
  }
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
  position: absolute;
  color: ${({ theme }) => theme.color.redError};
  display: none;
  line-height: 2;
`;

const BrainTreeInput = styled(HostedField)`
  height: 4.5rem;
  padding: 1.2rem 1.6rem;
  background: ${GlobalTheme.color.backgroundLightBlue};
  border: 1px solid ${(props) => props.theme.color.brand};

  &.braintree-hosted-fields-invalid {
    border: 0.2rem solid ${GlobalTheme.color.redError};
  }
  &.braintree-hosted-fields-invalid + ${BrainTreeError} {
    display: block;
    font-size: 1.6rem;
  }
`;

const BrainTreeLabel = styled(Typography)`
  color: ${({ theme }) => theme.color.brand};
  font-size: 1.8rem;
  margin-bottom: 1rem;
  display: block;
`;

const BrainTreeInputWrapper = styled('div', { shouldForwardProp: (prop) => prop !== 'inputType' })`
  position: relative;

  ${({ inputType }) => inputType === 'number' && css`
    grid-column: 1 / 3;
  `}

  ${({ inputType }) => inputType === 'expirationDate' && css`
    grid-column: 1;
  `}

  ${({ inputType }) => inputType === 'cvv' && css`
    grid-column: 2;
  `}
`;

const FormGrid = styled.div`
  display: grid;
  grid-gap: 3rem;
  grid-template-columns: repeat(2, 1fr);

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: flex;

    ${BrainTreeInputWrapper} {
      width: calc(25% - 0.5rem);

      :first-of-type {
          width: calc(50% - 0.5rem);
      }
    }
  }
`;

const BrainTreeCreditCard = styled.div`
  position: absolute;
  top: 4.5rem;
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

const AddPaymentButton = styled(Button)`
  width: calc(65% - 0.5rem);
`;

const CancelButton = styled(Button)`
  width: calc(35% - 0.5rem);
  text-align: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  button, a {
    font-size: 1.4rem;
    padding: 0;
  }

  > div {
    width: calc(65% - 0.5rem);
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    width: 50%;
  }
`;

const BraintreeCreditCard = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(true);
  const [isBraintreeReady, setIsBraintreeReady] = useState(false);
  const [deviceData, setDeviceData] = useState(false);
  // brain tree components do not have a built in dirty/touched state
  // need to make our own to disable submit button here and in BillingForm
  const [numberHasValue, setNumberHasValue] = useState(false);
  const [expirationDateHasValue, setExpirationDateHasValue] = useState(false);
  const [cvvHasValue, setCVVHasValue] = useState(false);
  const allInputsHaveValues = () => numberHasValue && expirationDateHasValue && cvvHasValue;

  // braintreeRef used for adding new cards to registered users
  // uses passed in ref otherwise
  const braintreeRef = useRef();
  const numberRef = useRef(null);
  const expRef = useRef(null);
  const cvvRef = useRef(null);
  const cardImageEl = useRef(null);
  let cardType = false;

  const cardTypeMap = {
    'American Express': 'american-express',
    MasterCard: 'master-card',
    Visa: 'visa',
    Discover: 'discover'
  };

  // this component is called in the BillingForm (for guest users) component
  // // as well as CheckoutNewCardFields (for registered users)

  useEffect(() => {
    // set the cardType for the card number input
    // if there is already a CC payment
    if (props.ccPayment) {
      const { source } = props.ccPayment;
      // set card image
      // image will be changed via onCardTypeChange when user interacts with input
      const imageElement = cardImageEl.current;
      cardType = cardTypeMap[source.cc_type] ?? false;
      imageElement.classList.add(cardType);
    }
  }, []);

  useEffect(() => {
    if (isBraintreeReady) {
      const fieldTypes = ['number', 'expirationDate', 'cvv'];
      const attribute = 'disabled';
      const method = props.disabled ? 'setAttribute' : 'removeAttribute';
      // for disabling the CC form inputs.
      // have to access braintree api through component ref
      // then either add or remove 'disabled' attribute
      // cannot simply add to component below because
      // the inputs are rendered in an iframe
      try {
        fieldTypes.forEach((field) => {
          // eslint-disable-next-line no-unused-expressions
          ref?.current?.api?.hostedFields?.[`${method}`]?.({
            field,
            attribute,
            ...(props.disabled && { value: true })
          });
        });
      } catch (error) { /* */ }
    }
  }, [isBraintreeReady, props.disabled]);

  useEffect(() => {
    // set value for BillingForm
    props.setAllInputsHaveValues(allInputsHaveValues());
  }, [numberHasValue, expirationDateHasValue, cvvHasValue]);

  const switchSetInputState = (emittedBy, value) => {
    switch (emittedBy) {
      case 'number':
        setNumberHasValue(value);
        break;
      case 'expirationDate':
        setExpirationDateHasValue(value);
        break;
      case 'cvv':
        setCVVHasValue(value);
        break;

      default:
    }
  };

  const handleOnEmpty = (event) => {
    // event fires when input value is removed, empty is not set initially
    const { emittedBy } = event;
    switchSetInputState(emittedBy, false);
  };

  const handleNotEmpty = (event) => {
    // fires when any input goes from no value to any value
    const { emittedBy } = event;
    switchSetInputState(emittedBy, true);

    // updates state in BillingForm to see if we should
    // disable submit button and whether to make the payment call or not
    props.setCCFormTouched(true);

    // empty placeholders when any field is not empty
    // to keep users from thinking the form is filled in with the placeholders
    // in case they try to edit and resubmit
    const numberInput = numberRef.current;
    numberInput.setPlaceholder('');

    const expInput = expRef.current;
    expInput.setPlaceholder('');

    const cvvInput = cvvRef.current;
    cvvInput.setPlaceholder('');
  };

  const disableSubmit = () => loading || !allInputsHaveValues();

  const getPlaceHolder = (inputType) => {
    // set the placeholder to mock CC information
    // allows guest users to see that they have put in a CC payment while
    // returning to the payment page
    // this gets removed when the user updates any input
    if (props.ccPayment) {
      const { source } = props.ccPayment;

      if (inputType === 'number') {
        if (source.cc_type === 'American Express') return `**** ****** *${source.last_digits}`;
        return `**** **** **** ${source.last_digits}`;
      }

      if (inputType === 'expirationDate') {
        return `${source.month} / ${source.year.substring(2)}`;
      }

      if (inputType === 'cvv') {
        if (source.cc_type === 'American Express') return '****';
        return '***';
      }
    }

    return '';
  };

  const onAuthorizationSuccess = () => {
    setIsBraintreeReady(true);
    setLoading(false);
    props.setCCFormLoading(false);
  };

  const onDataCollectorInstanceReady = (err, dataCollectorInstance) => {
    if (!err) {
      setDeviceData(dataCollectorInstance.deviceData);
      props.setDeviceData(dataCollectorInstance.deviceData);
    }
  };

  const onCardTypeChange = (event) => {
    const element = cardImageEl.current;
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
          }
        );
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

        Sentry.captureException(err);
      });
  };

  return (
    <>
      <BraintreeWrapper>
        {loading && <Loading />}
        <BraintreeForm
          id="braintree-cc-form"
          isVisible={!loading}
          className={(isBraintreeReady && !props.disabled) ? '' : 'disabled'}
          authorization={props.token}
          onAuthorizationSuccess={onAuthorizationSuccess}
          onDataCollectorInstanceReady={onDataCollectorInstanceReady}
          onCardTypeChange={onCardTypeChange}
          onError={onSubmitError}
          onEmpty={handleOnEmpty}
          onNotEmpty={handleNotEmpty}
          ref={ref ?? braintreeRef}
          styles={{
            input: {
              'font-size': '1.2rem',
              'font-family': GlobalTheme.font.sans,
              color: GlobalTheme.color.brand
            },
            'input.invalid': {
              color: GlobalTheme.color.redError
            },
            '::-webkit-input-placeholder': {
              color: GlobalTheme.color.brand
            },
            ':-moz-placeholder': {
              color: GlobalTheme.color.brand
            },
            '::-moz-placeholder': {
              color: GlobalTheme.color.brand
            },
            ':-ms-input-placeholder': {
              color: GlobalTheme.color.brand
            }
          }}
        >
          <FormGrid>
            <BrainTreeInputWrapper inputType="number">
              <BrainTreeLabel element="label" like="dec-1">Card number</BrainTreeLabel>
              <BrainTreeInput ref={numberRef} placeholder={getPlaceHolder('number')} type="number" aria-describedby="cc-error" />
              <BrainTreeError id="cc-error" role="alert" element="span" like="dec-1">Please enter a valid credit card number</BrainTreeError>
              <BrainTreeCreditCard ref={cardImageEl} />
            </BrainTreeInputWrapper>

            <BrainTreeInputWrapper inputType="expirationDate">
              <BrainTreeLabel element="label" like="dec-1">Expiration Date</BrainTreeLabel>
              <BrainTreeInput ref={expRef} placeholder={getPlaceHolder('expirationDate')} type="expirationDate" aria-describedby="exp-date-error" />
              <BrainTreeError id="exp-date-error" role="alert" element="span" like="dec-1">Please enter a valid expiration date</BrainTreeError>
            </BrainTreeInputWrapper>

            <BrainTreeInputWrapper inputType="cvv">
              <BrainTreeLabel element="label" like="dec-1">CVV</BrainTreeLabel>
              <BrainTreeInput ref={cvvRef} placeholder={getPlaceHolder('cvv')} type="cvv" aria-describedby="cvv-error" />
              <BrainTreeError id="cvv-error" role="alert" element="span" like="dec-1">Please enter a valid security code</BrainTreeError>
            </BrainTreeInputWrapper>
          </FormGrid>
        </BraintreeForm>
      </BraintreeWrapper>
      {
        props.showPaymentOptions && (
          <ButtonWrapper>
            <AddPaymentButton
              data-test-id="payment-submit"
              type="submit"
              disabled={disableSubmit()}
              onClick={handleOnBraintreeSubmit}
            >
              Add payment
            </AddPaymentButton>
            <CancelButton
              outline
              onClick={props.showPaymentOptions}
            >
              Cancel
            </CancelButton>
          </ButtonWrapper>
        )
      }
    </>
  );
});

BraintreeCreditCard.defaultProps = {
  showPaymentOptions: false,
  setAllInputsHaveValues: () => { },
  onSubmit: () => { },
  setDeviceData: () => { },
  ccPayment: false,
  setCCFormTouched: () => { },
  setCCFormLoading: () => { },
  disabled: false
};

BraintreeCreditCard.propTypes = {
  cart: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  setDeviceData: PropTypes.func,
  showPaymentOptions: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func
  ]),
  ccPayment: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]),
  setCCFormTouched: PropTypes.func,
  setCCFormLoading: PropTypes.func,
  setAllInputsHaveValues: PropTypes.func,
  disabled: PropTypes.bool
};

const mapStateToProps = (state) => ({
  cart: state.cart
});

const mapDispatchToProps = () => ({});

const ConnectedBraintreeCreditCard = connect(
  mapStateToProps, mapDispatchToProps, null, { forwardRef: true }
)(memo(BraintreeCreditCard));

BraintreeCreditCard.displayName = 'BraintreeCreditCard';

export default ConnectedBraintreeCreditCard;
