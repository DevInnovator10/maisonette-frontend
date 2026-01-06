import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import dynamic from 'next/dynamic';

import { formatMoney } from 'accounting-js';
import { toast, TOAST } from '../../utils/toastify';

import Button from '../../atoms/button';
import Checkbox from '../../atoms/checkbox';
import Typography from '../../atoms/typography';
import Radio from '../../atoms/radio';
import Select from '../../atoms/select';

import getPayment from '../../utils/getPayment';

import { updateCheckout } from '../../pages/api';
import { updateCart } from '../../store/modules/cart/actions';

import resetCheckout from '../../utils/resetCheckoutFlow';
import getCartAfterError from '../../utils/getCartAfterError';
import { logAmplitude } from '../../utils/amplitude';
import { qualifiesForAfterpay } from '../../utils/paymentMethodHelpers';

const ApplePay = dynamic(() => import('../../molecules/braintree-apple-pay'));
const BraintreePaypal = dynamic(() => import('../../molecules/braintree-paypal-checkout'));
const BraintreeCreditCard = dynamic(() => import('../../molecules/braintree-credit-card'));
const Afterpay = dynamic(() => import('../../molecules/afterpay'));

const Form = styled.form`
  grid-area: payment;
`;

const BraintreeApplePay = styled(ApplePay)``;

const HeadingWrapper = styled('div', { shouldForwardProp: (prop) => prop !== 'active' })`
  display: flex;
  margin-bottom: 3rem;
  border-bottom: 1px solid ${({ active, theme }) => (active ? theme.color.brand : theme.color.brandLight)};
  color: ${({ active, theme }) => (active ? theme.color.brand : theme.color.brandLight)};
`;

const EditStep = styled(Button)`
  line-height: 2.5rem;
  height: 2.5rem;
  border: 0;
  padding: 0;
  margin: 0 0 0 auto;
  display: flex;
  align-self: center;
  outline: 0;
  text-decoration: underline;
`;

const Step = styled(Typography)`
  width: 100%;
`;

const FormWrapper = styled('div', { shouldForwardProp: (prop) => prop !== 'active' })`
  display: ${({ active }) => (active ? 'block' : 'none')};
`;

const PaymentLabel = styled(Typography)`
  color: ${({ theme }) => theme.color.brand};
  letter-spacing: 0.2em;
  line-height: 2rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
`;

const PaymentSummary = styled(Typography)`
  color: ${({ theme }) => theme.color.brandLight};
`;

const CompleteWrapper = styled.div`
  margin: 3rem 0;

  ${PaymentLabel} {
    color: ${({ theme }) => theme.color.brandLight};
  }
`;

const ThirdPartyMessagesWrapper = styled.div`
  padding-left: ${({ theme }) => theme.modularScale.large};

  afterpay-placement {
    font-family: Helvetica, Arial, sans-serif;
    color: ${({ theme }) => theme.color.black};
    margin-block-start: 0;
    margin-block-end: 0;
  }
`;

const CardImage = styled.img`
  height: 2.5rem;
  width: ${(props) => (props.isApplePay ? 'auto' : '3.5rem')};
  margin-left: 1rem;
`;

const AfterpayImage = styled.img`
  max-height: 1.5rem;
  width: auto;
  margin-left: 1rem;
`;

const PaymentOption = styled(Radio)`
  align-items: center;
  display: flex;
  outline: 0;
  padding-top: 1rem;
  padding-bottom: 1rem;
  color: ${(props) => props.theme.color.brand};

  ::before {
    top: 1.7rem;
    border-color: ${(props) => props.theme.color.brand};
  }

  ::after {
    top: 2rem;
  }
`;

const AfterpayPaymentOption = styled(Radio)`
  align-items: center;
  display: flex;
  outline: 0;
  padding-top: 1rem;
  padding-bottom: 1rem;
  color: ${(props) => props.theme.color.brand};

  ::before {
    top: 1.3rem;
    border-color: ${(props) => props.theme.color.brand};
  }

  ::after {
    top: 1.6rem;
  }
`;

const FormButton = styled(Button)`
  margin-top: 1rem;
  outline: 0;
  width: 100%;
`;

const CreditCard = styled.div``;

const PaymentOptions = styled.div`
  & ~ ${CreditCard} {
    margin-top: 2rem;
  }
`;

const StyledSelect = styled(Select)`
  outline: 0;
  margin-bottom: 2rem;
`;

const StoreCreditWrapper = styled.div`
  margin-bottom: 2.5rem;
`;

const AppliedStoreCredit = styled(Typography)`
  color: ${(props) => props.theme.color.brandA11yRed};
  letter-spacing: 0.2em;
  line-height: 2rem;
  margin-top: .6rem;
  text-transform: uppercase;
`;

const RemainingAmount = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin: .6rem 0 0;
`;

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

const NewCreditCard = styled(Button)`
  font-family: ${(props) => props.theme.font.sans};
  letter-spacing: normal;
  display: inline-flex;
  transition: color 200ms ${(props) => props.theme.animation.easeOutQuad};

  &:hover {
    color: ${(props) => props.theme.color.brandLight};
  }
`;

const ExistingPaymentMethod = styled.div`
  ${NewCreditCard} {
    margin-top: 3rem;
  }
`;

const ApplePayCopy = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin: ${(props) => props.theme.modularScale.small} 0 ${(props) => props.theme.modularScale.medium};
`;

const CheckoutPayment = (props) => {
  const [paymentMethod, setPaymentMethod] = useState('cc');
  const [paymentSource, setPaymentSource] = useState(props.payment_sources.find((x) => x.default)?.id?.toString() ?? '');
  const [validPayments, setValidPayments] = useState(
    props.cart.payments?.filter((payment) => payment.state === 'checkout' && payment.source_type !== 'Spree::StoreCredit') || []
  );
  const [loading, setLoading] = useState(false);
  const formEl = useRef(null);
  const supportsApplePay = () => global?.ApplePaySession;

  const handleOnPaymentMethodChange = (method) => {
    setPaymentMethod(method);

    if (method === 'cc') {
      const firstAvailableCC = props.payment_sources.find((payment_source) => (
        payment_source.source.payment_type === 'CreditCard'
      ));

      setPaymentSource(firstAvailableCC?.id ?? '');
    }
  };

  const goToConfirm = () => {
    setLoading(true);

    logAmplitude('Submitted Checkout Payment', {
      cart: props.cart,
      types: props.cart?.payments?.filter((p) => p.state === 'checkout')
        ?.map((p) => (p.source.payment_type || p?.source_type))
    });

    updateCheckout({ id: props.cart.number, hold_state: true })
      .then(async (res) => {
        const resData = res?.data ?? res;

        if (resData.errors) {
          resData.errors.forEach(({ message = false }) => {
            if (message) {
              toast(message, { type: TOAST.TYPE.ERROR });
              logAmplitude('Encountered Transaction Error', {
                message,
                step: 'payment'
              });
            }
          });

          await getCartAfterError()
            .then((cartRes) => {
              const cartResData = cartRes?.data ?? cartRes;
              props.updateCart(cartResData);
            });

          return;
        }

        props.updateCart({ ...resData, state: 'confirm' });
        if (props.address_verification && !props.isMobile && global?.window) {
          global.window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }).finally(() => setLoading(false));
  };

  const handleUseSavedCard = () => {
    setLoading(true);

    logAmplitude('Submitted Checkout Payment', {
      cart: props.cart,
      types: props.payment_sources?.find((p) => p.id === +paymentSource)?.source?.payment_type
    });

    const body = {
      order: {
        payments_attributes: [{
          payment_method_id: props.cart.payment_methods.find((m) => m.name === 'Braintree').id,
          source_attributes: {
            wallet_payment_source_id: +paymentSource
          }
        }]
      }
    };

    updateCheckout({ id: props.cart.number, body, hold_state: true })
      .then(async (res) => {
        const resData = res?.data ?? res;

        if (resData.errors) {
          resData.errors.forEach(({ message = false }) => {
            if (message) {
              toast(message, { type: TOAST.TYPE.ERROR });
              logAmplitude('Encountered Transaction Error', {
                message,
                step: 'payment'
              });
            }
          });

          await getCartAfterError()
            .then((cartRes) => {
              const cartResData = cartRes?.data ?? cartRes;
              props.updateCart(cartResData);
            });

          return;
        }

        props.updateCart({ ...resData, state: 'confirm' });
        if (props.address_verification && !props.isMobile && global?.window) {
          global.window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }).finally(() => setLoading(false));
  };

  const updateUseStoreCredit = (useStoreCredits) => {
    setLoading(true);

    const body = {
      order: { use_store_credits: useStoreCredits }
    };

    updateCheckout({ id: props.cart.number, body, hold_state: true })
      .then((res) => {
        const resData = res?.data ?? res;
        if (resData.error) {
          resetCheckout(props.cart.number, props.cart.token, props.updateCart);
          return;
        }

        props.updateCart({ ...resData, state: 'payment' });
      }).finally(() => setLoading(false));
  };

  const isPayLaterEligible = () => global?.PayPalSDK?.isFundingEligible?.('paylater');

  useEffect(() => {
    setValidPayments(
      props.cart.payments?.filter((payment) => payment.state === 'checkout' && payment.source_type !== 'Spree::StoreCredit') || []
    );
  }, [props.cart]);

  return props.completedSteps.includes('payment') || ['payment', 'confirm'].includes(props.cart.state) ? (
    <Form ref={formEl} id="payment" tabIndex="0">
      <HeadingWrapper active={props.active ? 'true' : undefined}>
        <Step role="heading" aria-level="2" element="legend" like="heading-4" step={3}>
          3. Payment
        </Step>
        {
          !props.active && (
            <EditStep
              aria-label="edit payment details"
              outline
              onClick={
                () => {
                  props.handleOnEditClick('payment');
                  props.updateCart({ ...props.cart, state: 'payment' });
                }
              }
            >
              Edit
            </EditStep>
          )
        }
      </HeadingWrapper>

      {
        !props.active && (
          <CompleteWrapper>
            <PaymentLabel element="p" like="label-1">Payment Method</PaymentLabel>
            {
              props.cart?.gift_card_total && Math.abs(+props.cart.gift_card_total) > 0 && (
                <PaymentSummary element="p" like="dec-1">
                  {`Gift Card (${formatMoney(Math.abs(+props.cart.gift_card_total))})`}
                </PaymentSummary>
              )
            }

            {
              props.cart.payments
                .filter((payment) => payment.state === 'checkout')
                .map((payment) => <PaymentSummary key={payment.id} element="p" like="dec-1">{getPayment(payment)}</PaymentSummary>)
            }
          </CompleteWrapper>
        )
      }

      {
        props.active && (
          <FormWrapper active={props.active}>

            {+props.cart?.total_applicable_store_credit > 0 && (
              <StoreCreditWrapper>
                <Checkbox
                  id="apply-store-credit"
                  name="apply-store-credit"
                  active={props.cart.use_store_credits}
                  changed={() => updateUseStoreCredit(!props.cart.use_store_credits)}
                >
                  {/* eslint-disable-next-line */}
                  Apply Store Credit ({props.cart.display_total_available_store_credit} available)
                </Checkbox>

                {props.cart.use_store_credits && (
                  <AppliedStoreCredit element="p" like="label-1">
                    {formatMoney(props.cart.total_applicable_store_credit)}
                    {' '}
                    in store credit has been deducted from your order total
                  </AppliedStoreCredit>
                )}

                {
                  props.cart.use_store_credits
                  && +props.cart.order_total_after_store_credit > 0 && (
                    <RemainingAmount element="p" like="label-1">
                      {/* eslint-disable-next-line */}
                      Select another payment method for the remaining {props.cart.display_order_total_after_store_credit}
                    </RemainingAmount>
                  )
                }
              </StoreCreditWrapper>
            )}

            {
              !props.cart?.use_store_credits || +props.cart?.order_total_after_store_credit > 0
                ? (
                  <>
                    {props.children}

                    <PaymentLabel element="p" like="label-1">Payment Method</PaymentLabel>
                    {
                      props.cart?.gift_card_total && Math.abs(+props.cart.gift_card_total) > 0 && (
                        <PaymentSummary element="p" like="dec-1">
                          {`Gift Card (${formatMoney(Math.abs(+props.cart.gift_card_total))})`}
                        </PaymentSummary>
                      )
                    }

                    {
                      validPayments.length === 0 && (
                        <>
                          <PaymentOptions>
                            <PaymentOption
                              id="payment-cc"
                              name="payment_type"
                              value="cc"
                              active={paymentMethod === 'cc'}
                              changed={() => handleOnPaymentMethodChange('cc')}
                            >
                              Credit Card
                              <CardImage alt="Amex" src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/checkout/amex.png`} />
                              <CardImage alt="Discover" src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/checkout/discover.png`} />
                              <CardImage alt="Mastercard" src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/checkout/mastercard.png`} />
                              <CardImage alt="Visa" src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/checkout/visa.png`} />
                            </PaymentOption>

                            <PaymentOption
                              id="payment-pp"
                              name="payment_type"
                              value="pp"
                              active={paymentMethod === 'pp'}
                              changed={() => handleOnPaymentMethodChange('pp')}
                            >
                              PayPal
                              <CardImage alt="Paypal" src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/checkout/paypal.png`} />
                            </PaymentOption>

                            {
                              isPayLaterEligible()
                              && (
                                <>
                                  <PaymentOption
                                    id="payment-pp-p4"
                                    name="payment_type"
                                    value="pp-p4"
                                    active={paymentMethod === 'pp-p4'}
                                    changed={() => handleOnPaymentMethodChange('pp-p4')}
                                  >
                                    Pay Later
                                    <CardImage alt="Paypal Pay Later" src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/checkout/paypal.png`} />
                                  </PaymentOption>
                                  <ThirdPartyMessagesWrapper
                                    data-pp-message
                                    data-pp-style-layout="text"
                                    data-pp-style-logo-type="none"
                                    data-pp-style-text-color="black"
                                    data-pp-style-text-align="left"
                                    data-pp-amount={props.cart?.subtotals?.order_total}
                                  />
                                </>
                              )
                            }

                            {
                              qualifiesForAfterpay(props.cart?.payment_methods) && (
                                <>
                                  <AfterpayPaymentOption
                                    id="payment-afterpay"
                                    name="payment_type"
                                    value="afterpay"
                                    active={paymentMethod === 'afterpay'}
                                    changed={() => handleOnPaymentMethodChange('afterpay')}
                                  >
                                    Afterpay
                                    <AfterpayImage alt="afterpay" src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/checkout/afterpay.png`} />
                                  </AfterpayPaymentOption>
                                  <ThirdPartyMessagesWrapper>
                                    <afterpay-placement
                                      data-locale="en_US"
                                      data-currency="USD"
                                      data-amount={props.cart?.subtotals?.order_total}
                                      data-size="xs"
                                      data-modal-link-style="learn-more-text"
                                      data-logo-type="none"
                                      data-show-with="false"
                                      data-intro-text="Pay in"
                                      data-modal-theme="white"
                                    />
                                  </ThirdPartyMessagesWrapper>
                                </>
                              )
                            }

                            {
                              supportsApplePay() && (
                                <PaymentOption
                                  id="payment-aaple-pay"
                                  name="payment_type"
                                  value="apple-pay"
                                  active={paymentMethod === 'apple-pay'}
                                  changed={() => handleOnPaymentMethodChange('apple-pay')}
                                >
                                  Apple Pay
                                  <CardImage isApplePay alt="Apple Pay" src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/checkout/apple-pay.png`} />
                                </PaymentOption>
                              )
                            }
                          </PaymentOptions>

                          {
                            paymentMethod === 'pp'
                            && (
                              <BraintreePaypal
                                id="paypal-checkout"
                                token={process.env.NEXT_PUBLIC_BRAINTREE_TOKEN}
                                fundingSource="PAYPAL"
                              />
                            )
                          }
                          {
                            paymentMethod === 'pp-p4'
                            && (
                              <BraintreePaypal
                                id="paypal-checkout"
                                token={process.env.NEXT_PUBLIC_BRAINTREE_TOKEN}
                                fundingSource="PAYLATER"
                              />
                            )
                          }
                          {
                            paymentMethod === 'afterpay'
                            && (
                              <Afterpay
                                oldCheckout
                                id="afterpay-checkout"
                              />
                            )
                          }
                          {
                            paymentMethod === 'apple-pay'
                            && (
                              <>
                                <ApplePayCopy like="dec-1" element="p">
                                  You’ll be prompted to log in with your selected
                                  payment option when you click on this button.
                                </ApplePayCopy>
                                <BraintreeApplePay
                                  token={process.env.NEXT_PUBLIC_BRAINTREE_TOKEN}
                                />
                              </>
                            )
                          }

                          {
                            paymentMethod === 'cc' && (
                              <CreditCard>
                                {
                                  props.payment_sources.length > 0 && (
                                    <StyledSelect
                                      name="checkout-existing-cc"
                                      value={paymentSource}
                                      onChange={(e) => setPaymentSource(e.target.value)}
                                      inverted
                                    >
                                      <option
                                        value=""
                                        disabled
                                      >
                                        -- Use Existing Credit Card --
                                      </option>
                                      {
                                        props.payment_sources
                                          .filter((payment) => payment.source.cc_type)
                                          .map((payment) => (
                                            <option
                                              key={`payment-source-${payment.id}`}
                                              value={payment.id}
                                            >
                                              {`${payment.source.cc_type} ending in ${payment.source.last_digits}`}
                                            </option>
                                          ))
                                      }
                                    </StyledSelect>
                                  )
                                }

                                {
                                  !paymentSource ? (
                                    <BraintreeCreditCard
                                      token={process.env.NEXT_PUBLIC_BRAINTREE_TOKEN}
                                      onSubmit={props.onSubmit}
                                    />
                                  ) : (
                                    <>
                                      <NewCreditCard
                                        data-test-id="new-credit-card"
                                        styledLikeLink
                                        type="button"
                                        onClick={() => setPaymentSource('')}
                                      >
                                        Enter new credit card
                                      </NewCreditCard>
                                      <FormButton
                                        data-test-id="payment-submit"
                                        type="button"
                                        disabled={loading || props.loading}
                                        onClick={handleUseSavedCard}
                                      >
                                        Review Order
                                      </FormButton>
                                    </>
                                  )
                                }
                              </CreditCard>
                            )
                          }
                        </>
                      )
                    }

                    {
                      validPayments.length > 0 && (
                        <ExistingPaymentMethod>
                          {
                            validPayments.map((payment) => (
                              <PaymentSummary data-test-id="submitted-payment-summary" key={payment.id} element="p" like="dec-1">
                                {getPayment(payment)}
                              </PaymentSummary>
                            ))
                          }

                          <NewCreditCard
                            data-test-id="new-credit-card"
                            styledLikeLink
                            type="button"
                            onClick={() => {
                              setValidPayments([]);
                              handleOnPaymentMethodChange('cc');
                            }}
                          >
                            Change payment method
                          </NewCreditCard>
                          <FormButton
                            data-test-id="payment-submit"
                            type="button"
                            disabled={loading || props.loading}
                            onClick={goToConfirm}
                          >
                            Review Order
                          </FormButton>
                        </ExistingPaymentMethod>
                      )
                    }
                  </>
                ) : <FormButton data-test-id="payment-submit" type="button" disabled={loading} onClick={goToConfirm}>Review Order</FormButton>
            }
          </FormWrapper>
        )
      }

      {loading && <Loading />}
    </Form>
  ) : null;
};

CheckoutPayment.defaultProps = {
  active: false,
  loading: false,
  children: '',
  payment_sources: [],
  onSubmit: () => { },
  updateCart: () => { },
  handleOnEditClick: () => { },
  address_verification: false,
  isMobile: false
};

CheckoutPayment.propTypes = {
  active: PropTypes.bool,
  loading: PropTypes.bool,
  cart: PropTypes.object.isRequired,
  children: PropTypes.any,
  onSubmit: PropTypes.func,
  handleOnEditClick: PropTypes.func,
  updateCart: PropTypes.func,
  payment_sources: PropTypes.array,
  completedSteps: PropTypes.array.isRequired,
  address_verification: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  isMobile: PropTypes.bool
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  payment_sources: state.profile.payment_sources,
  token: state.user.spree_api_key
});

const mapDispatchToProps = (dispatch) => ({
  updateCart: (cart) => dispatch(updateCart(cart))
});

const ConnectedCheckoutPayment = connect(mapStateToProps, mapDispatchToProps)(CheckoutPayment);

ConnectedCheckoutPayment.displayName = 'CheckoutPayment';
ConnectedCheckoutPayment.whyDidYouRender = true;

export default ConnectedCheckoutPayment;
