import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import cookies from 'next-cookies';
import Router from 'next/router';

import {
  updateProducts,
  updatePages,
  updateSort,
  updateSlug,
  updateFacets,
  updateMeta,
  updateSlider,
  updateTracking
} from '../../store/modules/products/actions';
import { toggleIsLoading } from '../../store/modules/interfaces/actions';
import {
  getProducts,
  getBrand,
  getMinis
} from '../../pages/api';

import { storeWrapper } from '../../store';
import slugToSli from '../../utils/slugToSLI';
import SLIHyphenMap from '../../utils/SLIHyphenMap.json';
import { algoliaGSSP } from '../algolia-plp';

export const PageLoader = styled.div`
  background-color: ${(props) => props.theme.color.background};
  bottom: 0;
  left: 0;
  opacity: 0.75;
  pointer-events: none;
  position: fixed;
  right: 0;
  top: 0;
  visibility: visible;
  z-index: ${(props) => props.theme.layers.balcony};

  ${(props) => props.theme.loader()}
`;

export const DEFAULT_COUNT = 24;
export const DEFAULT_SORT = 'score';

const CATEGORY_IDS = ['cat1', 'cat2', 'cat3'];

export const getVisibleFilters = (filters = []) => {
  if (global.window) {
    const slug = global.window.location.pathname.split('/')[1];
    return filters
      .filter((f) => f && !['cat1', 'cat2', 'cat3', slug[slug.length - 1] === 's' ? slug.slice(0, -1) : slug].includes(f.split(':')[0]));
  }

  return [];
};

export const getCategories = (facets) => {
  if (!facets) return null;

  const defaults = facets.filter((facet) => CATEGORY_IDS.includes(facet.id));

  const active = defaults.reduce((acc, cat) => {
    let cats = acc;

    cat.values.forEach((value) => {
      if (value.selected) {
        if (!cats) cats = {};
        cats[cat.id] = value;
      }
    });

    return cats;
  }, null);

  return { defaults, active };
};

export const getHeaders = (categories) => {
  if (!categories) return null;

  const categoriesArray = Object.values(categories);
  const subHeaders = [];

  for (let i = 0; i < categoriesArray.length - 1; i++) {
    const cat = categoriesArray[i];
    subHeaders.push(cat);
  }

  return {
    header: categoriesArray[categoriesArray.length - 1],
    subHeaders
  };
};

export const getMerchHeader = (merch = {}) => {
  if (!merch.banners) return null;
  const h = merch.banners.find((banner) => banner.placement === 'top_of_landing_page');
  return h ? h.content : null;
};

const withPLP = (PLP) => {
  const Component = (props) => (
    <>
      {props.isPageLoading && <PageLoader />}
      <PLP {...props} />
    </>
  );

  Component.defaultProps = {
    isPageLoading: true
  };

  Component.propTypes = {
    isPageLoading: PropTypes.bool
  };

  return connect((state) => ({
    isPageLoading: state.interfaces.isLoading
  }), (dispatch) => ({
    toggleIsPageLoading: (loading) => dispatch(toggleIsLoading(loading))
  }))(Component);
};

export const withPLPServerSideProps = (getServerSidePropsFunc, plpType = false) =>
  storeWrapper.getServerSideProps(
    async (ctx) => {
      const {
        query, resolvedUrl, store
      } = ctx;

      // const algolia = cookies(ctx)?.sitespect_algolia ?? false;
      const algolia = true;
      if (plpType && algolia) return algoliaGSSP(ctx, plpType);

      const alphabetical = cookies(ctx)?.sitespect_alphabetical_filters ?? undefined;

      store.dispatch(toggleIsLoading(true));

      const page = resolvedUrl;

      const pageNumber = query.page ? parseInt(query.page, 10) - 1 : null;

      const {
        af: activeFilters = '',
        brand = null,
        cats = null,
        edit = null,
        isort: sort = DEFAULT_SORT,
        pw: correctedSearchTerm = null,
        srt: start = pageNumber && pageNumber > 0 ? pageNumber * DEFAULT_COUNT : 0,
        trend = null,
        w: searchTerm = '*'
      } = query;

      if (cats) {
        const hasUnhyphenatedCategory = cats?.filter((cat) => SLIHyphenMap[cat]) ?? null;

        if (hasUnhyphenatedCategory?.length > 0) {
          const [path, pathQueries] = page.split('?');
          const newPage = hasUnhyphenatedCategory.reduce((acc, curr) => {
            let temp = path;
            temp = temp.replace(curr, SLIHyphenMap[curr] ?? curr);
            return temp;
          }, path);

          ctx.res.setHeader('Location', `${newPage}${pathQueries ? `?${pathQueries}` : ''}`);
          ctx.res.statusCode = 301;
        }
      }

      let response = null;
      let filters = activeFilters.trim();

      const addSlugsToFilters = () => {
        if (trend) filters += `${filters ? ' ' : ''}trends:${slugToSli(trend)}`;
        if (brand) filters += `${filters ? ' ' : ''}brand:${slugToSli(brand, true)}`;
        if (edit) filters += `${filters ? ' ' : ''}edits:${slugToSli(edit)}`;

        if (cats && cats.length > 0) {
          if (cats[0]) filters += `${filters ? ' ' : ''}cat1:${slugToSli(cats[0])}`;
          if (cats[1]) filters += `${filters ? ' ' : ''}cat2:${slugToSli(cats[0])}_${slugToSli(cats[1])}`;
          if (cats[2]) filters += `${filters ? ' ' : ''}cat3:${slugToSli(cats[0])}_${slugToSli(cats[1])}_${slugToSli(cats[2])}`;
        }
      };

      addSlugsToFilters();

      const activeMini = cookies(ctx).maisonette_active_mini;

      let miniFilters = [];

      if (+activeMini) {
        const minis = await getMinis({ ctx }).then((res) => res?.minis || []);

        if (minis?.length > 0) {
          const mini = minis.find((x) => x.id === +activeMini);

          if (mini) {
            const { gender_taxons, age_range_taxons } = mini;
            const taxons = [...gender_taxons, ...age_range_taxons];
            miniFilters = taxons.map((x) => {
              const [k, v] = x.permalink.split('/');
              return `${slugToSli(k)}:${slugToSli(v)}`;
            });
          }
        }

        if (miniFilters.length > 0) {
          filters = filters
            ? [...new Set([...filters.split(' '), ...miniFilters])].join(' ')
            : miniFilters.join(' ');
        } else filters = filters ?? null;
      }

      response = await getProducts({
        params: {
          alphabetical,
          af: filters,
          cnt: DEFAULT_COUNT,
          isort: sort,
          srt: start,
          w: searchTerm
        },
        ctx
      });

      let responseData = response;
      let noResults = !responseData?.pages?.total;
      let noResultsWithMini = noResults && !!+activeMini;
      let noResultsWithMiniRemoved = noResults;

      if (noResultsWithMini) {
        const miniFiltersString = miniFilters.length > 0 ? miniFilters.join(' ') : null;
        filters = activeFilters.trim();
        filters = filters?.replace(miniFiltersString, '');
        addSlugsToFilters();

        response = await getProducts({
          params: {
            alphabetical,
            af: filters,
            cnt: DEFAULT_COUNT,
            isort: sort,
            srt: start,
            w: searchTerm
          },
          ctx
        });

        responseData = response;
        noResultsWithMiniRemoved = !responseData?.pages?.total;
      }

      if (noResultsWithMiniRemoved && (!searchTerm || searchTerm === '*')) {
        ctx.res.statusCode = 404;
      }

      const getEditsName = () => {
        if (noResults || !edit) return null;
        return responseData.facets.find((x) => x.id === 'edits')?.values.find((x) => x.selected)?.name ?? null;
      };

      store.dispatch(updatePages(responseData.pages ?? null));
      store.dispatch(updateFacets(responseData.facets ?? null));
      store.dispatch(updateMeta(responseData.result_meta ?? null));
      store.dispatch(updateSlider(responseData.slider ?? null));
      store.dispatch(updateTracking(responseData.tracking ?? null));
      store.dispatch(updateSort(sort));
      store.dispatch(updateSlug(page));
      store.dispatch(updateProducts(responseData.results ?? null));

      store.dispatch(toggleIsLoading(false));

      let brandReq = brand;

      if (brand) {
        if (/\s/.test(brand)) {
          const b = brand.replace(/\s+/g, '-').toLowerCase();
          ctx.res.setHeader('Location', `/brands/${b}`);
          ctx.res.statusCode = 301;
        }

        const brandRes = await getBrand({ brand, ctx });
        response = [brandRes, response];
        brandReq = brandRes;
      }

      if (responseData?.merch?.jumpurl) {
        const { jumpurl } = responseData.merch;
        const { pathname } = new URL(jumpurl);

        if (ctx.res) {
          ctx.res.setHeader('Location', pathname);
          ctx.res.statusCode = 301;
        } else {
          Router.push(pathname);
        }

        return {};
      }

      if (response.status >= 400) {
        ctx.res.statusCode = response.status;
      }

      if (response.error) ctx.res.statusCode = 404;

      if (pageNumber && pageNumber >= responseData?.pages?.total) {
        ctx.res.statusCode = 404;
        noResults = true;
        noResultsWithMini = true;
        noResultsWithMiniRemoved = true;
      }

      if (noResults) {
        try {
          const urlParts = resolvedUrl.split('/');
          const slug = urlParts[urlParts.length - 1];
          // product redirect
          const productExists = await global.fetch(`${process.env.NEXT_PUBLIC_CLIENT_HOST}/api/products/${slug}`)
            .then((res) => res.status === 200);
          if (productExists) {
            return {
              redirect: {
                destination: `/product/${slug}`,
                permanent: true
              }
            };
          }
        } catch (error) { /* noop */ }
      }

      let GSSPProps = null;

      if (getServerSidePropsFunc) {
        const {
          redirect,
          notFound,
          ...props
        } = await getServerSidePropsFunc(ctx, noResults);

        if (redirect) return { redirect };
        if (notFound) return { notFound };

        GSSPProps = props;
      }

      return {
        props: {
          ...responseData,
          brand: brandReq?.taxons[0] ?? null,
          categories: getCategories(responseData.facets),
          correctedSearchTerm,
          edit,
          filters: filters.length > 0 ? filters?.split(' ') : [],
          headers: getHeaders(getCategories(responseData.facets)?.active),
          merchHeader: getMerchHeader(responseData.merch),
          noResults,
          page,
          pages: responseData?.pages,
          results: responseData?.results ?? null,
          searchTerm,
          sort,
          trend,
          trendName: trend?.replace(/-/g, ' ') ?? null,
          editName: getEditsName(),
          logs: response,
          noResultsWithMini,
          noResultsWithMiniRemoved,
          ...GSSPProps
        }
      };
    }
  );

export default withPLP;
