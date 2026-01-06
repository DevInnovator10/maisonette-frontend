import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import { getHref } from '../../utils/navigation';
import trackEvent from '../../utils/tracking';
import Button from '../../atoms/button';
import Picture from '../../atoms/picture';
import Typography from '../../atoms/typography';
import IconCircleArrow from '../../atoms/icon-circle-arrow';
import LinkNoUnderline from '../../atoms/link-no-underline';
import Ruler from '../../atoms/ruler';

const Container = styled.section`
  width: 100%;
`;

const Heading = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: ${(props) => props.theme.modularScale['2xlarge']};
  text-align: center;
  a {
    text-decoration: none;
    font-family: inherit;
  }
`;

const Columns = styled.div`
  align-items: stretch;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  ${(props) => props.rowLayout && css`
    flex-direction: column;
  `}

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    flex-direction: row;
    flex-wrap: nowrap;
  }
`;

const Column = styled.article`
  align-items: center;
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
  margin-bottom: ${(props) => props.theme.modularScale.xlarge};
  padding: 0;
  text-align: center;
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    padding: 0;
    width: 50%;
    margin-bottom: 0;

    &:nth-child(odd) {
      padding-right: 3rem;
    }

    &:nth-child(even) {
      padding-left: 3rem;
    }
  }
`;

const Content = styled.span`
  bottom: 0;
  display: block;
  max-width: 400px;
  padding: ${(props) => props.theme.modularScale.large} ${(props) => props.theme.modularScale.medium} 0;
  width: 100%;

  ${(props) => props.shape === 'box' && css`
    @media screen and (min-width: ${props.theme.breakpoint.small}) {
      background-color: var(--background-color);
      margin-top: -40px;
      position: relative;
    }

    @media screen and (min-width: ${props.theme.breakpoint.medium}) {
      margin-top: -50px;
    }

    @media screen and (min-width: ${props.theme.breakpoint.large}) {
      margin-top: -60px;
    }
  `}
`;

const Figure = styled.figure`
  align-items: center;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Banner = styled(Picture, { shouldForwardProp: (prop) => prop !== 'shape' })`
  height: 100%;
  object-fit: cover;
  ${({ shape }) => shape === 'box' && css`width: 100%`};

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    width: 100%;
  }

  img {
    vertical-align: bottom;
    height: 100%;
    width: 100%;
  }

  &.circle img {
    border-radius: 999px;
  }
`;

const Subtitle = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: ${(props) => props.theme.modularScale.base};
`;

const Cta = styled(Button)`
  border: none;
  border-bottom: .2rem solid ${(props) => props.theme.color.brand};
  color: ${(props) => props.theme.color.brand};
  display: inline-block;
  font-family: ${(props) => props.theme.font.caption};
  font-size: ${(props) => props.theme.modularScale.small};
  padding-bottom: .8rem;
  position: relative;
  text-transform: uppercase;
  line-height: 1rem;
  letter-spacing: .24rem;
`;

const Description = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: ${(props) => props.theme.modularScale.small};
  line-height: 1.2;
`;

const ShopNow = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  svg {
    height: 2.7rem;
    margin-bottom: ${(props) => props.theme.modularScale.small};
    width: 2.7rem;

    circle,
    path {
      fill: none;
      stroke: ${(props) => props.theme.color.brand};
      stroke-width: 4;
      transform: translate3d(0, 0, 0);
    }
  }

  :focus,
  :hover:not(:disabled) {
    svg {
      path {
        animation: arrow-head;
        animation-duration: ${(props) => props.theme.animation.slow};
        animation-timing-function: ${(props) => props.theme.animation.easeMove};
        animation-delay: 0s;
        animation-iteration-count: 1;
        animation-direction: normal;
        animation-fill-mode: forwards;
        animation-play-state: running;
      }
    }
  }

  span {
    color: ${(props) => props.theme.color.brand};
    font-family: ${(props) => props.theme.font.caption};
    font-size: ${(props) => props.theme.modularScale.small};
    text-transform: uppercase;
  }
`;

const HR = styled(Ruler)`
  margin-left: 3rem;
  margin-right: 3rem;
  width: auto;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
`;

const handleTracking = () => trackEvent({
  eventAction: 'Homepage',
  eventCategory: 'Content Engagement',
  eventLabel: 'Content Slot 3 (2 Banners)'
});

/**
 * @param {object} data - The data to use
 * @param {string} key - The key of the `data` object containing the elements
 */
const parseElements = (data, shape) => Object.keys(data).map((elementId) => (
  <Column key={elementId} shape={shape}>
    {data[elementId]?.[`double_banner_${shape}_image`]
      && (
        <LinkNoUnderline
          fullWidth
          href={getHref({ navigation_url: data[elementId][`double_banner_${shape}_url`] })}
          passHref
        >
          <Figure onClick={handleTracking}>
            <Banner
              {...data[elementId][`double_banner_${shape}_image`]}
              shape={shape}
              className={shape}
              alt={data[elementId][`double_banner_${shape}_image_alt`]}
            />

            <Content shape={shape}>
              {data[elementId]?.[`double_banner_${shape}_subhead`]
                && (
                  <Subtitle element="p" like="dec-1">
                    {data[elementId][`double_banner_${shape}_subhead`]}
                  </Subtitle>
                )}

              {data[elementId]?.[`double_banner_${shape}_heading`]
                && (
                  <Description element="p" like="heading-4">
                    {data[elementId][`double_banner_${shape}_heading`]}
                  </Description>
                )}

              <ShopNow>
                {data[elementId]?.[`double_banner_${shape}_cta`]
                  ? (
                    <Cta isText inverted>
                      {data[elementId][`double_banner_${shape}_cta`]}
                    </Cta>
                  )
                  : <IconCircleArrow />}
              </ShopNow>
            </Content>
          </Figure>
        </LinkNoUnderline>
      )}
  </Column>
));

const DoubleBanner = (props) => (
  <Container>
    {props.data.double_banner_heading && (
      <header>
        <Heading element="h1" like="heading-5">
          {props.data.double_banner_heading_url ? (
            <Link href={props.data.double_banner_heading_url}>
              <a>
                {props.data.double_banner_heading}
              </a>
            </Link>
          ) : props.data.double_banner_heading}
        </Heading>
      </header>
    )}

    <Columns rowLayout={props.data?.double_banner_br}>
      {props.data?.double_banner_box_elements && parseElements(props.data.double_banner_box_elements, 'box')}
      {props.data?.double_banner_circle_elements && parseElements(props.data.double_banner_circle_elements, 'circle')}
    </Columns>

    {props.data?.double_banner_hr && <HR />}
  </Container>
);

DoubleBanner.propTypes = {
  data: PropTypes.object.isRequired
};

DoubleBanner.whyDidYouRender = true;

export default DoubleBanner;
