import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { withTheme } from 'emotion-theming';
import isURL from '../../utils/isURL';

const FastlyPicture = (props) => {
  const {
    Image, theme, key, src, alt, type: layoutType, ...imageProps
  } = props;
  const media = theme.breakpoint;
  const isLazyLoaded = !!imageProps['data-src'];
  const imageSrc = imageProps['data-src'] || src;
  const imageTypes = ['webp', 'jpeg'];
  // Replicate the image service for managing crops and optimizing sizes
  // For PDP see https://github.com/MaisonetteWorld/magine/blob/develop/lambda/options/product_rules.json
  // For PLP see https://github.com/MaisonetteWorld/magine/blob/develop/lambda/options/product-list_rules.json
  // Find below a useful guide to <picture> and srcset
  // https://www.smashingmagazine.com/2014/05/responsive-images-done-right-guide-picture-srcset/
  const widths = {
    xs: 375, sm: 562, md: 750, lg: 1140, xl: 1686, '2xl': 2250
  };
  // responsive sizes calculated based on PLP, PDP, brand taxon product image layout size
  // it must be recalculated whenever the layout of those pages changes
  const sizes = {
    plp: `
      (min-width: ${media.medium}) 11.5vw,
      21vw
  `,
    pdp: `
      (min-width: ${media.medium}) calc(28vw - 11rem),
      calc(73vw - 12rem)
    `,

    'taxon-product': `
      (min-width: ${media.large}) 11.5vw,
      (min-width: ${media.medium}) 33vw,
      calc(73vw - 12rem)
    `,
    'brand-header': '11vw'
  };

  const getImageHref = (width, format) => {
    // takes the existing image url search params and append Fastly ones
    const imageURL = new URL(
      imageSrc,
      isURL(imageSrc)
        ? undefined
        : process.env.NEXT_PUBLIC_ASSET_HOST
    );
    const searchParams = new URLSearchParams(imageURL.search);
    searchParams.set('width', width);
    searchParams.set('format', format);
    searchParams.set('crop', '1:1');
    imageURL.search = searchParams.toString();
    return imageURL.href;
  };

  const srcset = (format) => `
      ${getImageHref(widths.xs, format)} ${widths.xs}w,
      ${getImageHref(widths.sm, format)} ${widths.sm}w,
      ${getImageHref(widths.md, format)} ${widths.md}w,
      ${getImageHref(widths.lg, format)} ${widths.lg}w,
      ${getImageHref(widths.xl, format)} ${widths.xl}w,
      ${getImageHref(widths['2xl'], format)} ${widths['2xl']}w
    `;

  return (
    <picture key={key} className={layoutType === 'pdp' ? 'carousel-cell' : ''}>
      {
        imageTypes.map((imageType) => (
          <source
            key={imageType}
            type={`image/${imageType}`}
            srcSet={isLazyLoaded ? undefined : srcset(imageType)}
            data-srcset={isLazyLoaded ? srcset(imageType) : undefined}
            sizes={sizes[layoutType] || '100vw'}
          />
        ))
      }
      <Image src={src} alt={alt} {...imageProps} />
    </picture>
  );
};

FastlyPicture.defaultProps = {
  key: undefined,
  Image: styled.img``,
  type: 'plp',
  theme: {}
};

FastlyPicture.propTypes = {
  key: PropTypes.string,
  alt: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  Image: PropTypes.elementType,
  type: PropTypes.oneOf([
    'plp',
    'pdp',
    'taxon-product',
    'brand-header'
  ]),
  theme: PropTypes.shape()
};

export default withTheme(FastlyPicture);
