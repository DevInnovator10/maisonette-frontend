// This is a Page similar to Wishlist, however we don't have a user authenticated,
// a title and AccountNavigation. It's just a landing page.
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Head from 'next/head';
import styled from '@emotion/styled';
import {
    SearchBox as AlgoliaSearch,
  InstantSearch,
  Configure
} from 'react-instantsearch-dom';
import { Page, Content } from '../../../theme/page';
import Button from '../../../atoms/button';
import Typography from '../../../atoms/typography';

import ResultsList from '../../../organisms/algolia-plp/results-list';
import searchClient from '../../../utils/algolia';
import { logAmplitude } from '../../../utils/amplitude';

const SearchBox = styled(AlgoliaSearch)(() => ({ display: 'none' }));

const NoWishedProducts = styled.div`
  text-align: center;
`;

const NoItemsTitle = styled(Typography)`
  color: ${({ theme }) => theme.color.brand};
  text-align: center;
  margin-bottom: 2rem;
  margin: 3rem 0 1rem 0;
`;

const SharedWishlistPage = ({ wishlistParam, path }) => {
  const scrollY = useSelector((state) => state.products.scrollY);
  // if there is the wishlistParam (wl) it will be decode from base64 and URIcomponent,
  // and then creates an array to be used in facet filters from algolia with their respective
  // objectID's decodeds, in another case return an empty array.
  const algoliaFacetFilters = wishlistParam ? global.window
    ?.decodeURIComponent(global.window?.atob(wishlistParam))
    .split(',')
    .map((id) => `objectID:${id}`) : [];
  // it's the total of products shared measuring by algoliaFacetFilters array result
  const totalSharedProducts = algoliaFacetFilters?.length;

  useEffect(() => {
    global.window.scrollTo(0, scrollY || 0);
  }, [scrollY]);

  useEffect(() => {
    // TODO: Review this in the future when we have pagination, or different paths
    logAmplitude('Viewed Shared Wishlist', {
      url: `${process.env.NEXT_PUBLIC_CLIENT_HOST}${path}`,
      totalWishlistSize: totalSharedProducts
    });
  }, [path, totalSharedProducts]);

  const BodyContent = () => {
    // in case of we don't have any params or products shareds with "wl" param,
    // the start shopping page will be returned
    if (!wishlistParam) {
      return (
        <Content layout="large">
          <NoWishedProducts>
            <NoItemsTitle element="h2" like="heading-4">
              Looks like you haven&apos;t added anything to your wishlist yet!
            </NoItemsTitle>
            <Button href="/" isLink outline>
              Start Shopping
            </Button>
          </NoWishedProducts>
        </Content>
      );
    }
    return (
      <Content
        layout="large"
        css={{ paddingLeft: '0rem', paddingRight: '0rem' }}
      >
        <InstantSearch
          searchClient={searchClient}
          indexName={process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX}
        >
          {/* TODO Make this a real search page with infinite scroll, same as plp */}
          <Configure
            hitsPerPage={9999}
            facetFilters={[algoliaFacetFilters]}
            clickAnalytics
          />
          <SearchBox searchAsYouType={false} />

          <ResultsList />

        </InstantSearch>
      </Content>
    );
  };

  return (
    <Page id="maincontent">
      <Head>
        <title>Shared Wishlist</title>
      </Head>
      <BodyContent />
    </Page>
  );
};

SharedWishlistPage.defaultProps = {
  wishlistParam: null
};

SharedWishlistPage.propTypes = {
  wishlistParam: PropTypes.string,
  path: PropTypes.string.isRequired
};

export const getServerSideProps = (ctx) => {
  // path is the url resolved with paths and everything, just missing the domain,
  // so our complete url is the NEXT_PUBLIC_CLIENT_HOST + path
  const { query, resolvedUrl: path } = ctx;
  // ctx returns an object in query, so we can receive a lot of query params or nothing.
  // just the "wl" is important for us, so here we check if the query isn't empty and get the result
  // from "wl" if there is and pass it for the component as wishlistParam prop.
  const wishlistParam = Object.keys(query).length > 0 && query?.wl ? query.wl : null;
  return {
    props: {
      wishlistParam,
      path
    }
  };
};

export default SharedWishlistPage;
