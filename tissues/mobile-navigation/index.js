import React, {
  memo, useRef, useCallback
} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Link from '../../utils/link';

import Typography from '../../atoms/typography';
import { logAmplitude } from '../../utils/amplitude';
import { useEventListener } from '../../utils/hooks';

function getNavigationImage({ image }) {
  if (!image || Object.keys(image).length <= 0) return null;

  let imageURL = null;

  try {
    const { uri, imageName } = image;
    const imageHost = uri ? process.env.NEXT_PUBLIC_ASSET_HOST : '';
    const [name, type] = imageName.split('.');
    imageURL = `${imageHost}/${uri}${name}-small.${type}`;
  } catch (error) { /* bad image response */ }

  return css`
    align-items: center;
    display: flex;
    position: relative;

    ::before {
      background-image: url(${imageURL});
      background-position: 0, 100%;
      background-repeat: no-repeat;
      background-size: 2.4rem;
      content: '';
      display: inline-block;
      height: 2.4rem;
      margin-right: 0.5rem;
      width: 2.4rem;
    }
  `;
}

const FILTERED_NAVLINK_EMO_PROPS = new Set(['flair', 'highlighted']);

const NavLink = styled(Typography, {
  shouldForwardProp: (prop) => !FILTERED_NAVLINK_EMO_PROPS.has(prop)
})`
  align-items: center;
  border-radius: 0;
  color: ${({ highlighted, theme }) => (highlighted ? theme.color.brandA11yRed : theme.color.brand)};
  cursor: pointer;
  display: inline-flex;
  font-size: 11px;
  height: 50px;
  letter-spacing: 0.2em;
  outline: 0;
  outline: none;
  padding: 0 24px;
  position: relative;
  text-decoration: none;
  text-transform: uppercase;

  :first-of-type {
    justify-content: flex-start;
  }

  :last-of-type {
    justify-content: flex-end;
  }

  span {
    height: 100%;
    display: flex;
    align-items: center;
  }


  ${({ flair, highlighted }) => flair && css`
    span {
      background-image: url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/wings-left${!highlighted && '-blue'}.svg), url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/wings-right${!highlighted && '-blue'}.svg);
      background-position: 0, 100%;
      background-repeat: no-repeat;
      background-size: 12px;
      padding: 0 15px;
      position: relative;
    }
  `}

  ${getNavigationImage}
`;

const Navigation = styled.span`
  -ms-overflow-style: none;
  background-color: ${({ theme }) => theme.color.white};
  display: flex;
  justify-content: center;
  overflow: hidden;
  height: 50px;
  position: sticky;
  scrollbar-width: none;
  top: ${(props) => props.setTopValue()};
  transition: transform ${(props) => props.theme.animation.slow} ease;
  z-index: ${(props) => props.theme.layers.upstage - 1};

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: none;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  > nav {
    -ms-overflow-style: none;
    display: flex;
    overflow-x: scroll;
    padding: 0 10px;
    position: relative;
    scrollbar-width: none;
    white-space: nowrap;

    &::-webkit-scrollbar {
      display: none;
    }
  }
  ::after {
      background: -webkit-gradient(linear, left top, right top, color-stop(0, hsla(0,0%,100%,0)), color-stop(100%, #fff));
      content: '';
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      width: 25px;
  }
`;

const MobileNavigation = (props) => {
  const isLoggedIn = useCallback(
    () => Object.prototype.hasOwnProperty.call(props.profile, 'email'),
    [props.profile]
  );

  const setTopValue = () => {
    if (props.isCheckout) {
      return '80px';
    } if (isLoggedIn()) {
      return '184px';
    }
    return '156px';
  };

  const navigationRef = useRef();
  let ticking = false;
  let previousY = 0;

  const requestTick = () => {
    const { window } = global;
    const { current } = navigationRef;

    if (current && !ticking) {
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const isScrollingDown = currentY > previousY;

        if (current.style && currentY !== previousY) {
          if (isScrollingDown && currentY > 100) {
            current.style.transform = 'translate3d(0, -97px, 0)';
          } else {
            current.style.transform = 'translate3d(0, 0, 0)';
          }
        }

        previousY = currentY;
        ticking = false;
      });
    }

    ticking = true;
  };

  useEventListener('scroll', requestTick);

  const trackNavClick = (item) => {
    logAmplitude('Navigated Site', {
      navigationTerm: item.name.toLowerCase(),
      path: item.url,
      navigationType: 'mobile top nav'
    });
  };

  return (
    <Navigation ref={navigationRef} isLoggedIn={isLoggedIn()} setTopValue={setTopValue}>
      {
        props.navigation && (
          <nav>
            {
              props.navigation.map((item, index) => (
                <Link href={`/${item.url}`} key={`${item.name}-${item.url}`} passHref>
                  <NavLink
                    element="a"
                    like="label-1"
                    flair={item.flair}
                    highlighted={item.highlighted}
                    image={item.image}
                    onClick={() => trackNavClick(item, index)}
                  >
                    <span>
                      {item.name}
                    </span>
                  </NavLink>
                </Link>
              ))
            }
          </nav>
        )
      }
    </Navigation>
  );
};

MobileNavigation.defaultProps = {
  profile: {},
  isCheckout: false
};

MobileNavigation.propTypes = {
  navigation: PropTypes.array.isRequired,
  profile: PropTypes.object,
  isCheckout: PropTypes.bool
};

MobileNavigation.whyDidYouRender = true;

export default memo(MobileNavigation);
