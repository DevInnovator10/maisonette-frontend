import React from 'react';
import PropTypes from 'prop-types';
import {
  InstantSearch,
  Configure,
  connectRefinementList
} from 'react-instantsearch-dom';
import { Content } from '../../theme/page';
import InfiniteHitsArticles from './article-results';
import searchClient from '../../utils/algolia';

const VirtualRefinementList = connectRefinementList(() => null);

const AlgoliaArticles = (props) => {
  const createRefinementAttributes = () => {
    const hierarchicalMenu = props.searchState?.hierarchicalMenu?.['categories_slug.lvl0'];
    const lvl = hierarchicalMenu?.split(' > ')?.length - 1;

    return (

      <VirtualRefinementList
        attribute={`categories_slug.lvl${lvl}`}
        defaultRefinement={hierarchicalMenu}
      />
    );
  };

  return (
    <InstantSearch
      searchClient={searchClient}
      resultsState={props.resultsState}
      searchState={props.searchState}
      indexName={props.indexName}
      createURL={props.createURL}
      {...props}
    >
      <Configure
        // filters out the articles in the Le Scoop module
        // aka featured stories
        facets={['objectID']}
        facetsExcludes={{
          objectID: props.featuredStoriesIds
        }}
        hitsPerPage={10} // 10 articles for page layout
        filters="published:true"
      />

      {createRefinementAttributes()}

      <Content pillarPadding>
        <InfiniteHitsArticles {...props} />
      </Content>
    </InstantSearch>
  );
};

AlgoliaArticles.defaultProps = {
  createURL: () => {},
  category: null,
  subcategory: null,
  featuredStoriesIds: [],
  parentPage: null
};

AlgoliaArticles.propTypes = {
  searchClient: PropTypes.object.isRequired,
  resultsState: PropTypes.object.isRequired,
  searchState: PropTypes.object.isRequired,
  createURL: PropTypes.func,
  indexName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  page: PropTypes.object.isRequired,
  modules: PropTypes.array.isRequired,
  featuredStoriesIds: PropTypes.array,
  category: PropTypes.object,
  subcategory: PropTypes.object,
  parentPage: PropTypes.string
};

export default AlgoliaArticles;
