import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { formatMoney } from 'accounting-js';

import handleOnImageError from '../../utils/handleOnImageError';
import dateToString from '../../utils/dateToString';
import calculateLeadTime from '../../utils/calculateLeadTime';

import Button from '../../atoms/button';
import CartProductTitle from '../../molecules/cart-product-title';
import CrossIcon from '../../atoms/icon-cross';
import QuantitySelect from '../../molecules/quantity-select';
import Typography from '../../atoms/typography';
import ShipsFromBoutique from '../../molecules/shipping-boutique-text';
import { trackProductClick } from '../../utils/tracking';
import FinalSaleWarning from '../../molecules/final-sale-warning';

const Card = styled('div', { shouldForwardProp: (prop) => prop !== 'shouldUseBorder' })`
    border-top: ${({ theme, shouldUseBorder }) => (shouldUseBorder ? `1px solid ${theme.color.brandLight}` : 'none')};
  display: grid;
  grid-template-areas:
    "image info price"
    ". final-sale .";
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto;
  padding: ${(props) => props.theme.modularScale.base} 0;
`;

const Image = styled.img`
  display: block;
  grid-area: image;
  height: 6.5rem;
  width: 6.5rem;

  &.--wiggle {
    animation: ${({ theme }) => theme.animations.wiggle} ${({ theme }) => theme.animation.slow};
  }
`;

const InfoWrapper = styled.div`
  flex-grow: 1;
  grid-area: info;
  padding: 0 ${(props) => props.theme.modularScale.base};
`;

const Text = styled(Typography)`
  color: ${(props) => props.theme.color.brandLight};

  > span {
    color: ${(props) => props.theme.color.brand};
  }
`;

const Note = styled(Typography)`
  color: ${(props) => props.theme.color.brandLight};
  line-height: 1.5;

  & ~ & {
    margin-top: 0.5rem;
  }
`;

const Info = styled.span`
  display: flex;
  flex-direction: row;

  ${Text}:first-of-type {
    margin-right: 1.5rem;
  }
`;

const PriceWrapper = styled.div`
  grid-area: price;
  padding: 0 ${(props) => props.theme.modularScale.base};
  @media screen and (max-width: ${({ theme }) => theme.breakpoint.small}) {
    padding: 0 0 0 ${(props) => props.theme.modularScale.base};
  }
`;

const Price = styled(Typography, { shouldForwardProp: (prop) => prop !== 'isAdjusted' })`
  color: ${(props) => props.theme.color.brandLight};
  text-align: right;
  text-decoration: ${({ isAdjusted }) => ((isAdjusted) ? 'line-through' : 'none')};
`;

const Adjustment = styled(Typography)`
  color: ${(props) => (props.theme.color.brandGreen)};
  text-align: right;
  white-space: nowrap;
`;

const RemoveProduct = styled(Button)`
  text-decoration: none;
  align-items: center;
  align-self: flex-start;
  display: inline-flex;
  letter-spacing: 0.1em;
  margin-top: 1rem;
  text-transform: uppercase;

  svg {
    height: 0.8rem;
    width: 0.8rem;
    stroke-width: 10;
    stroke: ${(props) => props.theme.color.brand};
    margin-right: 0.5rem;
  }
`;

const OutOfStockLabel = styled(Typography)`
  color: ${(props) => props.theme.color.brandError};
`;

const GiftCardDetails = styled(Typography)`
  color: ${(props) => props.theme.color.brand};

  > span {
    color: ${(props) => props.theme.color.brandLight};
  }
`;

const MonogramText = styled('span', { shouldForwardProp: (prop) => prop !== 'monogramColor' })`
  color: ${({ monogramColor }) => monogramColor};
  ${({ monogramColor, theme }) => monogramColor?.toLowerCase() === '#ffffff' && css`
    background: ${theme.color.brand};
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  `};
`;

const CardBaseWrapper = styled.div`
  grid-area: final-sale;
  padding: 0 ${(props) => props.theme.modularScale.base};
`;

const FinalSale = styled(FinalSaleWarning)`
  margin-top: 1.6rem;
  margin-bottom: 1.6rem;
  >svg {
    width: 2.4rem;
  }
  @media (min-width: ${({ theme }) => theme.breakpoint.medium}){
    margin-top: 1.1rem;
    margin-bottom: 1.1rem;
    align-items: center;
    >svg {
      width: 1.6rem;
    }
}
`;

const OrderProductCard = (props) => {
  const { pathname } = useRouter();
  const [brand] = useState({ name: props.item.variant.brand, permalink: `/brands/${props.item.variant.brand_slug}` });
  const [title] = useState({ name: props.item.variant.name, permalink: `/product/${props.item.variant.slug}` });
  const [isAdjusted, setIsAdjusted] = useState(
    (props.adjustments.length > 0 && props.promotionable)
  );

  const imageRef = useRef();
  const cardRef = useRef();

  const handleProductRemove = () => props.onProductRemove(props.item);
  const handleUpdateProduct = (q) => props.onQuantityChange(q, props.item.id);

  const calculateProductTotalPrice = (
    price, quantity, adjustments = []
  ) => {
    const lineItemAdjustments = adjustments.reduce((a, c) => a + parseFloat(c.amount), 0);

    return quantity * price + lineItemAdjustments;
  };

  useEffect(() => {
    setIsAdjusted((props.adjustments.length > 0 && props.promotionable));
  }, [props.adjustments]);

  const handleProductClickTracking = (product, position, list) => {
    trackProductClick({ product, position, list }, true);
  };

  const shouldUseBorder = !pathname.includes('/checkout/confirmation/[id]') && !pathname.includes('/orders/[id]');

  return (
    <Card
      shouldUseBorder={shouldUseBorder}
      data-test-id="order-product-card"
      className={props.className}
      ref={cardRef}
      tabIndex="0"
    >
      <Image
        ref={imageRef}
        src={props.image || `${process.env.NEXT_PUBLIC_ASSET_HOST}/images/default-image.jpg`}
        alt={title.name}
        onError={handleOnImageError}
      />

      <InfoWrapper>
        <CartProductTitle
          brand={brand}
          product={title}
          onClick={() =>
            handleProductClickTracking(
              props.item,
              props.item.index,
              props.item.module
            )}
        />

        <Info data-test-id="order-product-info">
          <Text element="p" like="dec-1">
            {props.optionType}
            {': '}
            {props.option}
          </Text>

          {props.isMutatable && !props.isGiftCard ? (
            <QuantitySelect
              data-test-id="order-product-qty"
              stock={props.stock}
              selected={props.quantity}
              onChange={handleUpdateProduct}
              isCart
            />
          ) : (
            <Text data-test-id="order-product-qty" element="p" like="dec-1">
              Qty:
              {' '}
              {props.quantity}
            </Text>
          )}
        </Info>

        {props.monogram && (
          <Note data-test-id="order-product-monogram" element="p" like="dec-1">
            Monogram:
            {' '}
            {props.monogram?.text && (
              <>
                Text:
                {' "'}
                <MonogramText
                  monogramColor={props.monogram?.customization?.color?.value}
                >
                  {props.monogram?.text}
                </MonogramText>
                {'", '}
              </>
            )}
            {props.monogram?.customization?.font?.name
              && `Style: "${props.monogram?.customization?.font?.name}"`}
          </Note>
        )}

        {props.showShipsFromLabel && (
          <ShipsFromBoutique
            data-test-id="order-product-ship-from"
            boutique={props.vendor}
            country={props.country}
            threshold={props.cart.free_shipping_threshold}
            domesticOverride={props.domesticOverride}
          />
        )}

        {!props.promotionable && (
          <Text element="p" like="dec-1">
            Excluded from promo
          </Text>
        )}

        {props.backorder && (
          <Note
            data-test-id="order-product-backordered"
            element="p"
            like="dec-1"
          >
            Shipping Note: This item is backordered, will ship on
            {' '}
            <time dateTime={props.backorder}>
              {dateToString(props.backorder)}
            </time>
          </Note>
        )}

        {!!props.leadTime && (
          <Note data-test-id="order-product-lead-time" element="p" like="dec-1">
            Shipping Note: Ships within
            {' '}
            {calculateLeadTime(props.leadTime)}
          </Note>
        )}

        {props.showOutOfStockLabel && !props.inStock && (
          <OutOfStockLabel element="p" like="dec-1">
            Out of stock
          </OutOfStockLabel>
        )}

        {props.isGiftCard
          && props.item?.gift_cards?.map((gc, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <GiftCardDetails
              data-test-id="order-product-gift-details"
              element="p"
              like="dec-1"
              key={`$gift-card-details-${i}`}
            >
              <span>E-Gift: </span>
              {gc.recipient_name}
              {' at '}
              {gc.recipient_email}
            </GiftCardDetails>
          ))}
      </InfoWrapper>

      <PriceWrapper>
        <Price
          data-test-id="order-product-price"
          title="original price"
          element="p"
          like="dec-1"
          isAdjusted={isAdjusted}
        >
          {formatMoney(
            calculateProductTotalPrice(props.price, props.quantity),
            { precision: 2 }
          )}
        </Price>

        {isAdjusted
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
          ))}

        {isAdjusted && (
          <Price
            data-test-id="order-product-adjusted-price"
            title="total adjusted price"
            element="p"
            like="dec-1"
          >
            {formatMoney(
              calculateProductTotalPrice(
                props.price,
                props.quantity,
                props.adjustments
              ),
              { precision: 2 }
            )}
          </Price>
        )}
      </PriceWrapper>
      <CardBaseWrapper>
        {props.finalSale && <FinalSale />}
        {props.isMutatable && (
          <RemoveProduct styledLikeLink onClick={handleProductRemove}>
            <CrossIcon />
            Remove
          </RemoveProduct>
        )}
      </CardBaseWrapper>
    </Card>
  );
};

OrderProductCard.defaultProps = {
  backorder: null,
  cart: {},
  className: '',
  country: '',
  finalSale: false,
  image: '',
  item: null,
  isGiftCard: false,
  isMutatable: false,
  leadTime: null,
  monogram: null,
  onProductRemove: () => { },
  onQuantityChange: () => { },
  option: '',
  optionType: '',
  promotionable: true,
  showOutOfStockLabel: true,
  stock: 0,
  domesticOverride: false
};

OrderProductCard.propTypes = {
  backorder: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  cart: PropTypes.object,
  className: PropTypes.string,
  country: PropTypes.string,
  finalSale: PropTypes.bool,
  image: PropTypes.string,
  inStock: PropTypes.bool.isRequired,
  isGiftCard: PropTypes.bool,
  isMutatable: PropTypes.bool,
  item: PropTypes.object,
  leadTime: PropTypes.number,
  monogram: PropTypes.object,
  onProductRemove: PropTypes.func,
  onQuantityChange: PropTypes.func,
  option: PropTypes.string,
  optionType: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  promotionable: PropTypes.bool,
  adjustments: PropTypes.array.isRequired,
  quantity: PropTypes.number.isRequired,
  showOutOfStockLabel: PropTypes.bool,
  showShipsFromLabel: PropTypes.bool.isRequired,
  stock: PropTypes.number,
  vendor: PropTypes.string.isRequired,
  domesticOverride: PropTypes.bool
};

OrderProductCard.whyDidYouRender = true;

export default OrderProductCard;
