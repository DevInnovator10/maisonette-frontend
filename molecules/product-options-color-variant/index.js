import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Router from 'next/router';

import Typography from '../../atoms/typography';

// Context
import { useProduct } from '../../utils/context/product-provider';

const ProductColorOptionsWrapper = styled.div`
  margin-bottom: 3rem;
`;

const ColorText = styled(Typography, { shouldForwardProp: (prop) => prop !== 'revamp' })`
  color: ${(props) => props.theme.color.bluePrimary};
  ${({ revamp }) => !revamp && 'letter-spacing: 0.2em;'}
  line-height: 2rem;
  ${({ revamp }) => !revamp && 'text-transform: uppercase;'}

  > span {
    color: ${(props) => props.theme.color.brandLight};
  }
`;

const Span = styled.span`
`;

const StyledSpan = styled(Span)`
  color: ${({ theme }) => (theme.color.brandA11yRed)} !important;
`;

const ColorOptionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ColorOption = styled('span', { shouldForwardProp: (prop) => prop !== 'url' })`
  background-image: url(${({ url }) => url});
  background-size: contain;
  border-radius: 100%;
  border: 0.2em solid ${(props) => props.theme.color.white};
  border-opacity: 15%;
  height: 100%;
  left: 0;
  overflow: hidden;
  position: absolute;
  text-indent: -99999px;
  top: 0;

  width: 100%;
`;

const ColorOptionsItem = styled('label', { shouldForwardProp: (prop) => prop !== 'revamp' })`
  border-radius: 100%;
  border: 1px solid ${({ theme }) => theme.color.brandLight};
  border-opacity: 0.5;
  cursor: pointer;
  height: ${({ revamp }) => (revamp ? '4.8rem' : '4rem')};
  width: ${({ revamp }) => (revamp ? '4.8rem' : '4rem')};
  margin-top: 0.5rem;
  margin-right: 1.5rem;
  position: relative;
  transition: border ${(props) => props.theme.animation.fast} ${(props) => props.theme.animation.easeIn};

  &:last-of-type {
    margin-right: 0;
  }

  &:hover {
    border: 1px solid ${(props) => props.theme.color.bluePrimary};
    border-opacity: 1;
  }

  ${(props) => (
    props.outOfStock
      ? css`
        position: relative;
        cursor: not-allowed;
        opacity: .5;

        ::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          width: 93%;
          background: linear-gradient(to top left, transparent calc(50% - 1px), ${props.theme.color.brand}, transparent calc(50% + 1px));
          z-index: 1;
        }
      ` : css`
        :hover {
          opacity: 0.75;
        }
      `
  )}

  ${(props) => props.active && css`
  border: 1px solid ${props.theme.color.bluePrimary};
  border-opacity: 1;
  opacity: 1;

  &:hover {
    border: 1px solid ${props.theme.color.bluePrimary};
  }
`}
`;

const Option = styled.input`
  opacity: 0;
  position: absolute;
`;

const StyledOption = styled(Option, { shouldForwardProp: (prop) => prop !== 'outOfStock' })`
  z-index: ${({ outOfStock }) => (outOfStock ? '1' : '-1')};
`;

const ProductColorOptions = (props) => {
  /**
   * use siteSpect to get pdpRevamp value
   * which is pulled out and replaced with static value for a while
   */
  const pdpRevamp = false;
  const {
    state: {
      activeColor,
      colorVariants
    },
    setActiveColor,
    setActiveColorVariants,
    updateWarningMessage
  } = useProduct();

  const [colorOutOfStock, setColorOutOfStock] = useState(false);

  const isColorOutOfStock = (colorArray) => colorArray.every((color) => color.in_stock === false);

  const sortedColorImages = () => Object.keys(colorVariants).reduce((acc, color) => {
    const option = {};

    option.name = color;
    option.url = colorVariants[color][0].images[0].product_url;
    option.outOfStock = isColorOutOfStock(colorVariants[color]);

    // moving any colors out of stock last
    if (option.outOfStock) {
      acc.push(option);
    } else {
      acc.unshift(option);
    }

    return acc;
  }, []);

  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  const renderAriaLabel = (color) => (color.outOfStock ? `${color.name} option is out of stock` : color.name);

  return (
    <ProductColorOptionsWrapper id={props.id} className={props.className}>
      <ColorText
        element={pdpRevamp ? 'span' : 'p'}
        like={pdpRevamp ? 'dec-3' : 'label-1'}
        revamp={pdpRevamp}
      >
        {pdpRevamp ? 'Color' : 'COLOR'}
        {': '}
        {activeColor ? capitalizeFirstLetter(activeColor) : <span>Select a Color</span>}
        {' '}
        {colorOutOfStock && <StyledSpan>Out of Stock</StyledSpan>}
      </ColorText>

      <ColorOptionsList>
        {
          sortedColorImages().map((c) => (
            <ColorOptionsItem
              tabIndex="0"
              key={c.name}
              title={c.name}
              active={activeColor === c.name}
              outOfStock={c.outOfStock}
              revamp={pdpRevamp}
            >
              <ColorOption url={c.url}>{c.name}</ColorOption>

              <StyledOption
                id={`product-color-option-${c.name}`}
                className="product-color-option"
                name="product-color-option"
                type="radio"
                value={c.name}
                aria-label={renderAriaLabel(c)}
                outOfStock={c.outOfStock}
                onClick={() => {
                  updateWarningMessage('');
                  setActiveColor(c.name);
                  setActiveColorVariants(c.name);
                  setColorOutOfStock(c.outOfStock);

                  if (!props.isQuickshop) {
                    Router.push(`/product/${props.slug}?color=${c.name}`, undefined, { shallow: true });
                  }
                }}
              />
            </ColorOptionsItem>
          ))
        }
      </ColorOptionsList>
    </ProductColorOptionsWrapper>
  );
};

ProductColorOptions.defaultProps = {
  className: '',
  id: '',
  slug: '',
  isQuickshop: false
};

ProductColorOptions.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  slug: PropTypes.string,
  isQuickshop: PropTypes.bool
};

export default ProductColorOptions;
