import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Router, { useRouter } from 'next/router';

import ProductHeader from '../../molecules/product-detail-header';
import ProductRestrictions from '../../molecules/product-detail-restrictions';
import ProductBadge from '../../molecules/product-badge';
import StickyProductAdd from '../../tissues/product-details-sticky-add-to-cart';
import ProductAddToCart from '../../tissues/product-details-add-to-cart';
import ProductAddToCartGift from '../../tissues/product-details-add-gift-card';
import ProductProperties from '../../tissues/product-details-properties';

// Context
import { useProduct } from '../../utils/context/product-provider';

const ProductInformation = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: product-information;
  flex: 1;
`;

const ProductBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  margin-bottom: 3rem;
  margin-top: -1rem;

  > div {
    margin: 1rem 2rem 0 0;

  }
`;

const ProductDetails = (props) => {
  const router = useRouter();

  /**
   * get pdpVariants value from siteSpect
   * which is pulled out and replaced with static value for a while
   */
  const pdpVariants = false;
  const {
    state: {
      activeColorVariants,
      activeColor
    },
    setColorVariants,
    setActiveColorVariants,
    setActiveColor
  } = useProduct();

  const groupColors = (variants = false) => {
    if (!variants) return false;

    const colorVariants = {};

    variants.forEach((v) => {
      if (v.option_values?.length > 1) {
        const currentColor = v.option_values[1].name.toLowerCase();
        // if the current color does not exist in the colorVariants object,
        // create a new property & store that variant
        // otherwise, store the variant with the corresponding existing color
        if (!colorVariants[currentColor]) {
          colorVariants[currentColor] = [v];
        } else {
          colorVariants[currentColor].push(v);
        }
      }
    });

    return colorVariants;
  };

  const [groupedColors] = useState(groupColors(props.product?.variants));
  const [activeVariant, setActiveVariant] = useState(null);
  const [activeVendor, setActiveVendor] = useState(null);
  const [monogramSelected, setMonogramSelected] = useState(false);

  const getInternationalShipping = () => {
    const id = activeVariant?.prices?.[0]?.vendor_id;
    const stockItem = activeVariant?.stock_items?.filter((item) => item.vendor_id === id);
    return !!stockItem?.[0]?.international_shipping;
  };

  const handleOnVariantChange = (variant) => {
    if (variant) {
      const maisonetteStockId = variant.stock_items.find((x) => x.stock_location_name === 'Maisonette Fulfillment');

      const bestMargin = variant.prices.sort((a, b) => (
        (a.price - a.offer_settings.cost_price > b.price - b.offer_settings.cost_price) ? 1 : -1
      ))[0];

      const vendor = maisonetteStockId?.vendor_id ?? bestMargin?.vendor_id;

      setActiveVariant(variant);
      setActiveVendor(vendor);
    } else {
      setActiveVariant(null);
      setActiveVendor(null);
    }
  };

  const isGiftCard = props.product.gift_card;

  const onVendorChange = (vendor) => setActiveVendor(vendor);

  const getLeadTime = () => {
    const monogram = activeVariant?.prices?.[0]?.monogram;
    let monogramLeadTime;

    if (monogram?.monogrammable_only || (monogram && monogramSelected)) {
      monogramLeadTime = monogram?.monogram_lead_time;
    }

    return monogramLeadTime ?? activeVariant?.lead_time;
  };

  const currentColorPrices = () => {
    const colorPricesArray = activeColorVariants.length
      ? activeColorVariants : props?.product?.variants;

    return colorPricesArray && colorPricesArray.length
      ? colorPricesArray.map((v) => v.prices[0])
      : [];
  };

  const noCurrentColorOffers = () => {
    const colorPricesArray = activeColorVariants.length
      ? activeColorVariants : props?.product?.variants;

    return colorPricesArray && colorPricesArray.length
      ? colorPricesArray.every((v) => v.price === null)
      : true;
  };

  useEffect(() => {
    if (pdpVariants && groupedColors && Object.keys(groupedColors).length) {
      setColorVariants(groupedColors);

      if (!props.isQuickshop) {
        // confirm that the query param exists as a color variant
        if (router.query?.color && groupedColors[router.query?.color]) {
          setActiveColor(router.query?.color);
          setActiveColorVariants(groupedColors[router.query?.color]);
        } else {
          // if no query param or an invalid query param,
          // then set active color to the 1st color option
          const inStockColor = Object.entries(groupedColors).find((color) => color[1][0].in_stock);

          const defaultColorVariant = inStockColor[0];
          setActiveColor(defaultColorVariant);
          setActiveColorVariants(groupedColors[defaultColorVariant]);
          Router.push(`/product/${props?.product?.slug}?color=${defaultColorVariant}`, undefined, { shallow: true });
        }
      } else {
        // if this is quickshop, then an active color was already selected from PLP.
        // we need to update the size variants to the correct color
        setActiveColorVariants(groupedColors[activeColor]);
      }
    }
  }, [groupedColors]);

  return (
    <ProductInformation key={props?.product?.id}>
      {
        props.product?.trends && props.product?.trends.length > 0 && (
          <ProductBadges>
            {
              props.product.trends.map(
                (badge) => <ProductBadge key={badge.type} badge={badge.value} />
              )
            }
          </ProductBadges>
        )
      }

      <ProductHeader
        product={props.product}
        isQuickshop={props.isQuickshop}
        title={props?.product?.name}
        brand={props?.product?.brand}
        brandSlug={props?.product?.brand_slug}
        prices={currentColorPrices()}
        noOffers={noCurrentColorOffers()}
        variant={activeVariant}
        vendor={activeVendor}
        slug={props?.product?.slug}
        finalSale={activeVariant?.prices?.[0]?.final_sale}
        isGiftCard={isGiftCard}
      />

      {
        !props.isQuickshop && (activeVariant || isGiftCard) && (
          <ProductRestrictions
            leadTime={getLeadTime()}
            importDuties={getInternationalShipping()}
            isGiftCard={isGiftCard}
          />
        )
      }

      {
        isGiftCard ? (
          <ProductAddToCartGift
            product={props.product}
            variant={activeVariant}
            vendor={activeVendor}
            onVariantChange={handleOnVariantChange}
          />
        ) : (
          <ProductAddToCart
            product={props.product}
            position={props.position}
            variant={activeVariant}
            vendor={activeVendor}
            onVariantChange={handleOnVariantChange}
            isQuickshop={props.isQuickshop}
            setMonogramSelected={setMonogramSelected}
            finalSale={!!activeVariant?.prices?.[0]?.final_sale ?? false}
            isGiftCard={isGiftCard}
          />
        )
      }

      {!props.isQuickshop ? (
        <StickyProductAdd
          product={props.product}
          position={props.position}
          variant={activeVariant}
          vendor={activeVendor}
          onVariantChange={handleOnVariantChange}
          setMonogramSelected={setMonogramSelected}
        />
      ) : null}

      {
        !props.isQuickshop && (
          <ProductProperties
            brand={props.product.brand}
            brandDescription={props.product.brand_description}
            description={props.product.description}
            order={99}
            product={props.product}
            variant={activeVariant}
            vendor={activeVendor}
            onVendorChange={onVendorChange}
          />
        )
      }

    </ProductInformation>
  );
};

ProductDetails.defaultProps = {
  isQuickshop: false,
  position: null
};

ProductDetails.propTypes = {
  product: PropTypes.object.isRequired,
  isQuickshop: PropTypes.bool,
  position: PropTypes.number
};

ProductDetails.whyDidYouRender = true;

export default ProductDetails;
