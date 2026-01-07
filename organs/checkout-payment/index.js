import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Typography from '../../atoms/typography';
import CheckoutPaymentOptionsSection from '../../tissues/payment-options-section';
import CheckoutNewCardFields from '../../tissues/checkout-new-card-fields';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.color.brand};

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    grid-area: form;
  }
`;

const Heading = styled(Typography)`
  font-size: 2.4rem;
  margin-bottom: ${(props) => props.theme.modularScale.base};
`;

const CheckoutPaymentSection = (props) => {
  const [addingNewCard, setAddingNewCard] = useState(false);

  const showCardFields = () => {
    setAddingNewCard(true);
  };

  const showPaymentOptions = () => {
    setAddingNewCard(false);
  };

  return (
    <Wrapper>
      <Heading element="h1" like="heading-2">Payment</Heading>
      {
        addingNewCard ? (
          <CheckoutNewCardFields
            showPaymentOptions={showPaymentOptions}
            cart={props.cart}
            updateCart={props.updateCart}
            setLoading={props.setLoading}
          />
        ) : (
          <CheckoutPaymentOptionsSection
            showCardFields={showCardFields}
            setLoading={props.setLoading}
          />
        )
      }
    </Wrapper>
  );
};

CheckoutPaymentSection.defaultProps = {
  updateCart: () => {},
  cart: {},
  setLoading: () => {}
};

CheckoutPaymentSection.propTypes = {
  updateCart: PropTypes.func,
  cart: PropTypes.object,
  setLoading: PropTypes.func
};

export default CheckoutPaymentSection;
