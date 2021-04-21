import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { useRouter } from 'next/router';

import jsonData from './data.json';

import SizeGuideMeasuring from '../../tissues/size-guide-measuring';
import SizeGuideTab from '../../tissues/size-guide-tab';
import Typography from '../../atoms/typography';

const SizeGuideWrapper = styled.section`
  padding-top: 5rem;
  max-width: 95rem;
  margin: auto;
`;

const NavLink = styled(Typography, { shouldForwardProp: (prop) => prop !== 'active' })`
  align-items: center;
  color: ${({ theme }) => theme.color.brand};
  cursor: pointer;
  display: flex;
  height: 5em;
  line-height: 1.5;
  text-align: center;
  background: transparent;
  border: none;
  letter-spacing: 0.05rem;
  padding: 0;
  transition: color ${({ theme }) => theme.animation.fast} ${({ theme }) => theme.animation.easeInQuad};

  :first-of-type {
    margin-left: 0;
  }

  :last-of-type {
    margin-right: 0;
  }

  :hover {
    color: ${({ theme }) => theme.color.brandLight};
  }

  ${({ active, theme }) => active && css`
    ${theme.arrow('up', theme.color.brand, 'bottom -1px center')}

    :hover {
      color: ${theme.color.brand};
    }
  `}

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    padding: 0 1rem;
    margin: 0 1rem;
  }
`;

const Navigation = styled.nav`
  border-bottom: 1px solid ${({ theme }) => theme.color.brand};
  display: flex;
  justify-content: space-between;
  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    justify-content: center;
  }
`;

const Title = styled(Typography)`
  color: ${({ theme }) => theme.color.brand};
  line-height: 1.5;
  text-align: center;
`;

const Text = styled(Typography)`
  color: ${({ theme }) => theme.color.brandLight};
  margin: 2rem auto;
  max-width: 60rem;
  text-align: center;

  > a {
    font-family: inherit;
  }
`;

const DEFAULT_MEASURING_TAB = 'clothing';

const SizeGuide = (props) => {
  const router = useRouter();

  const [activeNav, setActiveNav] = useState('Measuring');
  const [activeTab, setActiveTab] = useState(
    ['clothing', 'shoes'].includes(props.selected) ? props.selected : DEFAULT_MEASURING_TAB
  );

  const isPage = () => {
    const { window } = global;
    if (window) {
      return window.location.pathname === '/size-guide';
    }
    return false;
  };

  const handleOnNavClick = (nav) => {
    const tab = nav === 'Measuring' ? 'clothing' : Object.keys(jsonData[nav])[0];
    setActiveNav(nav);
    setActiveTab(tab);

    if (isPage()) {
      // persist the pageOnly query that displays
      // the page without the header, cart drawer and footer for iOS app
      const { pageOnly } = router.query;

      router.replace({
        pathname: '/size-guide',
        query: pageOnly ? { pageOnly } : null
      });
    }
  };

  return (
    <SizeGuideWrapper>
      <Title element="h1" like="heading-3">Clothing + Shoes Size Chart</Title>

      <Text element="p" like="dec-1">
        Because sizing and cut will vary between brands, please use this chart as a general guide.
        If you are between sizes or need assistance selecting the proper size, please contact
        {' '}
        <a href="mailto:customercare@maisonette.com">customer care</a>
      </Text>

      {
        <Navigation>
          {
            Object.keys(jsonData).map((nav) => (
              <NavLink
                key={nav}
                type="button"
                active={activeNav === nav ? 'true' : undefined}
                element="button"
                like="dec-1"
                onClick={() => handleOnNavClick(nav)}
              >
                {nav}
              </NavLink>
            ))
          }

          <NavLink
            element="button"
            type="button"
            like="dec-1"
            active={activeNav === 'Measuring' ? 'true' : undefined}
            onClick={() => handleOnNavClick('Measuring')}
          >
            Measuring
          </NavLink>
        </Navigation>
      }

      {
        activeNav !== 'Measuring' && <SizeGuideTab activeNav={activeNav} activeTab={activeTab} />
      }

      {
        activeNav === 'Measuring' && (
          <SizeGuideMeasuring activeTab={activeTab} isPage={isPage()} />
        )
      }
    </SizeGuideWrapper>
  );
};

SizeGuide.defaultProps = {
  selected: DEFAULT_MEASURING_TAB
};

SizeGuide.propTypes = {
  selected: PropTypes.oneOf(['shoes', 'clothing'])
};

export default memo(SizeGuide);
