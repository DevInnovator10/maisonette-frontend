import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import styled from '@emotion/styled';

import * as helpers from '../../organisms/algolia-plp/utils/helpers';
import searchClient from '../../utils/algolia';

import Typography from '../../atoms/typography';

import Picture from '../../atoms/picture';
import Ruler from '../../atoms/ruler';

import TaxonProductsAlgolia from './algolia';

const Container = styled.section`
  padding: 0 ${(props) => props.theme.modularScale.small};
  width: 100%;

  a {
    display: inline;
  }
`;

const Title = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  text-align: center;
  a {
    font-family: inherit;
    text-decoration: none;
  }
`;

const Subtitle = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  font-family: ${(props) => props.theme.font.sans};
  letter-spacing: 0.2em;
  text-align: center;
  text-transform: uppercase;
`;

const TaxonIcon = styled(Picture)`
  width: 50px;
  height: 50px;
`;

const TaxonProducts = (props) => {
  const path = props.data?.taxon_products_path ?? '';
  // check if path starts with '/' if not add it for Algolia
  const algoliaPath = path.substring(0, 1) === '/' ? path : `/${path}`;
  const sState = helpers.pathToSearchState(algoliaPath);

  const DEFAULT_PROPS = {
    searchClient,
    indexName: process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX
  };

  const productLimit = parseInt(props.data?.taxon_products_limit, 10) ?? 4;

  return (
    <Container>
      <header>
        {props.data?.taxon_products_icon
          && (
            <TaxonIcon
              {...props.data.taxon_products_icon}
              alt={props.data?.taxon_products_icon_alt}
              circle
            />
          )}
        <Title element="h1" like="heading-4">
          {props.data.taxon_products_title_url ? (
            <Link href={props.data.taxon_products_title_url}>
              <a>
                {props.data.taxon_products_title}
              </a>
            </Link>
          ) : props.data.taxon_products_title}
        </Title>
        <Subtitle element="p" like="paragraph-4">
          {props.data.taxon_products_subtitle}
        </Subtitle>
      </header>
      <TaxonProductsAlgolia
        {...DEFAULT_PROPS}
        searchState={sState}
        createURL={(state) => helpers.createURL(state, props)}
        isSlider={props.data.taxon_products_is_slider}
        isAlgoliaPersonalizationEnabled={props.data.taxon_products_is_algolia_personalization}
        style={props.data.taxon_products_style ?? 'circle'}
        productLimit={productLimit}
      />
      {props.data?.taxon_products_hr && <Ruler />}
    </Container>
  );
};

TaxonProducts.propTypes = {
  data: PropTypes.object.isRequired
};

export default TaxonProducts;
