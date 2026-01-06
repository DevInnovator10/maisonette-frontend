import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

const DesktopImageGalleryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoint.medium}) {
    display: none;
  }
`;

const ImageGalleryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 4rem;
`;

const HiddenButton = styled('button', { shouldForwardProp: (prop) => prop !== 'noGrid' })`
  border: none;
  background: none;
  cursor: zoom-in;
  ${({ noGrid }) => (noGrid && css`margin-bottom: 1rem`)}
`;

const Image = styled('img', { shouldForwardProp: (prop) => prop !== 'isHero' })`
  ${({ isHero }) => (isHero && css`
    height: 450px;
    width: 450px;
  `)}
`;

const GridImage = ({
  image,
  index,
  alt,
  handleOnImageClick,
  handleOnImageLoad,
  isHero,
  noGrid
}) => (
  <HiddenButton
    noGrid={noGrid}
    onClick={() => {
      handleOnImageClick(image, index);
    }}
  >
    <Image
      alt={alt}
      src={isHero ? image.large_url : image.product_url}
      onLoad={(e) => handleOnImageLoad(e, index)}
      isHero={isHero}
    />
  </HiddenButton>
);

GridImage.defaultProps = {
  isHero: false,
  noGrid: false
};

GridImage.propTypes = {
  image: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  alt: PropTypes.string.isRequired,
  handleOnImageClick: PropTypes.func.isRequired,
  handleOnImageLoad: PropTypes.func.isRequired,
  isHero: PropTypes.bool,
  noGrid: PropTypes.bool
};

const DesktopImageGallery = ({
  images,
  createAlt,
  handleOnImageLoad,
  handleOnImageClick
}) => (
  <DesktopImageGalleryWrapper>
    {images.length > 3
      ? (
        <>
          <GridImage
            key={images[0].id}
            index={0}
            image={images[0]}
            alt={images[0].alt ?? `${createAlt(0)}`}
            handleOnImageLoad={handleOnImageLoad}
            handleOnImageClick={handleOnImageClick}
            isHero
          />
          <ImageGalleryGrid>
            {
              images.map(
                (image, idx) => {
                  if (idx === 0) return;

                  // eslint-disable-next-line consistent-return
                  return (
                    <GridImage
                      key={image.id}
                      index={idx}
                      image={image}
                      alt={image.alt ?? `${createAlt(idx)}`}
                      handleOnImageLoad={handleOnImageLoad}
                      handleOnImageClick={handleOnImageClick}
                    />
                  );
                }
              )
            }
          </ImageGalleryGrid>
        </>
      ) : (
        <>
          {
            images.map(
              (image, idx) => (
                <GridImage
                  key={image.id}
                  image={image}
                  alt={image.alt ?? `${createAlt(idx)}`}
                  handleOnImageLoad={handleOnImageLoad}
                  handleOnImageClick={handleOnImageClick}
                  isHero
                  noGrid
                />
              )
            )
          }
        </>
      )}
  </DesktopImageGalleryWrapper>
);

DesktopImageGallery.propTypes = {
  images: PropTypes.array.isRequired,
  createAlt: PropTypes.func.isRequired,
  handleOnImageClick: PropTypes.func.isRequired,
  handleOnImageLoad: PropTypes.func.isRequired
};

export default DesktopImageGallery;
