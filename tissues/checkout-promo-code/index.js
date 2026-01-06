import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import * as Sentry from '@sentry/node';
import Typography from '../../atoms/typography';
import PromoInput from '../../molecules/checkout-promo-code-input';
import PromoCode from '../../molecules/checkout-promo-code';
import { toast, TOAST } from '../../utils/toastify';
import { removeCoupon, updateCheckout } from '../../pages/api';
import { logAmplitude } from '../../utils/amplitude';
import InfoBox from '../../atoms/info-box';

const CouponWrapper = styled.div`
  display: grid;
  grid-template-rows: repeat(3, max-content);
  grid-gap: 1rem;
  color: ${(props) => props.theme.color.brand};
  margin-bottom: ${({ theme }) => theme.modularScale.sixtyFour};

  p {
    font-size: ${({ theme }) => theme.modularScale.sixteen};
  }

  label {
    font-size: ${({ theme }) => theme.modularScale.twentyFour};
  }
`;

const CheckoutPromoCodeSection = (props) => {
  const [couponError, setCouponError] = useState('');

  const getAdjustment = (couponId) => props.adjustments?.find(
    (adj) => adj.promotion_code_id === couponId);

  const handleSubmitCoupon = async (e, code) => {
    e.preventDefault();
    props.setLoading(true);
    logAmplitude('Submitted Promo Code', { code, removed_promo: false });

    await updateCheckout({
      id: props.cartNumber,
      body: { order: { coupon_code: code } },
      hold_state: true
    })
      .then(async (couponRes) => {
        const couponResData = couponRes?.data ?? couponRes;
        if (couponResData?.errors?.length > 0) {
          logAmplitude('Encountered Transaction Error', {
            message: couponResData.errors[0].message,
            step: props.cartState
          });

          setCouponError(couponResData.errors[0].message);

          Sentry.withScope((scope) => {
            scope.setLevel(Sentry.Severity.Info);
            couponResData.errors.forEach((error) => {
              Object.keys(error).forEach((key) => {
                scope.setExtra(key, error[key]);
              });
            });
            scope.setExtra('coupon code', code);
            Sentry.captureException(new Error('Apply coupon code failure'));
          });

          return;
        }

        await updateCheckout({ id: props.cartNumber, hold_state: true })
          .then((paymentRes) => {
            const paymentResData = paymentRes?.data ?? paymentRes;
            if (paymentResData.errors) {
              toast(couponResData?.errors ?? 'Something went wrong, please try again.', { type: TOAST.TYPE.ERROR });
              logAmplitude('Encountered Transaction Error', {
                message: couponResData?.errors?.toString(),
                step: props.cartState
              });
              return;
            }

            const res = { ...couponResData, ...paymentResData };
            props.updateCart(res);
          });
      }).then(() => props.setLoading(false));
  };

  const handleRemoveCoupon = async (code) => {
    props.setLoading(true);
    logAmplitude('Submitted Promo Code', { code, removed_promo: true });

    await removeCoupon({ order_number: props.cartNumber, coupon: code })
      .then(async (couponRes) => {
        const couponResData = couponRes?.data ?? couponRes;

        if (!couponResData.successful) {
          toast(couponResData?.error ?? 'Something went wrong, please try again.', { type: TOAST.TYPE.ERROR });

          Sentry.withScope((scope) => {
            if (couponResData?.errors) {
              couponResData.errors.forEach((error) => {
                Object.keys(error).forEach((key) => {
                  scope.setExtra(key, error[key]);
                });
              });
            }

            if (couponResData?.error) {
              Object.keys(couponResData.error).forEach((key) => {
                scope.setExtra(key, couponResData.error[key]);
              });
            }

            Sentry.captureException(new Error('Remove coupon code failure'));
          });

          return;
        }

        await updateCheckout({ id: props.cartNumber, hold_state: true })
          .then((paymentRes) => {
            const paymentResData = paymentRes?.data ?? paymentRes;
            if (paymentResData?.errors) {
              if (paymentResData.errors?.length > 0) {
                paymentResData.errors.forEach(({ message = null }) => {
                  if (typeof message === 'string') {
                    toast(message, { type: TOAST.TYPE.ERROR });
                  }
                });
              } else {
                toast('Something went wrong, please try again.', { type: TOAST.TYPE.ERROR });
              }
              return;
            }

            const res = { ...couponResData, ...paymentResData };

            props.updateCart(res);
          });
      }).then(() => {
        props.setLoading(false);
      });
  };

  const renderPromoCode = () => (props.coupons.length > 0
    ? (
      props.coupons.map((coupon) => {
        const adjustment = getAdjustment(coupon.id);
        return (
          <PromoCode
            key={coupon.id}
            coupon={coupon}
            adjustment={adjustment}
            handleRemoveCoupon={handleRemoveCoupon}
          />
        );
      })
    )
    : (
      <PromoInput
        handleSubmitCoupon={handleSubmitCoupon}
        couponError={couponError}
        setCouponError={setCouponError}
      />
    ));

  return (
    <CouponWrapper
      data-test-id="promo-code-wrapper"
    >
      <Typography
        htmlFor="promo-code-input"
        element="label"
        like="heading-2"
        data-test-id="promo-code-title"
      >
        Promo code
      </Typography>
      {
        props.cartState === 'address' || !props.hasAddresses
          ? <InfoBox text="Promo code available once you provide a delivery address" />
          : renderPromoCode()
      }
    </CouponWrapper>
  );
};

CheckoutPromoCodeSection.defaultProps = {
  coupons: [],
  adjustments: [],
  setLoading: () => {}
};

CheckoutPromoCodeSection.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  coupons: PropTypes.array,
  adjustments: PropTypes.array,
  cartNumber: PropTypes.string.isRequired,
  cartState: PropTypes.string.isRequired,
  updateCart: PropTypes.func.isRequired,
  hasAddresses: PropTypes.bool.isRequired,
  setLoading: PropTypes.func
};

export default CheckoutPromoCodeSection;
