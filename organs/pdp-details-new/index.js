import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Router, { useRouter } from 'next/router';

import BreadCrumbsRevamp from '../../molecules/breadcrumbs-new';
import ProductHeaderRevamp from '../../molecules/product-detail-header-new';
import ProductServiceLevels from '../../molecules/product-detail-service-levels';
import ProductDescriptionsRevamp from '../../molecules/product-detail-descriptions-new';
import StickyProductAdd from '../../tissues/product-details-sticky-add-to-cart';
import ProductAddToCartRevamp from '../../tissues/product-details-add-to-cart-new';
import ProductAddToCartGiftRevamp from '../../tissues/product-details-add-gift-card-new';
import ProductPropertiesRevamp from '../../tissues/product-details-properties-new';

import { useProduct } from '../../utils/context/product-provider';

const ProductInformation = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: product-information;
  flex: 1;
`;

const ProductDescriptionRevamp = styled(ProductDescriptionsRevamp)`
  @media (max-width: ${(props) => props.theme.breakpoint.medium}) {
    order: 98;
  }
`;

const ProductDetailsRevamp = (props) => {
  const router = useRouter();
  const {
    state: {
      activeColorVariants,
      activeColor
    },
    setColorVariants,
    setActiveColorVariants,
    setActiveColor
  } = useProduct();

  const groupColors = (variants) => {
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

  /**
   * use siteSpect to get pdpVariants value
   * which is pulled out and replaced with static value for a while
   */
  const pdpVariants = false;

  const getInternationalShipping = () => {
    const id = activeVariant?.prices?.[0]?.vendor_id;
    const stockItem = activeVariant?.stock_items?.filter((item) => item.vendor_id === id);
    return !!stockItem?.[0]?.international_shipping;
  };

  const handleOnVariantChange = (variant) => {
    if (variant) {
      const maisonetteStockId = variant.stock_items.find((x) => x.stock_location_name === 'Maisonette');

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
  const hasVariants = () => {
    if (pdpVariants && activeColorVariants.length > 1) return true;
    return props.product?.variants?.length > 1;
  };

  const onVendorChange = (vendor) => setActiveVendor(vendor);

  const getLeadTime = () => {
    const monogram = activeVariant?.prices?.[0]?.monogram;
    let monogramLeadTime;

    if (monogram?.monogrammable_only || (monogram && monogramSelected)) {
      monogramLeadTime = monogram?.monogram_lead_time;
    }

    return monogramLeadTime ?? activeVariant?.lead_time;
  };

  const isFinalSale = () => {
    if (activeVariant) {
      return activeVariant?.prices?.[0]?.final_sale;
    }

    const vars = pdpVariants ? activeColorVariants : props.product.variants;

    return vars.some((v) => (v.prices?.length && v.prices?.[0]?.final_sale));
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
    if (groupedColors && Object.keys(groupedColors).length) {
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
      <BreadCrumbsRevamp
        breadcrumbs={props.product?.breadcrumb_taxons || []}
        isProductInfo
      />

      <ProductHeaderRevamp
        isQuickshop={props.isQuickshop}
        title={props?.product?.name}
        brand={props?.product?.brand}
        brandSlug={props?.product?.brand_slug}
        prices={currentColorPrices()}
        noOffers={noCurrentColorOffers()}
        variant={activeVariant}
        vendor={activeVendor}
        slug={props?.product?.slug}
        hasVariants={hasVariants()}
        isGiftCard={isGiftCard}
        getLeadTime={getLeadTime}
        importDuties={getInternationalShipping}
        trends={(props.product?.trends && props.product?.trends.length > 0)
          ? props.product?.trends : []}
      />

      {
        isGiftCard ? (
          <ProductAddToCartGiftRevamp
            product={props.product}
            variant={activeVariant}
            vendor={activeVendor}
            onVariantChange={handleOnVariantChange}
          />
        ) : (
          <ProductAddToCartRevamp
            product={props.product}
            position={props.position}
            variant={activeVariant}
            vendor={activeVendor}
            onVariantChange={handleOnVariantChange}
            isQuickshop={props.isQuickshop}
            setMonogramSelected={setMonogramSelected}
            getLeadTime={getLeadTime}
          />
        )
      }

      {
        !props.isQuickshop && (
          <StickyProductAdd
            product={props.product}
            position={props.position}
            variant={activeVariant}
            vendor={activeVendor}
            onVariantChange={handleOnVariantChange}
            setMonogramSelected={setMonogramSelected}
          />
        )
      }

      {!props.isQuickshop && <ProductServiceLevels finalSale={isFinalSale()} />}

      {
        !props.isQuickshop && (
          <ProductDescriptionRevamp
            description={props.product.description}
          />
        )
      }

      {
        !props.isQuickshop && (
          <ProductPropertiesRevamp
            order={99}
            product={props.product}
            variant={activeVariant}
            vendor={activeVendor}
            onVendorChange={onVendorChange}
            brandDescription={props.product.brand_description}
          />
        )
      }

    </ProductInformation>
  );
};

ProductDetailsRevamp.defaultProps = {
  isQuickshop: false,
  position: null
};

ProductDetailsRevamp.propTypes = {
  product: PropTypes.object.isRequired,
  isQuickshop: PropTypes.bool,
  position: PropTypes.number
};

ProductDetailsRevamp.whyDidYouRender = true;

export default ProductDetailsRevamp;
