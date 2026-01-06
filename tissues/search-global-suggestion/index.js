import React, { Component, memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { debounce } from 'throttle-debounce';
import Link from '../../utils/link';
import trackEvent from '../../utils/tracking';
import { logAmplitude } from '../../utils/amplitude';

import { getProducts, getRacProducts, logClickSLI } from '../../pages/api';
import getMiniQueryParam from '../../utils/getMiniQueryParam';

import Anchor from '../../atoms/anchor';
import Button from '../../atoms/button';
import Card from '../product-card';
import withSearchActions from '../../organisms/search';

import { responsiveCSS } from '../../theme/page';
import Typography from '../../atoms/typography';
import theme from '../../theme/theme';

const SuggestionContainer = styled.section`
  background: ${(props) => props.theme.color.white};
  display: ${(props) => (props.isActive ? 'block' : 'none')};
  overflow: auto;
  position: fixed;
  top: 14.8rem;
  max-height: calc(100% - 14.8rem);
  width: 100%;
  z-index: ${(props) => props.theme.layers.audience};
`;

const SuggestionWrapper = styled.div`
  ${responsiveCSS};
  padding-bottom: 3rem;
  padding-top: 3rem;
  position: relative;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    display: grid;
    grid-template-columns: 25% 75%;
    grid-template-areas:
      'suggestions products'
      'empty view-all';
    grid-template-rows: repeat(2, auto);
  }
`;

const ProductCard = styled(Card)`
  &:not(:nth-of-type(-n + 2)) {
    display: none;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    &:not(:nth-of-type(-n + 2)) {
      display: block;
    }
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-gap: 1rem;
  margin-bottom: 3rem;
  grid-template-columns: repeat(2, 1fr);

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    grid-area: products;
    grid-template-columns: repeat(5, 1fr);
  }
`;

const ProductGridLabel = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  display: none;
  grid-column: -1 / 1;
  text-align: center;

  > b {
    font-family: ${(props) => props.theme.font.caption};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.24em;
    margin-left: 0.25rem;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    display: block;
  }
`;

const SearchSuggestionLabel = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: 1rem;
  text-align: center;
  display: none;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    display: block;
  }
`;

const ProductsLabel = styled(SearchSuggestionLabel)`
  grid-column: -1 / 1;
  margin: 0;
`;

const ViewAllResults = styled(Button)`
  display: block;
  grid-area: view-all;
  text-align: center;
  width: 100%;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    grid-column: 2;
  }
`;

const NoResultsError = styled(Typography)`
  color: ${(props) => props.theme.color.brandError};
  text-align: center;
`;

const ScopeResults = styled.div`
  grid-area: suggestions;
  padding-right: ${(props) => props.theme.modularScale.xlarge};
`;

const SearchTerm = styled.a`
  border-bottom: 1px solid ${(props) => props.theme.color.brand};
  border-top: 1px solid ${(props) => props.theme.color.brand};
  color: ${(props) => props.theme.color.brand};
  cursor: pointer;
  display: block;
  font-family: ${(props) => props.theme.font.caption};
  letter-spacing: 0.24em;
  margin-bottom: 1em;
  padding-bottom: 0.5rem;
  padding-top: 0.5rem;
  text-decoration: none;
  text-transform: uppercase;
  transition: color ${(props) => props.theme.animation.default};

  :hover {
    color: ${(props) => props.theme.color.brandLight};
  }
`;

const ScopeAnchor = styled(Anchor)`
  color: ${(props) => props.theme.color.brand};
  display: block;
  font-family: ${(props) => props.theme.font.sans};
  line-height: 3rem;

  .highlight {
    font-weight: 700;
  }
`;

const Loader = styled.div`
  position: relative;
  height: 10rem;

  ${(props) => props.theme.loader()}
`;

const BlueLabel = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
`;

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const highlightMatchingText = (query, str) => {
  if (str) {
    const substring = new RegExp(escapeRegExp(query), 'gi');
    const result = str.replace(substring, '<strong class="highlight">$&</strong>');
    return result;
  }

  return null;
};

export class SearchSuggestion extends Component {
  static trackSearchSuggestion(term, url) {
    trackEvent({
      eventCategory: 'Search',
      eventAction: 'Full Suggestion Click',
      eventLabel: term,
      eventValue: url
    });
    logAmplitude('Used Search Suggestion', { term });
  }

  static trackHintClick(h) {
    SearchSuggestion.trackSearchSuggestion(
      h?.suggestion?.toLowerCase?.(),
      `/shop?w=${h?.suggestion?.toLowerCase?.()}`
    );

    if (h?.logURL) {
      const { logURL } = h;
      const logURLQueries = logURL.split('?')[1];
      if (logURLQueries) {
        logClickSLI({ logURLQueries });
      }
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      abortController: null,
      active: false,
      areResultsCorrected: false,
      count: 0,
      isMobile: global.window
        ? global.window.matchMedia(`(max-width: ${theme.breakpoint.max('medium')})`).matches
        : true,
      loading: true,
      response: {},
      products: [],
      term: this.props.globalSearchTerm
    };

    this.ref = React.createRef();

    this.updateSearchTerm = this.updateSearchTerm.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.getShownResultsLabel = this.getShownResultsLabel.bind(this);
    this.getSuggestionCount = this.getSuggestionCount.bind(this);
    this.handleOnOutsideClick = this.handleOnOutsideClick.bind(this);
    this.resetAbortController = this.resetAbortController.bind(this);
    this.trackFullSearch = this.trackFullSearch.bind(this);

    this.getSuggestionsDebounced = debounce(500, this.getSuggestions);
    this.getSuggestionCountDebouced = debounce(500, this.getSuggestionCount);
  }

  componentDidMount() {
    global.window.addEventListener('resize', this.getSuggestionCountDebouced, false);
    this.resetAbortController();
  }

  componentDidUpdate(prevProps) {
    if (this.props.globalSearchTerm !== prevProps.globalSearchTerm) {
      this.updateSearchTerm(this.props.globalSearchTerm);
    }

    if (this.state.active) {
      global.window.addEventListener('click', this.handleOnOutsideClick, false);
    } else {
      global.window.removeEventListener('click', this.handleOnOutsideClick);
    }
  }

  componentWillUnmount() {
    global.window.removeEventListener('resize', this.getSuggestionCountDebouced);
  }

  getSuggestionCount() {
    const mql = global.window.matchMedia(`(max-width: ${theme.breakpoint.max('medium')})`);
    this.setState({ isMobile: mql.matches });
  }

  async getSuggestions() {
    const { signal } = this.state.abortController;

    if (this.state.active) {
      try {
        await getRacProducts({
          term: this.state.term,
          signal,
          params: { cnt: this.state.isMobile ? 2 : 5 }
        })
          .then(async (d) => {
            const racRes = d?.data ?? d;
            this.setState({ response: racRes });

            const { results } = racRes;
            const suggestedKeyword = this.state.term.toLowerCase();

            this.props.updateSearchHint(
              results?.product_suggestions ?? []
            );

            const query = {
              cnt: 5,
              w: this.state.term
            };

            if (this.props.activeMini !== -1 && this.props.activeMini) {
              query.af = getMiniQueryParam(this.props.activeMini, this.props.petites);
            }

            await getProducts({ params: query, signal })
              .then(async (res) => {
                const resData = res?.data ?? res;
                if (signal.aborted) {
                  return;
                }

                if (resData.result_meta.total) {
                  this.setState({
                    areResultsCorrected: false,
                    count: resData.result_meta.total,
                    loading: false,
                    products: resData.results
                  });
                  trackEvent({
                    eventCategory: 'Search',
                    eventAction: 'Search Query',
                    eventLabel: query.w,
                    eventValue: resData.result_meta.total
                  });
                  logAmplitude('Viewed Search Results', {
                    totalChars: query.w.length,
                    query: query.w,
                    totalResults: resData.result_meta.total
                  });
                  this.props.updateSearchResultsCorrected(false);
                  this.props.updateSearchResultsCount(resData.result_meta.total);
                } else if (suggestedKeyword) {
                  // if there are no results, use suggested key
                  query.w = suggestedKeyword;
                  await getProducts({ params: query, signal })
                    .then((suggestedRes) => {
                      if (signal.aborted) {
                        return;
                      }
                      const suggestedResData = suggestedRes?.data ?? suggestedRes;
                      this.setState({
                        areResultsCorrected: true,
                        count: suggestedResData.result_meta.total,
                        loading: false,
                        products: suggestedResData.result_meta.total
                          ? suggestedResData.results
                          : []
                      });
                      trackEvent({
                        eventCategory: 'Search',
                        eventAction: 'Search Query',
                        eventLabel: query.w,
                        eventValue: resData.result_meta.total
                      });
                      logAmplitude('Viewed Search Results', {
                        totalChars: query.w.length,
                        query: query.w,
                        totalResults: resData.result_meta.total
                      });
                      this.props.updateSearchResultsCorrected(true);
                      this.props.updateSearchResultsCount(resData.result_meta.total);
                    });
                } else {
                  this.setState({
                    areResultsCorrected: false,
                    count: resData.result_meta.total,
                    loading: false,
                    products: []
                  });
                  this.props.updateSearchResultsCorrected(false);
                  this.props.updateSearchResultsCount(resData.result_meta.total);
                }
              });
          });
      } catch (e) {
        // exception caught
        this.setState({
          areResultsCorrected: false,
          count: 0,
          loading: false,
          products: []
        });
        this.props.updateSearchResultsCorrected(false);
        this.props.updateSearchResultsCount(0);
      }
    }
  }

  // we may be able to remove this method
  // as SLI no longer provides suggested searches
  getShownResultsLabel() {
    const { results } = this.state.response;
    const searchSuggestionsScopes = results?.product_suggestions;

    if (
      this.state.areResultsCorrected
      && searchSuggestionsScopes
    ) {
      return this.state.term;
    }

    return this.state.term;
  }

  getViewAllQueryParams() {
    const query = {
      w: this.getShownResultsLabel().toString().toLowerCase()
    };

    if (this.props.activeMini !== -1 && this.props.activeMini) {
      query.af = getMiniQueryParam(this.props.activeMini, this.props.petites);
    }

    return query;
  }

  resetAbortController() {
    this.setState({ abortController: new global.window.AbortController() });
  }

  updateSearchTerm(term) {
    this.state.abortController.abort();
    this.resetAbortController();

    const active = term.length > 0;

    this.props.updateSearchResultsCorrected(false);
    this.props.updateSearchHint([]);

    this.setState({
      active,
      term,
      loading: true,
      response: {},
      products: []
    }, () => {
      this.getSuggestionsDebounced(this.state.term);
    });
  }

  handleOnOutsideClick(e) {
    const search = global.document.getElementById('global-search');

    if (
      !search
      && this.ref
      && this.ref.current
      && !this.ref.current.contains(e.target)
      && this.state.active
    ) {
      this.setState({ active: false }, () => {
        this.props.toggleGlobalSearchVisibility(false);
        this.props.updateSearchTerm('');
        this.props.updateSearchHint(null);
        this.props.updateSearchResultsCount(null);
      });
    }
  }

  trackFullSearch(elementClicked) {
    trackEvent({
      eventCategory: 'Search',
      eventAction: 'Full Search Results',
      eventLabel: this.getShownResultsLabel(),
      eventValue: this.state.count
    });
    logAmplitude('Clicked Search Results View All', {
      totalResults: this.state.count,
      elementClicked
    });
  }

  trackScopeClick(scope) {
    SearchSuggestion.trackSearchSuggestion(
      this.state.term
        .toLowerCase(),
      `/shop?w=${scope.product_slug}`
    );

    if (scope.logURL) {
      const { logURL } = scope;
      const logURLQueries = logURL.split('?')[1];
      if (logURLQueries) {
        logClickSLI({ logURLQueries });
      }
    }
  }

  render() {
    return (
      <SuggestionContainer
        ref={this.ref}
        isActive={this.state.active && this.props.isGlobalSearchActive}
      >
        <SuggestionWrapper>
          {
            this.state.loading
              ? <Loader />
              : (
                <>
                  {
                    this.state?.response?.results
                      && Object.entries(this.state.response.results).length === 0
                      ? <NoResultsError id="no-results-error" role="alert" element="p" like="label-1">{this.state.response.error}</NoResultsError>
                      : (
                        <>
                          <ScopeResults>
                            <SearchSuggestionLabel element="h1" like="heading-4">
                              Suggestions
                            </SearchSuggestionLabel>
                            <Link
                              href={{
                                pathname: '/shop',
                                query: this.getViewAllQueryParams()
                              }}
                              passHref
                            >
                              <SearchTerm
                                role="heading"
                                aria-level="2"
                                onClick={() => this.trackFullSearch('Suggestion Link')}
                              >
                                {this.getShownResultsLabel().toString()}
                              </SearchTerm>
                            </Link>
                            {
                              this.state.response.results?.product_suggestions?.map((scope) => (
                                <Link
                                  href={`/shop?w=${scope.product_slug}`}
                                  key={scope.product_slug}
                                  passHref
                                >
                                  <ScopeAnchor
                                    onClick={() => {
                                      this.trackScopeClick(scope);
                                      this.updateSearchTerm(scope.title);
                                    }}
                                  >
                                      in
                                    {' '}
                                    <span
                                        // eslint-disable-next-line react/no-danger
                                      dangerouslySetInnerHTML={{
                                        __html: highlightMatchingText(
                                          this.state.term, scope.title
                                        )
                                      }}
                                    />
                                  </ScopeAnchor>
                                </Link>
                              ))
                              }
                            {
                                this.state.response.errors
                                  && <BlueLabel element="p" like="paragraph-4">No suggestions available for this search.</BlueLabel>
                            }
                            {this.props.globalSearchHint?.map((h) => (
                              <Link
                                href={`/shop?w=${h?.suggestion?.toLowerCase?.()}`}
                                key={h?.suggestion}
                                passHref
                              >
                                <ScopeAnchor
                                  onClick={() => SearchSuggestion.trackHintClick(h)}
                                >
                                  <span
                                    // eslint-disable-next-line react/no-danger
                                    dangerouslySetInnerHTML={{
                                      __html: highlightMatchingText(
                                        this.state.term, h?.suggestion
                                      )
                                    }}
                                  />
                                </ScopeAnchor>
                              </Link>
                            ))}
                          </ScopeResults>
                          <ProductGrid>
                            <ProductsLabel element="h1" like="heading-4">
                              Products
                            </ProductsLabel>

                            <ProductGridLabel element="h2" like="label-2">
                              Showing results for
                              {' '}
                              <b>{this.getShownResultsLabel()}</b>
                            </ProductGridLabel>
                            {
                              this.state.products.length
                                ? (
                                  this.state.products.map(
                                    (product, i) => (
                                      <ProductCard
                                        key={`global-search-${product.maisonette_product_id}`}
                                        product={product}
                                        showQuickShop={false}
                                        showWishlist={false}
                                        module="quick-search"
                                        index={i + 1}
                                      />
                                    )
                                  )
                                ) : null
                            }
                          </ProductGrid>

                          <Link
                            href={{
                              pathname: '/shop',
                              query: this.getViewAllQueryParams()
                            }}
                            passHref
                          >
                            <ViewAllResults
                              data-test-id="search_view_all_results"
                              isLink
                              onClick={() => this.trackFullSearch('View All Button')}
                            >
                              {`View All (${this.state.count})`}
                            </ViewAllResults>
                          </Link>
                        </>
                      )
                  }
                </>
              )
          }
        </SuggestionWrapper>
      </SuggestionContainer>
    );
  }
}

SearchSuggestion.defaultProps = {
  activeMini: null,
  globalSearchTerm: '',
  isGlobalSearchActive: false,
  petites: [],
  updateSearchHint: () => { },
  updateSearchTerm: () => { },
  updateSearchResultsCorrected: () => { },
  updateSearchResultsCount: () => { },
  toggleGlobalSearchVisibility: () => { },
  globalSearchHint: []
};

SearchSuggestion.propTypes = {
  activeMini: PropTypes.number,
  globalSearchTerm: PropTypes.string,
  petites: PropTypes.object,
  updateSearchHint: PropTypes.func,
  updateSearchTerm: PropTypes.func,
  updateSearchResultsCorrected: PropTypes.func,
  updateSearchResultsCount: PropTypes.func,
  isGlobalSearchActive: PropTypes.bool,
  toggleGlobalSearchVisibility: PropTypes.func,
  globalSearchHint: PropTypes.array
};

const ConnectedSearchSuggestion = withSearchActions(SearchSuggestion);

ConnectedSearchSuggestion.displayName = 'SearchSuggestion';

export default memo(ConnectedSearchSuggestion);
