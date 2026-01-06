import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { client, applePay, dataCollector } from 'braintree-web';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import Router from 'next/router';
import * as Sentry from '@sentry/node';
import { toast, TOAST } from '../../utils/toastify';

import { updateCart } from '../../store/modules/cart/actions';
import { createBraintreeTransaction } from '../../pages/api';
import { logAmplitude } from '../../utils/amplitude';

const ApplePayButtonWrapper = styled('div', { shouldForwardProp: (prop) => prop !== 'supportsApplePay' })`
  display: ${({ supportsApplePay }) => (supportsApplePay ? 'block' : 'none')};
  width: 100%;

  // Border-radius was not working on ApplePay button
  // this sits the white button in a box with a black border
  background: ${(props) => props.theme.color.white};
  border: ${(props) => props.theme.color.black} 2px solid;
  padding: 1px;
`;

const ApplePayButton = styled('div', { shouldForwardProp: (prop) => prop !== 'newCheckout' })`
  @supports (-webkit-appearance: -apple-pay-button) {
    -apple-pay-button-style: white;
    -webkit-appearance: -apple-pay-button;
    display: block;
    height: ${(props) => (props.newCheckout ? '3.8rem' : '4.2rem')};
    width: 100%;
  }
`;

const Loading = styled(ApplePayButton)`
  position: relative;

  @supports (-webkit-appearance: -apple-pay-button) {
    -apple-pay-button-style: none;
    -webkit-appearance: none;
    align-items: center;
    color: black;
    display: flex;
    justify-content: center;

    ${(props) => props.theme.loader(2, 'black')}
  }
`;

const BraintreeApplePay = (props) => {
  const [supportsApplePay, setSupportsApplePay] = useState(false);
  const [applePayInstance, setApplePayInstance] = useState(null);
  const [deviceData, setDeviceData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [payment] = useState(props.cart.payment_methods.find((m) => m.name === 'Braintree'));

  useEffect(() => {
    try {
      if (!global.ApplePaySession) {
        console.error('This device does not support Apple Pay');
      }

      if (global.ApplePaySession && !global.ApplePaySession.canMakePayments()) {
        console.error('This device is not capable of making Apple Pay payments');
      }

      if (global.ApplePaySession && global.ApplePaySession.canMakePayments()) {
        client.create({
          authorization: props.token
        }, async (clientErr, clientInstance) => {
          if (clientErr) {
            console.error('Error creating client:', clientErr);
            return;
          }

          dataCollector.create({
            client: clientInstance,
            paypal: false,
            kount: true
          }, (dataCollectorInstanceErr, instance) => {
            if (dataCollectorInstanceErr) {
              console.error('Error retrieving device data:', dataCollectorInstanceErr);
              return;
            }

            setDeviceData(instance.deviceData);
          });

          applePay.create({
            client: clientInstance
          }, (applePayErr, instance) => {
            if (applePayErr) {
              console.error('Error creating applePayInstance:', applePayErr);
              return;
            }

            setSupportsApplePay(true);
            setApplePayInstance(instance);
          });
        });
      }
    } catch (e) {
      console.error('Apple Pay init error:', e);
    }
  }, []);

  const handleOnApplePayClick = async () => {
    if (!global.ApplePaySession) return;
    setLoading(true);
    logAmplitude('Submitted Checkout Payment', { cart: props.cart, method: 'Apple Pay' });
    logAmplitude('Clicked Button In Cart', { buttonName: 'Apple Pay button' });

    const paymentRequest = applePayInstance.createPaymentRequest({
      total: {
        label: 'Maisonette.',
        amount: props.cart.subtotals.order_total
      },

      // We recommend collecting billing address information, at minimum
      // billing postal code, and passing that billing postal code with

      // all Apple Pay transactions as a best practice.
      requiredBillingContactFields: ['postalAddress'],
      requiredShippingContactFields: [
        'postalAddress',
        'name',
        'phone',
        'email'
      ]
    });

    const session = new global.ApplePaySession(3, paymentRequest);

    session.onvalidatemerchant = (event) => {
      applePayInstance.performValidation({
        validationURL: event.validationURL,
        displayName: 'Maisonette.'
      }, (err, merchantSession) => {
        if (err) {
          Sentry.withScope((scope) => {
            scope.setLevel(Sentry.Severity.Warning);
            scope.setExtra('merchantSession', merchantSession);
            Sentry.captureException(new Error(err));
          });

          console.error('Error loading Apple Pay:', err);
          return;
        }

        session.completeMerchantValidation(merchantSession);
      });
    };

    session.onpaymentauthorized = (event) => {
      const { shippingContact } = event.payment;

      applePayInstance.tokenize({
        token: event.payment.token
      }, async (tokenizeErr, payload) => {
        if (tokenizeErr) {
          Sentry.withScope((scope) => {
            scope.setExtra('payload', payload);
            Sentry.captureException(new Error(tokenizeErr));
          });

          session.completePayment(global.ApplePaySession.STATUS_FAILURE);
          return;
        }

        setLoading(false);

        const request = {
          order_id: props.cart.number,
          payment_method_id: payment.id,
          options: {
            restart_checkout: false
          },
          transaction: {
            device_data: deviceData,
            email: shippingContact.emailAddress,
            nonce: payload.nonce,
            phone: shippingContact.phoneNumber,
            payment_type: 'ApplePayCard',
            ...(props.isCart && {
              shipping_address_attributes: {
                first_name: shippingContact.givenName,
                last_name: shippingContact.familyName,
                address_line_1: shippingContact.addressLines[0],
                address_line_2: shippingContact.addressLines[1],
                city: shippingContact.locality,
                state_code: shippingContact.administrativeArea,
                zip: shippingContact.postalCode,
                country_code: shippingContact.countryCode
              }
            })
          }
        };

        await createBraintreeTransaction({ order_token: props.cart.token, body: request })
          .then((cart) => {
            const cartData = cart?.data ?? cart;

            if (cartData.errors && Array.isArray(cartData.errors)) {
              cartData.errors.forEach((error) => {
                if (error.message && typeof error.message === 'string') {
                  toast(error.message, { type: TOAST.TYPE.ERROR, autoClose: false });
                }

                if (error.code === 422) {
                  props.updateCart({
                    state: 'address'
                  });
                }
              });
            } else {
              props.updateCart({
                ...cart,
                ...(props.isCart && { direct_checkout: true })
              });

              Router.push('/checkout')
                .then(() => global.window.scrollTo(0, 0));
            }
          });

        // After you have transacted with the payload.nonce,
        // call `completePayment` to dismiss the Apple Pay sheet.
        session.completePayment(global.ApplePaySession.STATUS_SUCCESS);
      });
    };

    session.oncancel = () => setLoading(false);
    session.abort = () => setLoading(false);

    session.begin();
  };

  return supportsApplePay ? (
    <ApplePayButtonWrapper className={props.className} supportsApplePay={supportsApplePay}>
      {
        loading
          ? <Loading />
          : <ApplePayButton newCheckout={props.newCheckout} onClick={handleOnApplePayClick} />
      }
    </ApplePayButtonWrapper>
  ) : null;
};

BraintreeApplePay.defaultProps = {
  className: '',
  isCart: false,
  newCheckout: false
};

BraintreeApplePay.propTypes = {
  className: PropTypes.string,
  token: PropTypes.string.isRequired,
  cart: PropTypes.object.isRequired,
  updateCart: PropTypes.func.isRequired,
  isCart: PropTypes.bool,
  newCheckout: PropTypes.bool
};

const mapStateToProps = (state) => ({
  cart: state.cart
});

const mapDispatchToProps = (dispatch) => ({
  updateCart: (cart) => dispatch(updateCart(cart))
});

const ConnectedBraintreeApplePay = connect(
  mapStateToProps, mapDispatchToProps
)(BraintreeApplePay);

ConnectedBraintreeApplePay.displayName = 'BraintreeApplePay';
ConnectedBraintreeApplePay.whyDidYouRender = true;

export default ConnectedBraintreeApplePay;
