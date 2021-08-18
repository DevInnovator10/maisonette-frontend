import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import QuickShop from '../product-quick-shop';
import ProductCard from '../product-card';
import SectionHeading from '../../molecules/section-heading';
import { getPopularProducts } from '../../pages/api';
import { trackProductClick } from '../../utils/tracking';

const Heading = styled(SectionHeading)`
  margin-bottom: 3rem;
`;

const ProductsWrapper = styled.section`
  margin-top: 2rem;

  & ~ & {
    margin-top: 10rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-area: products;
  grid-gap: 1.5rem;
  grid-template-columns: repeat(2, 1fr);
  position: relative;

  img {
    display: block;
    max-width: 100%;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Loading = styled.div`
  animation: spin .5s infinite linear;
  border: 0.15rem solid ${(props) => props.theme.color.brand};
  border-radius: 290486px;
  border-right-color: transparent;
  border-top-color: transparent;
  content: '';
  display: block;
  height: 2rem;
  margin: 0 auto;
  width: 2rem;

  @keyframes spin {
    from { transform: rotate(0) }
    to { transform: rotate(359deg) }
  }
`;

const ProductGrid = (props) => {
  const [quickshop, setQuickshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(false);
  const [hasResults, setHasResults] = useState(true);

  const getCats = () => {
    const [category, filter] = props.filter.split(':');
    return category.match(/cat1|cat2|cat3/g) ? filter.split('_') : '';
  };

  useEffect(() => {
    getPopularProducts(...props.productsArgs).then((p) => {
      setProducts(p);
      setHasResults(!!p || false);
      setLoading(false);
    });
  }, [props.productsArgs]);

  return hasResults ? (
    <ProductsWrapper>
      {
        props.name
          ? (
            <Heading
              title={`Popular Products for ${props.name}`}
              dec="Shop All"
              href={{
                pathname: `/shop${getCats() ? `/${getCats().join('/')}` : ''}`,
                query: props.filter.match(/cat1|cat2|cat3/g) ? null : { w: props.term, af: props.filter }
              }}
              type="taxon"
            />
          )
          : <Heading title="Popular Products" dec="Shop All" href="/shop" type="taxon" />
      }

      <Grid>
        {
          products && products.map((product, i) => (
            <Fragment key={product.maisonette_product_id}>
              <ProductCard
                product={product}
                index={i + 1}
                onClick={(e) => {
                  trackProductClick({ product });
                  const isQuickShop = e.target.dataset.id === 'quickshop';
                  const isWishlist = e.target.dataset.id === 'wishlist';
                  if (isQuickShop || isWishlist) e.preventDefault();
                }}
                module="popular-products"
                onQuickshopClick={() => setQuickshop(product.maisonette_product_id)}
              />

              {
                quickshop === product.maisonette_product_id && (
                  <QuickShop
                    slug={product.url.split('/')[product.url.split('/').length - 1]}
                    quickShopIndex={i + 1}
                    onQuickshopClose={() => setQuickshop(null)}
                    inPopularProducts
                  />
                )
              }
            </Fragment>
          ))
        }
      </Grid>

      { loading ? <Loading /> : '' }
    </ProductsWrapper>
  ) : null;
};

ProductGrid.defaultProps = {
  productsArgs: [],
  name: null,
  filter: '',
  term: ''
};

ProductGrid.propTypes = {
  productsArgs: PropTypes.array,
  filter: PropTypes.string,
  name: PropTypes.string,
  term: PropTypes.string
};

export default ProductGrid;
