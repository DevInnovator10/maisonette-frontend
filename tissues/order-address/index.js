import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import OrderItem from '../../molecules/orders-item';
import Typography from '../../atoms/typography';

import formatPhoneNumber from '../../utils/formatPhoneNumber';

const Address = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
`;

const getFullName = (address) => {
  if (!address) return null;
  const { firstname = '', lastname = '', full_name = null } = address;
  return full_name || `${firstname} ${lastname}`;
};

const OrderAddress = (props) => (
  <OrderItem className={props.className} title={props.title}>
    <Address element="address" like="dec-1">
      {getFullName(props.address)}
      <br />
      {props?.address?.address1}
      {props?.address?.address2 && `, ${props?.address?.address2}`}
      <br />
      {props?.address?.city}
      {', '}
      {props?.address?.state_text}
      {' '}

      {props?.address?.zipcode}
      <br />
      {props?.address?.country?.name || props?.address?.country?.iso}
      <br />
      {formatPhoneNumber(props?.address?.phone)}
    </Address>
  </OrderItem>
);

OrderAddress.defaultProps = {
  className: ''
};

OrderAddress.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  address: PropTypes.object.isRequired
};

OrderAddress.whyDidYouRender = true;

export default OrderAddress;
