import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Link from 'next/link';
import {
  Index, connectStateResults, connectHitInsights
} from 'react-instantsearch-dom';

// Components
import Section from '../algolia-section';
import Skeleton from '../algolia-skeleton';
import Button from '../../atoms/button';
import Price from '../algolia-plp/product-card-price';

// Context
import { useSearch } from '../../utils/context/search-provider';
import { useRecent } from '../../utils/context/recent-provider';

// Utils
import { logAmplitude } from '../../utils/amplitude';
import { aa } from '../../utils/algolia';
import isMobile from '../../utils/isMobile';
import isTablet from '../../utils/isTablet';

const CardPrice = styled(Price)`
  margin-top: 3px;
  font-size: 11px;
`;

const ScrollContainer = styled.div`
  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    overflow: auto;
    max-height: 78vh;
  }
`;

const ResultsContainer = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  '> div:nth-of-type(-n+2)': { marginBottom: '2rem' }, // first two elements
  '> a': {
    display: 'flex',
    flexBasis: 'calc(50% - 1rem)',
    justifyContent: 'center',
    marginBottom: '2rem',
    textDecoration: 'none',
    padding: '0.5rem',
    [`@media screen and (min-width: ${theme.breakpoint.small})`]: {
      flexBasis: 'calc(25% - 1rem)'
    }
  }
}));

const sharedStyles = (props) => ({
  fontSize: props.theme.modularScale.small,
  textAlign: 'center',
  lineHeight: 1.2
});

const ProductCard = styled.article((props) => ({
  alignItems: 'center',
  color: props.theme.color.brand,
  display: 'flex',
  flexDirection: 'column',

  h3: {
    ...sharedStyles(props)
  },
  h4: {
    ...sharedStyles(props),
    color: props.theme.color.brandLightBlue,
    marginBottom: '0.5rem',
    marginTop: '0.5rem'
  }
}));

const ViewAllButton = styled(Button)(() => ({
  display: 'flex',
  margin: '0 auto',
  width: 'fit-content'
}));

const Hit = ({ hit, insights }) => {
  const { close, updateAlgoliaSearchParams } = useSearch();

  const handleClick = (params) => {
    const {
      insights: hitInsights,
      i,
      a,
      searchParams
    } = params;
    hitInsights('clickedObjectIDsAfterSearch', i);

    const eventProps = {
      product: {
        ...hit,
        category: hit.product_type?.[0],
        sku: a.sku
      },
      // eslint-disable-next-line no-underscore-dangle
      index: hit.__position,
      module: 'quick-search'
    };

    logAmplitude('Clicked Product Card', eventProps);

    updateAlgoliaSearchParams(searchParams);
    close();
  };

  return (
    <Link href={`/product/${hit.slug}`} passHref>
      <a>
        <ProductCard onClick={() => {
          const params = {
            insights,
            i: {
              eventName: 'Suggested Product Clicked'
            },
            a: {
              sku: hit.slug
            },
            searchParams: {
              // eslint-disable-next-line no-underscore-dangle
              queryID: hit.__queryID,
              objectID: hit.objectID
            }
          };
          handleClick(params);
        }}
        >
          <img src={hit.image} width={130} height={130} alt={hit.title} />
          {hit.brand && <h4>{hit.brand}</h4> }
          <h3>{hit.title}</h3>
          <CardPrice hit={hit} />
        </ProductCard>
      </a>
    </Link>
  );
};

Hit.defaultProps = {
  hit: {},
  insights: {}
};

Hit.propTypes = {
  hit: PropTypes.object,
  insights: PropTypes.object
};

const SearchResults = connectStateResults((props) => {
  const { addItem } = useRecent();

  const HitWithInsights = connectHitInsights(aa)(Hit);
  const hasResults = props.searchResults && props.searchResults.nbHits !== 0;
  const nbHits = props.searchResults && props.searchResults.nbHits;

  const nbResults = isMobile() || isTablet() ? 4 : 8;

  const results = props.searchResults ? props.searchResults.hits.slice(0, nbResults) : [];

  if (!props.searchState.query) return null;

  if (props.searching) {
    return (
      <Section title="Top Product Search Results" term={props.searchState.query} hasCenteredTitle>
        <ResultsContainer>
          { [1, 2, 3, 4].map((i) => <Skeleton key={`product-skeleton-${i}`} />) }
        </ResultsContainer>
      </Section>
    );
  }

  const handleOnClick = () => {
    addItem(props.searchState.query);
    logAmplitude('Clicked Search Results View All', {
      totalResults: nbHits
    });
  };

  if (!hasResults) return null;

  return (
    <Section title="Top Product Search Results" term={props.q} hasCenteredTitle {...props}>
      <ScrollContainer>
        <ResultsContainer>
          { results.map((hit, index) => {
            const modifiedHit = {
              ...hit,
              __queryID: props.searchResults.queryID,
              __position: index + 1
            };
            return (
              <HitWithInsights
                key={hit.objectID}
                hit={modifiedHit}
              />
            );
          })}
        </ResultsContainer>
        {
          hasResults && (
            <ViewAllButton href={`/shop?w=${props.q}`} text={`See All Results (${nbHits})`} onClick={handleOnClick} outline isLink />
          )
        }
      </ScrollContainer>
    </Section>
  );
});

SearchResults.defaultProps = {
  searchState: null,
  searchResults: null,
  allSearchResults: null,
  error: null,
  searching: false,
  searchingForFacetValues: false,
  isSearchStalled: false
};

// Algolia props for the component given to connectStateResults()
// via: https://www.algolia.com/doc/api-reference/widgets/state-results/react/#provided-props
SearchResults.propTypes = {
  searchState: PropTypes.object,
  searchResults: PropTypes.object,
  allSearchResults: PropTypes.object,
  error: PropTypes.object,
  searching: PropTypes.bool,
  searchingForFacetValues: PropTypes.bool,
  isSearchStalled: PropTypes.bool
};

const SearchResultsWrapper = (props) => (
  <Index indexName={process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX}>
    <SearchResults {...props} />
  </Index>
);

export default SearchResultsWrapper;
