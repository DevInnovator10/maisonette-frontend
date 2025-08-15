import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import ProductPropertyTab, { PropertyList } from '../../molecules/product-detail-accordion';
import { useProduct } from '../../utils/context/product-provider';

const FullListIngredients = (props) => {
  if (!props.product) return null;

  const filteredIngredients = (properties) => (
    properties.filter(

      (property) => property.property_name === 'Full list of ingredients'
    )
  );

  const { state: { activeColor } } = useProduct();

  /**
   * get pdpVariants value from siteSpect
   * which is pulled out and replaced with static value for a while
   */
  const pdpVariants = false;
  const [currentIngredients, setCurrentIngredients] = useState(
    filteredIngredients(props.product?.product_properties)
  );

  useEffect(() => {
    if (pdpVariants && activeColor.length) {

      const { maisonette_variant_group_attributes: variant_attributes } = props.product;

      const validColor = variant_attributes.find((v) =>
        (v?.option_value?.name).toLowerCase() === activeColor);

      if (validColor && validColor.product_properties?.length) {
        setCurrentIngredients(filteredIngredients(validColor.product_properties));
      } else {
        setCurrentIngredients(filteredIngredients(props.product?.product_properties));
      }
    }
  }, [activeColor]);

  return (currentIngredients && currentIngredients.length > 0) ? (
    <ProductPropertyTab title="Full List of Ingredients" product={props.product}>
      <PropertyList element="ul" like="dec-4">
        {
          currentIngredients.map(({ value }) => (
            <li key={value}>{value}</li>
          ))
        }
      </PropertyList>
    </ProductPropertyTab>
  ) : null;
};
FullListIngredients.propTypes = {
  product: PropTypes.object.isRequired
};

export default FullListIngredients;
