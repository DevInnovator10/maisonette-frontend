import React, { Fragment, useState } from 'react';
import styled from '@emotion/styled';

import { trackProductClick } from '../../utils/tracking';

import ProductCard from '../product-card';
import QuickShop from '../product-quick-shop';
import Ruler from '../../atoms/ruler';

const Grid = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: ${(props) => props.theme.width.small};
  margin: 0 auto;
  position: relative;

  > article {
    flex-basis: 50%;
    padding: 0 .7rem;
  }

  img {
    display: block;
    max-width: 100%;
  }

  & ~ & {
    margin-top: 5rem;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    max-width: ${(props) => props.theme.width.large};

    > article {
      flex-basis: 25%;
    }
  }
`;

const Product = (props) => {
  if (!props.data?.product_elements) {
    return null;
  }

  const [quickshop, setQuickshop] = useState(null);

  const productElements = Object.keys(props.data.product_elements)
    .sort((a, b) => a - b)
    .map((key) => Object.values(props.data.product_elements[key])[0])
    .filter((x) => x);

  const getProductSlug = (product) => {
    // for Algolia products
    if (product.slug) return product.slug;

    // for CMS products that contain static SLI data
    if (product.product_slug) return product.product_slug;

    // for CMS products that contain SLI data
    // but are missing "product_slug" property
    if (product.url) return product.url.split('/')[product.url.split('/').length - 1];

    return '/';
  };

  return productElements.length > 0 && (
    <>
      <Grid>
        {
          productElements.map((productData, i) => {
            const productSlug = getProductSlug(productData);

            return (
              <Fragment key={productData}>
                <ProductCard
                  product={productData}
                  index={i + 1}
                  module="product"
                  onClick={(e) => {
                    trackProductClick({ productData });
                    const isQuickShop = e.target.dataset.id === 'quickshop';
                    const isWishlist = e.target.dataset.id === 'wishlist';

                    if (isQuickShop || isWishlist) {
                      e.preventDefault();
                    }

                  }}
                  onQuickshopClick={() => setQuickshop(productSlug)}
                />

                {
                quickshop === productSlug && (
                  <QuickShop
                    inProductModule
                    slug={productSlug}
                    quickShopIndex={i + 1}
                    onQuickshopClose={() => setQuickshop(null)}
                  />
                )
              }
              </Fragment>
            );
          })
        }
      </Grid>
      {props.data.product_hr && <Ruler />}
    </>
  );
};

Product.whyDidYouRender = true;

export default Product;
