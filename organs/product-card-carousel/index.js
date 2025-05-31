/* eslint-disable no-return-assign */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Carousel from '../../atoms/carousel';
import ProductCard from '../../tissues/product-card';
import Typography from '../../atoms/typography';

const CarouselWrapper = styled('section', { shouldForwardProp: (prop) => prop !== 'revamp' })`
    min-height: 10rem;
  position: relative;
  text-align: ${({ revamp }) => (revamp ? 'left' : 'center')};

  & + & {
    margin-top: 10rem;
  }

  ${({ theme, revamp }) => revamp && css`
    @media (max-width: ${theme.breakpoint.medium}) {
      text-align: center;
    }
  `}
`;

const CarouselTitle = styled(Typography, { shouldForwardProp: (prop) => prop !== 'revamp' })`
  color: ${(props) => props.theme.color.bluePrimary};

  ${({ theme, revamp }) => revamp && css`
  @media (max-width: ${theme.breakpoint.small}) {
    font-size: ${theme.modularScale.twentyFour}
  }
`}
`;

const ProductCardCarousel = (props) => {
  /**
   * use siteSpect to get pdpRevamp value
   * which is pulled out and replaced with static value for a while
   */

  const pdpRevamp = false;

  const carouselSettings = {
    prevNextButtons: props.products.length > 1,
    pageDots: !!props.pdpRecommendations,
    groupCells: props.pdpRecommendations && pdpRevamp ? 2 : true,
    cellAlign: 'left',
    wrapAround: props.isInfinite && props.products?.results
      ? props.products.results.length > 5
      : props.isInfinite
  };

  const onCarouselRef = useCallback((node) => {
    if (node !== null) {
      if (pdpRevamp) {
        const el = node;
        node.on('dragStart', () => {
          global.document.ontouchmove = (e) => e.preventDefault();
          el.slider.style.pointerEvents = 'none';
        });
        node.on('dragEnd', () => {
          global.document.ontouchmove = () => true;
          el.slider.style.pointerEvents = 'auto';
        });
      }
    }

    // Cleanup the event listeners when the component unmounts
    return () => {
      node.off('dragStart');
      node.off('dragEnd');
    };
  }, []);

  return props.products?.length > 0
    ? (
      <CarouselWrapper revamp={pdpRevamp}>

        <CarouselTitle
          element="h1"
          like="heading-3"
          revamp={pdpRevamp}
        >
          {props.title}
        </CarouselTitle>
        <Carousel
          type="product-card"
          options={carouselSettings}
          disableImagesLoaded
          flickityRef={onCarouselRef}
          reloadOnUpdate
          revamp={props.pdpRecommendations}
          hasUpToFiveProducts={(props.products.length > 1 && props.products.length < 6)}
        >
          {
            props.products.map(((product, i) => (
              <ProductCard
                taxonProducts={props.taxonProducts ?? true}
                key={`${props.id}-${product?.variants?.[0]?.maisonette_sku ?? product?.title}`}
                product={product}
                showQuickShop={false}
                showWishlist={false}
                module={props.id}
                index={i + 1}
                pdpRecommendations={props.pdpRecommendations}
              />
            )))
          }
        </Carousel>
      </CarouselWrapper>
    ) : null;
};

ProductCardCarousel.defaultProps = {
  isInfinite: false,
  taxonProducts: true,
  pdpRecommendations: false
};

ProductCardCarousel.propTypes = {
  products: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isInfinite: PropTypes.bool,
  taxonProducts: PropTypes.bool,
  pdpRecommendations: PropTypes.bool
};

export default ProductCardCarousel;
