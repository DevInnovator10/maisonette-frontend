import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Typography from '../../atoms/typography';

const Title = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: 2rem;
  letter-spacing: 0.2em;
  min-width: 5rem;
  text-transform: uppercase;
`;

const OrderWrapper = styled('div', { shouldForwardProp: (prop) => prop !== 'text' })`
  @media screen and (max-width: ${(props) => props.theme.breakpoint.small}) {
    ${({ text, theme }) => text === 'Payment' && `
      border-top: 1px solid ${theme.color.brandLight};
      border-bottom: 1px solid ${theme.color.brandLight};
      padding: 3.2rem 0;
    `}
  }
`;

const OrderItem = (props) => (
  <OrderWrapper data-test-id={`order-data-${props.title.toLowerCase().replace(' ', '-')}`} className={props.className} text={props.title}>
    <Title element="p" like="label-1" text={props.title}>{props.title}</Title>
    {props.children}
  </OrderWrapper>
);

OrderItem.defaultProps = {
  className: ''
};

OrderItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired
};

OrderItem.whyDidYouRender = true;

export default OrderItem;
