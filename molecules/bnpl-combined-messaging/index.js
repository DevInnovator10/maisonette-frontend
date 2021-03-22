import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Typography from '../../atoms/typography';
import calculateInstallments from '../../utils/calculateBNPLInstallments';

const MessageText = styled(Typography)`
  margin: ${({ theme }) => theme.modularScale.sixteen} auto;
  color: ${({ theme }) => theme.color.brand};
  font-size: ${({ theme }) => theme.modularScale.fourteen};
  text-align: center;
  width: 85%;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    width: auto;
  }
`;

const PaymentLogo = styled.img`
  margin: 0 0.5rem;
  height: ${({ theme }) => theme.modularScale.base};
  vertical-align: middle;
`;

const BNPLCombinedMessaging = (props) => {
  const [installmentCost, setInstallmentCost] = useState(false);

  useEffect(() => {

    const installment = calculateInstallments(props.amount);
    setInstallmentCost(installment);
  }, [props.amount]);

  return installmentCost && (
  <MessageText element="p" like="dec-1">
    {`Pay in 4 interest-free installments of ${installmentCost} with`}
    <PaymentLogo src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/checkout/afterpay.png`} alt="Afterpay Logo" />
      or
    <PaymentLogo src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/checkout/pp-with-logo.png`} alt="PayPal Logo" />
    *
  </MessageText>
  );
};

BNPLCombinedMessaging.propTypes = {
  amount: PropTypes.string.isRequired
};

export default BNPLCombinedMessaging;
