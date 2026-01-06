import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import ProductPropertyTab, { PropertyList } from '../../molecules/product-detail-accordion';

import { useProduct } from '../../utils/context/product-provider';

const HowToUseRevamp = (props) => {
  if (!props.product) return null;

  const filteredInstructions = (properties) => (
    properties.filter(
      (property) => property.property_name === 'How to Use'
    )
  );

  const { state: { activeColor } } = useProduct();

  /**
   * get pdpVariants value from siteSpect

   * which is pulled out and replaced with static value for a while
   */

  const pdpVariants = false;
  const [currentInstructions, setCurrentInstructions] = useState(
    filteredInstructions(props.product?.product_properties)
  );

  useEffect(() => {
    if (pdpVariants && activeColor.length) {
      const { maisonette_variant_group_attributes: variant_attributes } = props.product;

      const validColor = variant_attributes.find((v) =>
        (v?.option_value?.name).toLowerCase() === activeColor);

      if (validColor && validColor.product_properties?.length) {
        setCurrentInstructions(filteredInstructions(validColor.product_properties));
      } else {
        setCurrentInstructions(filteredInstructions(props.product?.product_properties));
      }
    }
  }, [activeColor]);

  return (currentInstructions && currentInstructions.length > 0) ? (
    <ProductPropertyTab title="How to Use" product={props.product} revamp>
      <PropertyList element="ul" like="dec-4" revamp>
        {
          currentInstructions.map((item) =>
            // eslint-disable-next-line react/no-danger
            <li key={item.id} dangerouslySetInnerHTML={{ __html: item.value }} />)
        }
      </PropertyList>
    </ProductPropertyTab>
  ) : null;
};

HowToUseRevamp.propTypes = {
  product: PropTypes.object.isRequired
};

export default HowToUseRevamp;
