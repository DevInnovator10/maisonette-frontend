import React, {
  useState, useEffect, useRef, useLayoutEffect
} from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Button from '../../atoms/button';
import Icon from '../../atoms/icon-arrow';
import Typography from '../../atoms/typography';
import Input from '../../atoms/input-text';

import { updateCart } from '../../store/modules/cart/actions';

const CouponInstructions = styled(Typography)`
  color: ${({ theme }) => theme.color.brandLight};
  display: block;
  margin-bottom: 1rem;
`;

const InputGroup = styled.span`
  display: flex;
  flex-direction: row;
  flex: 0 1 auto;
`;

const CouponInput = styled(Input)`
  flex: 1;
  outline: none;
`;

const FormLabel = styled.label`
  opacity: 0;
  pointer-events: none;
  position: absolute;
`;

const SubmitButton = styled(Button)`
  width: 40px;
  height: 40px;
  position: relative;
  justify-content: center;
  align-items: center;
`;

const IconArrow = styled(Icon)`
  height: 1rem !important;
  width: 1rem !important;
  fill: ${(props) => props.theme.color.white};
`;

const errorStyles = (props) => css`
  border-color: ${props.theme.color.brandError};
  color: ${props.theme.color.brandError};
`;

const ErrorMsg = styled.span`
  color: ${(props) => props.theme.color.brandError};
  display: block;
  font-family: ${(props) => props.theme.font.sans};
  font-size: 1.2rem;
  margin-top: 0.25rem;
  width: 100%;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;

  ${ErrorMsg} + ${InputGroup} input {
    border: 0.2rem solid transparent;
    ${errorStyles}

    ::placeholder {
      color: ${(props) => props.theme.color.brandError};
      opacity: 0.6;
    }
  }
`;

const Loading = styled.span`
  opacity: 0.75;
  z-index: ${(props) => props.theme.layers.balcony};

  ${(props) => props.theme.loader(2, 'white')}
`;

const CouponCode = (props) => {
  const schema = Yup.string().required('Coupon Code cannot be blank');

  const [code, setCode] = useState('');
  const [inputId] = useState(props.step ? `${props.step}-checkout-coupon` : 'checkout-coupon');
  const [arrowId] = useState(props.step ? `${props.step}-coupon-arrow` : 'checkout-coupon-arrow');
  const [btnId] = useState(props.step ? `${props.step}-coupon-btn` : 'checkout-coupon-btn');
  const [correctInput, setCorrectInput] = useState(false);
  const inputRef = useRef(0);

  const handleOnCouponChange = (e) => {
    if (e.target.id === inputRef.current.id) {
      props.setCouponCode(e.target.value);
      setCode(e.target.value);
      setCorrectInput(true);
    }
  };

  const validate = async (e) => {
    const { id } = e.target;

    if (id === arrowId || id === btnId) {
      setCorrectInput(true);
      await schema.validate(code)
        .catch(({ errors }) => {
          props.setCouponError(errors[0]);
          setTimeout(() => inputRef.current.select(), 0);
        });

      if (await schema.isValid(code)) props.setCouponError(false);
    }
  };

  useEffect(() => {
    if (props.couponSubmitted) return;

    if (correctInput && !props.couponTouched) {
      props.setCouponTouched(true);
      return;
    }

    if (code === '') setCorrectInput(false);
  }, [code]);

  useLayoutEffect(() => {
    const elem = inputRef.current;
    elem.addEventListener('blur', () => {
      if (!props.couponSubmitting) {
        props.setCouponError(false);
        if (elem.value === '') setCorrectInput(false);
      }
    });
  }, []);

  return (
    <fieldset form="coupon" className={props.className} disabled={props.loading}>
      <CouponInstructions id={`${props.step}-coupon-instructions`} element="label" like="dec-1">
          Limited to one code per order.
      </CouponInstructions>

      <InputWrapper>
        <FormLabel htmlFor={inputId}>Coupon Input</FormLabel>

        { correctInput && props.couponError && <ErrorMsg id={`${props.step}-coupon-error`} role="alert">{props.couponError}</ErrorMsg> }

        <InputGroup>
          <CouponInput
            aria-labelledby={`${props.step}-coupon-title ${props.step}-coupon-instructions`}
            aria-describedby={correctInput && props.couponError ? `${props.step}-coupon-error` : null}
            form="coupon"
            ref={inputRef}
            autoComplete="off"
            name="coupon_code"
            id={inputId}
            placeholder="Enter Gift / Promo Code"
            type="text"
            value={code}
            onChange={handleOnCouponChange}
          />

          <SubmitButton
            id={btnId}
            form="coupon"
            type="submit"
            onClick={validate}
            aria-label="submit gift or promo code"
            disabled={props.couponSubmitting}
            isIcon
          >
            {
              (correctInput && props.couponSubmitting)
                ? <Loading />
                : (
                  <IconArrow
                    id={arrowId}
                  />
                )
            }
          </SubmitButton>
        </InputGroup>

      </InputWrapper>
    </fieldset>
  );
};

CouponCode.defaultProps = {
  className: '',
  loading: false,
  step: '',
  couponSubmitting: false,
  couponTouched: false,
  couponError: false,
  couponSubmitted: false
};

CouponCode.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
  step: PropTypes.string,
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

const mapStateToProps = (state) => ({
  cart: state.cart
});

const mapDispatchToProps = (dispatch) => ({
  updateCart: (cart) => dispatch(updateCart(cart))
});

const ConnectedCouponCode = connect(mapStateToProps, mapDispatchToProps)(CouponCode);

CouponCode.displayName = 'CouponCode';

export default ConnectedCouponCode;
