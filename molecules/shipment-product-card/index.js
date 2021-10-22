import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { formatMoney } from 'accounting-js';
import Typography from '../../atoms/typography';
import CartProductTitle from '../cart-product-title';
import handleOnImageError from '../../utils/handleOnImageError';
import dateToString from '../../utils/dateToString';
import { trackProductClick } from '../../utils/tracking';

const Card = styled.div`
  display: grid;
  grid-template-areas: "image info";
  grid-template-columns: auto 1fr auto;
  padding-top: ${(props) => props.theme.modularScale.base};
  font-size: 1.6rem;
  color: ${(props) => props.theme.color.brand};
`;

const Image = styled.img`
  display: block;
  grid-area: image;
  height: 6.5rem;
  width: 6.5rem;
`;

const InfoWrapper = styled.div`
  flex-grow: 1;
  grid-area: info;
  padding: 0 ${(props) => props.theme.modularScale.base};
`;

const Text = styled(Typography)``;

const Note = styled(Typography)`
  line-height: 1.5;

  & ~ & {
    margin-top: 0.5rem;
  }
`;

const FinalSale = styled(Note)`
  color: ${(props) => props.theme.color.redError};
`;

const Info = styled.span`
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  ${Text}:first-of-type {
    margin-right: ${(props) => props.theme.modularScale.medium};
  }
`;

const CostWrapper = styled.div`
  display: flex;

  p:not(:first-of-type) {
    margin-left: 1rem;
  }
`;

const MonogramNote = styled(Note)`
  color: ${(props) => props.theme.color.brandLightBlue};
  margin-top: 1.6rem;
`;

const Price = styled(Typography, { shouldForwardProp: (prop) => prop !== 'isAdjusted' })`
  text-decoration: ${({ isAdjusted }) => ((isAdjusted) ? 'line-through' : 'none')};
`;

const Adjustment = styled(Typography)`
  color: ${(props) => (props.theme.color.brandGreen)};
  white-space: nowrap;
`;

const OutOfStockLabel = styled(Typography)`
  color: ${(props) => props.theme.color.redError};
`;

const GiftCardDetails = styled(Typography)``;

const MonogramText = styled.span``;

const MonogramDetails = styled.p``;

const ExcludedFromPromo = styled(Text)`
  color: ${(props) => props.theme.color.redError};
`;

const ShipmentProductCard = (props) => {
  const [brand] = useState({ name: props.item.variant.brand, permalink: `/brands/${props.item.variant.brand_slug}` });
  const [title] = useState({ name: props.item.variant.name, permalink: `/product/${props.item.variant.slug}` });
  const [isAdjusted, setIsAdjusted] = useState(
    (props.adjustments.length > 0 && props.promotionable)
  );

  useEffect(() => {
    setIsAdjusted((props.adjustments.length > 0 && props.promotionable));
  }, [props.adjustments]);

  const calculateProductTotalPrice = (
    price, quantity, adjustments = []
  ) => {
    const lineItemAdjustments = adjustments.reduce((a, c) => a + parseFloat(c.amount), 0);

    return quantity * price + lineItemAdjustments;
  };

  const handleProductClickTracking = (product, position, list) => {
    trackProductClick({ product, position, list }, true);
  };

  return (
    <Card
      data-test-id="order-product-card"
      className={props.className}
      tabIndex="0"
    >

      <Image
        src={props.image || `${process.env.NEXT_PUBLIC_ASSET_HOST}/images/default-image.jpg`}
        alt={title.name}
        onError={handleOnImageError}
      />

      <InfoWrapper>
        {
          props.noLinks ? (
            <>
              <Text element="p" like="dec-1">
                {props.brand}
              </Text>
              <Text element="p" like="dec-1">
                {props.title}
              </Text>
            </>
          )
            : (
              <CartProductTitle
                isNewCheckout
                brand={brand}
                product={title}
                onClick={() => handleProductClickTracking(
                  props.item,
                  props.item.index,
                  props.item.module
                )}
              />
            )
        }
        <CostWrapper>

          <Price data-test-id="order-product-price" title="original price" element="p" like="dec-1" isAdjusted={isAdjusted}>
            {formatMoney(
              calculateProductTotalPrice(props.price, props.quantity),
              { precision: 2 }
            )}
          </Price>

          {
            isAdjusted
              && props.adjustments.map((adjustment, i) => (
                <Adjustment
                  data-test-id="order-product-adjustment"
                  title={`${adjustment.label} adjustment`}
                  // eslint-disable-next-line react/no-array-index-key
                  key={`adjustments-${adjustment.label}-${i}`}
                  element="p"
                  like="dec-1"
                >
                  -
                  {' '}
                  {formatMoney(adjustment.amount * -1, { precision: 2 })}
                </Adjustment>
              ))
            }

          {
            isAdjusted
              && (
                <Price data-test-id="order-product-adjusted-price" title="total adjusted price" element="p" like="dec-1">
                  {
                    formatMoney(
                      calculateProductTotalPrice(
                        props.price,
                        props.quantity,
                        props.adjustments
                      ), { precision: 2 }
                    )
                  }
                </Price>
              )
          }
        </CostWrapper>

        { props.monogram && <FinalSale element="p" like="dec-1">Final Sale</FinalSale> }

        <Info data-test-id="order-product-info">
          <Text element="p" like="dec-1">
            {props.optionType}
            {': '}
            {props.option?.replace?.('- Monogram', '')}
          </Text>
          <Text data-test-id="order-product-qty" element="p" like="dec-1">
            Qty:
            {' '}
            {props.quantity}
          </Text>
        </Info>

        {
          props.monogram && (
            <>
              <MonogramNote element="p" like="dec-1">Monogram</MonogramNote>
              <Note element="p" like="dec-1">
                {
                  props.monogram?.text && (
                    <>
                      Text:
                      {' "'}
                      <MonogramText data-test-id="order-product-monogram-text">
                        {props.monogram?.text}
                      </MonogramText>
                      {'"'}
                      <br />
                    </>
                  )
                }

              </Note>
            </>
          )
        }

        {
          props.monogram?.customization?.font?.name
            && (
              <MonogramDetails data-test-id="order-product-monogram-font">
                {`Style: ${props.monogram?.customization?.font?.name}`}
              </MonogramDetails>
              )
        }

        {
          props.monogram?.customization?.color?.name
              && (
              <MonogramDetails data-test-id="order-product-monogram-color">
                {`Color: ${props.monogram?.customization?.color?.name}`}
                {' '}
              </MonogramDetails>
          )
        }

        { !props.promotionable && <ExcludedFromPromo element="p" like="dec-1">Excluded from promo</ExcludedFromPromo> }

        {
          props.backorder && (
            <Note data-test-id="order-product-backordered" element="p" like="dec-1">
              Shipping Note: This item is backordered, will ship on
              {' '}
              <time dateTime={props.backorder}>
                {dateToString(props.backorder)}
              </time>
            </Note>
          )
        }

        {
          props.isGiftCard && (
            props.item?.gift_cards?.map((gc, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <GiftCardDetails data-test-id="order-product-gift-details" element="p" like="dec-1" key={`$gift-card-details-${i}`}>
                <span>E-Gift: </span>
                {gc.recipient_name}
                {' at '}
                {gc.recipient_email}
              </GiftCardDetails>
            ))
          )
        }

        { props.finalSale && !props.monogram && <FinalSale element="p" like="dec-1">Final Sale</FinalSale> }

        {
          props.showOutOfStockLabel && !props.inStock && (
            <OutOfStockLabel element="p" like="dec-1">Out of stock</OutOfStockLabel>
          )
        }
      </InfoWrapper>
    </Card>
  );
};

ShipmentProductCard.defaultProps = {
  backorder: null,
  className: '',
  finalSale: false,
  image: '',
  item: null,
  isGiftCard: [],
  monogram: null,
  option: '',
  optionType: '',
  promotionable: true,
  showOutOfStockLabel: true,
  noLinks: false
};

ShipmentProductCard.propTypes = {
  backorder: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  className: PropTypes.string,
  finalSale: PropTypes.bool,
  image: PropTypes.string,
  inStock: PropTypes.bool.isRequired,
  isGiftCard: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  item: PropTypes.object,
  monogram: PropTypes.object,
  option: PropTypes.string,
  optionType: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  promotionable: PropTypes.bool,
  adjustments: PropTypes.array.isRequired,
  quantity: PropTypes.number.isRequired,
  showOutOfStockLabel: PropTypes.bool,
  noLinks: PropTypes.bool,
  brand: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default ShipmentProductCard;
