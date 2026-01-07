import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Radio from '../../atoms/radio';
import Button from '../../atoms/button';
import Typography from '../../atoms/typography';

const PaymentRadio = styled(Radio)`
  padding: 0;

  :after, :before {
    display: none;
  }
`;

const InfoWrapper = styled.div`
  display: flex;
  flex: 1 0 auto;
`;

const Payment = styled.div`
  display: flex;
  min-height: 5rem;
  flex-direction: column;
  background: ${(props) => props.theme.color.backgroundLightBlue};
  border: 1px solid ${(props) => props.theme.color.backgroundLightBlue};
  padding: 1.6rem;
  color: ${(props) => props.theme.color.brand};
  font-family: ${(props) => props.theme.font.sans};
  font-size: 1.6rem;

  ${(props) => props.active && css`
    background: ${props.theme.color.white};
    border: 1px solid ${props.theme.color.brand};
  `}
`;

const Logo = styled.img`
  width: 3.5rem;
  height: 2.5rem;
  margin-right: ${(props) => props.theme.modularScale.small};
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1 0 auto;
`;

const ConfirmationWrapper = styled.div`
  text-align: right;

  span {
    font-size: 1.6rem;
  }
`;

const RemoveButton = styled(Button)`
  font-family: ${(props) => props.theme.font.sans};
  align-self: flex-end;
  font-size: 1.6rem;
  margin: 1rem 0 0 1rem;

  :disabled {
    opacity: 1;
  }
`;

const NewCardCopy = styled.span`
  line-height: normal;
  font-size: 1.4rem;
  color: ${(props) => props.theme.color.brandLightBlue};
  margin-top: 1rem;
`;

const PaymentMethodRadio = (props) => {
  const [removing, setRemoving] = useState(false);

  const handleChangeRemoving = (e) => {
    // prevent default to stop selection of card
    e.preventDefault();
    setRemoving(true);
  };

  const handleChange = () => {
    props.setPaymentSource(props.payment.id);
  };

  const handleRemoveCard = () => {
    props.handleOnCardDelete(props.payment);
  };

  const getLogo = () => {
    let logo;
    if (['Visa', 'MasterCard', 'Discover'].includes(props.payment.source.cc_type)) {
      logo = props.payment.source.cc_type.toLowerCase().replace(' ', '');
    }

    if (props.payment.source.cc_type === 'American Express') {
      logo = 'amex';
    }

    return logo;
  };

  const getName = () => `ending in - ${props.payment.source.last_digits}`;
  const getExp = () => `${props.payment.source.month}/${props.payment.source.year}`;

  const renderRemoveOrCopy = () => (props.newCard ? (
    <NewCardCopy>
        This card will be saved after checkout
    </NewCardCopy>
  ) : (
    <RemoveButton
      text="Remove"
      styledLikeLink
      onClick={handleChangeRemoving}
      disabled={props.disabled}
    />
  ));

  return (
    <PaymentRadio
      id={`payment-card-${props.payment.id}`}
      name="cc-payment"
      changed={handleChange}
      value={props.payment.id}
      active={props.payment.id === props.paymentSource}
      disabled={props.disabled}
    >
      <Payment active={props.payment.id === props.paymentSource}>
        <InfoWrapper>
          {
            getLogo() && (
              <Logo
                alt="payment method logo"
                src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/checkout/${getLogo()}.svg`}
              />
            )
          }
          <Info>
            <span>{getName()}</span>
            <span>
              exp:
              {' '}
              {getExp()}
            </span>
          </Info>
        </InfoWrapper>
        {
          removing ? (
            <ConfirmationWrapper>
              <Typography element="span" like="dec-2">Are you sure?</Typography>
              <RemoveButton
                text="Yes, remove"
                styledLikeLink
                onClick={handleRemoveCard}
              />
            </ConfirmationWrapper>
          ) : renderRemoveOrCopy()
        }
      </Payment>
    </PaymentRadio>
  );
};

PaymentMethodRadio.defaultProps = {
  payment: {},
  paymentSource: '',
  setPaymentSource: () => {},
  newCard: false,
  handleOnCardDelete: () => {},
  disabled: false
};

PaymentMethodRadio.propTypes = {
  payment: PropTypes.object,
  paymentSource: PropTypes.number,
  setPaymentSource: PropTypes.func,
  handleOnCardDelete: PropTypes.func,
  // eslint-disable-next-line react/no-unused-prop-types
  newCard: PropTypes.bool,
  disabled: PropTypes.bool
};

export default PaymentMethodRadio;
