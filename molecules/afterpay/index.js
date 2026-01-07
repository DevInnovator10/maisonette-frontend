import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import * as Sentry from '@sentry/node';
import { toast, TOAST } from '../../utils/toastify';
import { updateCart } from '../../store/modules/cart/actions';
import { createAfterpay, updateCheckout } from '../../pages/api';
import useScript from '../../utils/hooks/useScript';
import getCartAfterError from '../../utils/getCartAfterError';
import { logAmplitude } from '../../utils/amplitude';
import trackEvent from '../../utils/tracking';

import Button from '../../atoms/button';

const AfterpayButton = styled(Button)`
  height: 4.4rem;
  padding: 0;
  border-color:  ${({ theme }) => theme.color.afterpayMint};
  background: ${({ theme }) => theme.color.afterpayMint};
`;

const AfterpayLogo = styled.img`
  height: 3rem;
  vertical-align: middle;
`;

const Loading = styled.span`
  opacity: 0.75;
  z-index: ${(props) => props.theme.layers.audience};

  ${(props) => props.theme.loader(3, props.theme.color.afterpayMint)}
`;

const Afterpay = (props) => {
  // the url will have to be an env variable
  // for prod: https://portal.afterpay.com/afterpay.js
  const [loaded, error] = useScript(process.env.NEXT_PUBLIC_AFTERPAY_SDK);

  const callAfterpay = async () => {
    logAmplitude('Submitted Checkout Payment', { cart: props.cart, method: 'Afterpay' });
    const payment_method_id = props.cart.payment_methods.find((m) => m.name === 'Afterpay')?.id;

    // this call creates a checkout in Afterpay via Solidus
    // if successful, it returns a token to be used in the Afterpay SDK
    await createAfterpay({
      order_number: props.cart.number, payment_method_id
    })
      .then(async (afterpayRes) => {
        if (afterpayRes?.errors?.length > 0) {
          props.setLoading(false);
          trackEvent({
            eventCategory: 'Payment',
            eventAction: 'Add Afterpay payment',
            eventLabel: 'Failure'
          });

          afterpayRes.errors.forEach((err) => {
            Sentry.withScope((scope) => {
              scope.setFingerprint(['Afterpay: Create Checkout']);
              Sentry.captureException(err);
            });

            const { message } = err;
            if (message) {
              logAmplitude('Encountered Transaction Error', {
                message,
                step: 'payment'
              });
            }

          });

          // generic Afterpay error, since users wouldn't be able to do anything if this fails
          toast('Your Afterpay payment could not be added. Please try again or choose another payment method.', { type: TOAST.TYPE.ERROR });
          return;
        }

        const { AfterPay } = global;
        const { token } = afterpayRes;
        if (AfterPay) {
          // starts Afterpay window
          // // uses iFrame if browser blocks pop up
          AfterPay.initialize({ countryCode: 'US' });
          AfterPay.open();
          AfterPay.onComplete = async (event) => {
            if (event.data?.status === 'SUCCESS') {
              props.setLoading(true);
              const { orderToken } = event.data;

              const payment = {
                order: {
                  payments_attributes: [
                    {
                      payment_method_id,
                      source_attributes: {
                        token: orderToken
                      }
                    }
                  ]
                }
              };

              await updateCheckout({ id: props.cart.number, body: payment, hold_state: true })
                .then((paymentRes) => {
                  const paymentResData = paymentRes?.data ?? paymentRes;
                  // any errors related to rejected Afterpay payments will not happen here
                  // Afterpay is only declined when capturing payment during order completion
                  // see comment in pages/checkout/index.js completeOrder
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
          };
        }
        AfterPay.transfer({ token });
      });
  };

  return (
    <>
      {
        !loaded ? <Loading />
          : (
            <AfterpayButton
              aria-label="Afterpay"
              onClick={callAfterpay}
              disabled={!loaded || error}
            >
              <AfterpayLogo src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/checkout/afterpay-mint.png`} alt="Afterpay" />
            </AfterpayButton>
          )
      }
    </>
  );
};

Afterpay.defaultProps = {
  setLoading: () => {}
};

Afterpay.propTypes = {
  cart: PropTypes.object.isRequired,
  updateCart: PropTypes.func.isRequired,
  setLoading: PropTypes.func
};

const mapStateToProps = (state) => ({
  cart: state.cart
});

const mapDispatchToProps = (dispatch) => ({
  updateCart: (cart) => dispatch(updateCart(cart))
});

const ConnectedAfterpay = connect(
  mapStateToProps, mapDispatchToProps
)(Afterpay);

export default ConnectedAfterpay;
