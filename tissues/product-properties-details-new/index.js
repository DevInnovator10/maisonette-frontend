import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import ProductPropertyTab, { PropertyList } from '../../molecules/product-detail-accordion';

import { useProduct } from '../../utils/context/product-provider';

const DETAIL_PROPERTIES = [
    'Maisonette Product ID',
  'Assembly Required',
  'Made to Order',
  'Country of Origin'
];

const DetailsRevamp = (props) => {
  if (!props.product) return null;

  const getProductDetails = (properties) => {
    if (!properties) return { id: 0, name: 0, value: 0 };

    const propObject = (value, name, id) => ({
      id,
      name,
      value
    });

    // TODO: refactor this method
    const detailsArray = properties.filter(
      (property) => DETAIL_PROPERTIES.includes(property.property_name)
    ).map((property) => {
      if (property.property_name === DETAIL_PROPERTIES[0]) {
        return propObject(`Item number ${property.value}`, property.property_name, property.id);
      }

      if (
        (
          property.property_name === DETAIL_PROPERTIES[1]
          || property.property_name === DETAIL_PROPERTIES[2]
        )
        && property.value.toLowerCase() === 'yes') {
        return propObject(property.property_name, property.property_name, property.id);
      }

      if (property.property_name === DETAIL_PROPERTIES[2] && property.property_name.toLowerCase() === 'yes') {
        return propObject(property.property_name, property.property_name, property.id);
      }

      if (property.property_name === DETAIL_PROPERTIES[3]) {
        return property.value.toLowerCase().includes('handmade')
          ? propObject(property.value, property.property_name, property.id)
          : propObject(property.value, property.property_name, property.id);
      }

      return propObject(property.value, property.property_name, property.id);
    });

    if (props.variant) {
      const { variant } = props;

      if (parseFloat(variant.weight)) {
        detailsArray.push(propObject(variant.weight, 'Weight', 'weight'));
      }

      if (parseFloat(variant.height)) {
        detailsArray.push(propObject(variant.height, 'Height', 'height'));
      }

      if (parseFloat(variant.width)) {
        detailsArray.push(propObject(variant.width, 'Width', 'width'));
      }

      if (parseFloat(variant.depth)) {
        detailsArray.push(propObject(variant.depth, 'Depth', 'depth'));
      }
    }

    return detailsArray.filter((item) => item.value !== 'No');
  };

  const { state: { activeColor } } = useProduct();

  /**
   * get pdpVariants value from siteSpect
   * which is pulled out and replaced with static value for a while
   */
  const pdpVariants = false;
  const [currentDetails, setCurrentDetails] = useState(
    getProductDetails(props.product?.product_properties)
  );

  useEffect(() => {
    if (pdpVariants && activeColor.length) {
      const { maisonette_variant_group_attributes: variant_attributes } = props.product;

      const validColor = variant_attributes.find((v) =>
        (v?.option_value?.name).toLowerCase() === activeColor);

      if (validColor && validColor.product_properties?.length) {
        setCurrentDetails(getProductDetails(validColor.product_properties));
      } else {
        setCurrentDetails(getProductDetails(props.product?.product_properties));
      }
    }
  }, [activeColor, props.variant]);

  useEffect(() => {
    if (props.variant) {
      setCurrentDetails(getProductDetails(props.product?.product_properties));
    }
  }, [props.variant]);

  return (currentDetails && currentDetails.length > 0 && typeof currentDetails.map === 'function') ? (
    <ProductPropertyTab title="Details" product={props.product} revamp>
      <PropertyList element="ul" like="dec-4" revamp>
        {
          currentDetails.map((item) => (
            <li key={item.id}>{`${item.name}: ${item.value}`}</li>
          ))
        }
      </PropertyList>
    </ProductPropertyTab>
  ) : null;
};

DetailsRevamp.defaultProps = {
  variant: null
};

DetailsRevamp.propTypes = {
  variant: PropTypes.object,
  product: PropTypes.object.isRequired
};

export default DetailsRevamp;
