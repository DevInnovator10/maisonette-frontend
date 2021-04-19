import { findResultsState } from 'react-instantsearch-dom/server';
import { withRouter } from 'next/router';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React from 'react';

import App from '../../pages/_app';
import Algolia from './algolia';
import searchClient from '../../utils/algolia';
import * as helpers from './utils/helpers';
import {
  shopGSSP,
  trendsGSSP,
  brandsGSSP,
  editsGSSP
} from './gssp';

import { convertSLIPath } from './utils/convertSLIPath';
import womensRedirectUrls from './utils/womensRedirects.json';

const updateAfter = 700;

const DEFAULT_PROPS = {
  searchClient,
  indexName: process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX
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
      return {
        searchState: helpers.pathToSearchState(props.router.asPath),
        lastRouter: props.router
      };
    }

    return null;
  }

  searchStateToURL = (searchState) => (searchState ? helpers.createURL(searchState, this.props) : '')

  onSearchStateChange = (newSearchState) => {
    clearTimeout(this.debouncedSetState);

    this.debouncedSetState = setTimeout(() => {
      const href = this.searchStateToURL(newSearchState);
      this.props.router.push(href, href, { shallow: true });
    }, updateAfter);

    this.setState({ searchState: newSearchState }, () => {
      // scroll to top after state change
      if (newSearchState.page === 1) global.window.scrollTo(0, 0);
    });
  };

  render() {

    return (
      <Algolia
        {...DEFAULT_PROPS}
        searchState={this.state.searchState}
        resultsState={this.props.resultsState}
        onSearchStateChange={this.onSearchStateChange}
        createURL={(state) => helpers.createURL(state, this.props)}
        brand={this.props.brand}
        trend={this.props.trend}
        edit={this.props.edit}
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
const Maisonette = (props) => <App Component={Algolia} pageProps={props} />;

/**
 *
 * The SSR portion of these pages is contained to the algoliaGSSP
 * method which exists in organisms/algolia-plp.
 * This method uses “findResultsState” to render the application
 * on the server-side and get the searchState / searchResults to pass
 * to the client.
 *
 */
export const algoliaGSSP = async ({ resolvedUrl, ...context }, page) => {
  // if url is the old SLI URL structure,
  // create the corresponding new URL structure
  // and redirect permanently
  // TODO: delete once redirect traffic diminishes
  if (resolvedUrl.includes('af=')) {
    const newPath = convertSLIPath(resolvedUrl);

    return {
      redirect: {
        destination: newPath,
        permanent: true
      }
    };
  }

  // TODO: eventually move this into next.config
  if (womensRedirectUrls[resolvedUrl]) {
    return {
      redirect: {
        destination: womensRedirectUrls[resolvedUrl],
        permanent: true
      }
    };
  }

  const searchState = helpers.pathToSearchState(resolvedUrl);
  let props;

  if (page === 'shop') props = shopGSSP(context);
  if (page === 'trends') props = trendsGSSP(context);
  if (page === 'edits') props = editsGSSP(context);
  if (page === 'brands') {
    props = await brandsGSSP(context);
    if (props.noResults) {
      return {
        redirect: {
          destination: '/brands',
          permanent: false
        }
      };
    }
  }

  // App gets rendered here first
  // this is why we need to pass props into findResultsState
  // so that the App is compiled with the correct props
  const resultsState = await findResultsState(Maisonette, {
    ...DEFAULT_PROPS,
    ...props,
    searchState
  });

  const outOfBounds = resultsState?.rawResults?.[0]?.page > resultsState?.rawResults?.[0]?.nbPages;
  const resultsRedirect = resultsState?.rawResults?.[0]?.userData?.[0]?.redirect;
  const noResults = resultsState?.rawResults?.[0]?.nbHits === 0;

  if (resultsRedirect && context?.req?.url !== resultsRedirect) {
    return {
      redirect: {
        destination: resultsState.rawResults[0].userData[0].redirect,
        permanent: false
      }
    };
  }

  if (outOfBounds) {
    return {
      redirect: {
        destination: '/404',
        permanent: false
      }
    };
  }

  if (page !== 'shop' && noResults) {
    const pathArray = resolvedUrl.split('/');
    let newUrl;

    if (pathArray.length > 2) {
      pathArray.pop();

      newUrl = (pathArray.length === 2 && (pathArray[1] === 'trends' || pathArray[1] === 'edits'))
        ? '/'
        : pathArray.join('/');
    }

    return {
      redirect: {
        destination: newUrl,
        permanent: false
      }
    };
  }

  return {
    props: {
      // this is necessary in order to render the correct headings for brands, trends, edits
      // for client side rendering
      ...props,
      // next.js is great, this is great
      // https://github.com/vercel/next.js/issues/11993#issuecomment-617375501
      resultsState: JSON.parse(JSON.stringify(resultsState)),
      searchState
    }
  };
};

Page.defaultProps = {
  brand: null,
  edit: null,
  trend: null
};

Page.propTypes = {
  brand: PropTypes.object,
  edit: PropTypes.string,
  resultsState: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  searchState: PropTypes.object.isRequired,
  trend: PropTypes.string
};

export default withRouter(Page);
