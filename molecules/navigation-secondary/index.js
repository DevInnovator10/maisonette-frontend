import React, { useRef, useState, memo } from 'react';
import PropTypes from 'prop-types';
import Link from '../../utils/link';

import {
  NavLabel,
  NavLink,
  NavNoLink,
  SecondaryItem,
  SecondaryList,
  SecondaryTrigger
} from './styles';

import { getNavigationProps, getNavigation } from '../../utils/navigation';
import { logAmplitude } from '../../utils/amplitude';

const NavigationSecondary = (props) => {
  const nav2 = getNavigation(props.navigation, 2);
  const [parent] = useState(props.parent);
  const containerRef = useRef(null);

  const removePointerEvents = () => {
    if (!props.isMobile) containerRef.current.style.pointerEvents = 'none';
  };

  const resetPointerEvents = () => {
    if (!props.isMobile) containerRef.current.style.pointerEvents = 'auto';
  };

  const trackNavClick = (item, isParent = false) => {
    const navigationTerm = !isParent
      ? `${props.navigation['1']?.find((x) => x.id === item.parent_id)?.name.toLowerCase()}.${item.name.toLowerCase()}`
      : item.name.toLowerCase();
    logAmplitude('Navigated Site', {
      navigationTerm,
      path: item.navigation_url,
      navigationType: props.isMobile ? 'mobile burger menu' : 'desktop top nav'
    });
  };

  return (
    nav2 && parent
      ? (
        <SecondaryList role="menu" ref={containerRef} onTransitionEnd={() => resetPointerEvents()}>
          <SecondaryItem role="menuitem" viewAll onClick={() => removePointerEvents()}>
            <Link
              {...getNavigationProps({ item: parent, viewAll: true })}
              passHref
            >
              <NavLink onClick={() => trackNavClick(parent, true)}>
                View All
              </NavLink>
            </Link>
          </SecondaryItem>

          {
              nav2
                .filter((x) => x.parent_id === parent.id)
                .map((item) => (
                  item.has_children
                    ? (
                      <SecondaryItem role="menuitem" key={item.id} onClick={() => removePointerEvents()} aria-haspopup>
                        <SecondaryTrigger
                          role="menuitemcheckbox"
                          onChange={(e) => props.handleChange(e, item)}
                          type="checkbox"
                          id={item.id}
                          name="secondary"
                        />
                        <NavLabel htmlFor={item.id}>{item.name}</NavLabel>

                        {
                          item.header_link
                            ? (
                              <Link
                                {...getNavigationProps({ item })}
                                passHref
                              >
                                <NavLink onClick={() => trackNavClick(item)}>
                                  {item.name}
                                </NavLink>
                              </Link>
                            ) : (
                              <NavNoLink onClick={() => trackNavClick(item)}>
                                {item.name}
                              </NavNoLink>
                            )
                        }

                        { props.renderTertiary(item, removePointerEvents) }
                      </SecondaryItem>
                    )
                    : (
                      <SecondaryItem role="menuitem" key={item.id} onClick={() => removePointerEvents()}>
                        <Link
                          {...getNavigationProps({ item })}
                          passHref
                        >
                          <NavLink onClick={() => trackNavClick(item)}>
                            {item.name}
                          </NavLink>
                        </Link>
                      </SecondaryItem>
                    )
                ))
            }
        </SecondaryList>
      ) : null
  );
};

NavigationSecondary.defaultProps = {
  parent: null
};

NavigationSecondary.propTypes = {
  handleChange: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  parent: PropTypes.object,
  renderTertiary: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired
};

export default memo(NavigationSecondary);
