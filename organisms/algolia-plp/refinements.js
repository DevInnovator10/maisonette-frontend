import React from 'react';
import PropTypes from 'prop-types';

import { connectStateResults } from 'react-instantsearch-dom';
import RefinementsHeader from './refinements-header';
import RefinementsCurrent from './refinements-current';
import RefinementList from './refinements-list';
import RangeSlider from './range-slider';

import hyperlinkRules from './utils/hyperlinkRules/index';

const Refinements = ({
  isBrandRefined, searchState, isShop
}) => {
  /*
    the below values are returned to be used as checks
    to decide whether the filter items should be rendered
    as hyperlinks for SEO purposes. see ./utils/hyperlinkRules/index.js
    for more details.

      brandPageHyperlinkCheck: <boolean>
      categoryPageHyperlinkCheck: <func>
      itemsForHyperlinkCheck: <object> || <boolean>

    the rules the values are defined by are also dependent on the
    RefinementList's attribute, meaning these values will only be
    passed into RefinementLists that have the appropriate attribute.
    an attribute argument is passed in for cases where a category
    should only affect a certain attribute
  */
  const {
    brandPageHyperlinkCheck = false,
    categoryPageHyperlinkCheck = () => {},
    itemsForHyperlinkCheck = false
  } = hyperlinkRules({
    searchState, isBrandRefined, isShop
  });

  return (
    <section>
      <RefinementsHeader isBrandRefined={isBrandRefined} />

      <RefinementsCurrent isBrandRefined={isBrandRefined} />

      <RefinementList
        attribute="product_type"
        useHyperlinks={brandPageHyperlinkCheck}
        itemsForHyperlinkCheck={itemsForHyperlinkCheck}
      />

      <RefinementList
        attribute="gender"
        itemsForHyperlinkCheck={itemsForHyperlinkCheck}
      />

      <RefinementList
        attribute="variants.age_range"
        useHyperlinks={categoryPageHyperlinkCheck({ attribute: 'variants.age_range' })}
      />

      <RefinementList
        attribute="variants.shoe_sizes"
      />

      <span css={{ display: 'none' }}>
        {/* //TODO: remove span and defaultRefinement when clothing_sizes are properly tagged.
          hides button to select filter, but allows for existing filter in url. */}
        <RefinementList
          attribute="variants.clothing_sizes"
          defaultRefinement={searchState?.refinementList?.['variants.clothing_sizes'] || []}
        />
      </span>

      {!isBrandRefined && (
        <RefinementList
          attribute="brand"
          searchable
        />
      )}

      <RefinementList
        attribute="color"
        useHyperlinks={categoryPageHyperlinkCheck({ attribute: 'color' })}
      />

      <RangeSlider attribute="variants.maisonette_sale" />
    </section>
  );
};

Refinements.defaultProps = {
  isBrandRefined: false,
  isShop: false,
  searchState: {}
};

Refinements.propTypes = {
  isBrandRefined: PropTypes.bool,
  isShop: PropTypes.bool,
  searchState: PropTypes.object
};

export default connectStateResults(Refinements);
