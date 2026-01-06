import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

import ProductPropertyTab from '../../molecules/product-detail-accordion';
import Typography from '../../atoms/typography';

import { useProduct } from '../../utils/context/product-provider';

const Icon = styled.img`
  max-height: 5rem;
  max-width: 5rem;
  width: 100%;
  margin: 1rem;

  & ~ & {
    margin-left: 1rem;
  }
`;

const AWARD_PROPERTIES = {
  'USDA Organic': '/images/usda-organic.png',
  'Made in the USA': '/images/made-in-the-usa.png',
  'Peta Badge': '/images/vegan-cruelty-free.png',
  'Leaping Bunny Badge': '/images/cruelty-free.png',
  'Cosmos Organic': '/images/cosmos-organic.png',
  'B Corp Certification': '/images/Bcertified.svg',
  'EWG Verification': '/images/EWGverified.svg',
  'OEXO-Tex Standard 100 Certification': '/images/oeko-tex.svg'
};

const AwardsRevamp = (props) => {
  if (!props.product) return null;

  const filteredAwards = (properties) => (
    properties.filter(
      (property) => Object.keys(AWARD_PROPERTIES).includes(property.value)
    )
  );

  const { state: { activeColor } } = useProduct();
  /**
   * get pdpVariants value from siteSpect
   * which is pulled out and replaced with static value for a while
   */
  const pdpVariants = false;
  const [currentAwards, setCurrentAwards] = useState(
    filteredAwards(props.product?.product_properties)
  );

  useEffect(() => {
    if (pdpVariants && activeColor.length) {
      const { maisonette_variant_group_attributes: variant_attributes } = props.product;

      const validColor = variant_attributes.find((v) =>
        (v?.option_value?.name).toLowerCase() === activeColor);

      if (validColor && validColor.product_properties?.length) {
        setCurrentAwards(filteredAwards(validColor.product_properties));

      } else {
        setCurrentAwards(filteredAwards(props.product?.product_properties));
      }
    }
  }, [activeColor]);

  return (currentAwards && currentAwards.length > 0) ? (
    <ProductPropertyTab title="Awards" product={props.product} revamp>
      <Typography element="div" like="dec-4" revamp>
        {
          currentAwards.map((item) => (
            <Icon
              key={item.id}
              src={`${process.env.NEXT_PUBLIC_ASSET_HOST}${AWARD_PROPERTIES[item.value]}`}
              alt={item.value}
            />
          ))
        }
      </Typography>
    </ProductPropertyTab>
  ) : null;
};

AwardsRevamp.propTypes = {
  product: PropTypes.object.isRequired
};

export default AwardsRevamp;
