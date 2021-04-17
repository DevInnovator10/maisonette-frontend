import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Link from '../../utils/link';
import { getPageParams } from '../../pages/api';

const NavigationContainer = styled.nav`
    display: none;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    display: block;
    grid-row: 2 / span 100;
  }
`;

const NavigationLink = styled.a`
  font-family: ${(props) => props.theme.font.sans};
  font-size: ${(props) => props.theme.modularScale.small};
  color: ${(props) => props.theme.color.brand};
  text-decoration: none;
  cursor: pointer;
  padding: 1rem;
  transition: color ${(props) => props.theme.animation.default};

  &:hover {
    color: ${(props) => props.theme.color.brandLight};
  }

  &.active {
    color: ${(props) => props.theme.color.brandLight};
  }
`;

const InnerPageNavigation = (props) => {
  const [activeLink, setActiveLink] = useState(props.activePageName);
  const [navPages, setNavPages] = useState('');

  useEffect(() => {
    const getPages = async () => {
      const hasNav = await getPageParams({ params: { innerPageNavigation: true } });
      const hasNavData = hasNav?.data ?? hasNav;
      if (hasNavData) {
        const careersPageData = { Title: 'Careers', URL: '/careers' };
        const hasNavDataWithCareers = [...hasNavData, careersPageData];
        setNavPages(hasNavDataWithCareers.sort((a, b) => (a.Title < b.Title ? -1 : 1)));
      }
    };
    getPages();
  }, []);

  useEffect(() => {
    setActiveLink(props.activePageName);
  }, [props.activePageName]);

  return (
    <NavigationContainer>
      <ul>
        {navPages.length > 0 && navPages.map(
          (page) => (
            <li key={page.Title}>
              <Link passHref href={page.URL === '/careers' ? '/careers' : '/[cms]'} as={page.URL}>
                <NavigationLink className={page.URL === activeLink ? 'active' : ''}>
                  {page.Title}
                </NavigationLink>
              </Link>
            </li>
          )
        )}
      </ul>
    </NavigationContainer>
  );
};

InnerPageNavigation.propTypes = {
  activePageName: PropTypes.string.isRequired
};

InnerPageNavigation.whyDidYouRender = true;

export default memo(InnerPageNavigation);
