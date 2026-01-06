import React, {
    useState,
  useRef,
  useCallback,
  useEffect
} from 'react';

import { css } from '@emotion/core';
import { useRouter } from 'next/router';
import Head from 'next/head';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { Page, Content } from '../../theme/page';
import { useEventListener } from '../../utils/hooks';
import BrandsSection from '../../molecules/brands-section';
import hasError from '../../utils/hasError';
import Select from '../../atoms/select';
import Typography from '../../atoms/typography';

import { getBrands as fetchBrands, getBrandsByTaxon } from '../api';
import SCOPE_TYPES from '../../utils/sentryScopeTypes';
import getCanonicalUrl from '../../utils/getCanonicalUrl';

const LoadingWrapper = styled.div`
  position: relative;
  height: 10rem;
`;

const Loading = styled.span`
  ${(props) => props.theme.loader()}
`;

const Title = styled(Typography)`
  color: ${({ theme }) => theme.color.brand};
  text-align: center;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    margin-bottom: 5rem;
  }
`;

const Navigation = styled.nav`
  border-bottom: 1px solid ${({ theme }) => theme.color.brand};
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  overflow: hidden;
`;

const NavLink = styled(Typography, { shouldForwardProp: (prop) => prop !== 'active' })`
  ${(props) => props.theme.arrow('up', props.theme.color.brandLight, 'bottom -1px center')}
  align-items: center;
  background-position: bottom -5px center;
  color: ${({ theme }) => theme.color.brand};
  cursor: pointer;
  display: flex;
  height: 5em;
  margin: 0 1rem;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  transition: color ${({ theme }) => theme.animation.fast} ${({ theme }) => theme.animation.easeInQuad},
              background-position ${({ theme }) => theme.animation.fast} ${({ theme }) => theme.animation.easeInQuad};

  :first-of-type {
    margin-left: 0;
  }

  :last-of-type {
    margin-right: 0;
  }

  :hover {
    color: ${({ theme }) => theme.color.brandLight};
    background-position: bottom -1px center;
  }

  ${({ active, theme }) => active && css`
    ${theme.arrow('up', theme.color.brand, 'bottom -1px center')}

    :hover {
      color: ${theme.color.brand};
    }
  `}

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    padding: 0 1rem;
    margin: 0 1rem;
  }
`;

const NavigationWrapper = styled.div`
  margin: 0 -6.5vw 5rem;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.large}) {
    position: sticky;
    background: ${({ theme }) => theme.color.background};
    margin: 0 -6.5vw;
    top: 9.1rem;
  }
`;

const FILTERED_SECONDARYNAVLINK_EMO_PROPS = new Set(['active', 'sale']);

const SecondaryNavLink = styled(NavLink, { shouldForwardProp: (prop) => !FILTERED_SECONDARYNAVLINK_EMO_PROPS.has(prop) })`
  ${(props) => props.theme.arrow('up', props.theme.color[props.sale ? 'brandA11yRed' : 'brandLight'], 'bottom -1px center')}
  background-position: bottom -5px center;
  color: ${({ theme, sale }) => (sale ? theme.color.brandA11yRed : theme.color.brand)};

  ${({ active, sale, theme }) => active && css`
    ${theme.arrow('up', theme.color[sale ? 'brandA11yRed' : 'brandLight'], 'bottom -1px center')}
    color: ${sale ? theme.color.brandA11yRed : theme.color.brandLight};
  `}

  :hover {
    color: ${({ theme, sale }) => (sale ? theme.color.brandA11yRed : theme.color.brandLight)};
  }
`;

const TertiaryNavLink = styled(NavLink)`
  height: 4rem;
  margin: 0 0.5rem;
  padding: 0 0.5rem;

  ${({ disabled }) => disabled && css`
    pointer-events: none;
    opacity: 0.25;
  `}

  &.is-active {
    ${({ theme }) => theme.arrow('up', theme.color.brand, 'bottom -1px center')}
    color: ${({ theme }) => theme.color.brand};
    transition: none;
  }
`;

const NavigationSelect = styled(Select)`
  background-color: transparent;
  border: 0;
  display: block;
  height: 6rem;
  margin: 0 auto;
  outline: 0;
  width: auto;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    display: none;
  }
`;

const NavigationSecondary = styled(Navigation)`
  display: none;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    display: flex;
  }
`;

const NavigationTertiary = styled(Navigation)`
  border-top: 1px solid ${({ theme }) => theme.color.brand};

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    background: ${({ theme }) => theme.color.background};
    border-top: 0 none;
  }
`;

const VALID_CATEGORIES = [
  {
    permalink: 'all-categories',
    name: 'All Categories'
  },
  {
    permalink: 'whats-new',
    name: 'What\'s New'
  },
  {
    permalink: 'baby',
    name: 'Baby'
  },
  {
    permalink: 'kids',
    name: 'Kids'
  },
  {
    permalink: 'play',
    name: 'Play'
  },
  {
    permalink: 'gear',
    name: 'Gear'
  },
  {
    permalink: 'gifts',
    name: 'Gifts'
  },
  {
    permalink: 'sale',
    name: 'Sale'
  }
];

const DEFAULT_CATEGORY = VALID_CATEGORIES[0];

const brandsToBuckets = (brands) => (
  brands.errors
    ? false
    : brands.reduce((a = {}, c) => {
      const first = c.name[0].toString(10).toUpperCase();
      const acc = a;

      if (first === c.name[0].toString(10).toLowerCase()) {
        // eslint-disable-next-line no-restricted-globals
        const key = isNaN(first) ? '@' : '0-9';
        if (acc[key]) acc[key].push(c);
        else acc[key] = [c];
      } else if (acc[first]) {
        acc[first].push(c);
      } else {
        acc[first] = [c];
      }

      return acc;
    }, {})
);

const BrandsPage = (props) => {
  const router = useRouter();
  const brandsRef = useRef();

  const [navigationRef, setNavigationRef] = useState(null);
  const [secondary, setSecondary] = useState(props.category ?? DEFAULT_CATEGORY.permalink);
  const [brands, setBrands] = useState(props.brands ?? null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      const prev = brands;

      setBrands(null);

      try {
        if (secondary === DEFAULT_CATEGORY.permalink) {
          fetchBrands().then((res) => {
            setBrands(brandsToBuckets(res));
            setLoading(false);
          });
        } else {
          getBrandsByTaxon({ taxon: secondary }).then((res) => {
            setBrands(brandsToBuckets(res));
            setLoading(false);
          });
        }
      } catch (error) {
        setBrands(prev);
      }
    }
  }, [loading]);

  const onNavigationRef = useCallback((node) => {
    if (node !== null) setNavigationRef(node);
  }, [brands]);

  let TICKING = false;
  const ACTIVE_CLASS = 'is-active';

  const handleOnCategoryClick = (permalink = DEFAULT_CATEGORY.permalink) => {
    setSecondary(permalink);
    setLoading(true);
    router.push('/brands', `/brands?category=${permalink}`, { shallow: true });
  };

  const handleOnSelectChange = (e) => {
    const { value } = e.currentTarget;
    setSecondary(value);
    setLoading(true);
    router.push('/brands', `/brands?category=${value}`, { shallow: true });
  };

  const handleOnLetterClick = (e, letter) => {
    e.preventDefault();

    const section = global.document.querySelector(`[data-section="${letter}"]`);
    [...navigationRef.children].forEach((n) => n.classList.remove(ACTIVE_CLASS));

    global.window.scroll({ top: section.offsetTop - 20, behavior: 'smooth' });
  };

  const handleOnWindowScroll = () => {
    TICKING = false;

    const { scrollY } = global.window;
    const activeSections = [];

    const lettersSections = global.document.querySelectorAll('[data-section]');
    const lettersNavigation = global.document.querySelectorAll('[data-letter]');

    [...lettersSections].forEach((section, i) => {
      lettersNavigation[i].classList.remove(ACTIVE_CLASS);
      if (section.offsetTop < scrollY) activeSections.push(section.dataset.section);
    });

    if (activeSections.length > 0) {
      const activeLetter = [...lettersNavigation].find(
        (letter) => letter.dataset.letter === activeSections[activeSections.length - 1]
      );

      activeLetter.classList.add(ACTIVE_CLASS);
    }
  };

  const requestTick = () => {
    const { window } = global;

    if (!TICKING) {
      window.requestAnimationFrame(() => {
        handleOnWindowScroll();
      });
    }

    TICKING = true;
  };

  useEventListener('scroll', requestTick);

  const isDisabled = (letter) => !brands?.[letter];

  return (
    <Page background="default" id="maincontent">
      <Head>
        <title>Brands - Maisonette</title>
        <meta
          name="description"
          content="Our favorite children’s luxury brands and independent boutiques, all in one magical place. Shop Maisonette for the best in kids clothing, furniture, decor, or toys."
        />

        <link
          key="canonical"
          rel="canonical"
          href={
            // to avoid /brands and /brands?category=all-categories
            // being treated as different pages
            router.asPath.includes('all-categories')
              ? `${process.env.NEXT_PUBLIC_CLIENT_HOST}/brands`
              : getCanonicalUrl(router)
          }
        />
      </Head>

      <Content>
        <Title element="h1" like="heading-4">Browse by Designer</Title>

        <NavigationWrapper>
          <NavigationSecondary>
            {
              VALID_CATEGORIES.map(({ permalink, name }) => (
                <SecondaryNavLink
                  key={permalink}
                  element="a"
                  like="dec-1"
                  onClick={() => handleOnCategoryClick(permalink)}
                  active={secondary === permalink ? 'true' : undefined}
                  sale={permalink === 'sale' ? 'true' : undefined}
                >
                  {name}
                </SecondaryNavLink>
              ))
            }
          </NavigationSecondary>

          <NavigationSelect
            name="brand-navigation"
            value={secondary}
            onChange={(e) => handleOnSelectChange(e)}
            inverted
          >
            {
              VALID_CATEGORIES.map(({ permalink, name }) => (
                <option key={permalink} value={permalink}>{name}</option>
              ))
            }
          </NavigationSelect>

          <NavigationTertiary ref={onNavigationRef}>
            {
              'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0-9,@'.split(',').map(
                (letter) => (
                  <TertiaryNavLink
                    key={letter}
                    element="a"
                    like="label-1"
                    href={`#${letter}`}
                    data-letter={letter}
                    onClick={(e) => handleOnLetterClick(e, letter)}
                    disabled={isDisabled(letter)}
                  >
                    {letter}
                  </TertiaryNavLink>
                )
              )
            }
          </NavigationTertiary>
        </NavigationWrapper>

        {
          !loading
            ? <BrandsSection ref={brandsRef} brands={brands} />
            : (
              <LoadingWrapper>
                <Loading />
              </LoadingWrapper>
            )
        }

      </Content>
    </Page>
  );
};

const getBrands = async (category) => {
  if (category) {
    try {
      const brands = await fetchBrands({
        base: process.env.SOLIDUS_HOST_SEO,
        uri: `/api/taxons/brands_by_category/${category}.json`,
        scopes: [SCOPE_TYPES.SERVICES.SOLIDUS]
      }).then((r) => brandsToBuckets(r));

      return hasError(brands) ? null : brands;
    } catch (error) {
      return null;
    }
  } else {
    try {
      const brands = await fetchBrands({
        base: process.env.SOLIDUS_HOST_SEO,
        uri: '/api/taxons/brands',
        scopes: [SCOPE_TYPES.SERVICES.SOLIDUS]
      }).then((r) => brandsToBuckets(r));

      return hasError(brands) ? null : brands;
    } catch (error) {
      return null;
    }
  }
};

export async function getServerSideProps({ query }) {
  const { category } = query;

  const brands = await getBrands(
    category !== DEFAULT_CATEGORY.permalink
      ? category
      : null
  );

  if (!brands) {
    return {
      redirect: {
        destination: '/brands',
        permanent: true
      }
    };
  }

  return {
    props: {
      brands,
      category: VALID_CATEGORIES.find((c) => c.permalink === category)?.permalink ?? null
    }
  };
}

BrandsPage.defaultProps = {
  brands: null,
  category: DEFAULT_CATEGORY.permalink
};

BrandsPage.propTypes = {
  brands: PropTypes.object,
  category: PropTypes.string
};

BrandsPage.whyDidYouRender = true;

export default BrandsPage;
