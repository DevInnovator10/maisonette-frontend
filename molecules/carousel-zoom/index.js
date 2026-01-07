import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import InnerImageZoom from 'react-inner-image-zoom';
import Button from '../../atoms/button';
import Carousel from '../../atoms/carousel';
import IconCirclePlus from '../../atoms/icon-circle-plus';
import { logAmplitude } from '../../utils/amplitude';
import { CarouselSmallWrapper, CarouselSmall, Thumbnail } from '../../tissues/carousel-wrapper';
import Typography from '../../atoms/typography';

const StyledCarousel = styled(Carousel)`
    .flickity-prev-next-button {
    position: absolute;
    &.previous { left: -4rem; }

      &.next {
        right: -4rem;

      }
    }
  }

  ${(props) => css`
  @media (max-width: ${props.theme.breakpoint.small}) {
    height: auto;
    width: 90%;
    overflow: auto;
  }
`}

  @media (max-width: 578px) {
   margin-top: auto;
  }

`;

const ImageSlideNumber = styled(Typography)`
  line-height: ${(props) => props.theme.modularScale.sixteen};
  font-weight: 400;
  width: 100%;
  display: inline-block;
  text-align: center;
  margin-top: 2.5rem;
`;

const ZoomClose = styled(Button)`
  background: ${(props) => props.theme.color.white};
  border-radius: 100%;
  outline: 0;
  margin: 1rem;
  position: absolute;
  z-index: 900;
  right: 0;
  top: 0;
  svg {
    transform: rotate(45deg);
  }
`;

const CarouselZoomDivWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  max-height: 1220px;
  height: 100%;

  .flickity-slider{
    height: 100%;
    display: flex;
    align-items: center;
  }

  ${(props) => css`
  @media (max-width: ${props.theme.breakpoint.small}) {
    width: 100%;
    overflow: hidden;
    max-height: 1220px;
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`}

`;

const ZoomControls = styled.div`
  background: ${(props) => props.theme.color.white};
  border-radius: 5rem;
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 50%;
  margin: 1rem;
  opacity: 0;
  position: absolute;
  transform: translateX(-50%);

`;

const ZoomContainer = styled.div`
  display: none;

  .iiz{
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    > div {
      transform: translateY(-80px);
      height: 100%;
      }

    img{
      opacity: 1;
      transform: translateY(80px);
      margin: 0 auto;

      ${(props) => css`
        @media (max-width: ${props.theme.breakpoint.small}) {
          transform: translateY(15%);
        }

        @media (max-width: 560px) {
          transform: translateY(25%);
        }
     `}

    }
  }
`;

const ZoomWrapper = styled.div`
  left: 3rem;
  position: absolute;
  top: 0;
  width: calc(100% - 6rem);
  z-index: -1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  svg {
    fill: transparent;
    stroke-width: 3;
    stroke: ${(props) => props.theme.color.brand};
  }

  img {
    display: block;
    max-width: 100%;
    top: 0;
  }


  ${ZoomControls} {
    visibility: hidden;
  }

  ${(props) => props.zoomOpened && css`
    background: ${props.theme.color.white};
    height: 100%;
    left: 0;
    max-height: 100vh;
    position: fixed;
    width: 100%;
    z-index: ${props.theme.layers.box};
    overflow: auto;

    img {
      opacity: 1;
      z-index: ${props.theme.layers.balcony};
    }

    ${ZoomContainer} {
      background-position: 50% 50%;
      background-repeat: no-repeat;
      background-size: 100%;
      cursor: all-scroll;
      display: block;
      height: 100%;
      object-fit: none;
      object-position: 0;
      position: relative;
      width: 95%;
      margin:0 auto;
      margin-top: 0px;
      border-radius: 8px;
      background: rgba(255,255,255,0.2);
      padding-top: 5px;

      ${StyledCarousel}

      @media (max-width: ${props.theme.breakpoint.small}) {
        display: flex;
        align-items: center;

      }

      @media screen and (max-width: 1440px) and (min-width: 750px) {
        .flickity-viewport {
          margin-top: 0px;
        }

      }

      @media (min-width: 1440px) {
        .flickity-viewport {
          margin-top: 70px;
        }
      }

    ${ZoomClose},
    ${ZoomControls} {
      right: 22px;
      margin-right: 0px;
      opacity: 1;
      z-index: ${props.theme.layers.balcony};
      visibility: visible;
    }
  `}

`;

class ProductCarouselZoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      zoom: 0,
      lowResolution: false,
      images: this.props.images,
      slideIndex: this.props.slideIndex,
      carouselRef: null
    };

    this.maxNumberOfZooms = 3;
    this.zoomContainerRef = createRef();

    this.closeZoom = this.closeZoom.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);

    this.handleOnEscapeKey = this.handleOnEscapeKey.bind(this);
  }

  componentDidMount() {
    global.document.addEventListener('keyup', this.handleOnEscapeKey, false);
  }

  componentWillUnmount() {
    global.document.removeEventListener('keyup', this.handleOnEscapeKey);
  }

  closeZoom = () => {
    this.setState({ zoom: 0 }, () => {
      this.props.onClose();
    });
  }

  zoomIn = () => {
    if (this.state.lowResolution) return;
    this.setState((prevState) => ({
      zoom: prevState.zoom < this.maxNumberOfZooms ? prevState.zoom + 1 : prevState.zoom
    }));
  }

  zoomOut = () => {
    if (this.state.lowResolution) return;
    this.setState((prevState) => ({
      zoom: prevState.zoom > 0 ? prevState.zoom - 1 : prevState.zoom
    }));
  }

  handleOnThumbnailClick = (i) => {
    const { carouselRef } = this.state;
    if (carouselRef) carouselRef.selectCell(i);
  };

  handleOnEscapeKey = (e) => {
    if (e.keyCode === 27) {
      this.closeZoom();
    }
  }

  onCarouselRef = (node) => {
    let prevIndex = 0;
    this.setState({ carouselRef: node });
    if (node !== null) {
      node.on('change', (i) => {
        const { images } = this.state;
        if (images[i]) {
          if (i > prevIndex) {
            logAmplitude('PDP Interaction', {
              product: this.props.product,
              imagePosition: i + 1,
              interactionType: 'Product Image Swipe',
              image: images[i].product_url
            });

            prevIndex += 1;
          }
          this.setState({
            slideIndex: i
          });
        }
      });
    }

    // Cleanup the event listener when the component unmounts
    return () => {
      node.off('change');
    };
  };

  render() {
    const { images, slideIndex } = this.state;
    return (
      <ZoomWrapper
        image={this.props.image}
        zoomAnimating={this.props.zoomAnimating}
        zoomClosed={this.props.zoomClosed}
        zoomOpened={this.props.zoomOpened}
        lowRes={this.state.lowResolution}
      >
        {
          !this.state.zoom && (
            <ImageSlideNumber element="span" like="label-3">
              {`${slideIndex + 1} / ${images.length}`}
            </ImageSlideNumber>
          )
        }
        <ZoomClose
          aria-label="close zoom"
          onClick={this.closeZoom}
          isIcon
          outline
          inverted
        >
          <IconCirclePlus />
        </ZoomClose>

        <ZoomContainer
          ref={(node) => { this.zoomContainerRef = node; }}
        >
          <CarouselZoomDivWrapper>
            <Carousel
              flickityRef={this.onCarouselRef}
              options={{
                initialIndex: this.props.slideIndex,
                wrapAround: true,
                pageDots: false
              }}
              type="pdp"
            >
              {
                images?.map(
                  (image) => (
                    <InnerImageZoom
                      src={image.large_url}
                      key={image.id}
                      zoomSrc={image.product_zoom_url}
                      fullscreenOnMobile
                      mobileBreakpoint={768}
                      hideHint
                      afterZoomIn={this.zoomIn}
                      afterZoomOut={this.zoomOut}
                    />
                  )
                )
              }
            </Carousel>
          </CarouselZoomDivWrapper>

          {images.length > 1 && (
            <CarouselSmallWrapper>
              <CarouselSmall>
                {
                  images.map((image, index) => (
                    <Thumbnail
                      key={image.id}
                      active={index === slideIndex}
                      onClick={() => this.handleOnThumbnailClick(index)}
                      tabIndex="0"
                      role="button"
                      aria-label={`${this.props.name} image thumbnail ${index + 1}`}
                      aria-pressed={index === slideIndex}
                    >
                      <img src={image.small_url} alt={image.alt ?? `${this.props.alt} - thumbnail`} draggable="false" />

                    </Thumbnail>
                  ))
                }
              </CarouselSmall>
            </CarouselSmallWrapper>
          )}
        </ZoomContainer>
      </ZoomWrapper>
    );
  }
}

ProductCarouselZoom.defaultProps = {
  onClose: () => { },
  zoomAnimating: false,
  zoomClosed: false,
  zoomOpened: false
};

ProductCarouselZoom.propTypes = {
  image: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired,
  slideIndex: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  zoomAnimating: PropTypes.bool,
  zoomClosed: PropTypes.bool,
  product: PropTypes.object.isRequired,
  zoomOpened: PropTypes.bool
};

export default ProductCarouselZoom;
