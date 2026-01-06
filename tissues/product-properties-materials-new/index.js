import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import ProductPropertyTab, { PropertyList } from '../../molecules/product-detail-accordion';

import { useProduct } from '../../utils/context/product-provider';

const MATERIAL_CARE_PROPERTIES = [
  'Care Instructions',
  'Material'
];

const MaterialsRevamp = (props) => {
  if (!props.product) return null;

  const filterMaterials = (productPropertiesArray) => (
    productPropertiesArray.filter(
      (property) => MATERIAL_CARE_PROPERTIES.includes(property.property_name)
    ));

  const { state: { activeColor } } = useProduct();

  /**
   * get pdpVariants value from siteSpect
   * which is pulled out and replaced with static value for a while
   */
  const pdpVariants = false;
  const [currentMaterials, setCurrentMaterials] = useState(
    filterMaterials(props.product?.product_properties ?? [])
  );

  useEffect(() => {
    if (pdpVariants && activeColor.length) {
      const { maisonette_variant_group_attributes: variant_attributes } = props.product;

      const validColor = variant_attributes.find((v) =>
        (v?.option_value?.name).toLowerCase() === activeColor);

      if (validColor && validColor.product_properties?.length) {
        setCurrentMaterials(filterMaterials(validColor.product_properties));
      } else {
        setCurrentMaterials(filterMaterials(props.product?.product_properties ?? []));
      }
    }
  }, [activeColor]);

  return currentMaterials && currentMaterials.length ? (
    <ProductPropertyTab title="Materials & Care" product={props.product} revamp>
      <PropertyList element="ul" like="dec-4" revamp>
        {
          currentMaterials.map((item) =>
            // eslint-disable-next-line react/no-danger
            <li key={item.id} dangerouslySetInnerHTML={{ __html: item.value }} />)
        }
      </PropertyList>
    </ProductPropertyTab>
  ) : null;
};

MaterialsRevamp.propTypes = {
  product: PropTypes.object.isRequired
};

export default MaterialsRevamp;
