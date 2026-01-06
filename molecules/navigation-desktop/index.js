import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useHoverIntent } from 'react-use-hoverintent';
import { logAmplitude } from '../../utils/amplitude';

const Arrow = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="11" height="11" viewBox="0 0 11 11" fill="none" {...props}>
    <path d="M5.9191 0.379761L5.13337 1.11313L8.95719 4.98931H0V6.03695H8.95719L5.10719 9.91313L5.78809 10.6203L11 5.53931L5.9191 0.379761Z" fill="#2B4798" />
  </svg>
);

const ListItem = styled.li(({
  isHovering,
  isFirst,
  navActive,
  defaultActive
}) => ({
  cursor: 'pointer',
  ':first-of-type': { paddingLeft: 0 },
  ':last-of-type': { paddingRight: 0 },
  '> ul': {
    background: 'white',
    display: 'none',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0
  },
  '> div': {
    background: 'white',
    display: 'none',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0
  },
  // isHovering, it should show
  // isFirst and not hovering, should show?
  // isHovering, and is not First, should show
  ...(
    ((isHovering && defaultActive) || (isFirst && navActive)) && {
      '> ul, > div': {
        display: 'flex',
        background: 'white',
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0
      },
      '> div': {
        display: 'flex',
        background: 'white',
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0
      }
    }
  )
}));

const Navigation = styled.nav(({ theme }) => ({
  background: theme.color.white,
  borderTop: '1px solid #E4DCBC',
  borderBottom: '1px solid #EEF0F7',
  display: 'flex',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  position: 'sticky',
  top: 103,
  zIndex: `${theme.layers.downstage - 1}`,
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    paddingLeft: '6.5vw',
    paddingRight: '6.5vw'
  }
}));

const Level1Anchor = styled.a(({
  theme, hasEmphasis, isFirst, navActive, asSpan
}) => ({
  alignItems: 'center',
  color: theme.color[hasEmphasis ? 'brandA11yRed' : 'brand'],
  display: 'flex',
  height: '100%',
  textDecoration: 'none',
  fontFamily: 'GT Walsheim Web',
  ...(
    asSpan && {
      alignItems: 'center',
      display: 'flex',
      height: '100%',
      borderBottom: '3px solid transparent'
    }
  ),
  '> span': {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    borderBottom: '3px solid transparent'
  },
  ':hover': {
    color: theme.color[hasEmphasis ? 'brandA11yRed' : 'brand'],
    'svg path': {
      fill: theme.color.brandLight
    }
  },
  ...(
    (isFirst && navActive) && {
      color: theme.color[hasEmphasis ? 'brandA11yRed' : 'brand'],
      'svg path': {
        fill: theme.color.brandLight
      },
      '> span': {
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        borderBottom: `3px solid ${theme.color.brand}`
      },
      ...(
        asSpan && {
          alignItems: 'center',
          display: 'flex',
          height: '100%',
          borderBottom: `3px solid ${theme.color.brand}`
        }
      )
    }
  )
}));

const ShopAll = styled(Level1Anchor)(() => ({
  border: '0 !important',
  fontSize: 12,
  svg: {
    marginLeft: '1rem'
  }
}));

const Level1 = styled.ul(({
  theme,
  isFirst,
  navActive
}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  zIndex: 1,
  '> li': {
    height: '6rem',
    ':hover': {
      '> a > span': {
        borderBottom: `3px solid ${theme.color.brand}`
      },
      '> span': {
        borderBottom: `3px solid ${theme.color.brand}`
      }
    },
    ...(
      (isFirst && navActive) && {
        '> a > span': {
          borderBottom: `3px solid ${theme.color.brand}`
        },
        '> span': {
          borderBottom: `3px solid ${theme.color.brand}`
        }
      }
    ),
    '> a': {
      padding: '0 2rem'
    },
    ':first-of-type': {
      '> a': { paddingLeft: 0 }
    },
    ':last-of-type': {
      '> a': { paddingRight: 0 }
    }
  }
}));

const Level2 = styled(Level1)(({ theme, defaultActive }) => ({
  paddingLeft: '1rem',
  paddingRight: '1rem',
  borderBottom: '1px solid #EEF0F7',
  borderTop: '1px solid #EEF0F7',
  justifyContent: 'flex-start',
  '> li': {
    paddingRight: '2rem',
    ':last-child': {
      paddingRight: 0
    }
  },
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    paddingLeft: '6.5vw',
    paddingRight: '6.5vw'
  },
  ...(!defaultActive && {
    display: 'none !important'
  })
}));

const Level2Anchor = styled(Level1Anchor)(() => ({}));

const Level3Anchor = styled(Level1Anchor)(() => ({
  border: '0 !important',
  lineHeight: 1.5,
  ':hover': {
    textDecoration: 'underline !important'
  }
}));

const Level3NoChildren = styled(Level1)(({ theme }) => ({
  borderTop: '1px solid #EEF0F7',
  flexDirection: 'column',
  padding: '2rem 1rem',
  '> li': {
    height: 'unset',
    border: 0,
    paddingBottom: '1rem',
    '> a': {
      paddingLeft: 0,
      ':hover': {
        textDecoration: 'underline'
      }
    }
  },
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    paddingLeft: '6.5vw',
    paddingRight: '6.5vw'
  }
}));

const Level3 = styled(Level1)(({ theme }) => ({
  padding: '2rem',
  borderTop: '1px solid #EEF0F7',
  justifyContent: 'flex-start',
  boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
  '> ul': {
    maxWidth: '20%',
    width: '100%',
    'li:first-of-type': {
      fontSize: 12,
      fontFamily: theme.font.caption,
      textTransform: 'uppercase',
      letterSpacing: 2,
      color: '#5368A7',
      marginBottom: '1.5rem'
    },
    li: {
      paddingBottom: '1rem'
    }
  },
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    paddingLeft: '6.5vw',
    paddingRight: '6.5vw'
  }
}));

const ListItemHI = (props) => {
  const { isFirst, ...restProps } = props;

  const [isHovering, ref] = useHoverIntent({
    timeout: 300,
    sensitivity: 6,
    interval: 100
  });

  // need to have a default "navActive" prop to pass in so that we can break the logic of isHovering
  return (
    <ListItem
      ref={ref}
      isHovering={isHovering || props.depth === 2}
      isFirst={isFirst}
      navActive={props?.navActive ?? true}
      defaultActive={props.defaultActive ?? true}
      {...restProps}
    >
      { props.children }
    </ListItem>
  );
};

ListItemHI.defaultProps = {
  isFirst: false,
  defaultActive: true
};

ListItemHI.propTypes = {
  children: PropTypes.node.isRequired,
  depth: PropTypes.oneOf([1, 2, 3, 4]).isRequired,
  isFirst: PropTypes.bool,
  defaultActive: PropTypes.bool
};

const Desktop = ({ navigation, ...props }) => {
  const [navActive, isNavActive] = useState(false);
  const [defaultActive, setDefaultActive] = useState(true);
  // Commented out until we need some clearTimeout
  // const [delayMouseEnter, setDelayMouseEnter] = useState(null);
  const {
    navigation1, navigation2, navigation3, navigation4
  } = navigation;

  const getNavigationItems = (nav, id) => nav.filter((x) => x.parent_id === id);
  const hasNoChildren = (nav, id) => {
    const items = getNavigationItems(nav, id);
    return items.filter((x) => !x.has_children).length === items.length;
  };

  const trackNavClick = (item, parents) => {
    logAmplitude('Navigated Site', {
      navigationTerm: item.name.toLowerCase(),
      path: item.navigation_url,
      navigationType: 'test desktop top nav',
      navBreadcrumb: parents
    });
  };

  return (
    <Navigation onMouseLeave={() => isNavActive(false)} {...props}>
      <Level1>
        {
          navigation1.map((navigation1_item) => (
            <ListItemHI
              onMouseEnter={() => {
                isNavActive(true);
                setDefaultActive(true);
              }}
              key={navigation1_item.id}
            >
              {
                navigation1_item.navigation_url && navigation1_item.navigation_url !== '/donotlink'
                  ? (
                    <Link href={navigation1_item.navigation_url} passHref>
                      <Level1Anchor
                        hasEmphasis={navigation1_item.highlight}
                        onClick={() => {
                          trackNavClick(navigation1_item, navigation1_item.name);
                          setDefaultActive(false);
                        }}
                      >
                        <span>
                          {navigation1_item.name}
                        </span>
                      </Level1Anchor>
                    </Link>
                  )
                  : <Level1Anchor as="span" hasEmphasis={navigation1_item.highlight}>{navigation1_item.name}</Level1Anchor>
              }

              {
                navigation1_item.has_children ? (
                  <Level2
                    onMouseEnter={() => {
                      setTimeout(() => {
                        isNavActive(false);
                      }, 1000);
                    }}
                    defaultActive={defaultActive}
                  >
                    {
                      navigation2
                        .filter((x) => x.parent_id === navigation1_item.id)
                        .map((navigation2_item, index) => (
                          <ListItemHI
                            key={navigation2_item.id}
                            isFirst={index === 0}
                            navActive={navActive}
                            defaultActive={defaultActive}
                          >
                            {
                              navigation2_item.navigation_url && navigation2_item.navigation_url !== '/donotlink'
                                ? (
                                  <Link href={navigation2_item.navigation_url} passHref>
                                    <Level2Anchor
                                      hasEmphasis={navigation2_item.highlight}
                                      isFirst={index === 0}
                                      navActive={navActive}
                                      defaultActive={defaultActive}
                                      onClick={() => {
                                        trackNavClick(navigation2_item, `${navigation1_item.name} > ${navigation2_item.name}`);
                                        setDefaultActive(false);
                                      }}
                                    >
                                      <span>
                                        {navigation2_item.name}
                                      </span>
                                    </Level2Anchor>
                                  </Link>
                                )
                                : (
                                  <Level2Anchor
                                    as="span"
                                    hasEmphasis={navigation2_item.highlight}
                                    isFirst={index === 0}
                                    navActive={navActive}
                                    defaultActive={defaultActive}
                                    asSpan
                                    onClick={() => {
                                      trackNavClick(navigation2_item, `${navigation1_item.name} > ${navigation2_item.name}`);
                                      setDefaultActive(false);
                                    }}
                                  >
                                    {navigation2_item.name}
                                  </Level2Anchor>
                                )
                            }

                            {
                              navigation2_item.has_children ? (
                                <>
                                  {
                                    hasNoChildren(navigation3, navigation2_item.id) ? (
                                      <Level3NoChildren>
                                        {
                                          getNavigationItems(navigation3, navigation2_item.id)
                                            .map((navigation3_item) =>

                                              (navigation3_item.name.toLowerCase().trim() === 'shop all'
                                                ? (
                                                  <ListItem css={{ padding: 0 }}>
                                                    <Link
                                                      href={navigation3_item.navigation_url}
                                                      passHref
                                                    >
                                                      <ShopAll
                                                        onClick={() => {
                                                          trackNavClick('Shop All', `${navigation1_item.name} > ${navigation2_item.name} > ${navigation3_item.name}`);
                                                          setDefaultActive(false);
                                                        }}
                                                      >
                                                        Shop All
                                                        <Arrow />
                                                      </ShopAll>
                                                    </Link>
                                                  </ListItem>
                                                )
                                                : (
                                                  <ListItem
                                                    key={navigation3_item.id}
                                                    css={{ padding: 0 }}
                                                  >
                                                    {
                                                  navigation3_item.navigation_url
                                                    ? (
                                                      <Link
                                                        href={navigation3_item.navigation_url}
                                                        passHref
                                                      >
                                                        <Level3Anchor
                                                          hasEmphasis={navigation3_item.highlight}
                                                          onClick={() => {
                                                            trackNavClick(navigation3_item, `${navigation1_item.name} > ${navigation2_item.name} > ${navigation3_item.name}`);
                                                            setDefaultActive(false);
                                                          }}
                                                        >
                                                          {navigation3_item.name}
                                                        </Level3Anchor>
                                                      </Link>
                                                    )
                                                    : <Level3Anchor as="span" hasEmphasis={navigation3_item.highlight}>{navigation3_item.name}</Level3Anchor>
                                                }
                                                  </ListItem>
                                                )))
                                        }
                                      </Level3NoChildren>
                                    ) : (
                                      <Level3 as="div">
                                        {
                                          getNavigationItems(navigation3, navigation2_item.id)
                                            .map((navigation3_item) => (
                                              <ul key={navigation3_item.id}>
                                                <ListItem>{navigation3_item.name}</ListItem>
                                                {
                                                  getNavigationItems(
                                                    navigation4,
                                                    navigation3_item.id
                                                  )
                                                    .filter((x) => x.name.toLowerCase().trim() !== 'shop all')
                                                    .map((navigation4_item) => (
                                                      <ListItem
                                                        key={navigation4_item.id}
                                                        css={{ padding: 0 }}
                                                      >
                                                        <Link
                                                          href={navigation4_item.navigation_url}
                                                          passHref
                                                        >
                                                          <Level3Anchor
                                                            hasEmphasis={navigation4_item.highlight}
                                                            onClick={() => {
                                                              trackNavClick(navigation4_item, `${navigation1_item.name} > ${navigation2_item.name} > ${navigation3_item.name} > ${navigation4_item.name}`);
                                                              setDefaultActive(false);
                                                            }}
                                                          >
                                                            {navigation4_item.name}
                                                          </Level3Anchor>
                                                        </Link>
                                                      </ListItem>
                                                    ))
                                                }

                                                {
                                                  // eslint-disable-next-line max-len
                                                  getNavigationItems(navigation4, navigation3_item.id)
                                                    .filter((x) => x.name.toLowerCase().trim() === 'shop all')
                                                    .map((navigation4_item) => (
                                                      <ListItem
                                                        key={navigation4_item.id}
                                                        css={{ padding: 0 }}
                                                      >
                                                        <Link
                                                          href={navigation4_item.navigation_url}
                                                          passHref
                                                        >
                                                          <ShopAll
                                                            onClick={() => {
                                                              trackNavClick('Shop All', `${navigation1_item.name} > ${navigation2_item.name} > ${navigation3_item.name} > ${navigation4_item.name}`);
                                                              setDefaultActive(false);
                                                            }}
                                                          >
                                                              Shop All
                                                            <Arrow />
                                                          </ShopAll>
                                                        </Link>
                                                      </ListItem>
                                                    ))
                                                }
                                              </ul>
                                            ))
                                        }
                                      </Level3>
                                    )
                                  }
                                </>
                              ) : null
                            }
                          </ListItemHI>
                        ))
                    }
                  </Level2>
                ) : null
              }
            </ListItemHI>
          ))
        }
      </Level1>
    </Navigation>
  );
};

Desktop.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default Desktop;
