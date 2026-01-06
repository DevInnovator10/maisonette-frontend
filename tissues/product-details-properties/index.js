import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import ProductDescriptions from '../../molecules/product-detail-descriptions';
import ShippingFrom from '../product-properties-shipping-from';
import Details from '../product-properties-details';
import Sizing from '../product-properties-sizing';
import Materials from '../product-properties-materials';
import KeyIngredients from '../product-properties-key-ingredients';
import FullListIngredients from '../product-properties-full-ingredients';
import HowToUse from '../product-properties-how-to-use';
import GoodToKnow from '../product-properties-good-to-know';
import Awards from '../product-properties-awards';

const Properties = styled.div`
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.color.brand};
  line-height: 1.5;
  @media (max-width: ${(props) => props.theme.breakpoint.medium}) {
    order: ${(props) => (props.placement ? `${props.placement}` : '')};
  }
`;

const ProductProperties = (props) => (
  <Properties placement={props.order}>
    <ProductDescriptions
      brand={props.product.brand}
      brandDescription={props.product.brand_description}
      description={props.product.description}
      product={props.product}
    />
    <Materials product={props.product} />
    <Details product={props.product} variant={props.variant} />
    <Sizing product={props.product} />
    <KeyIngredients product={props.product} />
    <FullListIngredients product={props.product} />
    <HowToUse product={props.product} />
    <GoodToKnow product={props.product} />
    <Awards product={props.product} />
    <ShippingFrom
      product={props.product}
      vendor={props.vendor}
      variant={props.variant}
      onVendorChange={props.onVendorChange}
    />
  </Properties>
);

ProductProperties.defaultProps = {
  variant: null,
  vendor: null
};

ProductProperties.propTypes = {
  onVendorChange: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  order: PropTypes.number.isRequired,
  variant: PropTypes.object,
  vendor: PropTypes.number
};

ProductProperties.whyDidYouRender = true;

export default ProductProperties;
