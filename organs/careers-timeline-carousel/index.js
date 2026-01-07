import React, { useCallback, useRef, useEffect } from 'react';
import PropTypes, { shape } from 'prop-types';
import styled from '@emotion/styled';
import { withTheme } from 'emotion-theming';

import Carousel from '../../atoms/carousel';
import Typography from '../../atoms/typography';

const StyledCarousel = styled(Carousel)`
  cursor: grab;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    padding-left: 2.4rem;
  }
`;

const ImageTitle = styled(Typography)`
  color: ${({ theme }) => theme.color.brandLightBlue};
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 400;
  text-align: left;
  margin-top: 2.4rem;
  margin-bottom: 8px;
`;

const ImageSubTitle = styled(Typography)`
  color: ${({ theme }) => theme.color.bluePrimary};
  text-transform: capitalize;
  line-height: 4rem;
  text-align: left;
  font-size: 2.4rem;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    font-size: 3.2rem;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;

const YearsWrapper = styled.ul`
  display: flex;
  gap: 6px;

  justify-content: center;
  flex-wrap: wrap;
`;

const Year = styled.li`
  width: 153.6px;
  height: 36px;
  margin-bottom: 1.6rem;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: ${({ theme }) => theme.modularScale.twentyFour};
  line-height: 150%;
  text-align: center;
  letter-spacing: 1px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  @media (max-width: ${({ theme }) => theme.breakpoint.medium}) {
    width: 51.2px;
    height: 24px;
    font-size: 20px;
    line-height: 24px;
  }
`;

const TimelineCarousel = (props) => {
  const { theme } = props;
  const years = [...new Set(props.images.map(({ year }) => year))];
  const carouselRef = useRef(null);
  const yearsWrapperRef = useRef(null);
  const yearIndexRef = useRef(0);

  useEffect(() => {
    if (carouselRef.current) carouselRef.current.destroy();
  }, []);

  const carouselSettings = {
    prevNextButtons: false,
    pageDots: false,
    cellAlign: 'left',
    draggable: true,
    wrapAround: props.isInfinite
  };

  const onCarouselRef = useCallback((node) => {
    if (node !== null) {
      const el = node;
      carouselRef.current = el;
      node.on('change', () => {
        const yearsWrapperEl = yearsWrapperRef.current;
        // Manipulating here the DOM directly because using React state reloads the carousel
        if (yearsWrapperEl) {
          const yearsEl = yearsWrapperEl.childNodes;
          // undo previous style
          yearsEl.item(yearIndexRef.current).style.color = theme.color.brandLightBlue;
          yearsEl.item(yearIndexRef.current).style.textDecoration = 'none';
          const newYear = node.selectedElement.dataset.year;
          // apply new style
          yearIndexRef.current = years.findIndex((year) => year === newYear);
          yearsEl.item(yearIndexRef.current).style.color = theme.color.bluePrimary;
          yearsEl.item(yearIndexRef.current).style.textDecoration = 'underline';
        }
      });
      node.on('dragStart', () => {
        global.document.ontouchmove = (e) => e.preventDefault();
        el.slider.style.pointerEvents = 'none';
      });
      node.on('dragEnd', () => {
        global.document.ontouchmove = () => true;
        el.slider.style.pointerEvents = 'auto';
      });
    }

    // Cleanup the event listeners when the component unmounts
    return () => {
      node.off('change');
      node.off('dragStart');
      node.off('dragEnd');
    };
  }, []);

  const handleYearChange = (currentYear) => {
    const carouselEl = carouselRef.current;
    if (carouselEl) {
      const allYears = props.images.map(({ year }) => year);
      const newIndex = allYears.findIndex((year) => year === currentYear);
      carouselEl.selectCell(newIndex);
    }
  };

  return (
    <>
      <YearsWrapper ref={yearsWrapperRef}>
        {years.map((year, index) => {
          const isActive = index === yearIndexRef.current;
          return (
            <Year
              style={{
                color: isActive ? theme.color.bluePrimary : theme.color.brandLightBlue,
                textDecoration: isActive ? 'underline' : 'none'
              }}
              key={`${index + 1}-${year}`}
              onClick={() => handleYearChange(year)}
            >
              {year}
            </Year>
          );
        })}
      </YearsWrapper>
      <StyledCarousel
        type="careers-timeline"
        options={carouselSettings}
        disableImagesLoaded
        reloadOnUpdate
        flickityRef={onCarouselRef}
      >
        {props.images.map((image, index) => (
          <ImageWrapper
            key={`${index + 1}-${image.year}`}
            data-year={image.year}
          >
            <Image src={image.path} alt={image.alt} />
            <ImageTitle element="h6" like="dec-4">
              {image.title}
            </ImageTitle>
            <ImageSubTitle element="h3" like="heading-7">
              {image.subTitle}
            </ImageSubTitle>
          </ImageWrapper>
        ))}
      </StyledCarousel>
    </>
  );
};

TimelineCarousel.defaultProps = {
  theme: {},
  isInfinite: true
};

TimelineCarousel.propTypes = {
  theme: shape(),
  images: PropTypes.arrayOf(shape({
    path: PropTypes.string,
    alt: PropTypes.string,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    year: PropTypes.string
  })).isRequired,
  isInfinite: PropTypes.bool
};

export default withTheme(TimelineCarousel);
