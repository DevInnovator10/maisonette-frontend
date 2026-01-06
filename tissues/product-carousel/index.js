import React, {
  useState, useCallback, useEffect, useRef
} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import * as Sentry from '@sentry/node';

import FastlyPicture from '../../atoms/fastly-picture';
import Carousel from '../../atoms/carousel';
import ZoomSlide from '../../molecules/carousel-zoom';

import { useProduct } from '../../utils/context/product-provider';

import { logAmplitude } from '../../utils/amplitude';

const FASTLY_ON = process.env.NEXT_PUBLIC_FASTLY_ON === 'true';

const CarouselGrid = styled.div`
  flex-direction: column;
  margin-top: -15px;
  align-items: center;
  grid-area: product-carousel;
  max-width: 100%;
  -webkit-tap-highlight-color: transparent;
`;

const CaroImageBtn = styled.button`
  background: transparent;
  border: none;
  min-height: 400px;
  img {
    width: 100%;
    height: 100%;
  }
  :hover {
    cursor: pointer;
  }

`;

const CarouselsWrapper = styled.section`
  overflow: hidden;
  width: 100%;
  :hover {
    cursor: pointer;
  }

  @media (max-width: ${({ theme }) => theme.breakpoint.small}) {
    margin-bottom: 0px;
  }
`;

const CarouselLargeWrapper = styled.div`
  position: relative;
  overflow: hidden;
  min-height: 300px;

  @media (max-width: ${({ theme }) => theme.breakpoint.small}) {
    .flickity-button.flickity-prev-next-button {
      display: none;
    }

  }

  @media (min-width:769px) {
    .flickity-button.flickity-prev-next-button + .flickity-page-dots {
      display: none;
    }
  }

`;

const CarouselSmallWrapper = styled.div`
  cursor: grab;
  overflow-x: hidden;
  overflow-y: scroll;
  overflow: auto;
  padding-bottom: 20px;
  margin-top: 25px;
  display:flex;
  justify-content: center;
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: flex;
    justify-content: center;
    max-height: 490px;
    overflow-x: initial;
    overflow-y: auto;
    padding-bottom: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoint.small}) {
    padding-bottom: 0px;
    margin-top: 0px;
  }

`;

const Thumbnail = styled.li`
  opacity: ${(props) => (props.active ? 1 : 0.6)};
  transition: opacity ${(props) => props.theme.animation.default} ${(props) => props.theme.animation.easeInQuad};
  margin: 0 1rem;

  :last-of-type {
    margin-right: 0;
  }

  img {
    border: 0.1rem solid ${(props) => props.theme.color.brand};
    display: block;
    height: 4rem;
    padding: 0.5rem;
    width: 4rem;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    margin-right: 0;
    margin-bottom: 1.5rem;

    :last-of-type {
      margin-bottom: 0;
    }
  }

`;

const CarouselSmall = styled.ul`
  display: flex;
  flex-direction: row;

  @media (max-width: ${(props) => props.theme.breakpoint.small}) {
    ${Thumbnail} {
      display: none;
    }
  }

`;

const ProductCarousel = (props) => {
  const smallCarouselRef = useRef(null);
  const { state: { activeColor } } = useProduct();

  const [images, setImages] = useState(props.images ?? []);
  const [carouselRef, setCarouselRef] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideImage, setSlideImage] = useState(props?.images[0]?.product_large_url ?? `${process.env.NEXT_PUBLIC_ASSET_HOST}/images/default-image.jpg`);
  const [zoomClosed, setZoomClosed] = useState(true);
  const [zoomOpened, setZoomOpened] = useState(false);
  const [zoomAnimating, setZoomAnimating] = useState(false);
  const [originalStyle] = useState(global.window?.getComputedStyle(global.document?.body).overflowY) ?? 'auto';

  const onCarouselRef = useCallback((node) => {
    let prevIndex = 0;

    if (node !== null) {
      setCarouselRef(node);
      node.on('change', (i) => {
        if (images[i]) {
          // in order to track if the user swiped LEFT to view the next image
          // for the first time, use prevIndex and closure to ensure
          // the user is visiting the image for the 1st time
          if (i > prevIndex) {
            logAmplitude('PDP Interaction', {
              product: props.product,
              imagePosition: i + 1,
              interactionType: 'Product Image Swipe',
              image: images[i].product_url
            });

            prevIndex += 1;
          }

          setSlideImage(images[i].product_large_url);
          setSlideIndex(i);
        }
      });
    }

    // Cleanup the event listeners when the component unmounts
    return () => {
      node.off('change');
    };
  }, []);

  useEffect(() => {
    if (zoomOpened) global.document.body.style.overflowY = 'hidden';
    if (zoomClosed) global.document.body.style.overflowY = originalStyle;
  }, [zoomOpened, zoomClosed]);

  const carouselSettings = {
    prevNextButtons: true,
    pageDots: true,
    wrapAround: true
  };

  const handleOnThumbnailClick = (i) => {
    if (carouselRef) carouselRef.selectCell(i);
  };

  const handleOnZoomOpenClick = (imgIndex) => {
    const { product } = props;
    global.document.body.style.overflowY = 'hidden';

    setSlideImage(images[imgIndex].product_zoom_url);
    setZoomAnimating(true);

    logAmplitude('PDP Interaction', {
      product,
      imagePosition: slideIndex + 1,
      interactionType: 'Product Image Click',
      image: images.product_zoom_url,
      imageZoomPosition: 'Click Image'
    });

    setTimeout(() => {
      setZoomAnimating(false);
      setZoomClosed(false);
      setZoomOpened(true);
    }, 0); /* parseInt(theme.animation.default, 10) */
  };

  const handleOnZoomCloseClick = () => {
    global.document.body.style.overflowY = '';

    setZoomAnimating(true);

    setTimeout(() => {
      setZoomAnimating(false);
      setZoomClosed(true);
      setZoomOpened(false);
    }, 0); /* parseInt(theme.animation.default, 10) */
  };

  let smallCarouselPos = {
    top: 0, left: 0, x: 0, y: 0
  };

  const mouseMoveHandler = (e) => {
    const dx = e.clientX - smallCarouselPos.x;
    const dy = e.clientY - smallCarouselPos.y;

    if (smallCarouselRef?.current) {
      smallCarouselRef.current.scrollLeft = smallCarouselPos.left - dx;
      smallCarouselRef.current.scrollTop = smallCarouselPos.top - dy;
    }
  };

  const mouseUpHandler = () => {
    if (smallCarouselRef?.current) {
      smallCarouselRef.current.style.cursor = 'grab';
      smallCarouselRef.current.style.userSelect = 'user-select';
    }

    global.document.body.style.cursor = 'default';
    global.document.removeEventListener('mousemove', mouseMoveHandler);
    global.document.removeEventListener('mouseup', mouseUpHandler);
  };

  const mouseDownHandler = (e) => {
    if (smallCarouselRef?.current) {
      smallCarouselRef.current.style.cursor = 'grabbing';
      smallCarouselRef.current.style.userSelect = 'none';

      smallCarouselPos = {
        left: smallCarouselRef.current.scrollLeft,
        top: smallCarouselRef.current.scrollTop,
        x: e.clientX,
        y: e.clientY
      };
    }

    global.document.body.style.cursor = 'grabbing';
    global.document.addEventListener('mousemove', mouseMoveHandler);
    global.document.addEventListener('mouseup', mouseUpHandler);
  };

  useEffect(() => () => {
    global.document.removeEventListener('mousemove', mouseMoveHandler);
    global.document.removeEventListener('mouseup', mouseUpHandler);

    // on initial render, if a color has not been selected,
    // and props.images is an empty array,
    // then add a default image

    if (!activeColor && props.images.length === 0) {
      props.images.push({ product_zoom_url: `${process.env.NEXT_PUBLIC_ASSET_HOST}/images/default-image.jpg` });

      setImages(props.images);
      setSlideImage(props.images[0].product_zoom_url);
    }
  }, []);

  useEffect(() => {
    if (activeColor && activeColor.length && props.product) {
      const { maisonette_variant_group_attributes: variant_attributes } = props.product;

      const validColor = variant_attributes.find((v) =>
        (v?.option_value?.name).toLowerCase() === activeColor);

      if (validColor && validColor.images.length) {
        const sortedImages = validColor.images.sort((a, b) => (a.position < b.position ? -1 : 1));

        setImages(sortedImages);
        setSlideImage(sortedImages[0].product_zoom_url);
      }
    }
  }, [activeColor]);

  const handleOnImageLoad = (event, imgIndex) => {
    const { performance } = global;
    const { currentTarget } = event;

    if (imgIndex > 0
      || !currentTarget
      || !performance
      || !performance.clearMarks
      || !performance.mark
    ) return;

    try {
      performance.clearMarks('PDP Image');
      performance.mark('PDP Image');
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const createAlt = (index) => `${props.name} - ${props.productType} - ${index + 1}`;

  return (
    <CarouselGrid>
      {/* NOTE: because I need a buffer between grid and slider...😕 */}
      <CarouselsWrapper multiImage={images.length > 1}>
        <CarouselLargeWrapper>
          <Carousel
            flickityRef={onCarouselRef}
            type="pdp"
            options={carouselSettings}
          >
            {
              images.map(
                (image, imgIndex) => (
                  <CaroImageBtn
                    key={image.id}
                    type="button"
                    onClick={() => handleOnZoomOpenClick(imgIndex)}
                    onKeyDown={() => handleOnZoomOpenClick(imgIndex)}
                  >
                    {FASTLY_ON ? (
                      <FastlyPicture
                        type="pdp"
                        src={slideIndex === imgIndex ? slideImage : image.small_url}
                        alt={image.alt ?? `${createAlt(imgIndex)}`}
                        onLoad={(e) => handleOnImageLoad(e, imgIndex)}
                      />
                    ) : (
                      <img
                        src={slideIndex === imgIndex ? slideImage : image.small_url}
                        alt={image.alt ?? `${createAlt(imgIndex)}`}
                        onLoad={(e) => handleOnImageLoad(e, imgIndex)}
                      />
                    )}
                  </CaroImageBtn>
                )
              )
            }
          </Carousel>

          {zoomOpened && (

            <ZoomSlide
              images={images}
              image={slideImage}
              slideIndex={slideIndex}
              alt={createAlt(slideIndex)}
              onClose={handleOnZoomCloseClick}
              zoomAnimating={zoomAnimating}
              zoomClosed={zoomClosed}
              zoomOpened={zoomOpened}
              setNoPinch={props.setNoPinch}
              name={props.name}
              product={props.product}
            />
          )}
        </CarouselLargeWrapper>

      </CarouselsWrapper>

      {
        images.length > 1 && (
          <CarouselSmallWrapper
            ref={smallCarouselRef}
            onMouseDown={mouseDownHandler}
          >
            <CarouselSmall>
              {
                images.map((image, index) => (
                  <Thumbnail
                    key={image.id}
                    active={index === slideIndex}
                    onClick={() => handleOnThumbnailClick(index)}
                    tabIndex="0"
                    role="button"
                    aria-label={`${props.name} image thumbnail ${index + 1}`}
                    aria-pressed={index === slideIndex}
                  >
                    {FASTLY_ON
                      ? (
                        <FastlyPicture
                          type="pdp"
                          src={image.small_url}
                          alt={image.alt ?? `${createAlt(index)} - thumbnail`}
                          draggable="false"
                        />
                      )
                      : (
                        <img
                          src={image.small_url}
                          alt={image.alt ?? `${createAlt(index)} - thumbnail`}
                          draggable="false"
                        />
                      )}

                  </Thumbnail>
                ))
              }
            </CarouselSmall>
          </CarouselSmallWrapper>
        )
      }
    </CarouselGrid>
  );
};

ProductCarousel.defaultProps = {
  productType: 'product',
  setNoPinch: () => { }
};

ProductCarousel.propTypes = {
  product: PropTypes.object.isRequired,
  images: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  productType: PropTypes.string,
  setNoPinch: PropTypes.func
};

export default ProductCarousel;
