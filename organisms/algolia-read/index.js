import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Index, connectStateResults, connectHitInsights } from 'react-instantsearch-dom';
import { aa } from '../../utils/algolia';

// Components
import Section from '../algolia-section';
import List from '../algolia-list';

// Context

import { useSearch } from '../../utils/context/search-provider';

// Utils
import { logAmplitude } from '../../utils/amplitude';
import isMobile from '../../utils/isMobile';
import isTablet from '../../utils/isTablet';

// Helpers
const getImagePath = (payload) => {
  try {
    const [imageName, extension] = payload.imageName.split('.');
    return payload.raw
      ? `${process.env.NEXT_PUBLIC_ASSET_HOST}/${payload.uri}${imageName}.${extension}`
      : `${process.env.NEXT_PUBLIC_ASSET_HOST}/${payload.uri}${imageName}-small.${extension}`;
  } catch (error) {
    return null;
  }
};

const ArticleWrapper = styled.article(({ theme }) => ({
  border: '1px solid #E0E0E0',
  borderRadius: '0.5rem',
  overflow: 'hidden',
  a: {
    alignItems: 'center',
    display: 'flex',
    textDecoration: 'none'
  },
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    padding: '8px',
    borderRadius: '0'
  }
}));

const Details = styled.div((props) => ({
  color: props.theme.color.brand,
  flex: 1,
  lineHeight: 1.25,
  padding: '0 1.5rem'
}));

const ArticleList = styled(List)(({ theme }) => ({
  marginBottom: '-0.5rem',
  li: { a: { paddingBottom: 0 } },
  [`@media screen and (min-width: ${theme.breakpoint.small})`]: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: '-0.5rem',
    li: {
      display: 'flex',
      flexBasis: 'calc(50% - 1rem)',
      margin: '0.5rem',
      article: { width: '100%' }
    }
  },
  [`@media screen and (min-width: ${theme.breakpoint.large})`]: {
    flexDirection: 'column',
    gap: '8px'
  }
}));

const Article = (props) => {
  const { close } = useSearch();

  const handleClick = (params) => {
    const { i, a } = params;
    props.insights('clickedObjectIDsAfterSearch', i);
    logAmplitude('Clicked Search Content Recommendation', a);
    close();
  };

  return (
    <ArticleWrapper
      onClick={() => {
        const params = {
          i: {
            eventName: 'Suggested Article Clicked'
          },
          a: {
            url: props.url,
            title: props.title
          }
        };
        handleClick(params);
      }}
    >
      <Link
        href={props.url}
        passHref
      >
        <a>
          <img src={props.src} alt={props.title} width={80} height={80} />
          <Details>
            {props.title}
          </Details>
        </a>
      </Link>
    </ArticleWrapper>
  );
};

Article.defaultProps = {
  src: '/images/default.png'
};

Article.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  insights: PropTypes.func.isRequired
};

const Hit = ({ hit, insights }) => (
  <li key={hit.objectID}>
    <Article
      url={hit.url}
      title={hit.title}
      src={getImagePath(hit.image) || undefined}
      insights={insights}
    />
  </li>
);

Hit.defaultProps = {
  hit: {},
  insights: {}
};

Hit.propTypes = {
  hit: PropTypes.object,
  insights: PropTypes.object
};

const ContentResults = connectStateResults((props) => {
  const { searchState, searchResults } = props;
  const HitWithInsights = connectHitInsights(aa)(Hit);
  const results = searchResults?.hits.slice(0, 4) ?? [];
  if ((isMobile() && !searchState.query) || results.length === 0) return null;

  return (
    <Section title="Read" direction={isMobile() || isTablet() ? 'column' : 'row'} {...props}>
      <ArticleList>
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
      </ArticleList>
    </Section>
  );
});

const ReadSearches = (props) => (
  <Index indexName={process.env.NEXT_PUBLIC_ALGOLIA_CONTENTS_INDEX}>
    <ContentResults {...props} />
  </Index>
);

export default ReadSearches;
