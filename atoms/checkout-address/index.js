import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import formatPhoneNumber from '../../utils/formatPhoneNumber';

const Address = styled.div`
  background: ${(props) => props.theme.color.backgroundLightBlue};
  padding: 1.6rem;
  color: ${(props) => props.theme.color.brand};
  font-family: ${(props) => props.theme.font.sans};
  width: 100%;
  text-align: left;
`;

const CheckoutAddressCard = (props) => (
  props.address

  && (
    <Address
      data-test-id="checkout-submitted-ship-address"
    >
      {`${props.address.firstname} ${props.address.lastname}`}
      <br />
      {`${props.address.address1}`}
      {props.address.address2 && `, ${props.address.address2}`}
      <br />
      {`${props.address.city}, ${props.address.state_text} ${props.address.zipcode}`}
      <br />
      {formatPhoneNumber(props.address.phone)}
    </Address>
  )

);

CheckoutAddressCard.propTypes = {
  address: PropTypes.object.isRequired
};

export default CheckoutAddressCard;
