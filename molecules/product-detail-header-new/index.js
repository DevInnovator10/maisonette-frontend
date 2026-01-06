import React, { useState, useEffect } from 'react';
import { formatMoney, unformat } from 'accounting-js';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connect } from 'react-redux';

import Link from '../../utils/link';
import Typography from '../../atoms/typography';
import ProductRestrictionsRevamp from '../product-detail-restrictions-new';
import ProductBadgeRevamp from '../product-badge-new';

import { useProduct } from '../../utils/context/product-provider';

const Title = styled(Typography)`
    color: ${({ theme }) => theme.color.bluePrimary};
`;

const Price = styled(Typography)`
  color: ${({ theme }) => theme.color.bluePrimary};
  justify-content: center;
  letter-spacing: normal;
  line-height: 2.2rem;
  margin-top: ${({ theme }) => theme.modularScale['2xlarge']};
  text-transform: uppercase;
`;

const Brand = styled(Typography)`
  color: ${({ theme }) => theme.color.bluePrimary};
  justify-content: center;
  letter-spacing: normal;
  line-height: 2.2rem;
  margin-top: 1rem;
`;

const MaisonetteStatement = styled(Typography)`
  color: ${({ theme }) => theme.color.bluePrimary};
  margin-top: 0.5rem;
`;

const NoUnderlineAnchor = styled.a`
  text-decoration: none;
`;

const ProductBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  margin-top: 2.5rem;
  margin-bottom: 1rem;

  > div {
    margin: 1rem 2rem 0 0;
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: space-evenly;
  margin-bottom: 2.5rem;

  ${Title}, ${Price} {
    line-height: 1;
    text-align: left;
  }
`;

const AfterPayMessage = styled.div`
  margin-top: ${({ theme }) => theme.modularScale.small};
  font-family: Sans-Serif;
  margin-bottom: 0.5rem;

  afterpay-placement {
    --logo-badge-width: 72px;
    margin-block-start: 0;
    margin-block-end: 0;
  }
`;

const PayPalMessage = styled.div`
`;

const ProductHeaderRevamp = (props) => {
  const { state: { addedOptionalMonogram, activeColorVariants } } = useProduct();

  const getVendorPrices = () => props.variant.prices.filter((v) => v.vendor_id === props.vendor);

  const getPrice = () => {
    const priceArray = props.variant ? getVendorPrices() : props.prices;

    const prices = priceArray.map(
      (p) => ({ original_price: p?.original_price ?? 0, price: p?.price ?? 0 })
    );
    const sales = priceArray.filter((p) => p?.on_sale || false);

    const final = { has_sale: false, discount: null };

    const getMin = (arr) => arr.reduce((acc, p) => {
      const a = acc;

      if (+p.price < +a.price && +p.price > 0) {
        a.original_price = +p.original_price;
        a.price = +p.price;
      }

      return a;
    }, {
      original_price: Math.min.apply(null, arr.map((p) => p.original_price).filter(Boolean)),
      price: Math.min.apply(null, arr.map((p) => p.price).filter(Boolean))
    });

    const getMax = (arr) => arr.reduce((acc, p) => {
      const a = acc;

      if (+p.price > +a.price) {
        a.original_price = +p.original_price;
        a.price = +p.price;
      }

      return a;
    }, { original_price: +arr[0].original_price, price: +arr[0].price });

    if (sales.length > 0) {
      const percents = sales.map((s) => Math.round(s.discount_percent));

      if (percents.every((p) => p === percents[0])) {
        final.discount = `(${Math.round(percents[0])}% Off)`;
      } else {
        final.discount = `(Up to ${Math.max(...percents)}% Off)`;
      }

      final.has_sale = true;
      final.max = getMax(sales);
      final.min = getMin(sales);
    } else {
      final.min = prices.length ? getMin(prices) : { price: 0 };
      final.max = prices.length ? getMax(prices) : { price: 0 };
    }

    if (props.variant && props.variant?.prices[0]?.monogram) {
      const { monogram } = props.variant?.prices[0];

      // if the current variant has
      // optional monogram with
      // an additional cost
      if (monogram.monogrammable
        && !monogram.monogrammable_only) {
        final.monogram_price = +monogram.monogram_price;
      }
    }

    return final;
  };

  const [currentPrice, setCurrentPrice] = useState(getPrice());

  const addMonogramPrice = (priceObj, monogramCost) => {
    const final = {};

    final.original_price = priceObj.original_price + monogramCost;
    final.price = priceObj.original_price + monogramCost;

    return final;
  };

  const isOutOfStock = () => (props.noOffers
    || (currentPrice.min.price + currentPrice.max.price === 0));

  const reachedStockLimit = () => {
    const { variant } = props;

    if (variant && variant.total_on_hand > 0) {
      const itemQuantity = props.cart?.line_items?.
        find((x) => x.variant_id === variant?.id)?.quantity || 0;

      const priceObj = props?.vendor
        ? variant.prices.find((x) => x.vendor_id === props.vendor)
        : variant?.prices[0];

      const max = 10;

      const count = priceObj.total_on_hand - itemQuantity > max
        ? max : priceObj.total_on_hand - itemQuantity;

      return count <= 0;
    }

    return false;
  };

  const determineBNPLAmount = () => {
    if (!currentPrice.has_sale && +currentPrice.min.price !== +currentPrice.max.price) {
      return 0;
    }

    return unformat(+currentPrice.min.price);
  };

  useEffect(() => {
    // if the user switched color options,
    // render the new general pricing
    if (activeColorVariants.length) {
      setCurrentPrice(getPrice());
    }
  }, [activeColorVariants]);

  useEffect(() => {
    // if user had selected the optional monogram
    // but switched sizes, adjust pricing accordingly if
    // there is a discrepancy between the different size pricings
    if (props.variant && addedOptionalMonogram) {
      const newPrice = getPrice();
      const { max, monogram_price } = newPrice;

      if ((max.original_price + monogram_price) !== currentPrice.max.original_price) {
        newPrice.max = addMonogramPrice(newPrice.max, newPrice.monogram_price);
        newPrice.min = addMonogramPrice(newPrice.min, newPrice.monogram_price);

        setCurrentPrice(newPrice);
      }
    } else {
      setCurrentPrice(getPrice());
    }
  }, [props.variant]);

  useEffect(() => {
    // if the user selected optional monogram
    // after selecting a size
    if (addedOptionalMonogram && currentPrice.monogram_price) {
      const withMonogramPrice = currentPrice;

      withMonogramPrice.max = addMonogramPrice(currentPrice.max, currentPrice.monogram_price);
      withMonogramPrice.min = addMonogramPrice(currentPrice.min, currentPrice.monogram_price);

      setCurrentPrice(withMonogramPrice);
    } else {
      setCurrentPrice(getPrice());
    }
  }, [addedOptionalMonogram]);

  return (
    <Header>
      <Link
        href={`/product/${props.slug}`}
        passHref
      >
        <NoUnderlineAnchor>
          <Title element="h1" like="heading-7">{props.title}</Title>
        </NoUnderlineAnchor>
      </Link>

      {
        props.brand && !props.isGiftCard && (
          <>
            {
              props.brandSlug ? (
                <>
                  <Brand element="span" like="dec-6">
                    {'From '}
                    <Link href={`/brands/${props.brandSlug}`} passHref>
                      <a>{props.brand}</a>
                    </Link>
                  </Brand>
                </>
              ) : <Brand element="span" like="dec-3">{props.brand}</Brand>
            }

            <MaisonetteStatement element="p" like="dec-4">
                  one of over
              {' '}
              <Link href={'/brands'} passHref>
                <a>
                  1000 brands
                </a>
              </Link>
              {' '}
                  on Maisonette
            </MaisonetteStatement>
          </>
        )
      }

      {
          !isOutOfStock() && (
            <>
              {currentPrice.has_sale && (
                <Price
                  tabIndex="0"
                  element="div"
                  like="dec-6"
                  css={(theme) => ({
                    color: theme.color.brandGreen
                  })}
                >
                  {` ${formatMoney(currentPrice.min.price)} ${currentPrice.discount}   `}
                  <Price
                    element="span"
                    like="dec-6"
                    css={(theme) => ({
                      textDecoration: 'line-through',
                      color: theme.color.brandLightBlue
                    })}
                  >
                    {formatMoney(currentPrice.min.original_price)}

                  </Price>
                </Price>
              )}

              {!currentPrice.has_sale && (
              <Price
                tabIndex="0"
                element="div"
                like="dec-6"
              >
                {
                    +currentPrice.min.price === +currentPrice.max.price
                      ? formatMoney(currentPrice.min.price)
                      : `${formatMoney(currentPrice.min.price)} - ${formatMoney(currentPrice.max.price)}`
                  }
              </Price>
              )}

              {
                props.variant && props.importDuties() && (
                  <MaisonetteStatement element="p" like="dec-4">
                    Import duties included
                  </MaisonetteStatement>
                )
              }

              <AfterPayMessage>
                <afterpay-placement
                  data-locale="en_US"
                  data-currency="USD"
                  data-intro-text="Pay in"
                  data-modal-link-style="learn-more-text"
                  data-badge-theme="white-on-black"
                  data-size={'xs'}
                  data-modal-theme="white"
                  data-amount={determineBNPLAmount()}
                />
              </AfterPayMessage>

              <PayPalMessage
                data-pp-message
                data-pp-style-layout="text"
                data-pp-style-logo-type="inline"
                data-pp-style-text-color="black"
                data-pp-style-text-align="left"
                data-pp-amount={determineBNPLAmount()}
              />
            </>
          )
        }

      {
        props.trends.length > 0 && (
          <ProductBadges>
            {props.trends.map(
              (badge) => <ProductBadgeRevamp key={badge.type} badge={badge.value} />
            )}
          </ProductBadges>
        )
      }

      {
        !props.hasVariants
        && (props.variant || props.isGiftCard)
        && !isOutOfStock()
        && (
          <ProductRestrictionsRevamp
            leadTime={props.getLeadTime()}
            finalSale={props.variant?.prices?.[0]?.final_sale}
            isGiftCard={props.isGiftCard}
            onlyOneLeft={props.variant?.total_on_hand === 1}
            reachedStockLimit={reachedStockLimit()}
          />
        )
      }

    </Header>
  );
};

ProductHeaderRevamp.defaultProps = {
  cart: {},
  title: '',
  brand: '',
  brandSlug: '',
  slug: '',
  variant: false,
  vendor: 0,
  noOffers: false,
  hasVariants: true,
  getLeadTime: () => {},
  isGiftCard: false,
  importDuties: () => {},
  trends: []
};

ProductHeaderRevamp.propTypes = {
  cart: PropTypes.object,
  brand: PropTypes.string,
  brandSlug: PropTypes.string,
  slug: PropTypes.string,
  title: PropTypes.string,
  prices: PropTypes.array.isRequired,
  variant: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  vendor: PropTypes.number,
  noOffers: PropTypes.bool,
  hasVariants: PropTypes.bool,
  getLeadTime: PropTypes.func,
  isGiftCard: PropTypes.bool,
  importDuties: PropTypes.func,
  trends: PropTypes.array
};

ProductHeaderRevamp.whyDidYouRender = true;

const mapStateToProps = (state) => ({
  cart: state.cart
});

export default connect(mapStateToProps, null)(ProductHeaderRevamp);
