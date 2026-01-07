import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import OrderItem from '../../molecules/orders-item';
import Typography from '../../atoms/typography';

const ListWrapper = styled(Typography)`
  display: flex;
  text-transform: capitalize;

  dd {
    color: ${(props) => props.theme.color.brand};
    flex: 1
  }

  dt {
    color: ${(props) => props.theme.color.brandLight};
    min-width: 5rem;
    padding-right: 1rem;
  }
`;

const dateOptions = {
  day: '2-digit',

  month: '2-digit',
  year: 'numeric'
};

const ReturnDetails = (props) => (
  <OrderItem className={props.className} title="Return">
    <dl>
      <ListWrapper element="div" like="dec-1">
        <dt>Submitted:</dt>
        <dd>
          {
            props.return.created_at
              ? (
                <time dateTime={props.return.created_at}>
                  {new Date(props.return.created_at).toLocaleDateString('en-US', dateOptions)}
                </time>
              ) : 'Submitted date not provided'
          }
        </dd>
      </ListWrapper>

      <ListWrapper element="div" like="dec-1">
        <dt>Reason:</dt>
        <dd>
          {
            props.return.reason
              ? props.return.reason.name
              : 'Reason not provided'
          }
        </dd>
      </ListWrapper>

      <ListWrapper element="div" like="dec-1">

        <dt>Status:</dt>
        <dd>
          {
            props.return.state
              ? props.return.state
              : 'Status not provided'
          }
        </dd>
      </ListWrapper>

      <ListWrapper element="div" like="dec-1">
        <dt>Order:</dt>
        <dd>
          {
            props.return.order.number
              ? props.return.order.number
              : 'Order number not provided'
          }
        </dd>
      </ListWrapper>
    </dl>
  </OrderItem>
);

ReturnDetails.defaultProps = {
  className: ''
};

ReturnDetails.propTypes = {
  className: PropTypes.string,
  return: PropTypes.object.isRequired
};

ReturnDetails.whyDidYouRender = true;

export default ReturnDetails;
