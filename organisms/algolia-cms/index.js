import { findResultsState } from 'react-instantsearch-dom/server';
import { withRouter } from 'next/router';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React from 'react';

// components
import App from '../../pages/_app';
import * as helpers from '../algolia-plp/utils/helpers';

// utils
import searchClient from '../../utils/algolia';
import SCOPE_TYPES from '../../utils/sentryScopeTypes';
import cmsPageLogic from './utils/cmsPageLogic';
import AlgoliaArticles from './algolia-pillar';

// gssp
import previewGSSP from './gssp/preview';

// methods
import { getPageParams } from '../../pages/api';
import Story from '../../pages/le_scoop/[category]/[subcategory]/[story]';
import Preview from './cms-page-preview';
import formatCatSubcatFromHM from './utils/formatCatSubcatFromHM/index';

const updateAfter = 700;

const DEFAULT_PROPS = {
  searchClient,
  indexName: process.env.NEXT_PUBLIC_ALGOLIA_CONTENTS_INDEX
};

class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchState: this.props.searchState,
      // eslint-disable-next-line react/no-unused-state
      lastRouter: this.props.router
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    if (!isEqual(state.lastRouter, props.router)) {
      const path = props.type !== 'preview' ? props.router.asPath : props.page.URL;
      return {
        searchState: helpers.pathToSearchState(path),
        lastRouter: props.router
      };
    }

    return null;
  }

  searchStateToURL = (searchState) => (searchState ? helpers.createURL(searchState, this.props) : '')

  onSearchStateChange = (newSearchState) => {
    clearTimeout(this.debouncedSetState);

    this.setState({ searchState: newSearchState }, () => {
      // scroll to top after state change
      if (newSearchState.page === 1) global.window.scrollTo(0, 0);
    });
  };

  onSearchStateChange = (newSearchState) => {
    clearTimeout(this.debouncedSetState);

    this.debouncedSetState = setTimeout(() => {
      const href = this.searchStateToURL(newSearchState);
      this.props.router.push(href, href, { shallow: true });
    }, updateAfter);
  };

  getParentPage = () => {
    // grab previously visited page using history
    // to be used in Amplitude event, default to current page
    // for direct visit
    let parentPage = this.props.router.asPath;

    if (this.props.history?.length > 0) {
      const { length } = this.props.history;
      parentPage = this.props.history[length - 1];
    }

    return parentPage;
  }

  render() {
    if (this.props.storyPage) {
      // storyPage prop is true when the category in the URL is an article
      // This handles cases where an article is not tagged and does not belong
      // to any category or subcategory.
      return <Story {...this.props} />;
    }

    if (this.props.type === 'preview' && this.props.cmsPage) {
      return <Preview {...this.props} />;
    }

    return (
      <AlgoliaArticles
        {...DEFAULT_PROPS}
        parentPage={this.getParentPage()}
        searchState={this.state.searchState}
        resultsState={this.props.resultsState}
        onSearchStateChange={this.onSearchStateChange}
        createURL={(state) => helpers.createURL(state, this.props)}
        category={this.props.category}
        subcategory={this.props.subcategory}
        page={this.props.page}
        modules={this.props.modules}
        featuredStoriesIds={this.props.featuredStoriesIds}
        type={this.props.type}
      />
    );
  }
}

/**
 *
 * “findResultsState” accepts the FULL APPLICATION as
 * the first argument (this hack allows us to load the application on
 * the server-side without any issues from the client or server-specific
 * libraries).
 *
 */
const Maisonette = (props) => <App Component={AlgoliaArticles} pageProps={props} />;

/**
 *
 * The SSR portion of these pages is contained to the algoliaGSSP
 * method which exists in organisms/algolia-plp.
 * This method uses “findResultsState” to render the application
 * on the server-side and get the searchState / searchResults to pass
 * to the client.
 *
 */
export const pillarPageGSSP = async ({ resolvedUrl, params = {} }, type) => {
  let props = {};

  const { category = null, subcategory = null, story = null } = params;

  let URL;
  if (type === 'homepage') URL = '/le_scoop';
  if (category) URL = `/le_scoop/${category}`;
  if (subcategory) URL = `/le_scoop/${category}/${subcategory}`;
  if (story) {
    URL = `/le_scoop/${category}/${subcategory}/${story}`;
  }

  const pages = await getPageParams({
    base: process.env.CMS_HOST,
    uri: '/pages',
    queryParams: { URL },
    scopes: [SCOPE_TYPES.SERVICES.STRAPI]
  });

  // cmsPageLogic fetches the content/modules for the page
  const pageData = await cmsPageLogic({ pages });

  props = {
    ...props, ...pageData
  };

  if (type === 'preview') props = await previewGSSP({ params });

  // the page type will be story if the page viewed is an article without a hierarchical menu
  // and no category in the url. Add noHM prop to not run cat/subcat logic below and storyPage prop
  // to render Story page component
  if (props.page?.type === 'story') props = { ...props, storyPage: true, noHM: true };

  // at this point we can be confident that the page doesn't exist as a category or article
  // and should redirect
  if (props.code === 'error') {
    return {
      redirect: {
        destination: type === 'homepage' ? '/' : '/le_scoop'
      }
    };
  }

  if (props.notFound) {
    return {
      notFound: true
    };
  }

  // since the preview page is fetched by id, we will need to use the preview's url value
  // to get the appropriate category and subcategory value
  const url = type === 'preview' ? props.page.URL : resolvedUrl;
  const searchState = helpers.pathToSearchState(url);

  if (searchState?.hierarchicalMenu?.['categories_slug.lvl0'] && !props.noHM) {
    const { hierarchicalMenu } = searchState;

    // set category and subcategory from hm
    // untagged articles and the le scoop homepage do not have a hm
    const { categoryData, subcategoryData } = formatCatSubcatFromHM({
      hierarchicalMenu: hierarchicalMenu['categories_slug.lvl0']
    });

    if (categoryData) props = { ...props, category: categoryData };
    if (subcategoryData) props = { ...props, subcategory: subcategoryData };
  }

  // App gets rendered here first
  // this is why we need to pass props into findResultsState
  // so that the App is compiled with the correct props
  const resultsState = await findResultsState(Maisonette, {
    ...DEFAULT_PROPS,
    searchState,
    ...props,
    type
  });

  return {
    props: {
      resultsState: JSON.parse(JSON.stringify(resultsState)),
      searchState,
      ...props,
      type
    }
  };
};

Page.defaultProps = {
  category: null,
  subcategory: null,
  storyPage: false,
  cmsPage: false
};

Page.propTypes = {
  resultsState: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  searchState: PropTypes.object.isRequired,
  category: PropTypes.object,
  subcategory: PropTypes.object,
  history: PropTypes.array.isRequired,
  page: PropTypes.object.isRequired,
  modules: PropTypes.array.isRequired,
  featuredStoriesIds: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  storyPage: PropTypes.bool,
  cmsPage: PropTypes.bool
};

export default withRouter(Page);
