import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { formatMoney } from 'accounting-js';

import dateToString from '../../utils/dateToString';
import Link from '../../utils/link';
import reformatTrackingUrl from '../../utils/reformatTrackingUrl';
import Typography from '../../atoms/typography';

const OrderCardWrapper = styled.div`
    color: ${(props) => props.theme.color.brand};
    font: ${(props) => props.theme.font.caption};
    :not(last-of-type) {
    margin-bottom: ${(props) => props.theme.modularScale.xlarge};
  }
`;

const OrderCard = styled.div`
  border: 2px solid ${(props) => props.theme.color.brandLight};
  padding: 0 ${(props) => props.theme.modularScale.base};
`;

const AnchorWrapper = styled.div`
  display: flex;
`;

const Anchor = styled(Typography)`
  text-decoration: none;
  font-size: ${(props) => props.theme.modularScale.sixteen};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OrderAnchor = styled(Anchor)`
  font-size: ${(props) => props.theme.modularScale.eighteen};
`;

const OrderDetails = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.color.brandLight};
  padding: ${(props) => props.theme.modularScale.base} 0;
  :last-of-type {
    border-bottom: 0;
  }
  > a {
    font-size: ${(props) => props.theme.modularScale.medium};
  }
`;

const OrderStatusWrapper = styled.div`
  width: 7rem;
  border-radius: 3.2rem;
  text-align: center;
  background-color: ${(props) =>
    (props.state === 'Complete'
      ? props.theme.color.brandGreen
      : props.theme.color.brandA11yRed)};
`;

const OrderStatus = styled(Typography)`
  color: ${(props) => props.theme.color.white};
  vertical-align: bottom;
`;

const OrderDetailWrapper = styled.div`
  flex: 1 0 auto;
  max-width: 100%;
`;

const Label = styled(Typography)`
  color: ${(props) => props.theme.color.brandA11yLight};
`;

const Shipment = styled.div`
  display: grid;
  grid-template-columns: 20% 80%;
`;

const Detail = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isState'
})`
  font-size: ${({ isState, theme }) => (isState ? theme.modularScale.sixteen : theme.modularScale.fourteen)};
  grid-column: 2;
  text-transform: capitalize;
`;

const Total = styled(Detail)`
  font-size: ${(props) => props.theme.modularScale.sixteen};
`;

const Date = styled(Total)``;

const ShipmentCounter = styled(Typography)`
  font-size: ${(props) => props.theme.modularScale.sixteen};
  font-family: ${(props) => props.theme.font.sans};
  grid-row-start: 1;
  grid-row-end: ${(props) => props.gridRowEnd};
`;

const ReturnWrapper = styled(Typography)`
  margin: 1rem auto;
  font-size: ${(props) => props.theme.modularScale.fourteen};
  text-align: center;
  a {
    font-size: ${(props) => props.theme.modularScale.fourteen};
    margin: 0 0.25rem;
    text-decoration: underline;
    overflow: visible;
  }
`;

const renderShipments = (shipments) => (
  shipments.map((shipment, index) => {
    const hasShipmentComma = shipment?.tracking?.includes(',');
    const shipmentTracking = shipment.tracking && hasShipmentComma
      ? shipment.tracking?.split(',').length
      : 1;
    return (
      <Shipment key={shipment.number}>
        {shipment.tracking ? (
          <>
            <ShipmentCounter
              element="div"
              like="label-1"
              gridRowEnd={shipmentTracking + 1}
            >
              {`${index + 1} of ${shipments.length}:`}
            </ShipmentCounter>

            {hasShipmentComma ? (
              shipment.tracking.split(',').map((tracking) => (
                <AnchorWrapper key={tracking.trim()}>
                  <Anchor
                    target="_blank"
                    rel="noopener noreferrer"
                    href={reformatTrackingUrl(
                      shipment.tracking_url,
                      tracking.trim()
                    )}
                    element="a"
                    like="dec-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {tracking.trim()}
                  </Anchor>
                </AnchorWrapper>
              ))
            ) : (
              <AnchorWrapper>
                <Anchor
                  target="_blank"
                  rel="noopener noreferrer"
                  href={shipment.tracking_url}
                  element="a"
                  like="dec-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {shipment.tracking}
                </Anchor>
              </AnchorWrapper>
            )}

            {shipment.delivery_estimation && (
              <Detail element="span" like="label-2">
                {`ETA: ${shipment.delivery_estimation}`}
              </Detail>
            )}
          </>
        ) : (
          <>
            <ShipmentCounter element="p" like="label-1">
              {`${index + 1} of ${shipments.length}:`}
            </ShipmentCounter>
            <Detail isState element="span" like="label-2">
              {shipment.state}
            </Detail>
          </>
        )}
      </Shipment>
    );
  })
);

const OrderPageCard = (props) => (
  <OrderCardWrapper>
    <Link href={`/orders/${props.order.number}`} passHref>
      <OrderCard>
        <OrderDetails>
          <OrderAnchor element="a" like="dec-2">
            {`#${props.order.number}`}
          </OrderAnchor>
          <OrderStatusWrapper state={props.order.state}>
            <OrderStatus element="span" like="dec-1">
              {props.order.state}
            </OrderStatus>
          </OrderStatusWrapper>
        </OrderDetails>

        <OrderDetails>
          <OrderDetailWrapper>
            <Label element="label" like="label-1">
              {' '}
              Total
            </Label>
            <Total element="p" like="label-2">
              {formatMoney(props.order.total)}
            </Total>
          </OrderDetailWrapper>
          <OrderDetailWrapper>
            <Label element="label" like="label-1">
              {' '}
              Order Date
            </Label>
            <Date element="p" like="label-2">
              {dateToString(props.order.completed_at, 'short-m-d-y')}
            </Date>
          </OrderDetailWrapper>
        </OrderDetails>

        <OrderDetails>
          <OrderDetailWrapper>
            <Label element="label" like="label-1">
              {`Shipments (${props.order.shipments.length} total)`}
            </Label>
            {renderShipments(props.order.shipments)}
          </OrderDetailWrapper>
        </OrderDetails>
      </OrderCard>
    </Link>
    <ReturnWrapper element="div" like="dec-5">
      {props.order.eligible_for_return && props.order.narvar_return_url ? (
        <Anchor href={props.order.narvar_return_url} element="a" like="dec-2">
          Return item(s) from this order
        </Anchor>
      ) : (
        <>
          Not eligible for return (
          <Link href="/returns-guide" passHref>
            <Anchor element="a" like="dec-1" target="_blank">
              View Return Policy
            </Anchor>
          </Link>
          )
        </>
      )}
    </ReturnWrapper>
  </OrderCardWrapper>
);

OrderPageCard.defaultProps = {};

OrderPageCard.propTypes = {
  order: PropTypes.object.isRequired
};

export default OrderPageCard;
