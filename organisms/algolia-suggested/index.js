import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Link from 'next/link';
import {
    Index, Highlight, connectStateResults, connectHitInsights
} from 'react-instantsearch-dom';

// Components
import Section from '../algolia-section';
import List, { ListItem } from '../algolia-list';

// Context
import { useSearch } from '../../utils/context/search-provider';

// Utils
import { logAmplitude } from '../../utils/amplitude';
import { aa } from '../../utils/algolia';

// Assets
const MagnifyingGlass = (props) => (
  <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M11.9967 11.6695L8.49778 8.34618C9.33211 7.48201 9.79454 6.36544 9.79757 5.20771C9.8196 3.98486 9.31698 2.80359 8.39937 1.92164C7.48177 1.03969 6.22366 0.528641 4.89954 0.5C3.57528 0.528444 2.31696 1.0394 1.39918 1.92138C0.481399 2.80335 -0.0213326 3.98473 0.000694468 5.20771C-0.0213326 6.43069 0.481399 7.61207 1.39918 8.49404C2.31696 9.37601 3.57528 9.88698 4.89954 9.91542C5.857 9.91148 6.79333 9.65518 7.59842 9.17664L11.0974 12.5L12 11.6665L11.9967 11.6695ZM4.89872 8.71443C3.90794 8.69114 2.96622 8.31135 2.27438 7.65603C1.58255 7.00072 1.19534 6.12175 1.19534 5.20657C1.19534 4.29139 1.58255 3.41243 2.27438 2.75711C2.96622 2.1018 3.90794 1.722 4.89872 1.69871C5.89081 1.71702 6.8352 2.09532 7.5275 2.75175C8.21981 3.40818 8.60434 4.28994 8.59789 5.20619C8.60957 5.66209 8.52264 6.11555 8.34221 6.54004C8.16177 6.96453 7.89144 7.35152 7.54704 7.67835C7.20265 8.00519 6.7911 8.2653 6.33651 8.44346C5.88191 8.62163 5.39339 8.71426 4.89954 8.71595L4.89872 8.71443Z" fill="#9CB1DC" />
  </svg>
);

const Arrow = (props) => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M9.5 9.5L1 1M1 1V5M1 1H5" stroke="#3150A2" />
  </svg>

);

const MagnifyingGlassIcon = styled(MagnifyingGlass)(() => ({
  marginRight: '1rem'
}));

const ArrowButton = styled.button(() => ({
  alignItems: 'center',
  background: 'none',
  border: 0,
  cursor: 'pointer',
  display: 'flex',
  height: '3rem',
  justifyContent: 'center',
  minWidth: '3rem',
  outline: 0,
  padding: 0,
  width: '3rem'
}));

const SuggestedItem = styled(ListItem)(() => ({
  '.ais-Highlight': {

    span: { color: '#4E68AF' },
    strong: { color: '#112E7D' }
  }
}));

const SuggestedList = styled(List)(() => ({
  marginBottom: '-1rem'
}));

const RefineButton = (props) => {
  const { updateQuery } = useSearch();

  const handleOnClick = (e) => {
    const input = global.document.querySelector('#algolia-search');
    updateQuery(props.query);
    input.focus();
    e.stopPropagation();
  };

  return (
    <ArrowButton type="button" onClick={handleOnClick} {...props}>
      <Arrow />
    </ArrowButton>
  );
};

RefineButton.defaultProps = {
  refine: () => {}
};

RefineButton.propTypes = {
  refine: PropTypes.func,
  query: PropTypes.string.isRequired
};

const Hit = ({ hit, insights }) => {
  const { close, updateQuery } = useSearch();

  const handleClick = (params) => {
    const { insights: hitInsights, i, a } = params;
    hitInsights('clickedObjectIDsAfterSearch', i);
    logAmplitude('Used Search Suggestion', a);
    updateQuery(a.sku);
    close();
  };

  return (
    <SuggestedItem
      key={hit.objectID}
      onClick={() => {
        const params = {
          insights,
          i: {
            eventName: 'Suggested Search Clicked'
          },
          a: {
            sku: hit.query
          }
        };
        handleClick(params);
      }}
    >
      <Link href={`/shop?w=${hit.query}`} passHref>
        <a>
          <MagnifyingGlassIcon />
          <Highlight hit={hit} attribute="query" tagName="strong" />
        </a>
      </Link>

      <RefineButton query={hit.query} />
    </SuggestedItem>
  );
};

Hit.defaultProps = {
  hit: {},
  insights: () => {}
};

Hit.propTypes = {
  hit: PropTypes.object,
  insights: PropTypes.func
};

const Suggested = connectStateResults((props) => {
  const { searchState, searchResults } = props;
  const HitWithInsights = connectHitInsights(aa)(Hit);
  const hasResults = searchResults?.nbHits !== 0;

  if (!searchState.query || !hasResults) return null;

  const results = searchResults?.hits.slice(0, 4) ?? [];

  return (
    <Section title="Suggested" {...props}>
      <SuggestedList>
        {
          results.map((hit, index) => {
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
          })
        }
      </SuggestedList>
    </Section>

  );
});

const SuggestedResults = () => (
  <Index indexName={process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_QUERY_SUGGESTIONS_INDEX}>
    <Suggested />
  </Index>
);

export default connectStateResults(SuggestedResults);
