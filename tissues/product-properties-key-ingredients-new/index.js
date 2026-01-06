import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import ProductPropertyTab, { PropertyList } from '../../molecules/product-detail-accordion';

import { useProduct } from '../../utils/context/product-provider';

const KeyIngredientsBenefitsRevamp = (props) => {
    if (!props.product) return null;

  const filterIngredients = (properties) => {
    const filtered = properties.filter(
      (property) => property.property_name === 'Key Ingredients & Benefits'
    );

    if (!filtered || filtered.length === 0) return null;

    return filtered.reduce((acc, curr) => {
      const { value } = curr;

      try {
        // no validation that there isn't more than one colon
        const [key, ...rest] = value.split(':');
        acc.push([key, rest.join().trim()]);
      } catch (error) {
        acc.push([false, value]);
      }

      return acc;
    }, []);
  };

  const { state: { activeColor } } = useProduct();

  /**
   * get pdpVariants value from siteSpect
   * which is pulled out and replaced with static value for a while
   */
  const pdpVariants = false;
  const [currentIngredients, setCurrentIngredients] = useState(
    filterIngredients(props.product?.product_properties)
  );

  useEffect(() => {
    if (pdpVariants && activeColor.length) {
      const { maisonette_variant_group_attributes: variant_attributes } = props.product;

      const validColor = variant_attributes.find((v) =>
        (v?.option_value?.name).toLowerCase() === activeColor);

      if (validColor && validColor.product_properties?.length) {
        setCurrentIngredients(filterIngredients(validColor.product_properties));
      } else {

        setCurrentIngredients(filterIngredients(props.product?.product_properties));
      }
    }
  }, [activeColor]);

  return (currentIngredients && currentIngredients.length > 0) ? (
    <ProductPropertyTab title="Key Ingredients & Benefits" product={props.product} revamp>
      <PropertyList element="ul" like="dec-4" revamp>
        {
          currentIngredients.map(([key, value]) => (
            <li key={key || value}>
              {
                key
                  ? <b>{`${key}: `}</b>
                  : ''
              }
              {value}
            </li>
          ))
        }
      </PropertyList>
    </ProductPropertyTab>
  ) : null;
};

KeyIngredientsBenefitsRevamp.propTypes = {
  product: PropTypes.object.isRequired
};

export default KeyIngredientsBenefitsRevamp;
