import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Flag from 'react-flagkit';
import Typography from '../../atoms/typography';
import Checkbox from '../../atoms/checkbox';
import Button from '../../atoms/button';
import ShippingMethodAlert from '../../atoms/shipping-method-alert';
import ShipmentRadio from '../../molecules/shipment-radio';
import ShipmentProductCard from '../../molecules/shipment-product-card';

const ShipmentCard = styled.div`
  display: flex;
  flex-direction: column;
  font-size: ${({ theme }) => theme.modularScale.sixteen};
  border: 1px solid ${({ theme }) => theme.color.brandLight};
  padding:${({ theme }) => theme.modularScale.sixteen};

  :not(:last-of-type) {
    margin-bottom: ${({ theme }) => theme.modularScale.thirtyTwo};
  }
`;

const ShipmentHeading = styled.div`
  display: flex;
  justify-content: space-between;

  h3 {
    font-size: ${({ theme }) => theme.modularScale.twenty};
  }

  p {
    color: ${({ theme }) => theme.color.brandLightBlue};
  }
`;

const DetailSegment = styled.div`
  margin-top: ${({ theme }) => theme.modularScale.thirtyTwo};
`;

const DetailHeading = styled(Typography)`
  font-family: ${({ theme }) => theme.font.sans};
  letter-spacing: .1rem;
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.modularScale.sixteen};
`;

const ShipsFrom = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.modularScale.sixteen} 0 0 0;

  img {
    margin-right: 1rem;
  }
`;

const EditBagButton = styled(Button)`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 1.6rem;
`;

const MethodAndCardWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    flex-direction: row;

    div {
      flex: 0 1 50%;
    }

    ${DetailSegment}:first-of-type {
      order: 2;
      margin-left: ${(props) => props.theme.modularScale['4xlarge']};
    }
  }
`;

const GiftWrapCheckbox = styled(Checkbox)`
  font-size: ${({ theme }) => theme.modularScale.sixteen};
  padding-left: ${({ theme }) => theme.modularScale.twenty};
  margin-top: ${({ theme }) => theme.modularScale.sixteen};

  :before, :after {
    font-size: ${({ theme }) => theme.modularScale.small};
  }
`;

const CheckoutShipmentCard = (props) => {
  const [
    selectedShippingId,
    setSelectedShippingId
  ] = useState(props.shipment.selected_shipping_rate?.id);

  const calculateItemTotals = () => {
    let total = 0;

    props.lineItems.forEach((li) => {
      total += li.quantity;
    });

    return total;
  };

  const renderShipmentRadios = () => props.shipment.shipping_rates.map((rate, index) => (
    <ShipmentRadio
      // eslint-disable-next-line react/no-array-index-key
      key={`shipping-method-${props.shipment.id}-${index}`}
      active={selectedShippingId === rate.id}
      index={index}
      rate={rate}
      shipment={props.shipment}
      changed={() => {
        setSelectedShippingId(rate.id);
        props.handleShippingMethodChange(rate.id, props.shipment);
      }}
      loading={props.loading}
    />
  ));

  const renderProductCards = () => props.lineItems.map((item, i) => (
    <ShipmentProductCard
      key={`${props.shipment.id}-${item.id}`}
      backorder={item.variant.is_backorderable && item.backordered}
      brand={item.variant.brand}
      finalSale={item.final_sale}
      image={(item.variant.images[0] && item.variant.images[0].product_url)}
      inStock={item.variant.in_stock}
      isGiftCard={item.gift_cards.length > 0}
      item={{ ...item, index: i + 1, module: 'Checkout Shipping Step' }}
      monogram={item.monogram}
      option={item.variant.option_values.length > 0 ? item.variant.option_values[0].presentation : ''}
      optionType={item.variant.option_values.length > 0 ? item.variant.option_values[0].option_type_presentation : ''}
      price={item.price}
      promotionable={item.promotionable}
      adjustments={item.adjustments}
      quantity={item.quantity}
      stock={item.variant.total_on_hand}
      title={item.variant.name}
      vendor={item.vendor_name}
      giftwrapPrice={props.shipment.giftwrap?.giftwrap_price}
    />
  ));

  return (
    <ShipmentCard>
      <ShipmentHeading>
        <Typography element="h3" like="dec-2">{`Shipment ${props.index + 1}`}</Typography>
        <Typography element="p" like="dec-2">
          {`${calculateItemTotals()} ${calculateItemTotals() > 1 ? 'items' : 'item'}`}
        </Typography>
      </ShipmentHeading>
      {
        props.shipment.giftwrappable
        && (
          <GiftWrapCheckbox
            id={`gift-wrap-${props.shipment.id}`}
            active={props.shipment?.giftwrap?.id ?? false}
            htmlFor={`${props.shipment.id}.giftwrap`}
            changed={() => { props.handleGiftWrap(props.shipment); }}
            name="gift-wrap"
            value={props.shipment?.giftwrap?.id ?? false}
            data-test-id="giftwrap-checkbox"
          >
            Gift wrap this shipment
            {' '}
            {props.shipment?.display_estimated_giftwrap_price ? ` (+${props.shipment?.display_estimated_giftwrap_price})` : ''}
          </GiftWrapCheckbox>
        )
      }
      <DetailSegment>
        <DetailHeading element="h4" like="label-1">Ships from</DetailHeading>
        <ShipsFrom>
          <Flag country={props.shipment.country_iso} size={22} />
          <span>{props.shipment.stock_location_name}</span>
        </ShipsFrom>
      </DetailSegment>
      <MethodAndCardWrapper>
        <DetailSegment>
          <DetailHeading element="h4" like="label-1">Shipping method</DetailHeading>
          {props?.shipment?.international_shipping || <ShippingMethodAlert />}
          {renderShipmentRadios()}
        </DetailSegment>

        <DetailSegment>
          <ShipmentHeading>
            <DetailHeading element="h4" like="label-1">Items in shipment</DetailHeading>
            <EditBagButton
              styledLikeLink
              onClick={props.openCart}
            >
              Edit bag
            </EditBagButton>
          </ShipmentHeading>
          {renderProductCards()}
        </DetailSegment>
      </MethodAndCardWrapper>
    </ShipmentCard>
  );
};

CheckoutShipmentCard.defaultProps = {
  shipment: {},
  lineItems: [],
  handleGiftWrap: () => { },
  openCart: () => { },
  handleShippingMethodChange: () => { },
  loading: false
};

CheckoutShipmentCard.propTypes = {
  shipment: PropTypes.object,
  lineItems: PropTypes.array,
  index: PropTypes.number.isRequired,
  handleGiftWrap: PropTypes.func,
  openCart: PropTypes.func,
  handleShippingMethodChange: PropTypes.func,
  loading: PropTypes.bool
};

export default CheckoutShipmentCard;
