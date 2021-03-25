import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {
  InstantSearch,
  connectStateResults,
  ToggleRefinement,
  Configure
} from 'react-instantsearch-dom';

import ProductCardCarousel from '../product-card-carousel';

import searchClient from '../../utils/algolia';

const HiddenToggleRefinement = styled(ToggleRefinement)`
  display: none !important;
`;

const AlgoliaProductCardCarousel = connectStateResults((props) => {
  /**
   * get pdpRevamp value from siteSpect
   * which is pulled out and replaced with static value for a while
   */
  const pdpRevamp = false;
  const hasResults = props.searchResults && props.searchResults.nbHits !== 0;
  const results = props.searchResults ? props.searchResults.hits : [];

  const filteredResults = results.filter((hit) => (
    // This is broken
    // TODO: Align backend on which solidus property is equivilant to the alogilia objectID
    (Number(hit.objectID) !== props.productID) && (hit.title !== props.productName)));

  if (!hasResults) return null;

  return (
    <>
      <ProductCardCarousel
        taxonProducts={false}
        title={props.title}
        products={filteredResults}
        id={props.id}
        trackFor={props.trackFor}
        isInfinite
        pdpRecommendations={pdpRevamp}
      />
    </>
  );
});

const ProductCardCarouselWrapper = ({
  title,
  id,
  trackFor,
  productName,
  productID,
  productBreadcrumbs,
  brand
}) => {
  const isRelatedProducts = title === 'Related Products';
  const isAlsoBoughtWith = title === 'Also Bought With';
  const isMoreFromBrand = title === 'More From This Brand';

  const index = isAlsoBoughtWith
    ? process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_FREQUENTLY_BOUGHT
    : process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX;

  const createValue = () => {
    if (isMoreFromBrand) return brand;

    if (productBreadcrumbs.length === 1) {
      return isRelatedProducts
        ? brand
        : productBreadcrumbs[0].name;
    }

    if (productBreadcrumbs.length >= 2) {
      return productBreadcrumbs.reduce((value, breadcrumb, i) => {
        if (i === 0) return breadcrumb.name;

        // if Also Bought With
        // then create a value that is 1 level
        // higher than the actual product
        if (!isRelatedProducts && i === productBreadcrumbs.length - 1) return value;
        return `${value} > ${breadcrumb.name}`;
      }, '');
    }

    return null;
  };

  const getAttribute = () => {
    if (isMoreFromBrand) return 'brand';

    if (productBreadcrumbs.length === 1) {
      return isRelatedProducts
        ? 'brand'
        : 'categories_slug.lvl0';
    }

    if (productBreadcrumbs.length >= 2) {
      return `categories_slug.lvl${productBreadcrumbs.length - (isRelatedProducts ? 1 : 2)}`;
    }

    return null;
  };

  const fallback = {
    attribute: getAttribute(),
    value: createValue()
  };

  // Because the filter section in the config component is a sql query, we need
  // to add an escape character before all double quotes otherwise it breaks
  const updatedProductName = productName.replace(/"/g, '\\"');

  return (
    <InstantSearch
      searchClient={searchClient}

      indexName={index}
    >
      {isMoreFromBrand && (
        // Logic specifically for "more from this brand" carousel
        // Configure was needed, because toggleRefinement can't be modified with multiple filters
        <Configure
          filters={`low_stock:false AND NOT title:"${updatedProductName}"`}
          // TODO: Add ranking and seasonality
        />
      )}

      <HiddenToggleRefinement
        // TODO: once Edits facet is backs
        // change this attributes to "Edits"
        // to populate Freq Bought Products
        attribute={fallback.attribute}
        value={fallback.value}
        label={''}
        defaultRefinement
      />

      <AlgoliaProductCardCarousel
        title={title}
        id={id}
        trackFor={trackFor}
        productID={productID}
        productName={productName}
      />
    </InstantSearch>
  );
};

ProductCardCarouselWrapper.defaultProps = {
  brand: '',
  title: '',
  id: '',
  trackFor: '',
  productName: '',
  productID: null,
  productBreadcrumbs: []
};

ProductCardCarouselWrapper.propTypes = {
  brand: PropTypes.string,
  title: PropTypes.string,
  id: PropTypes.string,
  trackFor: PropTypes.string,
  productName: PropTypes.string,
  productID: PropTypes.number,
  productBreadcrumbs: PropTypes.array
};

export default ProductCardCarouselWrapper;
