import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import OrderItem from '../../molecules/orders-item';
import Typography from '../../atoms/typography';

const ListWrapper = styled(Typography)`
    display: flex;
  text-transform: capitalize;
  font-size: 1.2rem;

  dd {
    color: ${(props) => props.theme.color.bluePrimary};
    font-weight: 400;
    flex: 1;
  }

  dt {

    color: ${(props) => props.theme.color.brandLight};
    font-weight: 400;
    min-width: 5rem;
    padding-right: 0.8rem;
  }
`;

const dateOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
};

const OrderDetails = (props) => (
  <OrderItem className={props.className} title="Order">
    <dl>
      <ListWrapper element="div" like="dec-3">
        <dt>Placed:</dt>
        <dd>
          <time dateTime={props.placedAt} data-test-id="order-placed-date">
            {new Date(props.placedAt).toLocaleDateString('en-US', dateOptions)}
          </time>
        </dd>
      </ListWrapper>

      <ListWrapper element="div" like="dec-3">
        <dt>Status:</dt>
        <dd data-test-id="order-status">{props.status}</dd>
      </ListWrapper>
    </dl>
  </OrderItem>
);

OrderDetails.defaultProps = {
  className: ''
};

OrderDetails.propTypes = {
  className: PropTypes.string,
  placedAt: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired
};

export default memo(OrderDetails);
