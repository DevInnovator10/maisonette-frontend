import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Carousel from '../../atoms/carousel';
import PillarTaxonLink from './pillar-taxon-link';

const Section = styled.section`
  overflow: hidden;

  :hover {
    cursor: grab;
  }

  :active {
    cursor: grabbing
  }
`;

const LinkCarousel = styled(Carousel)``;

const PillarCategoryTaxonShop = ({ items }) => {
  const [staticClick, setStaticClick] = useState(null);

  const onCarouselRef = useCallback((node) => {
    if (node !== null) {
      // carousel is populated with links with connected Amplitude events
      // use state to control whether or not to trigger the nav item's onClick
      node.on('staticClick', () => {
        setStaticClick(true);
      });

      node.on('dragStart', () => {
        setStaticClick(false);
      });
    }

    // Cleanup the event listeners when the component unmounts
    return () => {
      node.off('staticClick');
      node.off('dragStart');
    };
  }, []);

  return (
    <div>
      <Section>
        <LinkCarousel
          flickityRef={onCarouselRef}
          options={{
            contain: true,
            pageDots: false,
            prevNextButtons: false,
            cellAlign: 'left'
          }}
        >
          {
            items?.length > 0 && items.map((item, index) => (
              <PillarTaxonLink
                staticClick={staticClick}
                // eslint-disable-next-line react/no-array-index-key
                key={`${item.category_taxon_shop_row_heading}-${index}`}
                item={item}
              />
            ))
          }
        </LinkCarousel>
      </Section>
    </div>
  );
};

PillarCategoryTaxonShop.propTypes = {
  items: PropTypes.array.isRequired
};

export default PillarCategoryTaxonShop;
