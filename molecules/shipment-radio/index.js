import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Typography from '../../atoms/typography';
import Radio from '../../atoms/radio';

const ShippingRadio = styled(Radio)`
  display: grid;
  color: ${(props) => props.theme.color.brand};
  grid-gap: 1rem;
  margin-top: 1rem;
  background: ${(props) => props.theme.color.backgroundLightBlue};
  padding: 1rem 1rem 1rem 4rem;

  :before {
    left: 1rem;
  }

  :after {
    left: 1.3rem;
  }

  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, max-content);

`;

const ETA = styled(Typography)`
  font-size: 2rem;
  grid-column: 1 / -1;
  grid-row: 1;
`;

const ShipMethodCost = styled(Typography)`
  grid-column: 1;
  grid-row: 2;
`;

const ShipMethodName = styled(Typography)`
  grid-column: 2;
  grid-row: 2;
`;

const getShipMethodCost = (rate) => {
  const { total_cost } = rate;
  // `total_cost` is expected to have one of these 3 values:
  //   "Free"
  //   "(Included in flat rate)"
  //   "+$x.xx"

  // Guard clause if this empty/null/undefined:
  if (!total_cost) return 'Fetch Error';

  // This regex will remove all +, $, (, and ) from the API output
  const totalString = total_cost.replaceAll(/[+$()]*/g, '');

  // If it's a number, we'll prepend a $, otherwise, just run the string as is:
  return Number.isNaN(parseInt(totalString, 10)) ? totalString : `$${totalString}`;
};

const ShipmentRadio = (props) => (
  <ShippingRadio
    // eslint-disable-next-line react/no-array-index-key
    key={`shipping-method-${props.shipment.id}-${props.index}`}
    name={`shipping-method-${props.rate.name}-${props.shipment.id}`}
    active={props.active}
    changed={props.changed}
    id={`rate-${props.rate.id}`}
    className={props.active ? 'shipping-rate-selected' : 'shipping-rate-not-selected'}
  >
    <ETA
      element="h5"
      like="label-2"
    >
      {
        props.active && props.shipment?.delivery_estimation && !props.loading
          ? props.shipment?.delivery_estimation : 'Select to see estimate'
      }
    </ETA>
    <ShipMethodCost
      element="p"
      like="label-2"
    >
      {getShipMethodCost(props.rate)}
    </ShipMethodCost>
    <ShipMethodName
      element="p"
      like="label-2"
    >
      {props.rate.name}
    </ShipMethodName>
  </ShippingRadio>
);

ShipmentRadio.defaultProps = {
  loading: false
};

ShipmentRadio.propTypes = {
  rate: PropTypes.object.isRequired,
  shipment: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
  changed: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default ShipmentRadio;
