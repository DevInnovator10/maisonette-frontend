import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { formatNumber } from 'accounting-js';
import { InView } from 'react-intersection-observer';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { useRouter } from 'next/router';

import dynamic from 'next/dynamic';

import { Content } from '../../theme/page';
import Button from '../../atoms/button';
import Facets from '../../organs/plp-facets';
import Grid from '../../organs/plp-product-grid';
import Typography from '../../atoms/typography';
import responseDataHasProperties from '../../utils/responseDataHasProperties';
import trackEvent from '../../utils/tracking';
import updateQueryStringPage from '../../utils/updateQueryStringPage';
import { getProducts } from '../../pages/api';
import { getActiveMini } from '../filter-list-remove';
import {
  updateProduct,
  updateProducts,
  updatePages,
  updateSlug,
  updateFacets,
  updateMeta,
  updateSlider,
  updateTracking,
  updateScrollY
} from '../../store/modules/products/actions';

import {
  DEFAULT_COUNT,
  DEFAULT_SORT,
  getVisibleFilters
} from '../../organisms/products';

const ScrollToTop = dynamic(() => import('../back-to-top'));
const PopularProducts = dynamic(() => import('../product-popular-items'));
const NoResultsPageHeader = dynamic(() => import('../../molecules/product-no-results-header'));

const ContentGrid = styled(Content)`
  display: flex;
  flex-direction: column;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    flex-direction: row;
  }
`;

const ProductWrapper = styled.div`
  flex: 1 1 auto;
`;

const LoadPreviousProducts = styled(Button)`
  grid-area: button;
  outline: 0;
  margin: 0 auto 3rem auto;
  text-decoration: none;
`;

const LoadMoreProducts = styled(Button)`
  grid-area: button;
  outline: 0;
  margin: 3rem auto 0 auto;
  text-decoration: none;
`;

const MobileFacets = styled.div`
  background-color: ${(props) => props.theme.color.backgroundLight};

  > div {
    display: grid;
    padding: 1rem 3rem;
    grid-gap: 2rem;
    grid-template-columns: repeat(2, 1fr);
    max-width: ${(props) => props.theme.width.small};
    margin: 0 auto;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: none;
  }
`;

const MobileButton = styled(Button)`
  ${(props) => props.theme.arrow('down', props.theme.color.brand, 'right center', 4)}
  background-color: ${(props) => props.theme.color.backgroundLight};
  border: 0 none;
  color: ${(props) => props.theme.color.brand};
  cursor: pointer;
  outline: 0;
  padding: 0;
  text-align: left;

  > span {
    color: ${(props) => props.theme.color.brandLight};
    float: right;
    letter-spacing: initial;
    padding-right: 1.5rem;
    text-transform: none;
  }
`;

const NoResultsSection = styled.section`
  position: relative;
  margin: 0 auto;
  max-width: ${({ theme }) => theme.width.medium};
`;

const Products = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
`;

const Loading = styled.span`
  display: block;
  grid-area: loader;
  height: 6rem;
  position: relative;
  width: 100%;
  margin-top: 3rem;

  ${(props) => props.previous && css`
    margin-bottom: 3rem;
    margin-top: 0;
  `}

  ::after {
    animation: spin .5s infinite linear;
    border: 0.25rem solid ${(props) => props.theme.color.brand};
    border-radius: 290486px;
    border-right-color: transparent;
    border-top-color: transparent;
    content: '';
    height: 3rem;
    left: calc(50% - (3rem / 2));
    position: absolute;
    top: calc(50% - (3rem / 2));
    width: 3rem;

    @keyframes spin {
      from { transform: rotate(0) }
      to { transform: rotate(359deg) }
    }
  }
`;

const IntersectionObserverElement = styled.span`
  bottom: 0;
  height: 75vh;
  position: absolute;
  width: 100%;
  visibility: hidden;
`;

const SORTS = [
  {
    name: 'Best Match',
    id: 'best-match',
    value: 'score'
  },
  {
    name: 'Best Sellers',
    id: 'best-sellers',
    value: 'globalpop'
  },
  {
    name: 'Just In',
    id: 'just-in',
    value: 'date rev'
  },
  {
    name: 'Price: Low to High',
    id: 'price-asc',
    value: 'price'
  },
  {
    name: 'Price High to Low',
    id: 'price-desc',
    value: 'price rev'
  }
];

const ProductGrid = (props) => {
  const router = useRouter();
  const { asPath } = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingPreviousPage, setLoadingPreviousPage] = useState(false);
  const [scrollToSecondSection, setScrollToSecondSection] = useState(false);
  const [infiniteScroll, setInfiniteScroll] = useState(false);
  const [reverseInfiniteScroll, setReverseInfiniteScroll] = useState(false);
  const [products, setProducts] = useState(props.results);
  const [pages, setPages] = useState(props.pages);
  const [mobileFilterActive, setMobileFilterActive] = useState(false);
  const [mobileSortActive, setMobileSortActive] = useState(false);
  const [mini, setMini] = useState(getActiveMini(props.activeMini, props.minis));

  const initialPage = router.query?.page ? parseInt(router.query?.page, 10) - 1 : null;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [firstPage, setFirstPage] = useState(initialPage || 0);

  useEffect(() => {
    const elem = global.document.querySelector(`[data-slug="${props.clickedProduct}"]`);

    if (elem) {
      setTimeout(() => {
        elem.scrollIntoView({ block: 'center' });
        props.updateProduct(null);
      }, 0);
    }
  }, []);

  const fetchNextPageData = (page) => {
    const start = page > -1 ? page * DEFAULT_COUNT : pages?.current?.name * DEFAULT_COUNT;

    return getProducts({
      params: {
        af: props.filters.join(' '),
        cnt: DEFAULT_COUNT,
        isort: props.sort,
        srt: start,
        w: props.searchTerm
      }
    });
  };

  const handleLoadNextPage = async (page) => {
    if (!props.isPageLoading) {
      setLoading(true);
      if (page >= 0) setLoadingPreviousPage(true);

      const response = await fetchNextPageData(page);
      const responseData = response?.data ?? response;

      const expectedProps = [
        'pages', 'facets', 'result_meta', 'tracking', 'results'
      ];

      if (responseDataHasProperties(responseData, expectedProps)) {
        if (page < 0) {
          setProducts([...products, ...responseData.results]);
          setPages(responseData.pages);
          props.updateProducts([...products, ...responseData.results]);
        } else {
          setProducts([...responseData.results, ...products]);
          setCurrentPage(page);
          setReverseInfiniteScroll(true);
          setScrollToSecondSection(true);
          if (page < firstPage) {
            setFirstPage(page);
          }
          props.updateProducts([...responseData.results, ...products]);
        }

        props.updatePages(responseData.pages);
        props.updateFacets(responseData.facets);
        props.updateMeta(responseData.result_meta);
        props.updateSlider(responseData.slider || []);
        props.updateTracking(responseData.tracking);
        props.updateSlug(props.page);

        global.document.cookie = 'savedPage=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setLoading(false);
        setLoadingPreviousPage(false);
      } else {
        setPages(null);
        setInfiniteScroll(false);
        setLoading(false);
        setLoadingPreviousPage(false);
      }
    }
  };

  const handleOnSectionIntersection = (intersectedSection) => {
    updateQueryStringPage(firstPage + intersectedSection + 1, router);
    if (reverseInfiniteScroll && intersectedSection === 0) {
      const pageToLoad = firstPage + intersectedSection - 1;
      if (pageToLoad > -1) {
        handleLoadNextPage(pageToLoad);
      }
    }
  };

  const handleOnLoadMoreClick = (page) => {
    if (!loading) handleLoadNextPage(page);
    if (page === -1) setInfiniteScroll(true);
  };

  const handleOnIntersectionChange = (inView) => {
    if (!inView || !infiniteScroll || pages.current.name === pages.total) return;
    handleLoadNextPage(-1);
  };

  const getUrlPath = () => router.asPath.split('?')[0];

  useEffect(() => {
    if (!scrollToSecondSection) return;
    const secondSection = global.document.getElementById('product-card-intersection-observer-1');
    if (!secondSection) return;
    const offset = 300;
    const sectionPosition = secondSection.getBoundingClientRect().top;
    const scrollPosition = sectionPosition - offset;
    if (secondSection) global.window.scrollTo({ top: scrollPosition });
    setScrollToSecondSection(false);
  }, [scrollToSecondSection]);

  useEffect(() => {
    if (products !== props.results) {
      setProducts(props.results);
      setPages(props.pages);
      setInfiniteScroll(true);
      setLoading(false);
    }
  }, [props.results, props.sort]);

  useEffect(() => {
    props.updateScrollY(0);
    global.window.scrollTo(0, 0);
  }, [props.sort]);

  useEffect(() => {
    setPages(props.pages);
    if (props.scrollY && props.slug === asPath) {
      global.window.scrollTo(0, props.scrollY);
    }
  }, []);

  useEffect(() => {
    if (props.activeMini && !props.loadingMinis) {
      const activeMini = getActiveMini(props.activeMini, props.minis);
      setMini(activeMini);
    }
  }, [props.activeMini, props.loadingMinis]);

  useEffect(() => {
    if (props.noResultsWithMiniRemoved) {
      trackEvent({
        event: 'techEvent',
        eventCategory: 'Site search',
        eventAction: 'No results',
        eventLabel: props.searchTerm
      });
    }
  }, []);

  if (props.noResultsWithMiniRemoved) {
    return (
      <Content>
        <NoResultsSection>
          <NoResultsPageHeader
            slug={props.searchTerm}
            facets={[]}
            noResultsWithMiniRemoved={props.noResultsWithMiniRemoved}
          />

          {
            props?.filters?.length > 0 ? props?.filters.map((f) => {
              const [category, value] = f.split(':');
              const facet = props?.facets
                ?.find((x) => x.id === category)?.values
                ?.find((x) => x.id === value);

              return facet ? (
                <PopularProducts
                  {...props}
                  key={`popular-${category}-${value}`}
                  productsArgs={['*', 8, f]}
                  name={facet?.name ?? null}
                  filter={f}
                  term="*"
                />
              ) : <PopularProducts term={props.searchTerm} />;
            }) : <PopularProducts term={props.searchTerm} />
          }

        </NoResultsSection>
      </Content>
    );
  }

  return (
    <>
      {
        products && (
          <MobileFacets>
            <div>
              <MobileButton onClick={() => setMobileFilterActive(true)}>
                {
                  +getVisibleFilters(props.filters).length > 0
                    ? `Filters (${getVisibleFilters(props.filters).length})`
                    : 'Filters'
                }

                {
                  props.result_meta?.total > 0 && (
                    <Typography element="span" like="dec-1">
                      {`${formatNumber(props.result_meta.total, { precision: 0 })} items`}
                    </Typography>
                  )
                }
              </MobileButton>

              <MobileButton onClick={() => setMobileSortActive(true)}>
                Sort
                <Typography element="span" like="dec-1">
                  {
                    SORTS.find((s) => s.value === props.sort)?.name.toLowerCase().includes('price')
                      ? `
                        Price
                        ${
                      SORTS.find((s) => s.value === props.sort)?.name.toLowerCase().split(' ')[1] === 'low'
                        ? '\u2191'
                        : '\u2193'
                      }
                      `
                      : SORTS.find((s) => s.value === props.sort)?.name
                  }
                </Typography>
              </MobileButton>
            </div>

            <ScrollToTop />
          </MobileFacets>
        )
      }

      <ContentGrid>
        {
          props?.facets && (
            <>
              {
                products && (
                  <Facets
                    {...props}
                    facets={props?.facets}
                    slider={props?.slider?.[0] ?? false}
                    sort={props.sort}
                    meta={props.result_meta}
                    activeFilters={props.filters}
                    mobileFilterActive={mobileFilterActive}
                    setMobileFilterActive={setMobileFilterActive}
                    mobileSortActive={mobileSortActive}
                    setMobileSortActive={setMobileSortActive}
                  />
                )
              }

              <ProductWrapper>
                <div>
                  {
                    props.noResultsWithMini
                    && (
                      <>
                        {props.loadingMinis && <Loading />}
                        <NoResultsPageHeader
                          slug={props.searchTerm}
                          facets={[]}
                          miniName={mini?.name}
                        />
                      </>
                    )
                  }
                </div>
                <Products>
                  {
                    !loading && !reverseInfiniteScroll && currentPage && currentPage > 0 ? (
                      <>
                        <LoadPreviousProducts
                          as="a"
                          onClick={(e) => {
                            e.preventDefault();
                            handleOnLoadMoreClick(currentPage - 1);
                          }}
                          href={`${getUrlPath()}?page=${currentPage}`}
                        >
                          Click To Load Previous Pages
                        </LoadPreviousProducts>
                      </>
                    ) : null
                  }

                  {loadingPreviousPage && <Loading previous />}

                  {products && (
                    <Grid
                      taxonProducts={props.taxonProducts}
                      products={products}
                      intersectionInterval={DEFAULT_COUNT}
                      intersectionCallback={
                        (intersectedSection) => handleOnSectionIntersection(intersectedSection)
                      }
                    />
                  )}

                  {loading && <Loading />}

                  {
                    !loading && pages?.current?.name !== pages?.total && (
                      <>
                        <LoadMoreProducts
                          as="a"
                          onClick={(e) => {
                            e.preventDefault();
                            handleOnLoadMoreClick(-1);
                          }}
                          href={`${getUrlPath()}?page=${firstPage + 2}`}
                        >
                          Click To Load More Products
                        </LoadMoreProducts>

                        <InView threshold={0} onChange={handleOnIntersectionChange}>
                          {({ ref }) => <IntersectionObserverElement ref={ref} />}
                        </InView>
                      </>
                    )
                  }
                </Products>
              </ProductWrapper>
            </>
          )
        }
      </ContentGrid>
    </>
  );
};

ProductGrid.defaultProps = {
  categories: null,
  filters: [],
  isPageLoading: true,
  pages: null,
  result_meta: null,
  results: null,
  scrollY: 0,
  searchTerm: '*',
  slug: '',
  sort: DEFAULT_SORT,
  activeMini: 0,
  minis: [],
  loadingMinis: true,
  noResultsWithMini: false,
  noResultsWithMiniRemoved: false,
  clickedProduct: null,
  taxonProducts: true
};

ProductGrid.propTypes = {
  categories: PropTypes.object,
  filters: PropTypes.array,
  isPageLoading: PropTypes.bool,
  page: PropTypes.string.isRequired,
  pages: PropTypes.object,
  result_meta: PropTypes.object,
  results: PropTypes.array,
  scrollY: PropTypes.number,
  searchTerm: PropTypes.string,
  slug: PropTypes.string,
  sort: PropTypes.string,
  activeMini: PropTypes.number,
  minis: PropTypes.array,
  loadingMinis: PropTypes.bool,
  noResultsWithMini: PropTypes.bool,
  noResultsWithMiniRemoved: PropTypes.bool,
  clickedProduct: PropTypes.string,
  updateProducts: PropTypes.func.isRequired,
  updatePages: PropTypes.func.isRequired,
  updateScrollY: PropTypes.func.isRequired,
  updateSlug: PropTypes.func.isRequired,
  updateFacets: PropTypes.func.isRequired,
  updateMeta: PropTypes.func.isRequired,
  updateSlider: PropTypes.func.isRequired,
  updateTracking: PropTypes.func.isRequired,
  updateProduct: PropTypes.func.isRequired,
  taxonProducts: PropTypes.bool
};

const PLPGrid = connect((state) => ({
  isPageLoading: state.interfaces.isLoading,
  scrollY: state.products.scrollY,
  slug: state.products.slug,
  products: state.products.products,
  activeMini: state.petites.active_mini,
  minis: state.petites.minis,
  loadingMinis: state.petites.loading,
  clickedProduct: state.products.product
}), (dispatch) => ({
  updateProduct: (slug) => dispatch(updateProduct(slug)),
  updateProducts: (products) => dispatch(updateProducts(products)),
  updatePages: (pages) => dispatch(updatePages(pages)),
  updateScrollY: (scrollY) => dispatch(updateScrollY(scrollY)),
  updateSlug: (slug) => dispatch(updateSlug(slug)),
  updateFacets: (facets) => dispatch(updateFacets(facets)),
  updateMeta: (meta) => dispatch(updateMeta(meta)),
  updateSlider: (slider) => dispatch(updateSlider(slider)),
  updateTracking: (tracking) => dispatch(updateTracking(tracking))
}))(ProductGrid);

PLPGrid.whyDidYouRender = true;

export default PLPGrid;
