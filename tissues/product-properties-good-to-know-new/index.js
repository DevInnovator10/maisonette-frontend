import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import ProductPropertyTab, { PropertyList } from '../../molecules/product-detail-accordion';

import { useProduct } from '../../utils/context/product-provider';

const ListWrapper = styled.div`
  display: flex;
  gap: 32px;
  margin-left: 1.75rem;
`;

const List = styled(PropertyList)`
  list-style: none;
  margin-left: 0;
  flex: 1 1 0;
  max-width: 555px; /* 👀 */
  line-height: 2.5rem;

  li {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    margin-left: 3rem;

    &::before {
      content: '';
      display: inline-block;
      height: 1.6rem;
      width: 1.6rem;
      background-image: url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/check-mark.svg);
      background-size: contain;
      background-repeat: no-repeat;
      position: absolute;
      left: -2.3rem;
      top: 0.4rem;
    }
  }
`;

const GoodToKnowRevamp = (props) => {
  if (!props.product) return null;

  const filteredGoodToKnow = (properties) => (
    properties.filter(
      (property) => property.property_name === 'Good to know'
    )
  );

  const breakIntoChunksOfFour = (goodToKnowArray) => {
    // breaks array into chunks of 4
    const [firstFour, lastFour = []] = goodToKnowArray.reduce((acc, cur, i) => {
      const idx = Math.floor(i / 4);
      acc[idx] = [].concat((acc[idx] || []), cur);
      return acc;
    }, []);

    return {
      firstFour,
      lastFour
    };
  };

  const { state: { activeColor } } = useProduct();

  /**
   * get pdpVariants value from siteSpect
   * which is pulled out and replaced with static value for a while
   */
  const pdpVariants = false;
  const [currentGoodToKnow, setCurrentGoodToKnow] = useState(
    filteredGoodToKnow(props.product?.product_properties)
  );
  const [firstFour, setFirstFour] = useState([]);
  const [lastFour, setLastFour] = useState([]);

  useEffect(() => {
    setFirstFour(breakIntoChunksOfFour(currentGoodToKnow).firstFour);
    setLastFour(breakIntoChunksOfFour(currentGoodToKnow).lastFour);
  }, []);

  useEffect(() => {
    if (pdpVariants && activeColor.length) {
      const { maisonette_variant_group_attributes: variant_attributes } = props.product;

      const validColor = variant_attributes.find((v) =>
        (v?.option_value?.name).toLowerCase() === activeColor);

      const newProperties = (validColor && validColor.product_properties?.length)
        ? validColor.product_properties
        : props.product?.product_properties;

      const newGoodToKnow = filteredGoodToKnow(newProperties);

      setCurrentGoodToKnow(newGoodToKnow);
      setFirstFour(breakIntoChunksOfFour(newGoodToKnow).firstFour);
      setLastFour(breakIntoChunksOfFour(newGoodToKnow).lastFour);
    }
  }, [activeColor]);

  return (currentGoodToKnow && currentGoodToKnow.length > 0) ? (
    <ProductPropertyTab title="Good to Know" product={props.product} revamp>
      <ListWrapper>
        <List element="ul" like="dec-4">
          {
            firstFour.map((item) =>
              // eslint-disable-next-line react/no-danger
              <li key={item.id} dangerouslySetInnerHTML={{ __html: item.value }} />)
          }
        </List>

        {
          lastFour && (
            <List element="ul" like="dec-4">
              {
                lastFour.map((item) =>
                  // eslint-disable-next-line react/no-danger
                  <li key={item.id} dangerouslySetInnerHTML={{ __html: item.value }} />)
              }
            </List>
          )
        }
      </ListWrapper>
    </ProductPropertyTab>
  ) : null;
};

GoodToKnowRevamp.propTypes = {
  product: PropTypes.object.isRequired
};

export default GoodToKnowRevamp;
