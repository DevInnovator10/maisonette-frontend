import React from 'react';
import styled from '@emotion/styled';
import Typography from '../typography';
import { useShippingCutoff } from '../../utils/hooks/useShippingCutoff';

const AlertText = styled(Typography)`
  font-size: ${({ theme }) => theme.modularScale.sixteen};
  color: ${({ theme }) => theme.color.redError};
  margin: 1rem 0 ${({ theme }) => theme.modularScale.sixteen};
`;

const ShippingMethodAlert = () => {
  // shippingCutoff is an object containing strings: { start, end, message }
  const { shippingCutoff } = useShippingCutoff();

  return shippingCutoff?.message
    ? <AlertText element="p" like="dec-1">{shippingCutoff.message}</AlertText>
    : null;
};

export default ShippingMethodAlert;
