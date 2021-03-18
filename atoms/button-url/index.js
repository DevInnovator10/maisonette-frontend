import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Link from 'next/link';

const buttonColors = (props) => {
  let colors = {};

  if (!props.outline) {
    if (!props.inverted) {
      colors = {
        background: props.theme.color.brand,
        border: props.theme.color.brand,
        color: props.theme.color.white
      };
    } else {
      colors = {
        background: props.theme.color.brandNeutral,
        border: props.theme.color.brandNeutral,
        color: props.theme.color.brand
      };
    }
  } else if (props.outline) {
    if (props.inverted) {
      colors = {
        background: 'transparent',
        border: props.theme.color.white,
        color: props.theme.color.white
      };
    } else {
      colors = {
        background: 'transparent',
        border: props.theme.color.brand,
        color: props.theme.color.brand
      };
    }
  }

  return colors;
};

const ButtonReset = (props) => css`
  appearance: none;
  background: transparent;
  border: none;
  box-sizing: border-box;
  color: inherit;
  cursor: pointer;
  ${props.isIcon ? 'display: flex;' : ''}
  font: inherit;
  letter-spacing: .24em;
  line-height: 4rem;
  margin: 0;
  max-height: 4.4rem;
  opacity: 1;
  overflow: hidden;
  ${props.isIcon ? 'padding: 0;' : 'padding: 0 3.5rem;'};
  text-transform: uppercase;
  transition-property: opacity;
  width: auto;
  -moz-osx-font-smoothing: inherit;
  appearance: none;
  -webkit-font-smoothing: inherit;
  -webkit-backface-visibility: hidden;

  :active {
      outline: 0;
  }

  :hover {
    opacity: 0.75;
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: .5;
  }
  ${props.isIcon ? `
    svg {
      width: 4rem;
      height: 4rem;
    }
  ` : ''}
`;

const styledLikeText = (props) => css`
  background: transparent;
  border: 0.2rem solid ${props.theme.color.white};
  color: ${props.theme.color.brand};
  letter-spacing: .2em;
  padding: 0;
`;

const StyledLink = styled.a`
  ${ButtonReset}
  text-decoration: none;
  background-color: ${(props) => buttonColors(props).background};
  border: 0.2rem solid ${(props) => buttonColors(props).border};
  color: ${(props) => buttonColors(props).color};
  font-family: ${(props) => props.theme.font.caption};
  font-size: ${(props) => props.theme.modularScale.small};
  transition-duration: ${(props) => props.theme.animation.default};
  transition-timing-function: ${(props) => props.theme.animation.easeOutQuad};

  ${(props) => (props.isText ? styledLikeText : '')}

  span {
    line-height: 2rem;
  }
`;

const ButtonUrl = ({
  passHref,
  href,
  children,
  ...other
}) => (
  <Link passHref={passHref} href={href}>
    <StyledLink {...other}>
      {children}
    </StyledLink>
  </Link>
);

ButtonUrl.defaultProps = {
  children: '',
  disabled: false,
  inverted: false,
  passHref: false,
  isIcon: false,
  isText: false,
  styledLikeLink: false,
  outline: false
};

ButtonUrl.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.any
  ]),
  disabled: PropTypes.bool,
  inverted: PropTypes.bool,
  passHref: PropTypes.bool,
  isIcon: PropTypes.bool,
  isText: PropTypes.bool,
  styledLikeLink: PropTypes.bool,
  outline: PropTypes.bool,
  href: PropTypes.string.isRequired
};

ButtonUrl.whyDidYouRender = true;

export default ButtonUrl;
