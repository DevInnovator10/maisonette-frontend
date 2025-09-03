import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { client, paypalCheckout, dataCollector } from 'braintree-web';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import Router from 'next/router';
import * as Sentry from '@sentry/node';
import { toast, TOAST } from '../../utils/toastify';

import { updateCart } from '../../store/modules/cart/actions';
import { createBraintreeTransaction } from '../../pages/api';
import trackEvent from '../../utils/tracking';
import { logAmplitude } from '../../utils/amplitude';
import { orderTotalToDisplay } from '../../utils/paymentMethodHelpers';

const PayPalWrapper = styled.div`
  position: relative;
  min-height: 4.5rem;
  overflow: hidden;
`;

const NewCheckoutWrapper = styled('div', { shouldForwardProp: (prop) => prop !== 'isVisible' })`
  position: relative;
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  background-color: ${(props) => props.theme.color.paypalYellow};
  border: 1px solid ${(props) => props.theme.color.paypalYellow};

  :hover {
    background-color: ${(props) => props.theme.color.paypalYellowHover};
    transition: background-color ${(props) => props.theme.animation.default} ${(props) => props.theme.animation.easeOutQuad};
  }
`;

const NewCheckoutPayPal = styled.div`
  flex: 1 1 auto;
  height: 4rem;
`;

const Loading = styled.span`
  opacity: 0.75;
  z-index: ${(props) => props.theme.layers.box};

  ${(props) => props.theme.loader(3, props.theme.color.paypalYellow)}
`;

const BraintreePayPal = (props) => {
  const [loading, setLoading] = useState(true);
  const [payPalError, setPayPalError] = useState(false);
  const [payment] = useState(props.cart.payment_methods.find((m) => m.name === 'Braintree'));
  const [ppInstance, setPPInstance] = useState(null);
  const [supportsFundingSource, setSupportsFundingSource] = useState(false);
  const [amount, setAmount] = useState(orderTotalToDisplay(props.cart));

  let clientInstance = null;
  let deviceData = null;

  useEffect(() => {
    // update amount to reflect change in store credit usage
    setAmount(orderTotalToDisplay(props.cart));
  }, [props.cart]);

  // TODO: combine paypal checkout and cart components
  // they no longer need to be separated
  const PayPalButton = global?.PayPalSDK?.Buttons?.driver('react', { React, ReactDOM });

  const createOrder = () => ppInstance.createPayment({
    flow: 'checkout',
    currency: 'USD',
    amount,
    intent: 'capture',
    enableShippingAddress: false
  });

  const onApprove = (data) => {
    logAmplitude('Submitted Checkout Payment', { cart: props.cart, method: 'PayPal' });

    return ppInstance.tokenizePayment(data)
      // some logic here before tokenization happens below
      .then(async (order) => {
        // Submit payload.nonce to your server
        const request = {
          order_id: props.cart.number,
          payment_method_id: payment.id,
          state: 'payment',
          options: {
            restart_checkout: false
          },
          transaction: {
            device_data: deviceData,
            email: order.details.email,
            nonce: order.nonce,
            phone: order.details.phone,
            payment_type: 'PayPalAccount'
          }
        };

        await createBraintreeTransaction({ body: request, order_token: props.cart.token })
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
                ...cartData
              });

              trackEvent({
                eventCategory: 'Payment',
                eventAction: 'Add PayPal payment',
                eventLabel: 'Success'
              });

              Router.push({
                pathname: '/checkout',
                query: { paypal: 'true' }
              }, '/checkout').then(() => global.window.scrollTo(0, 0));
            }
          });
      });
  };

  const onCancel = (data) => {
    console.error('PayPal SDK checkout payment cancelled', JSON.stringify(data, 0, 2));
  };

  const onError = (err) => {
    Sentry.withScope((scope) => {
      scope.setContext('paypal instance', ppInstance);
      Sentry.captureException(err);
    });
  };

  useEffect(() => {
    const fundingSource = global?.PayPalSDK?.FUNDING?.[props.fundingSource];
    const isSupported = fundingSource && global?.PayPalSDK?.isFundingEligible(fundingSource);

    if (isSupported) {
      setSupportsFundingSource(true);
      // create PP Instance
      client.create({
        authorization: props.token
      }).then(async (instance) => {
        clientInstance = instance;

        return dataCollector.create({
          client: instance,
          kount: true,
          paypal: true
        });
      }).then((dataCollectorInstance) => {
        deviceData = dataCollectorInstance.deviceData;

        return paypalCheckout.create({
          client: clientInstance
        });
      }).then((paypalCheckoutInstance) => {
        setPPInstance(paypalCheckoutInstance);
        return Promise.resolve();
      })
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          setPayPalError(true);
          Sentry.captureException(error);
        });
    }
  }, []);

  return (
    !payPalError && supportsFundingSource && ppInstance && (
      <PayPalWrapper>
        {loading && <Loading />}
        <NewCheckoutWrapper isVisible={!loading}>
          <NewCheckoutPayPal>
            <PayPalButton
              id={props.id}
              createOrder={createOrder}
              onApprove={(data) => onApprove(data)}
              onCancel={(data) => onCancel(data)}
              onError={(err) => onError(err)}
              style={{
                shape: 'rect',
                height: 40,
                color: 'gold'
              }}
              fundingSource={global.PayPalSDK.FUNDING[props.fundingSource]}
            />
          </NewCheckoutPayPal>
        </NewCheckoutWrapper>
      </PayPalWrapper>
    )
  );
};

BraintreePayPal.propTypes = {
  id: PropTypes.string.isRequired,
  cart: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  updateCart: PropTypes.func.isRequired,
  fundingSource: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  cart: state.cart
});

const mapDispatchToProps = (dispatch) => ({
  updateCart: (cart) => dispatch(updateCart(cart))
});

const ConnectedBraintreePayPal = connect(
  mapStateToProps, mapDispatchToProps
)(BraintreePayPal);

ConnectedBraintreePayPal.displayName = 'BraintreePayPal';
ConnectedBraintreePayPal.whyDidYouRender = true;

export default ConnectedBraintreePayPal;
