/* eslint-disable no-return-assign */
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Carousel from '../../atoms/carousel';
import MobileZoomArrows from '../../atoms/mobile-zoom-arrows';

import { logAmplitude } from '../../utils/amplitude';

const MobileImageGalleryWrapper = styled.div`
  display: flex;
  align-items: flex-end;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    display: none;
  }
`;

const MobileCarousel = styled(Carousel)(() => ({
  width: '100%',
  button: { width: '100%' }
}));

const HiddenButton = styled.button`
  border: none;
  background: none;
`;

const StyledImage = styled.img`
  @media (min-width: ${({ theme }) => theme.breakpoint.small}) and (max-width: ${({ theme }) => theme.breakpoint.medium}) {
    weight: 350px;
    height: 350px;
  }
`;

const Image = ({
  image,
  index,
  alt,
  handleOnImageClick,
  handleOnImageLoad
}) => (
  <HiddenButton

    onClick={() => {
      handleOnImageClick(image, index);
    }}
  >
    <StyledImage
      alt={alt}
      src={image.product_url}
      onLoad={(e) => handleOnImageLoad(e, index)}
    />
  </HiddenButton>
);

Image.propTypes = {
  image: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  alt: PropTypes.string.isRequired,
  handleOnImageClick: PropTypes.func.isRequired,
  handleOnImageLoad: PropTypes.func.isRequired
};

const MobileImageGallery = ({
  product,
  images,
  createAlt,
  handleOnImageLoad,
  handleOnImageClick
}) => {
  const [mobileZoomImage, setMobileZoomImage] = useState(images.length ? images[0] : null);
  const [mobileZoomImageIndex, setMobileZoomImageIndex] = useState(0);

  const onMobileCarouselRef = useCallback((node) => {
    let prevIndex = 0;

    if (node !== null) {
      node.on('change', (i) => {
        if (images[i]) {
          // in order to track if the user swiped LEFT to view the next image
          // for the first time, use prevIndex and closure to ensure
          // the user is visiting the image for the 1st time
          if (i > prevIndex) {
            logAmplitude('PDP Interaction', {
              product,
              imagePosition: i + 1,
              interactionType: 'Product Image Swipe',
              image: images[i].product_url
            });

            prevIndex += 1;
          }

          setMobileZoomImage(images[i]);
          setMobileZoomImageIndex(i);
        }
      });

      node.on('dragStart', () => (global.document.ontouchmove = (e) => e.preventDefault()));
      node.on('dragEnd', () => (global.document.ontouchmove = () => true));
    }

    // Cleanup the event listeners when the component unmounts
    return () => {
      node.off('change');
      node.off('dragStart');
      node.off('dragEnd');
    };
  }, []);

  const handleZoomButtonClick = () => {
    if (mobileZoomImage) {
      handleOnImageClick(mobileZoomImage, mobileZoomImageIndex);
    }
  };

  return (
    <MobileImageGalleryWrapper>
      <MobileCarousel
        type="mobilePDP"
        flickityRef={onMobileCarouselRef}
        options={{
          prevNextButtons: false,
          pageDots: images.length > 1,
          groupCells: 1
        }}
        mobilePDP
      >
        {
          images.map((image, idx) => (
            <Image
              key={`mobile-image-${image.id}`}
              image={image}
              index={idx}
              alt={image.alt ?? `${createAlt(idx)}`}
              handleOnImageLoad={handleOnImageLoad}
              handleOnImageClick={handleOnImageClick}
            />
          ))
        }
      </MobileCarousel>

      <MobileZoomArrows handleZoomButtonClick={handleZoomButtonClick} />
    </MobileImageGalleryWrapper>
  );
};

MobileImageGallery.propTypes = {
  product: PropTypes.object.isRequired,
  images: PropTypes.array.isRequired,
  createAlt: PropTypes.func.isRequired,
  handleOnImageClick: PropTypes.func.isRequired,
  handleOnImageLoad: PropTypes.func.isRequired
};

export default MobileImageGallery;
