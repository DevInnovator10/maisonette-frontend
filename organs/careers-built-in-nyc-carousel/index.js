import React, { useCallback, useRef, useEffect } from 'react';
import PropTypes, { shape } from 'prop-types';
import styled from '@emotion/styled';

import Carousel from '../../atoms/carousel';
import Typography from '../../atoms/typography';

const Title = styled(Typography)`
    color: ${({ theme }) => theme.color.brandLightBlue};
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 400;
  text-align: left;
  margin-top: 2.4rem;
  margin-bottom: 8px;
`;

const SubTitle = styled(Typography)`
  color: ${({ theme }) => theme.color.bluePrimary};
  text-transform: capitalize;
  line-height: 4rem;
  text-align: left;
  font-size: 2.4rem;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    font-size: 3.2rem;
  }
`;

const Cell = styled.div`
  display: flex;
  flex-direction: column;
`;

const Link = styled.a`
  text-decoration: none;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;

const BuiltInNycCarousel = (props) => {
  const carouselRef = useRef(null);

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
      node.off('dragStart');

      node.off('dragEnd');
    };
  }, []);

  return (
    <>
      <Carousel
        type="built-in-nyc"
        options={carouselSettings}
        disableImagesLoaded
        flickityRef={onCarouselRef}
        reloadOnUpdate
      >
        {props.data.map(({
          imageSrc, imageAlt, articleUrl, section, title
        }) => (
          <Cell
            key={imageSrc}
          >
            <Link href={articleUrl} target="_blank" rel="noopener noreferrer">
              <Image src={imageSrc} alt={imageAlt} />
              <Title element="h6" like="dec-4">
                {section}
              </Title>
              <SubTitle element="h3" like="heading-7">
                {title}
              </SubTitle>
            </Link>
          </Cell>
        ))}
      </Carousel>
    </>
  );
};

BuiltInNycCarousel.defaultProps = {
  isInfinite: true
};

BuiltInNycCarousel.propTypes = {
  data: PropTypes.arrayOf(shape({
    imageSrc: PropTypes.string,
    imageAlt: PropTypes.string,
    articleUrl: PropTypes.string,
    title: PropTypes.string,
    section: PropTypes.string
  })).isRequired,
  isInfinite: PropTypes.bool
};

export default BuiltInNycCarousel;
