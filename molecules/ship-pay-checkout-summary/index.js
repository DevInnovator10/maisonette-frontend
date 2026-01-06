import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import getPayment from '../../utils/getPayment';
import Typography from '../../atoms/typography';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, auto);
  grid-column-gap: 3rem;
  color: ${(props) => props.theme.color.brand};
  margin-bottom: ${(props) => props.theme.modularScale.large};
  
  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: none;
  }
`;

const Heading = styled(Typography)`
  grid-row: 1;
  letter-spacing: 0.24rem;
  line-height: ${(props) => props.theme.modularScale.large};
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
`;

const Details = styled(Typography)`
  grid-row: 2;
  font-size: 1.6rem;
`;

const ShipPayCheckoutSummary = (props) => (
  <Wrapper id="checkout-ship-pay-summary">
    <Heading element="h3" like="label-1">
        DELIVERY
    </Heading>
    <Details element="p" like="dec-1">
      {
        Object.keys(props.shippingAddress ?? {}).length > 0
          ? (
            <>
              {props.shippingAddress.address1}
              {props.shippingAddress.address2 && `, ${props.shippingAddress.address2}`}
              <br />
              {props.shippingAddress.city}
              ,
              {' '}
              {props.shippingAddress.state_text}
              <br />
              {props.shippingAddress.zipcode}
            </>
          )
          : (
            <>
            -
            </>
          )
      }
    </Details>
    <Heading element="h3" like="label-1">
        PAYMENT
    </Heading>
    {
        props.payments.length > 0
          ? (
            <>
              {props.payments.filter((p) => p.state === 'checkout' && p.source_type !== 'Spree::StoreCredit')
                .map((p) => (
                  <Details key={p.id} element="p" like="dec-1">
                    {getPayment(p, true)}
                  </Details>
                ))}
            </>
          ) : (
            <>
            -
            </>
          )
      }
  </Wrapper>
);

ShipPayCheckoutSummary.defaultProps = {
  shippingAddress: {},
  payments: []
};

ShipPayCheckoutSummary.propTypes = {
  shippingAddress: PropTypes.object,
  payments: PropTypes.array
};

export default ShipPayCheckoutSummary;
