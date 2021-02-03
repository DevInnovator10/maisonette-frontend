import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Typography from '../../atoms/typography';
import Button from '../../atoms/button';
import Icon from '../../atoms/icon-cross';

const Wrapper = styled.div`
  display: grid;
  grid-gap: 1rem;

  p {
    font-size: 1.4rem;
  }

  svg {
    height: 1rem;
    width: 1rem;
    margin-left: auto;
    align-self: center;
    stroke-width: 20;
    stroke: ${(props) => props.theme.color.brand};
  }
`;

const RemoveCodeButton = styled(Button)`
  font-family: ${(props) => props.theme.font.sans};
  letter-spacing: .1rem;
  display: flex;
  border: none;
  color: ${(props) => props.theme.color.brand};
  background: #2F4DA10D;
  text-align: left;
  padding: 0 1rem;
  font-size: 1.8rem;
`;

const CheckoutPromoCode = (props) => {
  const removeCoupon = () => {
    props.handleRemoveCoupon(props.coupon.value);
  };

  return (
    <Wrapper>
      <RemoveCodeButton
        aria-label={`remove ${props.coupon.value} promo code`}
        onClick={removeCoupon}
      >
        {props.coupon.value.toUpperCase()}
        <Icon />
      </RemoveCodeButton>
      <Typography
        element="p"
        like="dec-2"
      >
        {props.adjustment.label}
      </Typography>
    </Wrapper>
  );
};

CheckoutPromoCode.defaultProps = {
  adjustment: {}
};

CheckoutPromoCode.propTypes = {
  coupon: PropTypes.object.isRequired,
  adjustment: PropTypes.object,

  handleRemoveCoupon: PropTypes.func.isRequired
};

export default CheckoutPromoCode;
