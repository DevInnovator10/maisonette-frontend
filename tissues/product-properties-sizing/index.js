import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import ProductPropertyTab, { PropertyList } from '../../molecules/product-detail-accordion';

import { useProduct } from '../../utils/context/product-provider';

const Sizing = (props) => {
  if (!props.product) return null;

  const getSizing = (properties = []) => (properties.filter(
    (property) => property?.property_name === 'Sizing Notes'
  ));

  const { state: { activeColor } } = useProduct();

  /**
   * get pdpVariants value from siteSpect
   * which is pulled out and replaced with static value for a while
   */
  const pdpVariants = false;

  const [currentSizing, setCurrentSizing] = useState(getSizing(props.product?.product_properties));

  useEffect(() => {
    if (pdpVariants && activeColor.length) {
      const { maisonette_variant_group_attributes: variant_attributes } = props.product;

      const validColor = variant_attributes.find((v) =>
        (v?.option_value?.name).toLowerCase() === activeColor);

      if (validColor && validColor.product_properties?.length) {
        setCurrentSizing(getSizing(validColor.product_properties));
      } else {
        setCurrentSizing(getSizing(props.product?.product_properties));
      }
    }
  }, [activeColor]);

  return (currentSizing && currentSizing.length > 0) ? (
    <ProductPropertyTab title="Size / Fit" product={props.product}>
      <PropertyList element="ul" like="dec-4">
        {
          currentSizing.map((item) =>
            // eslint-disable-next-line react/no-danger
            <li key={item.id} dangerouslySetInnerHTML={{ __html: item.value }} />)
        }
      </PropertyList>
    </ProductPropertyTab>
  ) : null;
};

Sizing.propTypes = {
  product: PropTypes.object.isRequired
};

export default Sizing;
