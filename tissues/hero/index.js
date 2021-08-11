import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import router from 'next/router';
import theme from '../../theme/theme';

import { getHref } from '../../utils/navigation';
import trackEvent from '../../utils/tracking';
import LinkNoUnderline from '../../atoms/link-no-underline';
import Button from '../../atoms/button';
import Picture from '../../atoms/picture';
import Typography from '../../atoms/typography';
import Ruler from '../../atoms/ruler';
import Carousel from '../../atoms/carousel';
import { useWindowSize } from '../../utils/hooks';

import Link from '../../utils/link';

const HeroContent = styled.span`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 2rem 3rem 0;

  @media screen and (min-width: ${theme.breakpoint.small}) {
    margin: 0 auto;
    max-width: 600px;
    width: 100%;
  }

  @media screen and (min-width: ${theme.breakpoint.medium}) {
    ${(props) => (!props.circle ? `
      background-color: var(--background-color);
      margin-top: ${props.hasImages && !props.isStory ? '-60px' : '0'};
      position: relative;
      z-index: ${theme.layers.backstage};
    ` : null)}
  }

  ${(props) => props.carousel && css`
    padding-top: ${theme.modularScale.sixteen};

    @media screen and (min-width: ${theme.breakpoint.medium}) {
      margin-top: 0;
      padding-top: ${theme.modularScale.thirtyTwo};
    }
  `}
`;

const circleImageStyles = `
  max-width: 430px;
  width: 100%;
`;

const MobileImage = styled(Picture)`
  ${(props) => (props.circle ? circleImageStyles : '')};
  ${(props) => (props.circle ? `padding: ${theme.modularScale['2xlarge']} 2rem 0` : '')};

  margin-left: auto;
  margin-right: auto;

  @media screen and (min-width: ${theme.breakpoint.small}) {
    display: none;
  }
`;

const DesktopImage = styled(Picture)`
  ${(props) => (props.circle ? circleImageStyles : '')}

  display: none;
  margin-left: auto;
  margin-right: auto;

  ${(props) => props.isStory && css`
    img {
      object-fit: contain;
      display: block;
      max-height: 580px;
      max-width: 100%;
    }
  `};

  @media screen and (min-width: ${theme.breakpoint.small}) {
    display: block;

    & + ${HeroContent} {
      transform: ${(props) => (props.circle || props.isStory || props.carousel ? 'none' : 'translateY(-60px);')}
    }
  }

  @media screen and (min-width: ${theme.breakpoint.medium}) {
    ${(props) => (props.className === 'rect' ? 'min-height: 6rem' : '')};
  }
`;

const Anchor = styled.a`
  display: block;
`;

const HeroTagLine = styled(Typography)`
  color: ${theme.color.brand};
  padding-bottom: ${theme.modularScale['2xlarge']};
  padding-top: ${theme.modularScale.base};

  @media screen and (min-width: ${theme.breakpoint.medium}) {
    padding-top: ${(props) => (props.isStory ? props.theme.modularScale.base : '0')};
  }
`;

const HeroTitle = styled(Typography, { shouldForwardProp: (prop) => prop !== 'carousel' })`
  color: ${theme.color.brand};
  margin-bottom: 0.75em;
  text-align: center;
  line-height: 35px;

  ${({ carousel }) => carousel && css`
    margin-bottom: 0;
  `}
`;

const HeroDescription = styled(Typography)`
  color: ${theme.color.brand};
  text-align: center;

  a {
    font-family: inherit;
    display: inline;
  }
`;

const CreditsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeroDl = styled.dl`
  display: grid;
  grid-column-gap: 8px;
  grid-row-gap: 0.7em;
  grid-template-columns: repeat(2, max-content);
  color: ${theme.color.brand};
`;

const HeroDt = styled(Typography)`
`;

const HeroDd = styled(Typography)`
  a {
    display: inline;
  }
`;

const HeroCTA = styled(Button)`
  border: none;
  border-bottom: .2rem solid ${theme.color.brand};
  color: ${theme.color.brand};
  display: inline-block;
  font-family: ${theme.font.caption};
  font-size: ${theme.modularScale.small};
  padding-bottom: .8rem;
  position: relative;
  text-transform: uppercase;
  line-height: 1rem;
  letter-spacing: .24rem;
`;

const contentCheck = (item) => {
  if (
    item.hero_subhead
    || item.hero_heading
    || item.hero_description
    || item.hero_photography
    || item.hero_styling
    || item.hero_writer
    || item.hero_interviewer
    || item.hero_illustration
    || item.hero_cta
  ) {
    return true;
  }
  return false;
};

const HeroImage = (props) => {
  const windowWidth = useWindowSize();

  if (windowWidth.width <= parseInt(theme.breakpoint.small, 10)) {
    return (
      <MobileImage
        {...props.item.hero_image_mobile}
        circle={props.item.hero_circle_image}
        className={props.item.hero_circle_image ? 'circle' : 'rect'}
        disableLazyload={props.disableLazyload}
        alt={props.item.hero_image_mobile_alt}
      />
    );
  }

  return (
    <DesktopImage
      {...props.item.hero_image_desktop}
      circle={props.item.hero_circle_image}
      className={props.item.hero_circle_image ? 'circle' : 'rect'}
      isStory={props.isStory}
      disableLazyload={props.disableLazyload}
      alt={props.item.hero_image_desktop_alt}
      carousel={props.carousel}
    />
  );
};

HeroImage.defaultProps = {
  carousel: false
};

HeroImage.propTypes = {
  item: PropTypes.object.isRequired,
  disableLazyload: PropTypes.bool.isRequired,
  isStory: PropTypes.bool.isRequired,
  carousel: PropTypes.bool
};

const Hero = ({
  item, isStory, disableLazyload, carousel, staticClick
}) => {
  const handleHeroLinkClick = (e) => {
    e.preventDefault();
    if (staticClick || !carousel) {
      // only want to trigger the push when staticClick is true,
      // which means the click was not an attempt to move the carousel.
      // check carousel prop to allow for hero links that are not in carousel.
      router.push(item.hero_url);
    }
  };

  return item && (
    <>
      {item?.hero_image_desktop && item?.hero_image_mobile
        ? (
          <>
            {
              item.hero_url ? (
                <Link href={getHref({ navigation_url: item?.hero_url })} passHref>
                  <Anchor aria-label={item.hero_heading} onClick={handleHeroLinkClick}>
                    <HeroImage
                      item={item}
                      isStory={isStory}
                      disableLazyload={disableLazyload}
                      carousel={carousel}
                    />
                  </Anchor>
                </Link>
              ) : (
                <HeroImage
                  item={item}
                  isStory={isStory}
                  disableLazyload={disableLazyload}
                  carousel={carousel}
                />
              )
            }
          </>
        ) : null}

      {contentCheck(item) && (
        <HeroContent
          circle={item.hero_circle_image}
          hasImages={item.hero_image_desktop && item.hero_image_desktop}
          isStory={isStory}
          carousel={carousel}
        >
          {
            item.hero_subhead
              ? <HeroTagLine element="h2" like="dec-1" isStory={isStory}>{item.hero_subhead}</HeroTagLine>
              : null
          }

          {
            item.hero_heading
              ? (
                <>
                  {item.hero_url ? (
                    <LinkNoUnderline
                      href={getHref({ navigation_url: item?.hero_url })}
                    >
                      <HeroTitle
                        element="h1"
                        like="heading-4"
                        carousel={carousel}
                        onClick={handleHeroLinkClick}
                      >
                        {item.hero_heading}

                      </HeroTitle>
                    </LinkNoUnderline>
                  ) : <HeroTitle element="h1" like="heading-4" carousel={carousel}>{item.hero_heading}</HeroTitle>}
                </>
              )
              : null
          }

          {
            item.hero_description
              ? <HeroDescription element="p" like="paragraph-1" dangerouslySetInnerHTML={{ __html: item.hero_description }} />
              : null
          }

          {
            (
              item.hero_photography
              || item.hero_styling
              || item.hero_writer
              || item.hero_interviewer
              || item.hero_illustration
            ) && (
              <CreditsWrapper>
                {
                  item.hero_photography
                    ? (
                      <HeroDl>
                        <HeroDt element="dt" like="dec-1">Photography</HeroDt>
                        <HeroDd element="dd" like="dec-1" dangerouslySetInnerHTML={{ __html: item.hero_photography }} />
                      </HeroDl>
                    )
                    : null
                }

                {
                  item.hero_styling
                    ? (
                      <HeroDl>
                        <HeroDt element="dt" like="dec-1">Styling</HeroDt>
                        <HeroDd element="dd" like="dec-1" dangerouslySetInnerHTML={{ __html: item.hero_styling }} />
                      </HeroDl>
                    )
                    : null
                }

                {
                  item.hero_writer
                    ? (
                      <HeroDl>
                        <HeroDt element="dt" like="dec-1">Written By</HeroDt>
                        <HeroDd element="dd" like="dec-1" dangerouslySetInnerHTML={{ __html: item.hero_writer }} />
                      </HeroDl>
                    )
                    : null
                }

                {
                  item.hero_interviewer
                    ? (
                      <HeroDl>
                        <HeroDt element="dt" like="dec-1">Interview By</HeroDt>
                        <HeroDd element="dd" like="dec-1" dangerouslySetInnerHTML={{ __html: item.hero_interviewer }} />
                      </HeroDl>
                    )
                    : null
                }

                {
                  item.hero_illustration
                    ? (
                      <HeroDl>
                        <HeroDt element="dt" like="dec-1">Illustration</HeroDt>
                        <HeroDd element="dd" like="dec-1" dangerouslySetInnerHTML={{ __html: item.hero_illustration }} />
                      </HeroDl>
                    )
                    : null
                }
              </CreditsWrapper>
            )
          }

          {
            item.hero_cta && item.hero_url
              // eslint-disable-next-line max-len
              ? <HeroCTA isLink isText inverted href={item.hero_url}>{item.hero_cta}</HeroCTA>
              : null
          }
        </HeroContent>
      )}
    </>
  );
};

const HeroModuleWrapper = styled('section', { shouldForwardProp: (prop) => prop !== 'isStory' })`
  margin: ${({ isStory }) => (isStory ? `-${theme.modularScale.large} -3rem 0` : `-${theme.modularScale['2xlarge']} -3rem 0`)};
  width: calc(100% + 6rem);

  @media screen and (min-width: ${theme.breakpoint.small}) {
    margin: 0 auto;
    width: 100%;
  }

  :hover {
    @media screen and (min-width: ${theme.breakpoint.large}) {
      // hover behavior is specific for this module.
      // show the carousel arrow buttons on hover of the Hero module,
      // additional carousel styling live in /atoms/carousel
      .flickity-prev-next-button {
        display: block;
      }
    }
  }
`;

// component helps with styling issues brought on by carousel
const CarouselDiv = styled.div``;

const arrowShape = {
  x0: 10,
  x1: 60,
  y1: 50,
  x2: 70,
  y2: 40,
  x3: 30
};

const handleTracking = (isStory) => trackEvent({
  eventAction: `${isStory ? 'Le Scoop Story' : 'Homepage'}`,
  eventCategory: 'Content Engagement',
  eventLabel: 'Content Slot 1 (Hero)'
});

const HeroCarousel = (props) => {
  const elements = Object.values(props.data.hero_elements);
  const [firstElement] = elements;
  const [staticClick, setStaticClick] = useState(false);

  const onCarouselRef = useCallback((node) => {
    // TODO: create global logic for this behavior
    // staticClick fires when the cell is not being swiped
    // we use this to trigger router pushes
    if (node !== null) {
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

  // used to set adjustArrows prop for carousel to center the arrows on the image,
  // rather than entire carousel - this affects all slides, so content must be normalized
  const hasHeading = elements?.some((element) => element.hero_heading);

  return (
    <HeroModuleWrapper onClick={() => handleTracking(props.isStory)} isStory={props.isStory}>
      {
        elements?.length > 1
          ? (
            <Carousel
              type="hero"
              adjustArrows={hasHeading}
              ignoreDomReady
              flickityRef={onCarouselRef}
              options={{
                arrowShape,
                wrapAround: true,
                adaptiveHeight: true,
                autoPlay: true
              }}
            >
              {
                elements.map((element, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <CarouselDiv key={`hero-element-div-${index}`}>
                    <Hero
                      carousel
                      item={element}
                      isStory={props.isStory}
                      disableLazyload
                      staticClick={staticClick}
                    />
                  </CarouselDiv>
                ))
              }
            </Carousel>
          )
          : (
            <Hero
              item={firstElement}
              isStory={props.isStory}
              disableLazyload={props.disableLazyload}
            />
          )
      }

      {props.data?.hero_hr && <Ruler />}
    </HeroModuleWrapper>
  );
};

HeroCarousel.defaultProps = {
  isStory: false,
  disableLazyload: false
};

HeroCarousel.propTypes = {
  data: PropTypes.object.isRequired,
  isStory: PropTypes.bool,
  disableLazyload: PropTypes.bool
};

export default HeroCarousel;
