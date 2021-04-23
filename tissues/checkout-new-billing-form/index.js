import React, { useEffect, useState, useRef } from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { Form as formikForm, Formik } from 'formik';
import * as Sentry from '@sentry/node';
import { toast, TOAST } from '../../utils/toastify';

import { updateCheckout, getCart } from '../../pages/api';
import { updateCart } from '../../store/modules/cart/actions';
import { toggleCartModalVisibility } from '../../store/modules/interfaces/actions';
import { setUserProfile } from '../../store/modules/profile/actions';
import BraintreeCreditCardNew from '../../molecules/braintree-credit-card-new';
import Button from '../../atoms/button';

import PaymentMethodRadio from '../../molecules/payment-method-radio';
import StoreCreditCheckout from '../../molecules/store-credit-checkbox';
import BillingStep from '../checkout-new-billing-address';
import Typography from '../../atoms/typography';

import removeSearchRecursive from '../../utils/removeSearchRecursive';
import { logAmplitude } from '../../utils/amplitude';
import getCartAfterError from '../../utils/getCartAfterError';

const Loading = styled.div`
  background-color: ${(props) => props.theme.color.background};
  bottom: 0;
  left: 0;
  opacity: 0.75;
  position: fixed;
  right: 0;
  top: 0;
  visibility: visible;
  z-index: ${(props) => props.theme.layers.balcony};
  ${(props) => props.theme.loader()}
`;

// TODO: make SVG?
const PlusSign = styled.div`
  display:inline-block;
  margin-right: 1rem;
  width: ${(props) => props.theme.modularScale.small};
  height: ${(props) => props.theme.modularScale.small};
  background:
    linear-gradient(
      #2F4DA1,
      #2F4DA1),
    linear-gradient(
      #2F4DA1,

      #2F4DA1);
  background-position:center;
  background-size: 16.14px 2px,2px 16.14px;
  background-repeat:no-repeat;
`;

const SectionHeading = styled(Typography)`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const CCWrapper = styled.div`
  display: grid;
  grid-gap: 6.4rem;
  grid-template-areas: 'inputs'
                       'billing'
                       'buttons';
  font-family: ${(props) => props.theme.font.sans};
  margin-bottom: 6.4rem;
`;

const CCSection = styled.div`
  grid-area: inputs;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  margin-bottom: ${(props) => props.theme.modularScale.xlarge};


  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SectionWrapper = styled.div``;

const AddNewCard = styled(Button)`
  font-family: ${(props) => props.theme.font.sans};
  display: flex;
  font-size: ${(props) => props.theme.modularScale.sixteen};
  align-items: center;
  text-align: left;
  line-height: normal;
`;

const Form = styled(formikForm)`
  display: grid;
  grid-gap: 3rem;
`;

const FormWrapper = styled.div`
  display: grid;
  grid-gap: ${({ theme }) => theme.modularScale.sixtyFour};
  grid-area: billing;
`;

const AddPaymentButton = styled(Button)`
  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    width: calc(65% - 0.5rem);
  }
`;

const ButtonWrapper = styled.div`
  display: grid;

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    width: 50%;
  }
`;

const getUserSavedCC = (paymentSources) => paymentSources?.filter?.((payment) => payment?.source?.payment_type === 'CreditCard');

const CheckoutAddress = (props) => {
  // TODO: refactor into organism - too much logic here
  const [loading, setLoading] = useState(true);
  const [deviceData, setDeviceData] = useState(false);
  const [ccFormTouched, setCCFormTouched] = useState();
  const [ccFormLoading, setCCFormLoading] = useState(true);
  const [allInputsHaveValues, setAllInputsHaveValues] = useState(true);
  const braintreeCCRef = useRef();

  useEffect(() => {
    if (!props.user.loading) {
      setLoading(false);
    }
  }, [props.user.loading]);

  const useBilling = () =>
  // the cart address id's will be the same if the user selects 'same as shipping'
       props.cart?.ship_address?.id === props.cart?.bill_address?.id;

  // see onSubmit in Formik component below for details about 'search' keys
  const DEFAULT_BILLING_ADDRESS_OBJECT = {
    first_name: { search: '' },
    last_name: { search: '' },
    address1: { search: '' },
    address2: { search: '' },
    city: { search: '' },
    zipcode: { search: '' },
    phone: { search: '' },
    country_iso: { search: '' },
    state_name: { search: '' }
  };

  const getDefaultAddress = () => {
    const { cart } = props;

    // if guest user with previously filled in address or paypal/apple pay address
    // or logged in user deletes all of their addresses while using same cart
    if (cart?.bill_address && !useBilling()) {
      // see onSubmit in Formik component below for details about 'search' keys
      return {
        first_name: { search: cart.bill_address.firstname },
        last_name: { search: cart.bill_address.lastname },
        address1: { search: cart.bill_address.address1 },
        address2: { search: cart.bill_address.address2 },
        city: { search: cart.bill_address.city },
        zipcode: { search: cart.bill_address.zipcode },
        phone: { search: cart.bill_address.phone },
        country_iso: { search: cart.bill_address.country_iso },
        state_name: { search: cart.bill_address.state_text }
      };
    }

    return DEFAULT_BILLING_ADDRESS_OBJECT;
  };

  const checkAddressErrors = (response, billing) => {
    const errors = response.errors.filter(({ message }) =>
      message && message !== 'The order could not be transitioned. Please fix the errors and try again.');

    errors.forEach(({ message = null }) => {
      if (typeof message === 'string') {
        toast(
          message, {
            type: TOAST.TYPE.ERROR,
            onClose: () => {
              if (message === 'Order can’t be advanced because the inventory for an item in your cart is 0.') {
                props.toggleCart(true);
              }
            }
          }
        );

        logAmplitude('Encountered Transaction Error', {
          message,
          step: 'payment'
        });
      }
    });

    Sentry.withScope((scope) => {
      scope.setLevel(Sentry.Severity.Info);

      response.errors.forEach((error) => {
        Object.keys(error).forEach((key) => {
          scope.setExtra(key, error[key]);
        });
      });

      scope.setExtra('billing', billing);

      const addressError = new global.window.Error('Add address failure');
      Sentry.captureException(addressError);
    });

    getCart({ order_number: props.cart.number })
      .then((cartRes) => {
        const cartResData = cartRes?.data ?? cartRes;
        props.setLoading(false);
        if (cartResData.errors) return;
        props.updateCart(cartResData);
      });
  };

  const submitCCPayment = (braintreeRes) => {
    const order = {
      order: {
        payments_attributes: [
          {
            payment_method_id: props.cart.payment_methods.find((m) => m.name === 'Braintree').id,
            source_attributes: {
              device_data: deviceData,
              payment_type: braintreeRes.type,
              nonce: braintreeRes.nonce
            }
          }
        ]
      }
    };

    return updateCheckout({ id: props.cart.number, body: order, hold_state: true });
  };

  const callBraintreeCC = async (current) => {
    logAmplitude('Submitted Checkout Payment', { cart: props.cart, method: 'Credit Card' });

    return current.api.tokenize()
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
        props.setLoading(false);
      });
  };

  const submitSavedCard = () => {
    logAmplitude('Submitted Checkout Payment', {
      cart: props.cart,
      types: props.user.payment_sources?.find(
        (p) => p.id === +props.paymentSource)?.source?.payment_type
    });

    const body = {
      order: {
        payments_attributes: [{
          payment_method_id: props.cart.payment_methods.find((m) => m.name === 'Braintree').id,
          source_attributes: {
            wallet_payment_source_id: +props.paymentSource
          }
        }]
      }
    };

    return updateCheckout({ id: props.cart.number, body, hold_state: true });
  };

  const submitBillingAddress = (values) => {
    // Clear out the "search" object from the values for the TEC-1780 Safari hack
    // first iterate through each object until you find a "search" key
    // then take that value and assign it as the value to the parents key
    const v = removeSearchRecursive(JSON.parse(JSON.stringify(values)));
    const billing = v.billing[0];

    const request = {
      use_billing: billing.use_billing
    };

    if (!billing.use_billing) {
      request.bill_address_attributes = typeof billing.bill_address_attributes === 'string'
                      && props.user.addresses
                        .find((a) => a.id === +billing.bill_address_attributes) !== undefined
        ? (({ country, state, ...address }) => (address))(
          props.user.addresses.find((x) => x.id === +billing.bill_address_attributes)
        ) : billing.bill_address_attributes;
    }

    logAmplitude('Submitted Checkout Address', { cart: props.cart });

    return updateCheckout({
      id: props.cart.number,
      body: { order: request },
      hold_state: true
    });
  };

  // guest or registered user with no saved CCs
  const userHasNoSavedCC = !props.user?.id
    || getUserSavedCC(props.user?.payment_sources)?.length === 0;

  const disableSubmit = () =>
    // braintree cc loading
    (userHasNoSavedCC && ccFormLoading)
    // guest or registered user with no saved CCs, empty inputs - no CC payment (empty form)
    // or inputs touched (pre filled place holders removed - form is empty)
    || (userHasNoSavedCC && !allInputsHaveValues && (!props.ccPayment || ccFormTouched))
    // registered user with saved cards, but no selected payment source
    || (!userHasNoSavedCC && (props.user.id && !props.paymentSource));

  if (loading) return <Loading />;

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          billing: [{
            use_billing: useBilling(),
            bill_address_attributes: getDefaultAddress()
          }]
        }}

        onSubmit={async (values) => {
          props.setLoading(true);
          const { current } = braintreeCCRef;
          let paymentType;
          const updatedFormOrNoCCPayment = !props.ccPayment || (props.ccPayment && ccFormTouched);

          if (!userHasNoSavedCC && props.newCardID !== props.paymentSource) {
            // registered user who is using a saved payment
            paymentType = 'saved';
          }

          if (userHasNoSavedCC && updatedFormOrNoCCPayment && !props.isCoveredByStoreCredit) {
            // guest user or registered user without saved CCs
            // who has not already submitted a payment
            // or has submitted a card, but has touched the CC form
            // and the order total is not covered by store credit
            paymentType = 'new';
          }

          await submitBillingAddress(values).then(async (addressRes) => {
            if (addressRes.errors?.length > 0) {
              checkAddressErrors(addressRes, values.billing[0]);
            }

            if (!paymentType) {
              // handles when a user returns to the payment page after submitting a CC.
              // // guest or registered user without saved CC did not try to update the CC input
              // // registered user with saved CCs did not select a different saved CC
              // Or when the entire order is covered by store credit
              // // we show disabled radios and CC inputs in this case, but still want to submit
              // // billing address changes
              Router.push('/checkout').then(() => props.setLoading(false));
            }

            if (paymentType === 'new') {
              if (current) {
                await callBraintreeCC(current).then(async (braintreeRes) => {
                  if (braintreeRes) {
                    await submitCCPayment(braintreeRes).then((paymentRes) => {
                      const paymentResData = paymentRes?.data ?? paymentRes;

                      if (paymentResData?.errors?.length > 0) {
                        props.setLoading(false);
                        paymentResData.errors.forEach(({ message = false }) => {
                          if (message) {
                            toast(message, { type: TOAST.TYPE.ERROR });
                            logAmplitude('Encountered Transaction Error', {
                              message,
                              step: 'payment'
                            });
                          }
                        });

                        getCartAfterError()
                          .then((cartRes) => {
                            const cartResData = cartRes?.data ?? cartRes;
                            props.updateCart(cartResData);
                          });
                      } else {
                        Router.push('/checkout').then(() => props.setLoading(false));
                      }
                    });
                  }
                });
              } else {
                props.setLoading(false);
              }
            }

            if (paymentType === 'saved') {
              await submitSavedCard().then((savedCardRes) => {
                const savedCardResData = savedCardRes?.data ?? savedCardRes;

                if (savedCardResData?.errors?.length > 0) {
                  props.setLoading(false);
                  savedCardResData.errors.forEach(({ message = false }) => {
                    if (message) {
                      toast(message, { type: TOAST.TYPE.ERROR });
                      logAmplitude('Encountered Transaction Error', {
                        message,
                        step: 'payment'
                      });
                    }
                  });

                  getCartAfterError()
                    .then((cartRes) => {
                      const cartResData = cartRes?.data ?? cartRes;
                      props.updateCart(cartResData);
                    });
                  return;
                }

                Router.push('/checkout').then(() => props.setLoading(false));
              });
            }
          });
        }}
      >
        {({
          values,
          isSubmitting,
          setFieldValue
        }) => (
          <Form id="billing">
            {isSubmitting && <Loading />}
            <CCWrapper>
              {
                  userHasNoSavedCC && (
                    <BraintreeCreditCardNew
                      token={process.env.NEXT_PUBLIC_BRAINTREE_TOKEN}
                      ref={braintreeCCRef}
                      setDeviceData={setDeviceData}
                      ccPayment={props.ccPayment}
                      setCCFormTouched={setCCFormTouched}
                      setCCFormLoading={setCCFormLoading}
                      setAllInputsHaveValues={setAllInputsHaveValues}
                      disabled={props.isCoveredByStoreCredit}
                    />
                  )
              }
              {
                props.user.id && (
                  <SectionWrapper>
                    <CCSection>
                      { props.user?.loading && <Loading /> }
                      {
                        !props.user?.loading
                          && !userHasNoSavedCC
                          && props.ccPayment && props.newCardID && (
                          // if registered user adds a new card
                          // which is not saved yet
                          // but has other saved cards
                          <PaymentMethodRadio
                            payment={props.ccPayment}
                            paymentSource={props.paymentSource}
                            setPaymentSource={props.setPaymentSource}
                            newCard
                            disabled={props.isCoveredByStoreCredit}
                          />
                        )
                      }
                      {
                        props.user?.payment_sources
                          && getUserSavedCC(props.user.payment_sources)
                            .map((source) => (
                              // users's saved cards
                              <PaymentMethodRadio
                                key={source.id}
                                payment={source}
                                paymentSource={props.paymentSource}
                                setPaymentSource={props.setPaymentSource}
                                handleOnCardDelete={props.handleOnCardDelete}
                                disabled={props.isCoveredByStoreCredit}
                              />
                            ))
                      }
                    </CCSection>
                    {
                      !props.user?.loading
                        && !userHasNoSavedCC && !props.isCoveredByStoreCredit && (
                        // should only render when registered user
                        // has saved cards
                        <AddNewCard
                          styledLikeLink
                          onClick={props.showCardFields}
                        >
                          <PlusSign />
                          Add new card
                        </AddNewCard>
                      )
                    }
                  </SectionWrapper>
                )
              }
              <FormWrapper>
                {
                  // store credit lives in two places at the moment for design reasons
                  // also in tissues/payment-options-section
                  // could be likely be refactored to be placed with CSS
                  +props.cart.total_applicable_store_credit > 0 && (
                    <SectionWrapper>
                      <SectionHeading element="h2" like="dec-1">Store credit</SectionHeading>

                      <StoreCreditCheckout
                        updateUseStoreCredit={props.updateUseStoreCredit}
                        applicableStoreCredit={props.cart?.total_applicable_store_credit}
                        availableStoreCredit={props.cart?.display_total_available_store_credit}
                        useStoreCredit={props.cart?.use_store_credits}
                      />
                    </SectionWrapper>
                  )
                }
                <SectionWrapper>
                  <BillingStep
                    setFieldValue={setFieldValue}
                    name="billing"
                    values={values}
                    isSubmitting={isSubmitting}
                  />
                </SectionWrapper>
              </FormWrapper>
              <ButtonWrapper>
                <AddPaymentButton
                  data-test-id="payment-submit"
                  type="submit"
                  disabled={
                    loading
                    || isSubmitting
                    || (disableSubmit() && !props.isCoveredByStoreCredit)
                  }
                >
                  Add payment
                </AddPaymentButton>
              </ButtonWrapper>
            </CCWrapper>
          </Form>
        )}
      </Formik>
    </>
  );
};

CheckoutAddress.defaultProps = {
  updateUseStoreCredit: () => {},
  setPaymentSource: () => {},
  paymentSource: 0,
  ccPayment: false,
  newCardID: 0,
  isCoveredByStoreCredit: false
};

CheckoutAddress.propTypes = {
  cart: PropTypes.object.isRequired,
  updateCart: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  toggleCart: PropTypes.func.isRequired,
  updateUseStoreCredit: PropTypes.func,
  setPaymentSource: PropTypes.func,
  paymentSource: PropTypes.number,
  showCardFields: PropTypes.func.isRequired,
  handleOnCardDelete: PropTypes.func.isRequired,
  ccPayment: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool
  ]),
  newCardID: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool
  ]),
  setLoading: PropTypes.func.isRequired,
  isCoveredByStoreCredit: PropTypes.bool
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  user: state.profile
});

const mapDispatchToProps = (dispatch) => ({
  updateCart: (cart) => dispatch(updateCart(cart)),
  setUserProfile: (user) => dispatch(setUserProfile(user)),
  toggleCart: (flag) => dispatch(toggleCartModalVisibility(flag))
});

const ConnectedCheckoutAddress = connect(mapStateToProps, mapDispatchToProps)(CheckoutAddress);

export default ConnectedCheckoutAddress;
