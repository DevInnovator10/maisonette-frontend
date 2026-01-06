import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Link from '../../utils/link';

import { getNavigationProps, getNavigation } from '../../utils/navigation';
import { logAmplitude } from '../../utils/amplitude';

const navAnchorStyles = (props) => css`
  color: ${props.theme.color.white};
  display: block;
  font-size: 1.2rem;
  text-decoration: none;
  cursor: pointer;

  @media (min-width: ${props.theme.breakpoint.medium}) {
    font-size: 1.3rem;
  }
`;

const NavLink = styled.a`
  ${navAnchorStyles};
  letter-spacing: 0;
`;

const NavLabel = styled.label`
  ${navAnchorStyles}
  transition: background-image ${(props) => props.theme.animation.fast} ${(props) => props.theme.animation.easeInQuad};
`;

const TertiaryItem = styled.li`
  font-family: ${(props) => props.theme.font.sans};

  > ${NavLink}, > ${NavLabel} {
    line-height: 3;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    color: red;
    ${(props) => (props.viewAll ? css`display: ${props.headerLink ? 'block' : 'none'};` : '')}

    > ${NavLink} {
      color: ${(props) => props.theme.color.brand};
      line-height: 2.5rem;
      text-align: left;
      transition: color ${(props) => props.theme.animation.default};

      &:hover {
        color: ${(props) => props.theme.color.brandLight};
      }
    }
  }
`;

const TertiaryList = styled.ul`
  background-color: ${(props) => props.theme.color.brand};
  height: 100vh;
  overflow: hidden;
  left: 0;
  padding: 5rem 3rem 10rem 3rem;
  position: absolute;
  top: 0;
  width: 28rem;
  z-index: ${(props) => props.theme.layers.downstage};
  transition: transform ${(props) => props.theme.animation.fast} ${(props) => props.theme.animation.easeInQuad},
  visibility ${(props) => props.theme.animation.default};

  > li > ${NavLabel} {
    ${(props) => props.theme.arrow('left', props.theme.color.white, 'left center', 5)}
    border-bottom: 1px solid ${(props) => props.theme.color.white};
    border-top: 1px solid ${(props) => props.theme.color.brand};
    font-family: ${(props) => props.theme.font.caption};
    letter-spacing: 0.24em;
    line-height: 4.4rem;
    padding-left: 1.5rem;
    position: relative;
    text-transform: uppercase;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    width: 38rem;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    background: none;
    display: flex;
    flex-direction: column;
    height: auto;
    padding: 0;
    position: initial;
    width: 100%;

    li[data-attribute="view-all"] {
      border-top: 1px solid ${(props) => props.theme.color.brand};
      margin-top: 1rem;
      order: 999;

      ${NavLink} {
        line-height: 4rem;
      }
    }

    > li > ${NavLabel} {
      display: none;
    }
  }
`;

const NavList = (props) => {
  const nav3 = getNavigation(props.navigation, 3);
  const [parent] = useState(props.parent);

  const trackNavClick = (item, isParent = false) => {
    const parentItem = props.navigation[isParent ? '1' : '2']?.find((x) => x.id === item.parent_id);
    const rootName = !isParent && props.navigation['1']?.find((x) => x.id === parent.parent_id)?.name.toLowerCase();
    const navigationTerm = rootName
      ? `${rootName}.${parentItem?.name.toLowerCase()}.${item.name.toLowerCase()}`
      : `${parentItem?.name.toLowerCase()}.${item.name.toLowerCase()}`;
    logAmplitude('Navigated Site', {
      navigationTerm,
      path: item.navigation_url,
      navigationType: props.isMobile ? 'mobile burger menu' : 'desktop top nav'
    });
  };

  return (
    nav3 && parent
      ? (
        <TertiaryList role="menu">
          <li>
            <NavLabel htmlFor={parent.id}>{parent.name}</NavLabel>
          </li>

          {
            parent.header_link && (
              <TertiaryItem
                role="menuitem"
                data-attribute="view-all"
                viewAll
                headerLink={parent.header_link}
                onClick={props.removePointerEvents}
              >
                <Link {...getNavigationProps({ item: parent, viewAll: true })} passHref>
                  <NavLink onClick={() => trackNavClick(parent, true)}>
                    View All
                  </NavLink>
                </Link>
              </TertiaryItem>
            )
          }

          {
            nav3
              .filter((x) => x.parent_id === parent.id)
              .map((item) => (
                <TertiaryItem role="menuitem" key={item.id} onClick={props.removePointerEvents}>
                  <Link
                    {...getNavigationProps({ item })}
                    passHref
                  >
                    <NavLink onClick={() => trackNavClick(item)}>
                      {item.name}
                    </NavLink>
                  </Link>
                </TertiaryItem>
              ))
          }
        </TertiaryList>
      ) : null
  );
};

NavList.defaultProps = {
  parent: PropTypes.object
};

NavList.propTypes = {
  navigation: PropTypes.object.isRequired,
  parent: PropTypes.object,
  removePointerEvents: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired
};

export default memo(NavList);
