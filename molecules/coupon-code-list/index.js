import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import * as Sentry from '@sentry/node';
import { toast, TOAST } from '../../utils/toastify';

import Typography from '../../atoms/typography';
import Icon from '../../atoms/icon-cross';
import CouponCode from '../coupon-code-input';

import { updateCheckout, removeCoupon } from '../../pages/api';
import { updateCart } from '../../store/modules/cart/actions';
import { logAmplitude } from '../../utils/amplitude';

const CouponsWrapper = styled.dl`
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  position: relative;
`;

const Title = styled(Typography)`
  color: ${({ theme }) => theme.color.brand};
  letter-spacing: 0.2em;
  line-height: 2rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
`;

const Loading = styled.span`
  opacity: 1;
  z-index: ${(props) => props.theme.layers.balcony};

  ${(props) => props.theme.loader(1)}
`;

const Coupon = styled(Typography)`
  align-items: center;
  align-self: flex-start;
  color: ${(props) => props.theme.color.brand};
  cursor: pointer;
  display: inline-flex;
  letter-spacing: 0.1em;
  text-transform: uppercase;

  ${Loading}, svg {
    height: 0.8rem;
    width: 0.8rem;
    margin-right: 0.5rem;
  }

  svg {
    stroke-width: 10;
    stroke: ${(props) => props.theme.color.brand};
  }

  ${Loading} {
    display: inline-block;
    position: relative;

    ::after {
      border-width: 1px;
    }
  }

  & ~ & {
    margin-top: 0.5rem;
  }
`;

const CouponInput = styled(CouponCode)`
  margin-bottom: 0.5rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  display: block;
  padding: 0;
`;

const CouponHOC = (props) => {
  const [loading, setLoading] = useState(false);

  const handleRemoveCoupon = async (code) => {
    setLoading(true);
    logAmplitude('Submitted Promo Code', { code, removed_promo: true });

    await removeCoupon({ order_number: props.cart.number, coupon: code })
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

        await updateCheckout({ id: props.cart.number, hold_state: true })
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

            props.updateCart({
              ...res,
              state: props.cart.state === 'confirm' ? props.cart.state : res.state
            });
          });

        toast(couponRes?.success ?? 'The coupon code was successfully removed from this order.', { type: TOAST.TYPE.SUCCESS });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Coupon
      className={props.className}
      element="dd"
      like="label-1"
    >
      <RemoveButton
        aria-label={`remove ${props.coupon.value}`}
        disabled={loading}
        onClick={() => handleRemoveCoupon(props.coupon.value)}
        type="button"
      >
        { loading ? <Loading /> : <Icon /> }
        {props.coupon.value.toUpperCase()}
      </RemoveButton>
    </Coupon>
  );
};

CouponHOC.defaultProps = {
  className: '',
  updateCart: () => {}
};

CouponHOC.propTypes = {
  className: PropTypes.string,
  coupon: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
  updateCart: PropTypes.func
};

const CouponItem = connect(
  (state) => ({ cart: state.cart }),
  (dispatch) => ({ updateCart: (cart) => dispatch(updateCart(cart)) })
)(CouponHOC);

const CouponList = (props) => {
  const [coupons, setCoupons] = useState(props?.cart?.applied_promotion_codes ?? []);

  useEffect(() => {
    setCoupons(props?.cart?.applied_promotion_codes ?? []);
  }, [props.cart]);

  if (props.cart.state === 'address') return null;

  return (
    <CouponsWrapper className={props.className}>
      <Title id={`${props.step}-coupon-title`} element="dt" like="label-1">
        { coupons.length === 0 ? 'Coupon Code' : 'Applied Coupons' }
      </Title>

      {
        coupons.length === 0
          ? (
            <CouponInput
              step={props.step}
              setCouponCode={props.setCouponCode}
              couponSubmitting={props.couponSubmitting}
              couponTouched={props.couponTouched}
              setCouponTouched={props.setCouponTouched}
              couponError={props.couponError}
              setCouponError={props.setCouponError}
              couponSubmitted={props.couponSubmitted}
              loading={props.loading}
            />
          )
          : coupons.map((coupon) => (
            <CouponItem key={coupon.value} coupon={coupon} />
          ))
      }
    </CouponsWrapper>
  );
};

CouponList.defaultProps = {
  className: '',
  loading: false,
  step: '',
  couponSubmitting: false,
  couponTouched: false,
  couponError: false,
  couponSubmitted: false
};

CouponList.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
  step: PropTypes.string,
  cart: PropTypes.object.isRequired,
  setCouponCode: PropTypes.func.isRequired,
  couponSubmitting: PropTypes.bool,
  couponTouched: PropTypes.bool,
  setCouponTouched: PropTypes.func.isRequired,
  couponError: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  setCouponError: PropTypes.func.isRequired,
  couponSubmitted: PropTypes.bool
};

const ConnectedCouponList = connect(
  (state) => ({ cart: state.cart }),
  (dispatch) => ({ updateCart: (cart) => dispatch(updateCart(cart)) })
)(CouponList);

CouponList.displayName = 'CouponList';

export default ConnectedCouponList;
