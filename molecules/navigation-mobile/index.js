import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { logAmplitude } from '../../utils/amplitude';

import { toggleNavigationVisibility } from '../../store/modules/interfaces/actions';

const Caret = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="9" height="13" viewBox="0 0 9 13" fill="none" {...props}>
    <path d="M7.5 1.5L2 6.5L7.5 11.5" stroke="white" strokeWidth="2" />
  </svg>
);

const Close = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="17" height="17" viewBox="0 0 17 17" fill="none" {...props}>
    <path d="M1 1L8.5 8.5M16 16L8.5 8.5M16 1L8.5 8.5M8.5 8.5L1 16" stroke="white" strokeWidth="2" />
  </svg>
);

const Navigation = styled.nav(({ theme, isActive }) => ({
  background: theme.color.brand,
  overflow: 'auto',
  bottom: 0,
  color: theme.color.white,
  left: 0,
  position: 'fixed',
  right: 50,
  top: 0,
  transform: isActive ? 'translateX(0)' : 'translateX(-100%)',
  maxWidth: '38rem',
  transition: 'transform 300ms cubic-bezier(0.165,0.840,0.440,1)',
  zIndex: theme.layers.balcony
}));

const List = styled.ul(({ theme }) => ({
  background: theme.color.brand,
  height: '100%',
  padding: `${theme.modularScale.small} ${theme.modularScale.xlarge}`,
  position: 'relative',
  overflow: 'hidden'
}));

const ListItem = styled.li(({ theme, depth }) => ({
  alignItems: 'center',
  background: theme.color.brand,
  borderBottom: '1px solid #4C67AE',
  display: 'flex',
  fontSize: 14,
  height: '5.8rem',
  textTransform: 'uppercase',
  ':last-child': {
    borderBottom: 0
  },
  'a, span': {
    alignItems: 'center',
    color: theme.color.white,
    display: 'flex',
    fontFamily: theme.font.caption,
    height: '100%',
    letterSpacing: 2.8,
    paddingRight: '2rem',
    position: 'relative',
    textDecoration: 'none',
    width: '100%',
    '::after': {
      display: depth === 4 && 'none',
      borderColor: 'transparent transparent transparent #ffffff',
      borderStyle: 'solid',
      borderWidth: '5px 0 5px 5px',
      content: '" "',
      height: 0,
      marginLeft: 'auto',
      pointerEvents: 'none',
      position: 'absolute',
      right: 0,
      width: 0
    }
  }
}));

const InnerList = styled(List)(({ isActive }) => ({
  bottom: 0,
  left: isActive ? 0 : '100%',
  position: 'absolute',
  top: 0,
  width: '100%',
  zIndex: 1
}));

const Header = styled.header(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.modularScale.xlarge,
  '> svg': {
    height: 30,
    marginLeft: 'auto',
    marginRight: -6,
    padding: 6,
    width: 30
  }
}));

const Back = styled.span(({ theme }) => ({
  alignItems: 'center',
  cursor: 'pointer',
  display: 'flex',
  fontFamily: theme.font.caption,
  fontSize: theme.modularScale.small,
  letterSpacing: 1,
  height: '3rem',
  textTransform: 'uppercase',
  svg: {
    height: 10,
    marginRight: '0.5rem',
    marginTop: 1
  }
}));

const Title = styled.h3(({ theme }) => ({
  fontFamily: theme.font.caption,
  fontSize: theme.modularScale.medium,
  fontWeight: 'bold',
  letterSpacing: 1.9,
  padding: `${theme.modularScale.medium} ${theme.modularScale.xlarge}`,
  textTransform: 'uppercase'
}));

const Mobile = ({ navigation, ...props }) => {
  const isNavigationActive = useSelector((state) => state.interfaces.isNavigationActive);
  const dispatch = useDispatch();

  const [active, setActive] = useState({});
  const {
    navigation1, navigation2, navigation3, navigation4
  } = navigation;

  const handleOnItemClick = (event, item, depth) => {
    const { has_children } = item;
    event.stopPropagation();

    if (has_children) {
      const temp = active;
      temp[depth] = item;

      setActive({ ...temp });
      event.preventDefault();
    }
  };

  const handleOnBackClick = () => {
    const temp = active;
    delete active[Object.keys(active).length];
    setActive({ ...temp });
  };

  const handleOnCloseClick = () => {
    setActive({});
    dispatch(toggleNavigationVisibility(false));
  };

  useEffect(() => {
    if (!isNavigationActive) setActive({});
  }, [isNavigationActive]);

  const trackNavClick = (item, parents) => {
    logAmplitude('Navigated Site', {
      navigationTerm: item.name.toLowerCase(),
      path: item.navigation_url,
      navigationType: 'test mobile top nav',
      navBreadcrumb: parents
    });
  };

  return (
    <Navigation isActive={isNavigationActive} {...props}>
      <Header>
        {
          Object.keys(active).length > 0 ? (
            <Back onClick={handleOnBackClick}>
              <Caret />
              Back
            </Back>
          ) : null
        }
        <Close onClick={handleOnCloseClick} />
      </Header>

      {
        Object.keys(active).length ? (
          <Title>{ active[Object.keys(active).length].name }</Title>
        ) : null
      }

      <List depth={1}>
        {
          navigation1.map((navigation1_item) => (
            <ListItem
              depth={1}
              key={navigation1_item.id}
              onClick={(e) => {
                handleOnItemClick(e, navigation1_item, 1);
                trackNavClick(navigation1_item, navigation1_item.name);
              }}
            >
              {
                navigation1_item.navigation_url
                  ? <a href={navigation1_item.navigation_url}>{navigation1_item.name}</a>
                  : <span>{navigation1_item.name}</span>
              }

              {
                navigation1_item.has_children ? (
                  <InnerList
                    depth={2}
                    isActive={active[1]?.id === navigation1_item.id}
                  >
                    {
                      navigation2
                        .filter((x) => x.parent_id === navigation1_item.id)
                        .map((navigation2_item) => (
                          <ListItem
                            depth={2}
                            key={navigation2_item.id}
                            onClick={(e) => {
                              handleOnItemClick(e, navigation2_item, 2);
                              trackNavClick(navigation2_item, `${navigation1_item.name} > ${navigation2_item.name}`);
                            }}
                          >
                            {
                              navigation2_item.navigation_url
                                ? (
                                  <a href={navigation2_item.navigation_url}>
                                    {navigation2_item.name}
                                  </a>
                                )
                                : <span>{navigation2_item.name}</span>
                            }

                            {
                              navigation2_item.has_children ? (
                                <InnerList
                                  depth={3}
                                  isActive={active[2]?.id === navigation2_item.id}
                                >
                                  {
                                    navigation3
                                      .filter((x) => x.parent_id === navigation2_item.id)
                                      .map((navigation3_item) => (
                                        <ListItem
                                          depth={3}
                                          key={navigation3_item.id}
                                          onClick={(e) => {
                                            handleOnItemClick(e, navigation3_item, 3);
                                            trackNavClick(navigation3_item, `${navigation1_item.name} > ${navigation2_item.name} > ${navigation3_item.name}`);
                                          }}
                                        >
                                          {
                                            navigation3_item.navigation_url
                                              ? (
                                                <a href={navigation3_item.navigation_url}>
                                                  {navigation3_item.name}
                                                </a>
                                              )
                                              : <span>{navigation3_item.name}</span>
                                          }

                                          {
                                            navigation3_item.has_children ? (
                                              <InnerList
                                                depth={4}
                                                isActive={active[3]?.id === navigation3_item.id}
                                              >
                                                {
                                                  navigation4
                                                    .filter(
                                                      (x) => x.parent_id === navigation3_item.id
                                                    ).map((navigation4_item) => (
                                                      <ListItem
                                                        depth={4}
                                                        key={navigation4_item.id}
                                                        onClick={() => trackNavClick(navigation4_item, `${navigation1_item.name} > ${navigation2_item.name} > ${navigation3_item.name} > ${navigation4_item.name}`)}
                                                      >
                                                        <Link href={navigation4_item?.navigation_url ?? '/'} key={navigation4_item.id} passHref>
                                                          <a>{navigation4_item.name}</a>
                                                        </Link>
                                                      </ListItem>
                                                    ))
                                                }
                                              </InnerList>
                                            ) : null
                                          }
                                        </ListItem>
                                      ))
                                    }
                                </InnerList>
                              ) : null
                            }
                          </ListItem>
                        ))
                    }
                  </InnerList>
                ) : null
              }
            </ListItem>
          ))
        }
      </List>
    </Navigation>
  );
};

Mobile.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default Mobile;
