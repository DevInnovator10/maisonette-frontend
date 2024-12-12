import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import { logAmplitude } from '../utils/amplitude';

const navigationCSS = ({ theme }) => css`
  margin-left: auto;
  margin-right: auto;
  padding-left: 3rem;
  padding-right: 3rem;

  @media screen and (min-width: ${theme.breakpoint.medium}) {
    padding-left: 6.5vw;
    padding-right: 6.5vw;
  }
`;

const cmsCSS = ({ theme }) => css`
  padding-top: ${theme.modularScale.large};
  padding-bottom: ${theme.modularScale.large};

  :first-of-type {
    padding-top: ${theme.modularScale['2xlarge']};
  }

  :last-of-type {
    padding-bottom: ${theme.modularScale['2xlarge']};
  }

  @media screen and (min-width: ${theme.breakpoint.medium}) {
    padding-top: ${theme.modularScale['2xlarge']};
    padding-bottom: ${theme.modularScale['2xlarge']};

    :first-of-type {
      padding-top: ${theme.modularScale['2xlarge']};
    }

    :last-of-type {
      padding-bottom: ${theme.modularScale['2xlarge']};
    }
  }
`;

const responsiveCSS = ({ theme, noPadding, isDoubleBanner }) => css`
  margin-left: auto;
  margin-right: auto;
  padding-left: ${noPadding || isDoubleBanner ? 0 : '3rem'};
  padding-right: ${noPadding || isDoubleBanner ? 0 : '3rem'};

  @media screen and (min-width: ${theme.breakpoint.medium}) {
    padding-left: ${noPadding ? 0 : '9.5vw'};
    padding-right: ${noPadding ? 0 : '9.5vw'};
  }
`;

const Page = styled('main', { shouldForwardProp: (prop) => prop !== 'background' })`
  position: relative;
  min-height: 100vh;

  ${({ background, theme }) => !background && css`
    --background-color: ${theme.color.white};
  `}

  ${({ background, theme }) => background === 'default' && css`
    --background-color: ${theme.color.background};
    background-image: url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-bg-right.jpg);
    background-position: top right;
    background-color: ${theme.color.background};
    background-repeat: repeat-y;

    @media screen and (min-width: ${theme.breakpoint.small}) {
      background-image: url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-bg-left.jpg),
                        url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-bg-right.jpg);
      background-position: top left, top right;
      background-color: ${theme.color.background};
      background-repeat: repeat-y;
    }
  `}

  ${({ background, theme }) => background === 'white' && css`
    --background-color: ${theme.color.white};
    background-color: ${theme.color.white};
  `}

  ${({ background, theme }) => background === 'cream' && css`
    --background-color: ${theme.color.background};
    background-color: ${theme.color.background};
  `}

  ${({ background, theme }) => background === 'holiday' && css`
    --background-color: ${theme.color.background};
    background-image: url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-holiday-bg-right.jpg);
    background-position: top right;
    background-color: ${theme.color.background};
    background-repeat: repeat-y;

    @media screen and (min-width: ${theme.breakpoint.small}) {
      background-image: url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-holiday-bg-left.jpg),
                        url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-holiday-bg-right.jpg);
      background-position: top left, top right;
      background-color: ${theme.color.background};
      background-repeat: repeat-y;
    }
  `}

  ${({ background, theme }) => background === 'neon' && css`
    // below is specific to a neon rebels (brand) themed cms page
    // uses the background field set on a CMS page
    --background-color: rgb(255, 255, 0);
    background-color: rgb(255, 255, 0);

    * {
      color: black !important;
    }

    @media screen and (min-width: ${theme.breakpoint.small}) {
      background-color: rgb(255,255,0);
    }
  `}

  ${({ background }) => background === 'halloween' && css`
    // below is specific to a halloween themed cms page
    // uses the background field set on a CMS page
    --background-color: #FFD65C;
    background-color: #FFD65C;
  `}

  ${({ background }) => background === 'opaque' && css`
    --background-color: hsla(120, 100%, 100%, 0.7);
    background-color: hsla(120, 100%, 100%, 0.7);
  `}

  ${({ background }) => background === 'dark-opaque' && css`
    --background-color: hsla(0, 0%, 0%, 0.7);
    background-color: hsla(0, 0%, 0%, 0.7);
  `}

  ${({ background }) => background === 'transparent' && css`
    --background-color: transparent;
    background-color: transparent;
  `}
`;
const FILTERED_CONTENT_EMO_PROPS = new Set(['hasHr', 'isAccordion', 'isBlockQuote', 'isCircleBanner', 'isCMS', 'isDoubleBanner', 'isFullWidthBelowMedium', 'isFullWidthMobileOnly', 'isHeading', 'isNeon', 'isSocialShare', 'isWhite', 'layout', 'noPadding', 'pillarNav', 'pillarPadding']);

const StyledContent = styled('div', {
  shouldForwardProp: (prop) => !FILTERED_CONTENT_EMO_PROPS.has(prop)
})`
  ${responsiveCSS};
  position: relative;
  padding-bottom: ${({ noPadding }) => (noPadding ? 0 : '2rem')};
  padding-top: ${({ noPadding }) => (noPadding ? 0 : '2rem')};

  ${({ isCMS }) => isCMS && cmsCSS};

  ${({ pillarPadding, theme }) => pillarPadding && css`
    // specific for desktop content pillar page views
    @media screen and (min-width: ${theme.breakpoint.large}) {
      padding-left: 16vw;
      padding-right: 16vw;
    }
  `};

  ${({ pillarNav, theme }) => pillarNav && css`
    padding-right: 0;

    @media screen and (min-width: ${theme.breakpoint.large}) {
      padding-right: 0;
    }
  `}

  ${({ isAccordion, theme }) => isAccordion && css`
    & ~ & {
      padding-top: 0;

      dt {
        border-top: none;
      }

      dd {
        border-bottom: 1px solid ${theme.color.brand};
      }
    }

    div:not(&) + & dt {
      border-top: 1px solid ${theme.color.brand};
    }

    :not(:last-of-type) {
      padding-bottom: 0;
    }
  `};

  ${({ theme, noPadding }) => css`

    @media screen and (min-width: ${theme.breakpoint.medium}) {
      padding-bottom: ${noPadding ? 0 : theme.modularScale.xlarge};
      padding-top: ${noPadding ? 0 : theme.modularScale.xlarge};
    }
  `}

  ${({ isWhite, theme }) => isWhite && css`
    background: ${theme.color.white};
  `}

  ${({ isCircleBanner, theme, noPadding }) => isCircleBanner && css`
    @media screen and (min-width: ${theme.breakpoint.medium}) {
      width: 33.333%;
      margin: auto;
      padding: ${noPadding ? 0 : '3rem 4.5vw'};
      display: inline-block;
    }
  `}

  ${({ isHeading }) => isHeading && css`
    h1 {
      text-align: left;
    }

    hr {
      background: ${({ theme }) => theme.color.brand};
    }
  `}

  ${({ isSocialShare }) => isSocialShare && css`
    padding-top: 0 !important;
  `}

  ${({ isFullWidthBelowMedium, theme }) => isFullWidthBelowMedium && css`
    padding: 0;

    @media screen and (min-width: ${theme.breakpoint.medium}) {
      padding: ${theme.modularScale['2xlarge']} 6.5vw 0;
    }
  `}

  ${({ isFullWidthMobileOnly }) => isFullWidthMobileOnly && css`
    padding-left: 0;
    padding-right: 0;
  `}

  ${({ hasHr, theme }) => hasHr && css`
    padding-bottom: 0;

    @media screen and (min-width: ${theme.breakpoint.medium}) {
      padding-bottom: 0;
    }
`}

  ${({ layout }) => layout === 'small' && css`
    && { max-width: 50rem }
  `}

  ${({ layout }) => layout === 'medium' && css`
    && { max-width: 80rem }
  `}

  ${({ layout }) => layout === 'large' && css`
    && { max-width: 120rem }
  `}
`;

const PageWithNav = styled(Page)`
  display: grid;
  grid-template-columns: minmax(28%, 1fr) minmax(72%, 3fr);

  > ${StyledContent} {
    grid-column: 1 / span 2;
    width: 100%;
    padding-left: 3rem;

    h1 {
      padding-top: 1rem;
      text-align: center;
    }
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    > nav {
      padding-top: 3rem;
      padding-right: 3rem;
      padding-left: 9.5vw;
    }

    > ${StyledContent} {
      grid-column: 2 / span 1;
      padding-left: 0;

      h1 {
        padding-top: 5rem;
        padding-bottom: 2rem;
        text-align: left;
      }
    }
  }

  ${StyledContent}:last-of-type {
    margin-bottom: 5rem;
  }
`;

Page.whyDidYouRender = true;
PageWithNav.whyDidYouRender = true;

const handleOnClick = (e, template, position, noEvents) => {
  // do not fire if there is no template, or noEvents boolean passed in
  if (!template || noEvents) return;

  const { currentTarget, target } = e;

  let text = null;
  let link = null;
  let img = null;

  const getLink = () => {
    const temp = target?.closest('a');
    return temp && currentTarget?.contains(temp)
      ? temp?.getAttribute('href')
      : null;
  };

  const getText = () => {
    text = (target?.textContent || target?.innerText)?.trim();
    if (text) return text;

    // check if has aria-label or title
    if (target?.nodeName?.toLowerCase() === 'svg') {
      // wrapped by some element
      const parent = target?.parentElement;
      return (parent?.getAttribute('title') || parent?.getAttribute('aria-label')) ?? null;
    }

    return (target?.getAttribute('title') || target?.getAttribute('aria-label')) ?? null;
  };

  if (target?.nodeName?.toLowerCase() === 'a') {
    link = target.getAttribute('href');
    text = getText();
  } else if (target?.nodeName?.toLowerCase() === 'img') {
    img = target?.getAttribute('src');
    link = getLink();
  } else {
    text = getText();
    link = getLink();
  }

  logAmplitude('Clicked Content Module', {
    img,
    link,
    text,
    position: position + 1,
    title: template.title
  });
};

const Content = ({
  template, position, noEvents, ...rest
}) =>
  <StyledContent onClick={(e) => handleOnClick(e, template, position, noEvents)} {...rest} />;

Content.whyDidYouRender = true;

Content.defaultProps = {
  template: null,
  position: null,
  noEvents: false
};

Content.propTypes = {
  template: PropTypes.object,
  position: PropTypes.number,
  noEvents: PropTypes.bool
};

export {
  Content,
  StyledContent,
  Page,
  PageWithNav,
  navigationCSS,
  responsiveCSS,
  handleOnClick as trackModuleClick
};
