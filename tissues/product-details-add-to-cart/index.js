/*
  TODO: refactor this tissue
  TODO: break up the different parts of this tissue into organisms
  TODO: import those organisms into this tissue

  TODO: move reachedStockLimit() into /utils to call repeatedly in different organs
*/

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import { formatMoney } from 'accounting-js';
import { toast, TOAST } from '../../utils/toastify';

import { trackAddToCart, trackLineItemChange, LUX } from '../../utils/tracking';

import { updateCart } from '../../store/modules/cart/actions';
import { setProductDisplayPrice } from '../../store/modules/product/actions';
import { addToCart } from '../../pages/api';

// Utils
import getCookie from '../../utils/getCookie';
import asModal from '../../utils/asModal';
import { logAmplitude, amplitudeActive } from '../../utils/amplitude';
import { formatSplitTests } from '../../utils/amplitudeHelpers/splitTestHelpers';
import { aa } from '../../utils/algolia';
import isMobile from '../../utils/isMobile';

// Context
import { useSearch } from '../../utils/context/search-provider';
import { useProduct } from '../../utils/context/product-provider';

// Components
import Button from '../../atoms/button';
import Monogram from '../product-details-monogrammable';
import Select from '../../atoms/select';
import Typography from '../../atoms/typography';
import WaitlistEmail from '../../molecules/product-waitlist-email';
import Checkbox from '../../atoms/checkbox';
import AddToWishlist from '../../molecules/add-to-wishlist';
import IconShirt from '../../atoms/icon-tshirt';
import ProductColorOptions from '../../molecules/product-options-color-variant';

const FormWrapper = styled.form``;

const LazySizeGuide = dynamic(() => import('../../organs/size-guide'), { ssr: false });
const SizeGuideModal = asModal(LazySizeGuide);

const QuantityATBWrapper = styled.div`
display: flex;
column-gap: ${(props) => props.theme.modularScale.sixteen};
`;

const QuantityWrapper = styled.div`
margin-bottom: ${(props) => props.theme.modularScale.sixteen};
`;

const QuantitySelect = styled(Select, { shouldForwardProp: (prop) => prop !== 'changed' })`
  min-height: 4.4rem;
  min-width: ${(props) => props.theme.modularScale.sixtyFour};
  outline: 0;
  font-size: ${(props) => props.theme.modularScale.fourteen};
  color: ${(props) => props.theme.color.brand};
  border-width: .1rem;
`;

const QuantitySelectLabel = styled.label`
  opacity: 0;
  pointer-events: none;
  position: absolute;
`;

const SubmitButtonLabel = styled.label`
  opacity: 0;
  pointer-events: none;
  position: absolute;
`;

const SubmitButton = styled(Button)`
  font-family: ${(props) => props.theme.font.sans};
  font-size: ${(props) => props.theme.modularScale.sixteen};
  margin-bottom: 1rem;
  outline: 0;
  padding: 0 1rem;
  width: 100%;
  text-transform: none;
  letter-spacing: 0;

  @media (min-width: ${(props) => props.theme.breakpoint.large}) {
    margin-bottom: 0;
  }
`;

const Option = styled.input`
  opacity: 0;
  position: absolute;
  z-index: -1;
`;

const OptionLabel = styled(Typography)`
  align-items: center;
  border: 1px solid ${(props) => props.theme.color.bluePrimary};
  color: ${(props) => props.theme.color.bluePrimary};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  height: 3.5rem;
  justify-content: center;
  line-height: 3rem;
  margin: 1rem 1rem 0 0;
  min-width: 8rem;
  padding: 0 1rem;
  position: relative;
  text-align: center;
  transition: opacity ${(props) => props.theme.animation.default} ${(props) => props.theme.animation.easeOutQuad};

  ${(props) => props.active && css`
    background-color: ${props.theme.color.brand};
    color: ${props.theme.color.white};
  `};

  ${(props) => (
    props.disabled
      ? css`
        position: relative;
        cursor: not-allowed;
        opacity: .5;

        ::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          background: linear-gradient(to top left, transparent calc(50% - 1px), ${props.theme.color.brand}, transparent calc(50% + 1px));
          z-index: -1;
        }
      ` : css`
        :hover {
          opacity: 0.75;
        }
      `
  )}
`;

const OptionGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  margin-top: -1rem;
`;

const OptionHelper = styled(Typography)`
  color: ${(props) => props.theme.color.bluePrimary};
  line-height: 2rem;
  margin-bottom: 0.5rem;
`;

const OptionText = styled('span', { shouldForwardProp: (prop) => prop !== 'showWarningMsg' })`
  color: ${({ showWarningMsg, theme }) => (showWarningMsg ? theme.color.brandA11yRed : theme.color.brandLightBlue)};
`;

const OptionInvalid = styled.span`
  color: ${(props) => props.theme.color.brandA11yRed};
`;

const NoMoreLeftText = styled(Typography)`
  color: ${(props) => props.theme.color.brandA11yRed};
  text-align: center;
  margin-top: -2rem;
  margin-bottom: 2rem;
`;

const OpenSizeGuideButton = styled(Button)`
  align-items: center;
  display: flex;
  flex-direction: row;
  font-family: ${(props) => props.theme.font.sans};
  font-size: 1.4rem;
  margin-bottom: 3.2rem;

  > svg {
    width: 2rem;
    fill: ${(props) => props.theme.color.brand};
    margin-right: 0.5rem;
  }
`;

const AddToCartWrapper = styled('div', { shouldForwardProp: (prop) => prop !== 'isQuickShop' })`
  margin-bottom: 4rem;

  ${({ isQuickshop }) => isQuickshop && css`
    margin-bottom: 0;
  `}
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  margin-bottom: 1rem;
`;

const Monogrammable = styled(Monogram)`
  margin-bottom: 2rem;
`;

const MonogramCheckbox = styled(Checkbox)`
  margin-bottom: 2rem;
`;

const TextFlair = styled(Typography)`
  align-self: center;
  color: ${({ theme }) => theme.color.brandA11yRed};
  letter-spacing: 0.1em;
  position: relative;
  text-align: center;
  text-transform: uppercase;
  padding: 0 ${({ theme }) => theme.modularScale.base};
`;

const BagCountWrapper = styled.div`
  position: absolute;
`;

const BagCountNotification = styled.span`
  height: 0;
  width: 0;
  opacity: 0;
`;

const WarningText = styled(Typography)`
  font-family: ${(props) => props.theme.font.sans};
  font-size: 1.5rem;
  color: ${(props) => props.theme.color.brandA11yRed};
  display: block;
  line-height: 1.5;
`;

const WarningWrapper = styled.div`
display: flex;
justify-content: center;
margin-bottom: 1rem;
`;

const ProductAdd = (props) => {
  const {
    state: {
      warning,
      buttonText,
      stickyAddedToCart,
      activeColorVariants
    },
    updateWarningMessage,
    updateQuantity,
    updateButtonText,
    onOnPageAddedToCart,
    onStickyAddedToCart,
    setRequireMonogram,
    setOnPageCTARef,
    setAddedOptionalMonogram,
    setProductAdded,
    setProductAddedModalActive
  } = useProduct();
  const { insights } = props;
  const { state: { queryID, objectIDs } } = useSearch();

  const getOptionType = () => props.product?.option_types?.[0]?.name || 'size';

  const [addingToCart, setAddingToCart] = useState(false);
  const [addMonogram, setAddMonogram] = useState(false);
  const [displayButtonText, setDisplayButtonText] = useState(buttonText);
  const [warningMessage, setWarningMessage] = useState('');
  const [monogramColor, setMonogramColor] = useState(false);
  const [monogramFont, setMonogramFont] = useState(false);
  const [monogramText, setMonogramText] = useState(false);
  const [onlyOneLeft, setOnlyOneLeft] = useState(false);
  const [option, setOption] = useState(null);
  const [optionType] = useState(getOptionType());
  const [outOfStock, setOutOfStock] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const [quantityChanged, setQuantityChanged] = useState(false);
  const [sizeGuideActive, setSizeGuideActive] = useState(false);
  const [variant, setVariant] = useState(null);
  const [renderBagNotification, setRenderBagNotification] = useState(false);
  const onPageCTARef = useRef(null);

  /**
   * get pdpVariants value from siteSpect
   * which is pulled out and replaced with static value for a while
   */
  const pdpVariants = false;

  const handleSingleVariantReset = (singleVariantArray) => {
    const [v] = singleVariantArray;
    const o = v.option_values[0].name;

    props.onVariantChange(v);

    setAddMonogram(v?.prices?.[0]?.monogram?.monogrammable_only ?? false);
    setOnlyOneLeft(v.total_on_hand === 1);
    setOption(o);
    setOutOfStock(v.total_on_hand === 0);
    setVariant(v);
  };

  const handleMultipleVariantsReset = () => {
    setAddMonogram(false);
    setOnlyOneLeft(false);
    setOption(null);
    setOutOfStock(false);
    setVariant(null);
    props.onVariantChange(null);
  };

  const handleQuantityReset = () => {
    setQuantity('1');
    updateQuantity('1');
    setQuantityChanged(false);
  };

  const handleOnOutOfStock = () => {
    setOutOfStock(true);
    setDisplayButtonText('Out of Stock');
    updateButtonText('Out of Stock');
  };

  const handleMonogramFieldsReset = () => {
    setMonogramColor(false);
    setMonogramFont(false);
    setMonogramText(false);
  };

  // componentDidMount is if there are no color options
  useEffect(() => {
    if (!pdpVariants) {
      if (props.product?.variants?.length === 1) {
        handleSingleVariantReset(props.product.variants);
        handleQuantityReset();
      }

      if (props.product?.variants?.every((v) => v.in_stock === false)) {
        handleOnOutOfStock();
      }
    }

    updateWarningMessage('');
    setOnPageCTARef(onPageCTARef.current);
  }, []);

  // this useEffect is for if there are color options
  useEffect(() => {
    if (pdpVariants) {
      // if user made any selections but switched the product color,
      // reset all selections
      if (option || variant || outOfStock || quantity !== '0') {
        // if the new color has only 1 size variant,
        // then reset the selection accordingly
        if (activeColorVariants?.length === 1) {
          handleSingleVariantReset(activeColorVariants);
        } else {
          handleMultipleVariantsReset();
        }

        handleQuantityReset();
      }

      if (activeColorVariants.length && activeColorVariants?.every((v) => v.in_stock === false)) {
        handleOnOutOfStock();
      }
    }
  }, [activeColorVariants]);

  const getOptions = () => {
    const variants = pdpVariants ? activeColorVariants : props.product?.variants;

    const options = variants.filter((v) => v.option_values.length > 0).map(
      (v) => ({
        label: v.option_values[0].name,
        position: v.option_values[0].position,
        count: v.total_on_hand,
        variant: v
      })
    );

    return options.sort((a, b) => ((a.position < b.position) ? -1 : 1));
  };

  const getCalculatedPrice = () => {
    if (variant && quantity > 0 && props.variant !== null && props.vendor) {
      const vendor = variant.prices.find((x) => x.vendor_id === props.vendor);
      const vendorPrice = vendor.price;
      const monogramPrice = +variant.prices[0]?.monogram?.monogram_price ?? 0;

      const variantTotal = vendorPrice * quantity;
      const monogramTotal = addMonogram ? monogramPrice * quantity : 0;
      const total = variantTotal + monogramTotal;

      const price = formatMoney(total, { precision: 2 });
      return ` - ${price}`;
    }

    if (!outOfStock && quantity > 0 && !addingToCart) {
      const defaultVariant = props.product?.variants?.find((v) => v.in_stock);

      if (defaultVariant) {
        const price = formatMoney(defaultVariant.prices[0].price, { precision: 2 });
        return ` - ${price}`;
      }
    }

    return null;
  };

  const handleAddToCart = async ({
    count,
    userId,
    variantId,
    vendorId
  }) => {
    const { monogram_customizations } = variant.prices[0].monogram;

    const variants = pdpVariants ? activeColorVariants : props.product.variants;

    if (variants.length > 1) {
      setQuantity('1');
      updateQuantity('1');
      setOption(null);
      setVariant(null);
      setAddingToCart(true);
      props.onVariantChange(null);
    } else {
      setQuantity('1');
      updateQuantity('1');
      setAddingToCart(true);
    }

    if (addMonogram) {
      updateWarningMessage('');
      setRequireMonogram(true);
    }

    const userToken = getCookie('maisonette_user_token');
    const orderToken = getCookie('maisonette_order_token');
    const sessionToken = getCookie('maisonette_session_token');
    const splitTests = getCookie('maisonette_split_tests');

    const request = {
      line_item: {
        quantity: count,
        variant_id: variantId,
        vendor_id: vendorId
      },
      // add browser state to track missing orders and the changes is temporary
      browser: {
        amplitude_active: amplitudeActive,
        ga_active: !!(global.window.ga && global?.ga?.q),
        maisonette_session_token: sessionToken,
        ab_tests: splitTests ? formatSplitTests(JSON.parse(splitTests)) : false
      }
    };

    if (addMonogram) {
      request.line_item.monogram_attributes = {};
      request.line_item.monogram_attributes.text = monogramText;

      if (monogram_customizations?.colors?.length > 0) {
        request
          .line_item
          .monogram_attributes
          .customization = request.line_item.monogram_attributes.customization || {};

        request.line_item.monogram_attributes.customization.color = monogram_customizations.colors
          .find((color) => color.value === monogramColor.hex);
      }

      if (monogram_customizations?.fonts?.length > 0) {
        request
          .line_item
          .monogram_attributes
          .customization = request.line_item.monogram_attributes.customization || {};

        request.line_item.monogram_attributes.customization.font = monogram_customizations.fonts
          .find((font) => font.value === monogramFont);
      }
    }

    if (userToken && userId) request.user_id = userId;
    if (orderToken !== undefined && orderToken !== 'undefined') request.order_token = orderToken;

    LUX.addedToCart();

    const abortController = new global.window.AbortController();

    await addToCart({ body: request, signal: abortController.signal })
      .then((res) => {
        // if the user adds an item to the cart and quickly tries to navigate away
        // the request will abort and continue with the .then block.
        // aborting the request will prevent this from happening
        if (Object.keys(res).length === 0) abortController.abort();
        if (abortController.signal.aborted) return;

        if (res?.errors && Array.isArray(res.errors)) {
          res.errors.forEach(({ message = null }) => {
            if (typeof message === 'string') {
              toast(message, { type: TOAST.TYPE.ERROR });
            }
          });

          setAddingToCart(false);
          onStickyAddedToCart(false);
          onOnPageAddedToCart(false);
          return;
        }

        props.updateCart(res);

        global.document.cookie = `maisonette_order_token=${res.token}; max-age=15768017; path=/;`;
        global.document.cookie = `maisonette_order_number=${res.number}; max-age=15768017; path=/;`;

        LUX.cartValue(res);
        LUX.cartSize(res);

        const currVariants = pdpVariants ? activeColorVariants : props?.product?.variants;
        const trackVariant = currVariants.find((v) => v.id === variantId);

        trackAddToCart({
          product: props.product,
          cart: res,
          quantity: count,
          variant: trackVariant,
          user: props.user
        });

        logAmplitude('Added To Cart', {
          product: props.product,
          cart: res,
          quantity: count,
          variant: trackVariant,
          position: props.position
        });

        // if the user opened PDP from direct link
        // or from Algolia PLP in a new tab,
        // then queryID is null and objectIDs is an empty array
        // because the user was not using an Algolia search.
        // Therefore we cannot persist the necessary data to send to Algolia
        if (queryID && objectIDs.length) {
          if (aa) {
            // aa is needed to send event
            // when user adds to cart on PDP
            aa('convertedObjectIDsAfterSearch',
              {
                eventName: 'Added to Cart',
                index: process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX,
                queryID,
                objectIDs
              });
          } else {
            // insights is needed to send event
            // when user adds to cart from Quickshop on Algolia PLP
            insights('convertedObjectIDsAfterSearch', {
              eventName: 'Added to Cart'
            });
          }
        }

        setTimeout(() => {
          setAddingToCart(false);
          onStickyAddedToCart(false);
          onOnPageAddedToCart(false);
          setRenderBagNotification(true);
        }, 1500);

        if (isMobile()) {
          const { line_item: { variant_id } } = request;
          setProductAdded(variant_id);
          setProductAddedModalActive(true);
          logAmplitude('Add to Cart Confirmation', {
            product: props.product,
            isViewed: true
          });
        }

        setTimeout(() => {
          // remove notification to trigger alert for screen readers
          // if another item is added
          setRenderBagNotification(false);
        }, 2000);
      });
  };

  const canSubmit = () => {
    if (props.cart.loading) return false;

    let isMonogramValid = true;

    if (variant?.prices?.length && addMonogram) {
      const { monogram_customizations = {} } = variant.prices[0].monogram;

      let isColorValid = true;
      let isFontValid = true;

      if (Object.prototype.hasOwnProperty.call(monogram_customizations, 'colors')) {
        isColorValid = monogram_customizations.colors.length === 0 || monogramColor;
      }

      if (Object.prototype.hasOwnProperty.call(monogram_customizations, 'fonts')) {
        isFontValid = monogram_customizations.fonts.length === 0 || monogramFont;
      }

      const isTextValid = monogramText;

      isMonogramValid = !!isColorValid && !!isFontValid && !!isTextValid;
    }

    if (!isMonogramValid) return 'Please provide all monogram options';
    if (quantity === '0') return 'Please select quantity';
    if (option === null) return `Please select a ${optionType.toLowerCase()}`;

    return isMonogramValid && quantity !== '0' && option;
  };

  const handleOnMonogramClick = () => {
    setAddMonogram(!addMonogram);
    setWarningMessage('');
    props.setMonogramSelected(!addMonogram);
    setRequireMonogram(!addMonogram);
    updateWarningMessage('');
    setAddedOptionalMonogram(false);

    // if user adds Monogram
    if (!addMonogram) {
      setRequireMonogram(!addMonogram);
      setAddedOptionalMonogram(true);
      handleMonogramFieldsReset();
    }
  };

  const handleMonogramOnly = () => {
    setAddMonogram(true);
    setRequireMonogram(true);
    handleMonogramFieldsReset();
  };

  const reachedStockLimit = (newVariant) => {
    const selectedVariant = newVariant ?? variant;

    if (selectedVariant && selectedVariant.total_on_hand > 0) {
      const itemQuantity = props.cart?.line_items?.
        find((x) => x.variant_id === selectedVariant?.id)?.quantity || 0;

      const priceObj = props?.vendor
        ? selectedVariant.prices.find((x) => x.vendor_id === props.vendor)
        : selectedVariant?.prices[0];

      const max = 10;

      const count = priceObj.total_on_hand - itemQuantity > max
        ? max : priceObj.total_on_hand - itemQuantity;

      return count <= 0;
    }

    return false;
  };

  const handleOnOptionSelect = (e, v) => {
    const { value } = e.currentTarget;

    props.onVariantChange(v);

    const monogram = v?.prices[0]?.monogram;
    if (monogram?.monogrammable_only) handleMonogramOnly();

    setOption(value);
    setOnlyOneLeft(v.total_on_hand === 1);
    setOutOfStock(v.total_on_hand === 0);
    setQuantity('1');
    setQuantityChanged(false);
    setVariant(v);

    if (reachedStockLimit(v)) {
      updateWarningMessage('No more left');
    } else if (warning.includes('monogram') !== true) {
      updateWarningMessage('');
    }
  };

  const handleOnSelectChange = (e) => {
    setQuantity(e.currentTarget.value);
    setQuantityChanged(e.currentTarget.value > 0);
    updateQuantity(e.currentTarget.value);

    trackLineItemChange({
      product: props.product,
      quantity: e.currentTarget.value,
      variant
    });
  };

  useEffect(() => {
    if (outOfStock) {
      props.setProductDisplayPrice(0);
    } else {
      const price = getCalculatedPrice();
      props.setProductDisplayPrice(price ? getCalculatedPrice() : 0);
    }
  }, [variant, props.vendor, quantity, addMonogram, outOfStock]);

  const hasSizeGuideProperty = () => !!props?.product?.product_properties?.find((x) => x.property_name === 'Size Guide');

  const renderQuantityOptions = () => {
    if (variant && variant.total_on_hand > 0) {
      const itemQuantity = props.cart?.line_items?.
        find((x) => x.variant_id === variant?.id)?.quantity || 0;

      const priceObj = variant.prices.find((x) => x.vendor_id === props.vendor);

      const max = 10;

      const count = priceObj.total_on_hand - itemQuantity > max
        ? max : priceObj.total_on_hand - itemQuantity;

      const options = [];
      for (let i = 1; i <= count; i++) {
        options.push(<option key={i}>{i}</option>);
      }

      return options;
    }

    return [];
  };

  const sizeOptionDisabled = (o) => o.count <= 0;
  const quantitySelectDisabled = () => outOfStock || !option || reachedStockLimit();
  const addToCartDisabled = () =>
    reachedStockLimit() || outOfStock || props.cart.loading || addingToCart;
  const disabledMessage = () => {
    if (outOfStock) return `Add to Bag button and Quantity Select is disabled. ${optionType} is out of stock.`;
    if (addMonogram) return 'Please select monogram values.';
    if (reachedStockLimit()) return 'Add to Bag button and Quantity Select is disabled. No more items left.';
    return `Quantity Select is disabled. Please select a ${optionType} to enable.`;
  };

  const renderButtonText = () => {
    if (outOfStock) {
      setDisplayButtonText('Out of Stock');
    } else if (!outOfStock && (displayButtonText === 'Out of Stock')) {
      setDisplayButtonText('Add to bag');
    }
  };

  const isProductAvailable = () => props.product.available;
  const isProductDiscontinued = () => props.product.discontinued;
  const isVariantDiscontinued = () => variant && variant.discontinued;

  useEffect(() => {
    // if props.variant is truthy,
    // then a size selection was made
    // otherwise, the color was switched
    if (props.variant) {
      const { variant: selectedSizeVariant } = props;

      const monogram = selectedSizeVariant?.prices[0]?.monogram;
      if (monogram?.monogrammable_only) handleMonogramOnly();

      setVariant(selectedSizeVariant);
      setOption(selectedSizeVariant.option_values[0].name);
      setOnlyOneLeft(selectedSizeVariant.total_on_hand === 1);
      setOutOfStock(selectedSizeVariant.total_on_hand === 0);
      handleQuantityReset();

      if (warning !== 'No more left' && warning !== 'Please provide all monogram options') {
        updateWarningMessage('');
      }
    } else {
      setVariant(props.variant);
      handleMonogramFieldsReset();
    }
    if (!addingToCart) renderButtonText();
  }, [props.variant]);

  useEffect(() => {
    // if the variant's last product was added to the cart
    // re-render the button text to display
    // either no more left or appropriate text
    if (!addingToCart) renderButtonText();
  }, [variant]);

  useEffect(() => {
    updateButtonText(displayButtonText);
  }, [displayButtonText]);

  useEffect(() => {
    handleMonogramFieldsReset();
    setRequireMonogram(addMonogram);
  }, [addMonogram]);

  useEffect(() => {
    renderButtonText();
  }, [outOfStock]);

  useEffect(() => {
    setWarningMessage(warning);
  }, [warning]);

  useEffect(() => {
    // if sticky button was submitted
    if (stickyAddedToCart) {
      handleAddToCart({
        variantId: props.variant.id,
        vendorId: props.vendor,
        count: quantity,
        userId: props.userId
      });
    }
  }, [stickyAddedToCart]);

  const availabilityMessage = isProductDiscontinued()
    ? 'This product is no longer available'
    : 'This product is not available yet';

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const validSubmission = canSubmit();

    // if there is a valid warning message,
    // display warning msg and update selection
    // color
    if (validSubmission.includes('Please')) {
      updateWarningMessage(validSubmission);
    } else {
      onOnPageAddedToCart(true);
      handleAddToCart({
        variantId: props.variant.id,
        vendorId: props.vendor,
        count: quantity,
        userId: props.userId
      });
    }
  };

  return (
    <>
      <AddToCartWrapper
        isQuickshop={props.isQuickshop}
        onSubmit={handleOnSubmit}
        ref={onPageCTARef}
      >
        {
          isProductDiscontinued() || !isProductAvailable()
            ? (
              <TextFlair element="p" like="label-1">
                {availabilityMessage}
              </TextFlair>
            ) : (
              <FormWrapper id="add-to-cart-form">
                {pdpVariants && (
                  <ProductColorOptions
                    slug={props.product?.slug}
                    onVariantChange={props.onVariantChange}
                    onProductAddVariantChange={setVariant}
                  />
                )}

                {(
                  (
                    (pdpVariants && activeColorVariants?.length > 1)
                    || props.product?.variants?.length > 1
                  )
                  && option !== 'OS')
                  && (
                    <>
                      <OptionHelper element="p" like="dec-4">
                        {optionType}
                        {': '}
                        {
                          option
                            ? (
                              <>
                                {option}
                                {outOfStock && <OptionInvalid> Out of Stock</OptionInvalid>}
                                {!onlyOneLeft && reachedStockLimit()
                                  && <OptionInvalid> No More Left </OptionInvalid>}
                                {
                                  onlyOneLeft && (
                                    <OptionInvalid>
                                      {reachedStockLimit() ? ' No More Left' : ' Only 1 Left'}
                                    </OptionInvalid>
                                  )
                                }
                              </>
                            ) : <OptionText showWarningMsg={warningMessage.length > 0}>{`Select a ${optionType.toLowerCase()}`}</OptionText>
                        }
                      </OptionHelper>

                      <OptionGroup>
                        {
                          getOptions().map((o) => (
                            <OptionLabel
                              tabIndex="0"
                              active={option === o.label ? 'true' : undefined}
                              element="label"
                              like="dec-4"
                              key={o.label}
                              disabled={sizeOptionDisabled(o)}
                              htmlFor={`product-option-${o.label}`}
                            >
                              <Option
                                id={`product-option-${o.label}`}
                                name="product-option"
                                type="radio"
                                value={o.label}
                                aria-label={sizeOptionDisabled(o) ? `${o.label} option is out of stock.` : o.label}
                                checked={option === o.label}
                                onChange={(e) => handleOnOptionSelect(e, o.variant)}
                              />
                              {o.label}
                            </OptionLabel>
                          ))
                        }
                      </OptionGroup>

                      {
                        hasSizeGuideProperty() && (
                          <OpenSizeGuideButton
                            styledLikeLink
                            onClick={() => {
                              setSizeGuideActive(true);

                              logAmplitude('PDP Interaction', {
                                product: props.product,
                                interactionType: 'Opened Size Guide'
                              });
                            }}
                          >
                            <IconShirt />
                            Size guide
                          </OpenSizeGuideButton>
                        )
                      }

                      <SizeGuideModal
                        active={sizeGuideActive}
                        onClose={() => setSizeGuideActive(false)}
                      />
                    </>
                  )}

                {
                  (
                    (pdpVariants && activeColorVariants?.length === 1)
                    || props.product?.variants?.length === 1
                  )
                  && reachedStockLimit()
                  && <NoMoreLeftText element="p" like="label-1"> No More Left </NoMoreLeftText>
                }

                <QuantitySelectLabel
                  tabIndex={quantitySelectDisabled() ? '0' : '1'}
                  htmlFor="product-add-to-cart-quantity-select"
                >
                  {quantitySelectDisabled() && disabledMessage()}
                </QuantitySelectLabel>

                {
                  isVariantDiscontinued()
                    ? (
                      <TextFlair element="p" like="label-1">
                        The selected Size is not available
                      </TextFlair>
                    ) : (
                      <>
                        {
                            variant?.in_stock

                            && variant?.prices[0]?.monogram?.monogrammable && (
                              <>
                                {
                                  variant.prices[0].monogram.monogrammable_only
                                    ? (
                                      <Monogrammable
                                        variant={variant.id}
                                        colors={
                                          variant.prices[0].monogram.monogram_customizations.colors
                                        }
                                        fonts={
                                          variant.prices[0].monogram.monogram_customizations.fonts
                                        }
                                        maxTextLength={
                                          variant.prices[0].monogram.monogram_max_text_length
                                        }
                                        setColor={(color) => setMonogramColor(color)}
                                        setFont={(font) => setMonogramFont(font)}
                                        setText={(text) => setMonogramText(text)}
                                      />
                                    ) : (
                                      <>
                                        <MonogramCheckbox
                                          id="pdp-monogram"
                                          name="pdp-monogram"
                                          value={addMonogram}
                                          active={addMonogram}
                                          changed={handleOnMonogramClick}
                                        >
                                          {`Add monogram +${formatMoney(variant.prices[0].monogram.monogram_price)}`}
                                        </MonogramCheckbox>
                                        {addMonogram && (
                                          <Monogrammable
                                            variant={props.variant.id}
                                            colors={
                                              variant.prices[0]
                                                .monogram.monogram_customizations.colors
                                            }
                                            fonts={
                                              variant.prices[0]
                                                .monogram.monogram_customizations.fonts
                                            }
                                            maxTextLength={
                                              variant.prices[0].monogram.monogram_max_text_length
                                            }
                                            setColor={(color) => setMonogramColor(color)}
                                            setFont={(font) => setMonogramFont(font)}
                                            setText={(text) => setMonogramText(text)}
                                          />
                                        )}
                                      </>
                                    )
                                }
                              </>
                            )
                          }
                        <QuantityATBWrapper>
                          <QuantityWrapper>
                            <QuantitySelect
                              name="quantity"
                              id="product-add-to-cart-quantity-select"
                              disabled={quantitySelectDisabled()}
                              value={outOfStock ? '0' : quantity}
                              changed={quantityChanged ?? undefined}
                              onChange={handleOnSelectChange}
                              outline
                            >
                              {props?.vendor ? renderQuantityOptions() : []}
                            </QuantitySelect>
                          </QuantityWrapper>

                          <ButtonWrapper>
                            <SubmitButtonLabel
                              htmlFor="product-add-to-cart-button"
                              tabIndex={addToCartDisabled() ? '0' : '1'}
                            >
                            Add to Bag Button
                              {addToCartDisabled() && disabledMessage()}
                            </SubmitButtonLabel>
                            <SubmitButton
                              type="submit"
                              data-test-id="add_to_cart"
                              id="product-add-to-cart-button"
                              disabled={addToCartDisabled()}
                            >
                              {displayButtonText}

                            </SubmitButton>
                          </ButtonWrapper>
                        </QuantityATBWrapper>

                        {/* {warningMessage.length ? ( */}
                        {(warningMessage.length && warningMessage !== 'No more left') ? (
                          <WarningWrapper>
                            <WarningText element="p" like="label-1">
                              {warningMessage}
                            </WarningText>
                          </WarningWrapper>
                        ) : null}
                        <AddToWishlist product={props.product} />
                      </>
                    )
                }
              </FormWrapper>
            )
        }
        <WaitlistEmail
          active={outOfStock}
          variant={variant?.id ?? null}
        />
      </AddToCartWrapper>

      {
        // below renders a bag update message for screen readers only
        // not visible on screen
        renderBagNotification && (
          <BagCountWrapper>
            <BagCountNotification
              role="alert"
              aria-live="polite"
            >
              {`Added to Bag. Bag now has ${props.cart.count} items`}
            </BagCountNotification>
          </BagCountWrapper>
        )
      }
    </>
  );
};

ProductAdd.defaultProps = {
  cart: {},
  isQuickshop: false,
  position: null,
  updateCart: () => { },
  setMonogramSelected: () => { },
  setProductDisplayPrice: () => { },
  user: null,
  userId: null,
  variant: null,
  vendor: null,
  insights: () => { }
};

ProductAdd.propTypes = {
  cart: PropTypes.object,
  isQuickshop: PropTypes.bool,
  position: PropTypes.number,
  onVariantChange: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  updateCart: PropTypes.func,
  setMonogramSelected: PropTypes.func,
  setProductDisplayPrice: PropTypes.func,
  user: PropTypes.object,
  userId: PropTypes.number,
  variant: PropTypes.object,
  vendor: PropTypes.number,
  insights: PropTypes.func
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  lists: state.lists,
  token: state.user.spree_api_key,
  userId: state.profile.id,
  user: state.profile
});

const mapDispatchToProps = (dispatch) => ({
  updateCart: (cart) => dispatch(updateCart(cart)),
  setProductDisplayPrice: (price) => dispatch(setProductDisplayPrice(price))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductAdd);
