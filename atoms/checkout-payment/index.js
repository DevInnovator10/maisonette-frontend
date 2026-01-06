import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import handleOnImageError from '../../utils/handleOnImageError';
import { getPaymentName, getPaymentIcon, getPaymentExp } from '../../utils/getCheckoutPayment';

const Payment = styled.div`
  display: flex;
  background: ${(props) => props.theme.color.backgroundLightBlue};
  padding: 1.6rem;
  color: ${(props) => props.theme.color.brand};
  font-family: ${(props) => props.theme.font.sans};
  font-size: 1.6rem;
`;

const Logo = styled('img', { shouldForwardProp: (prop) => prop !== 'afterpay' })`
  width: 3.5rem;
  height: 2.5rem;
  margin-right: ${(props) => props.theme.modularScale.small};

  ${({ afterpay }) => afterpay && css`
    // afterpay logo is a much different layout then other methods
    // need to adjust to keep image from being skewed - matches logo in cart
    width: 7.5rem;
    max-height: 2.6rem;
    height: auto;
    align-self: center;
  `}
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1 0 auto;
`;

const CheckoutPaymentCard = (props) => (
  props.payments.length > 0
  && props.payments.map((payment) => (
    <Payment key={payment.id}>
      {
        getPaymentIcon(payment)
        && (
          <Logo
            onError={handleOnImageError}
            alt="payment method logo"
            afterpay={payment.payment_method?.name === 'Afterpay' ? 'true' : undefined}
            src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/checkout/${getPaymentIcon(payment)}.svg`}
          />
        )
      }
      <Info>
        <span>{getPaymentName(payment)}</span>
        {
          getPaymentExp(payment) && (
            <span>
              exp:
              {' '}
              {getPaymentExp(payment)}
            </span>
          )
        }
      </Info>
    </Payment>
  ))
);

CheckoutPaymentCard.defaultProps = {
  payments: []
};

CheckoutPaymentCard.propTypes = {
  payments: PropTypes.array
};

export default CheckoutPaymentCard;
