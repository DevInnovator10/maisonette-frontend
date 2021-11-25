import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Typography from '../../atoms/typography';
import Button from '../../atoms/button';
import CheckoutAddress from '../../atoms/checkout-address';
import CheckoutStepNumber from '../../atoms/checkout-step-number';

const SectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    grid-area: delivery;
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
  }
`;

const AddressWrapper = styled.div`
  width: 100%;
  color: ${({ theme }) => theme.color.brand};
`;

const Heading = styled(Typography)`
  font-size: ${({ theme }) => theme.modularScale.twentyFour};
  margin-bottom: ${({ theme }) => theme.modularScale.thirtyTwo};
`;

const AddEditButton = styled(Button)`
  padding: 0;
  width: 22rem;
  font-size: ${({ theme }) => theme.modularScale.fourteen};
  margin-top: ${({ theme }) => theme.modularScale.thirtyTwo};
  text-align: center;
`;

const CheckoutDeliverySection = (props) => (
  <SectionWrapper id="checkout-delivery-section">
    <CheckoutStepNumber stepNumber="1" />
    <AddressWrapper>
      <Heading element="h2" like="heading-5">Delivery address</Heading>
      {
        props.address
          && (
            <CheckoutAddress
              display
              address={props.address}
            />
          )
      }

      <AddEditButton
        outline
        isLink
        text={props.address ? 'change address' : 'add address'}
        href="/checkout/delivery-address"
        data-test-id="checkout-delivery-address-button"
      />

    </AddressWrapper>
  </SectionWrapper>
);

CheckoutDeliverySection.defaultProps = {
  address: false
};

CheckoutDeliverySection.propTypes = {
  address: PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
};

export default CheckoutDeliverySection;
