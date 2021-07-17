import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';

import StoreCreditCheckout from '../../molecules/store-credit-checkbox';
import Typography from '../../atoms/typography';
import Radio from '../../atoms/radio';
import BillingForm from '../checkout-new-billing-form';

import { deletePaymentSource, setDefaultPaymentSource } from '../../store/modules/profile/actions';
import {
    removePaymentMethod, setDefaultPaymentMethod, updateCheckout
} from '../../pages/api';
import { updateCart } from '../../store/modules/cart/actions';
import resetCheckout from '../../utils/resetCheckoutFlow';
import {
  supportsApplePay,
  isPayLaterEligible,
  qualifiesForAfterpay,
  isCoveredByStoreCredit,
  orderTotalToDisplay
} from '../../utils/paymentMethodHelpers';

const BraintreeApplePay = dynamic(() => import('../../molecules/braintree-apple-pay'));
const BraintreePaypal = dynamic(() => import('../../molecules/braintree-paypal-checkout'));
const Afterpay = dynamic(() => import('../../molecules/afterpay'));

const Wrapper = styled.div`
  display: grid;
  grid-template-areas: 'radios'
                       'inputs'
                       'buttons';
  color: ${(props) => props.theme.color.brand};

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    grid-area: form;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${(props) => props.theme.font.sans};
  margin-bottom: ${({ theme }) => theme.modularScale.sixtyFour};

  label {
    margin-bottom: 0;
  }
`;

const SectionHeading = styled(Typography)`

  font-size: 2rem;
  margin-bottom: 1rem;
`;

const PaymentOption = styled(Radio)`
  display: flex;
  color: ${(props) => props.theme.color.brand};
  align-items: center;
  outline: 0;
  padding: 1rem 1rem 1rem 2rem;
  font-size: 1.8rem;
  margin: 0.6rem 0;

  ::before, ::after {
    font-size: 1.2rem;
    top: 50%;
    transform: translateY(-50%);
    border-color: ${(props) => props.theme.color.brand};
  }
`;

const ButtonWrapper = styled.div`
  display: grid;

  > div, > button {
    @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
      width: calc(65% - 0.5rem);
    }
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    width: 50%;
  }
`;

const LogInMessage = styled(Typography)`
  font-size: ${({ theme }) => theme.modularScale.fourteen};
`;

const Message = styled.div`
  margin-bottom: ${({ theme }) => theme.modularScale.sixteen};
`;

const ThirdPartyMessagesWrapper = styled.div`
  display: ${(props) => (props.active ? 'block' : 'none')};
  padding-left: 2rem;

  afterpay-placement {
    // Need to match PayPal font, since we can't change it
    font-family: Helvetica, Arial, sans-serif;
    color: ${({ theme }) => theme.color.black};
    padding-right: 3rem;
    margin-block-start: 0;
    margin-block-end: 0;
    --logo-badge-width: 72px;
  }
`;

const getUserSavedCC = (paymentSources) => paymentSources?.filter?.((payment) => payment?.source?.payment_type === 'CreditCard');

const CheckoutPaymentOptionsSection = (props) => {
  const [paymentMethod, setPaymentMethod] = useState('cc');
  const [ccPayment, setCCPayment] = useState();
  const [coveredByStoreCredit, setCoveredByStoreCredit] = useState(
    isCoveredByStoreCredit(props.cart)
  );

  // set newCardID to false initially, update to use id
  // to decide to update payment on billing submit
  const [newCardID, setNewCardID] = useState(false);

  const [paymentSource, setPaymentSource] = useState(
    props.user?.payment_sources?.find?.((x) => x.default)?.id ?? 0
  );

  const [validPayments, setValidPayments] = useState(
    props.cart?.payments?.filter((payment) =>
      payment.state === 'checkout' && payment?.source_type !== 'Spree::StoreCredit') || []
  );

  const defaultCard = props?.user?.payment_sources?.find((ps) => ps.default) ?? false;

  useEffect(() => {
    // selects radio for returning users
    // defaults to CC in useState above which handles all other cases

    const payment = validPayments?.[0];
    const type = payment?.source?.payment_type;

    if (type === 'PayPalAccount') {
      // we do not know whether user selected PayPal or PayLater
      // // default to PayPal
      setPaymentMethod('pp');
    }

    if (type === 'ApplePayCard') {
      setPaymentMethod('apple-pay');
    }

    if (payment?.payment_method?.name === 'Afterpay') {
      setPaymentMethod('afterpay');
    }
  }, []);

  useEffect(() => {
    if (coveredByStoreCredit) {
      // set to show disabled CC form when store credit covers order total
      setPaymentMethod('cc');
    }
  }, [coveredByStoreCredit]);

  useEffect(() => {
    setValidPayments(
      props.cart.payments?.filter((payment) => payment.state === 'checkout' && payment.source_type !== 'Spree::StoreCredit') || []
    );

    setCoveredByStoreCredit(isCoveredByStoreCredit(props.cart));
  }, [props.cart]);

  useEffect(() => {
    if (paymentMethod === 'cc' && validPayments.length > 0) {
      const creditCard = validPayments.find((p) => p.source?.payment_type === 'CreditCard');
      setCCPayment(creditCard);
    }
  }, [props.cart.payments]);

  useEffect(() => {
    let creditCardPayment;
    if (paymentMethod === 'cc' && validPayments.length > 0) {
      creditCardPayment = validPayments.find((p) => p.source?.payment_type === 'CreditCard');
      setCCPayment(creditCardPayment);
    }

    // order has no CC payment
    if (!creditCardPayment) {
      // look through user's saved CCs and select the default, or first
      const savedCards = getUserSavedCC(props.user?.payment_sources);
      const firstCardId = savedCards?.[0]?.id;
      setPaymentSource(defaultCard?.id ?? firstCardId?.id);
    } else {
      // order has a CC payment
      // get saved CC ids
      const savedCCSources = getUserSavedCC(props.user?.payment_sources);
      const savedCCSourceIDs = savedCCSources?.map((s) => s.source.id);

      if (savedCCSourceIDs?.includes(creditCardPayment?.source_id)) {
        // if ccPayment is in saved CCs, check existing saved CCs
        // to find ID of source to select correct payment
        const ccPaymentSourceId = creditCardPayment?.source_id;
        const savedSource = savedCCSources.find((s) => s.source.id === ccPaymentSourceId);

        if (savedSource) {
          // set the paymentSource to the id of the saved CC
          setPaymentSource(savedSource.id);
          setNewCardID(false);
        }
      } else {
        setPaymentSource(creditCardPayment.id);
        setNewCardID(creditCardPayment.id);
      }
    }
  }, [props.user.loading, props.cart.payments]);

  const handleOnPaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleOnCardDelete = async (payment) => {
    props.setLoading(true);
    await removePaymentMethod({ id: payment.id })
      .then(async () => {
        props.deletePaymentSource(payment.id);

        if (defaultCard && defaultCard.id === payment.id) {
          const sorted_ps = props.user.payment_sources
            .filter((ps) => ps.id !== payment.id)
            .sort((first_ps, second_ps) => {
              if (first_ps.source.payment_type < second_ps.source.payment_type) return -1;
              if (first_ps.source.payment_type > second_ps.source.payment_type) return 1;

              return 0;
            });

          if (sorted_ps && sorted_ps.length > 0) {
            await setDefaultPaymentMethod({ id: sorted_ps[0].id })
              .then(() => props.setDefaultPaymentSource(sorted_ps[0].id));
          }
        }
      }).then(() => props.setLoading(false));
  };

  const updateUseStoreCredit = (useStoreCredits) => {
    props.setLoading(true);

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

        props.updateCart({ ...resData });
      }).then(() => props.setLoading(false));
  };

  return (
    <Wrapper>
      <Section>
        <PaymentOption
          id="payment-cc"
          name="payment_type"
          value="cc"
          active={paymentMethod === 'cc'}
          changed={() => handleOnPaymentMethodChange('cc')}
          disabled={coveredByStoreCredit}
        >
          Credit Card
        </PaymentOption>

        <PaymentOption
          id="payment-pp"
          name="payment_type"
          value="pp"
          active={paymentMethod === 'pp'}
          changed={() => handleOnPaymentMethodChange('pp')}
          disabled={coveredByStoreCredit}
        >
          PayPal
        </PaymentOption>
        <ThirdPartyMessagesWrapper active={paymentMethod === 'pp' ? 'true' : undefined}>
          <LogInMessage element="p" like="dec-2">Log in will be prompted after you click on the payment provider button.</LogInMessage>
        </ThirdPartyMessagesWrapper>

        {
          supportsApplePay() && (
            <>
              <PaymentOption
                id="payment-apple-pay"
                name="payment_type"
                value="apple-pay"
                active={paymentMethod === 'apple-pay'}
                changed={() => handleOnPaymentMethodChange('apple-pay')}
                disabled={coveredByStoreCredit}
              >
                Apple Pay
              </PaymentOption>
              <ThirdPartyMessagesWrapper active={paymentMethod === 'apple-pay' ? 'true' : undefined}>
                <LogInMessage element="p" like="dec-2">Log in will be prompted after you click on the payment provider button.</LogInMessage>
              </ThirdPartyMessagesWrapper>
            </>
          )
        }

        {
          qualifiesForAfterpay(props.cart?.payment_methods) && (
            <>
              <PaymentOption
                id="payment-afterpay"
                name="payment_type"
                value="afterpay"
                active={paymentMethod === 'afterpay'}
                changed={() => handleOnPaymentMethodChange('afterpay')}
                disabled={coveredByStoreCredit}
              >
                Afterpay
              </PaymentOption>
              <ThirdPartyMessagesWrapper active={paymentMethod === 'afterpay' ? 'true' : undefined}>
                <Message>
                  <afterpay-placement
                    data-locale="en_US"
                    data-currency="USD"
                    data-amount={orderTotalToDisplay(props.cart)}
                    data-modal-theme="white"
                    data-intro-text="Pay in"
                    data-modal-link-style="learn-more-text"
                    data-badge-theme="white-on-black"
                    data-size="sm"
                  />
                </Message>
                <LogInMessage element="p" like="dec-2">Log in will be prompted after you click on the payment provider button.</LogInMessage>
              </ThirdPartyMessagesWrapper>
            </>
          )
        }

        {
          isPayLaterEligible() && (
            <>
              <PaymentOption
                id="payment-pp-p4"
                name="payment_type"
                value="pp-p4"
                active={paymentMethod === 'pp-p4'}
                changed={() => handleOnPaymentMethodChange('pp-p4')}
                disabled={coveredByStoreCredit}
              >
                PayPal Pay Later
              </PaymentOption>
              <ThirdPartyMessagesWrapper active={paymentMethod === 'pp-p4' ? 'true' : undefined}>
                <Message
                  data-pp-message
                  data-pp-style-layout="text"
                  data-pp-style-logo-type="inline"
                  data-pp-style-text-color="black"
                  data-pp-style-text-align="left"
                  data-pp-style-text-size="14"
                  data-pp-amount={orderTotalToDisplay(props.cart)}
                />
                <LogInMessage element="p" like="dec-2">Log in will be prompted after you click on the payment provider button.</LogInMessage>
              </ThirdPartyMessagesWrapper>
            </>
          )
        }

      </Section>

      {
        paymentMethod === 'cc'
        && (
          <BillingForm
            cart={props.cart}
            ccPayment={ccPayment}
            paymentSource={paymentSource}
            setPaymentSource={setPaymentSource}
            handleOnCardDelete={handleOnCardDelete}
            showCardFields={props.showCardFields}
            updateUseStoreCredit={updateUseStoreCredit}
            newCardID={newCardID}
            setLoading={props.setLoading}
            isCoveredByStoreCredit={coveredByStoreCredit}
          />
        )
      }

      {
        // this lives in two places at the moment for design reasons
        // also in tissues/checkout-new-billing-form
        // could be likely be refactored to be placed with CSS
        paymentMethod !== 'cc' && +props.cart.total_applicable_store_credit > 0 && (
          <Section>
            <SectionHeading element="h2" like="dec-1">Store credit</SectionHeading>
            <StoreCreditCheckout
              updateUseStoreCredit={updateUseStoreCredit}
              applicableStoreCredit={props.cart?.total_applicable_store_credit}
              availableStoreCredit={props.cart?.display_total_available_store_credit}
              useStoreCredit={props.cart?.use_store_credits}
            />
          </Section>
        )
      }

      <ButtonWrapper>
        {
          paymentMethod === 'pp'
          && (
            <BraintreePaypal
              newCheckout
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
              newCheckout
              id="paypal-checkout"
              token={process.env.NEXT_PUBLIC_BRAINTREE_TOKEN}
              fundingSource="PAYLATER"
            />
          )
        }

        {
          paymentMethod === 'apple-pay'
          && (
            <BraintreeApplePay
              newCheckout
              token={process.env.NEXT_PUBLIC_BRAINTREE_TOKEN}
            />
          )
        }

        {
          paymentMethod === 'afterpay'
          && (
            <Afterpay
              setLoading={props.setLoading}
            />
          )
        }
      </ButtonWrapper>

    </Wrapper>
  );
};

CheckoutPaymentOptionsSection.defaultProps = {
  showCardFields: () => { },
  user: {},
  cart: {},
  setLoading: () => { }
};

CheckoutPaymentOptionsSection.propTypes = {
  showCardFields: PropTypes.func,
  user: PropTypes.object,
  cart: PropTypes.object,
  deletePaymentSource: PropTypes.func.isRequired,
  setDefaultPaymentSource: PropTypes.func.isRequired,
  setLoading: PropTypes.func,
  updateCart: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  user: state.profile
});

const mapDispatchToProps = (dispatch) => ({
  updateCart: (cart) => dispatch(updateCart(cart)),
  deletePaymentSource: (ps_id) => dispatch(deletePaymentSource(ps_id)),
  setDefaultPaymentSource: (payment_source_id) => dispatch(
    setDefaultPaymentSource(payment_source_id)
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutPaymentOptionsSection);
