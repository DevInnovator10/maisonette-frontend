import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import * as Sentry from '@sentry/node';

import {
  FrequentlyBoughtTogether,
  RelatedProducts
} from '@algolia/recommend-react';
import recommend from '@algolia/recommend';

// algolia search client
import searchClient from '../../utils/algolia';

import {
  createRecentlyViewed,
  getRecentlyViewed,
  getProduct as fetchProduct
} from '../api';

import { generateMeta, generateBreadcrumbSeoSchema } from '../../utils/meta';
import { Page, Content } from '../../theme/page';
import { trackPageType, trackProductView } from '../../utils/tracking';
import getCookie from '../../utils/getCookie';
import hasError from '../../utils/hasError';
import SCOPE_TYPES from '../../utils/sentryScopeTypes';
import getCanonicalUrl from '../../utils/getCanonicalUrl';

import { Skeleton, SkeletonWrapper } from '../../atoms/skeleton';
import ErrorPage from '../_error';
import ProductCardCarousel from '../../organs/product-card-carousel';
import ProductCardCarouselWrapper from '../../organs/product-algolia-card-carousel';
import ProductImageGallery from '../../tissues/product-image-gallery';
import ProductCategoryLinks from '../../molecules/product-detail-category-links';
import ProductDetailsRevamp from '../../organs/pdp-details-new';
import ProductDetailScrollToTop from '../../molecules/product-detail-scroll-to-top';
import BreadCrumbsRevamp from '../../molecules/breadcrumbs-new';

// TODO: remove this and pdpVariants cookie once dynamic data is ready
// import newProductData from './new_pdp_view.json';

// Context
import { useProduct } from '../../utils/context/product-provider';

const MobileBreadcrumbSkeletonWrapper = styled(SkeletonWrapper)`
  @media (max-width: ${(props) => props.theme.breakpoint.medium}) {
    grid-area: breadcrumbs;
  
    ${Skeleton} {
      height: 5rem;
    }
  }
`;

const DetailsSkeletonWrapper = styled(SkeletonWrapper)`
  grid-area: product-information;
`;

const CarouselSkeletonWrapper = styled(SkeletonWrapper)`
display: flex;
  grid-area: product-carousel;

  ${Skeleton}::before {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`;

const MobileBreadcrumbSkeletonRevamp = () => (
  <MobileBreadcrumbSkeletonWrapper>
    <Skeleton />
  </MobileBreadcrumbSkeletonWrapper>
);

const DetailsSkeletonRevamp = () => (
  <DetailsSkeletonWrapper>
    {/* Breadcrumbs */}
    <Skeleton css={{ height: '5rem', marginBottom: '3rem' }} />

    {/* Product Header */}
    <Skeleton css={{ height: '30rem', marginBottom: '3rem' }} />

    {/* Product Options */}
    <Skeleton css={{ height: '45rem', marginBottom: '3rem' }} />

    {/* Product Description */}
    <Skeleton css={{ height: '40rem', marginBottom: '3rem' }} />

    {/* Product Accordian */}
    <Skeleton css={{ height: '25rem', marginBottom: '3rem' }} />
  </DetailsSkeletonWrapper>
);

const CarouselSkeletonRevamp = () => (
  <CarouselSkeletonWrapper>
    <Skeleton />
  </CarouselSkeletonWrapper>
);

const ProductRevamp = styled.div`
  display: grid;
  grid-gap: 3rem;
  grid-template-areas: 'breadcrumbs' 'product-carousel' 'product-information';
  grid-template-columns: minmax(0, 1fr);
  margin-bottom: 3rem;

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    grid-gap: 5rem;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 'product-carousel product-information';
  }
`;

const getMetaTitle = (name, brand = '', category = '') => {
  let title = name;

  if (brand) {
    title += ` - ${brand}`;
    if (category) title += ` ${category}`;
  } else if (category) {
    title += ` - ${category}`;
  }

  title += ' | Maisonette';

  return title;
};

const getMetaDescription = (name, brand = '', category = '') => {
  let description = `Discover the ${name}`;

  if (brand) {
    description += ` from ${brand}.`;
    if (category) description += ` Shop ${category} and more from Maisonette's curated selection.`;
  } else if (category) {
    description += `. Shop ${category} and more from Maisonette's curated selection.`;
  }

  return description;
};

const getMetaDetails = (product) => {
  const { name, brand = '', breadcrumb_taxons = [] } = product;
  const category = breadcrumb_taxons[breadcrumb_taxons?.length - 1]?.name ?? null;

  return {
    title: getMetaTitle(name, brand, category),
    description: getMetaDescription(name, brand, category)
  };
};

const ProductDetailPage = (props) => {
  const index = searchClient.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX);
  const router = useRouter();
  const productMeta = getMetaDetails(props.product);

  const getAvailability = (variantsArray) => {
    if (variantsArray.length <= 0) return 'https://schema.org/OutOfStock';

    return variantsArray.some(({ in_stock = false }) => in_stock)
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';
  };

  const getPrice = (variantsArray) => {
    let price = 0;

    if (!variantsArray.length) return price;

    for (let i = 0; i <= variantsArray.length - 1; i++) {
      const variant = variantsArray[i];
      if (variant.price) {
        price = variant.price;
        break;
      }
    }

    if (price) {
      const [whole, fraction] = price.toString().split('.');
      if (+fraction === 0) return whole;
      return price;
    }

    return price;
  };

  const meta = {
    key: 'product',
    title: productMeta.title,
    description: productMeta.description,
    og: {
      description: productMeta.description,
      image: props.product.master?.images?.length > 0
        ? props.product.master?.images[0]?.large_url ?? null
        : null,
      title: productMeta.title,
      url: `${process.env.NEXT_PUBLIC_CLIENT_HOST}${router?.asPath}`
    },
    twitter: {
      description: productMeta.description,
      image: props.product.master?.images?.length > 0
        ? props.product.master?.images[0]?.large_url ?? null
        : null,
      title: productMeta.title
    }
  };

  const createNewScript = (variantObj, colorVariantsArray) => {
    // for initial render and default script data
    const newScriptData = {
      image: `${props?.product?.master?.images[0]?.large_url}`,
      description: `${props?.product?.description}`,
      price: `${getPrice(props.product?.variants) ?? props?.product?.master?.price}`,
      availability: `${getAvailability(props.product?.variants)}`
    };

    // if the variantObj is truthy,
    // this means the user changed the color
    if (variantObj) {
      newScriptData.image = `${variantObj.images.find((image) => (image.position === 1))?.large_url
        ?? variantObj.images[0].large_url}`;
      newScriptData.description = `${variantObj.description ?? newScriptData.description}`;
      newScriptData.price = `${colorVariantsArray.length ? getPrice(colorVariantsArray) : newScriptData.price}`;
      newScriptData.availability = `${colorVariantsArray.length ? getAvailability(colorVariantsArray) : newScriptData.availability}`;
    }

    return {
      __html: `
        {
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": "${props.product.name}",
          "image": "${newScriptData.image}",
          "description": "${newScriptData.description}",
          "brand": "${props?.product?.brand}",
          "sku": "${props?.product?.master?.sku}",
          "offers": {
            "@type": "Offer",
            "url": "${process.env.NEXT_PUBLIC_CLIENT_HOST}/product/${props?.product?.slug}",
            "priceCurrency": "USD",
            "price": "${newScriptData.price}",
            "availability": "${newScriptData.availability}",
            "itemCondition": "https://schema.org/NewCondition"
          }
        }
      `
    };
  };

  // eslint-disable-next-line max-len
  const [currentScript, setCurrentScript] = useState(createNewScript(null, props.product?.variants));
  const [currentMeta, setCurrentMeta] = useState(meta);
  const [recentlyViewed, setRecentlyViewed] = useState(false);

  /**
   * get pdpVariants value from siteSpect
   * which is pulled out and replaced with static value for a while
   */

  const pdpVariants = false;
  const { state: { activeColor, activeColorVariants } } = useProduct();

  useEffect(() => {
    global.window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (pdpVariants && activeColor.length) {
      const { maisonette_variant_group_attributes: variant_attributes } = props.product;

      const validColor = variant_attributes.find((v) =>
        (v?.option_value?.name).toLowerCase() === activeColor);

      if (validColor) {
        setCurrentScript(createNewScript(validColor, activeColorVariants));

        if (validColor.images?.length) {
          const newMeta = currentMeta;

          const newImage = validColor.images.find((image) => (image.position === 1))?.large_url
            ?? validColor.images[0].large_url;

          newMeta.og.image = newImage;
          newMeta.twitter.image = newImage;

          setCurrentMeta(newMeta);
        }
      }
    }
  }, [activeColor]);

  const recommendClient = recommend(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
  );

  const setProductAsRecentlyViewed = async (variant_id) => {
    const session_id = getCookie('maisonette_session_token');

    await createRecentlyViewed({
      body: {
        recently_viewed: {
          session_id,
          variant_id
        }
      }
    });
  };

  const getRecentlyViewedProducts = () => {
    const session_id = getCookie('maisonette_session_token');

    getRecentlyViewed({ session_id })
      .then(async (res) => {
        if (hasError(res)) {
          setRecentlyViewed(false);
          return;
        }

        try {
          const ids = res
            // convert id to string as getObjects method accept string array
            .map((x) => x.variant_id.toString())
            // remove current product from ids
            .filter((id) => Number(id) !== props.product.master.id)
            .slice(0, 20);

          if (ids) {
            /**
             * getObjects lets you retrieve multiple objects from a specified index
             * For more details, please check: https://www.algolia.com/doc/api-reference/api-methods/get-objects
             */
            index.getObjects(ids).then(({ results }) => {
              // filter to remove the null record
              setRecentlyViewed(results.filter((result) => result));
            });
          }
        } catch (error) {
          setRecentlyViewed(false);
        }
      });
  };

  useEffect(() => {
    if (props.product && !hasError(props.product)) {
      // trackPageType is here to ensure that the GA page view event
      // happens before the product view event
      // TODO: Address these calls when updating the google analytics system
      trackPageType('Product Description Pages', router.asPath);
      trackProductView({ product: props.product });
      setProductAsRecentlyViewed(props.product.master.id);
      getRecentlyViewedProducts();
    }
  }, [props.product]);

  const getProductType = () => {
    const { classifications } = props.product;
    const [productType] = classifications.filter((c) => {
      const prettyName = c.taxon?.pretty_name;
      return prettyName.split('->')?.[0]?.trim() === 'Product Type';
    });
    return productType?.taxon?.name;
  };

  if (router?.isFallback) {
    return (
      <Page id="maincontent">
        <Content>
          <ProductRevamp>
            <MobileBreadcrumbSkeletonRevamp />
            <CarouselSkeletonRevamp />
            <DetailsSkeletonRevamp />
          </ProductRevamp>
        </Content>
      </Page>
    );
  }

  if (!props.product || hasError(props.product)) {
    return <ErrorPage statusCode={404} />;
  }

  const hasImages = props.product?.master && props.product?.master?.images;

  return (
    <div key={props.product.id}>
      <Head>
        {generateMeta(currentMeta)}

        <link key="canonical" rel="canonical" href={getCanonicalUrl(router)} />

        {generateBreadcrumbSeoSchema(props)}

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={currentScript}
        />
      </Head>

      <Page id="maincontent">
        <Content>
          <ProductRevamp>
            <BreadCrumbsRevamp breadcrumbs={props.product?.breadcrumb_taxons || []} />

            {
              hasImages && (
                <ProductImageGallery
                  product={props.product}
                  images={props.product?.master?.images}
                  name={props.product?.master?.name}
                  productType={getProductType()}
                />
              )
            }

            <ProductDetailsRevamp product={props.product} />
          </ProductRevamp>

          <RelatedProducts
            recommendClient={recommendClient}
            indexName={process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX}
            objectIDs={[`${props.product?.master?.id}`]}
            fallbackComponent={() => (
              <ProductCardCarouselWrapper
                brand={props.product?.brand}
                title="Related Products"
                id="related-products"
                trackFor="Related Products"
                productName={props.product?.name}
                productBreadcrumbs={props.product?.breadcrumb_taxons}
                productID={props.product?.id}
              />
            )}
            view={({ items }) => (
              <ProductCardCarousel
                title="Related Products"
                products={items}
                id="related-products"
                trackFor="Related Products"
                isInfinite
                pdpRecommendations
              />
            )}
                // eslint-disable-next-line react/no-children-prop
            children={
                  ({ View, Fallback, recommendations }) => (
                    recommendations.length
                      ? <View />
                      : <Fallback />
                  )
                }
          />

          <FrequentlyBoughtTogether
            recommendClient={recommendClient}
            indexName={process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX}
            objectIDs={[`${props.product?.master?.id}`]}
                // https://www.algolia.com/doc/ui-libraries/recommend/api-reference/recommend-react/FrequentlyBoughtTogether/#param-fallbackcomponent
            fallbackComponent={() => (
              <ProductCardCarouselWrapper
                brand={props.product?.brand}
                title="Also Bought With"
                id="also-bought-with"
                trackFor="Also Bought"
                productName={props.product?.name}
                productBreadcrumbs={props.product?.breadcrumb_taxons}
                productID={props.product?.id}
              />
            )}
            view={({ items }) => (
              <ProductCardCarousel
                title="Also Bought With"
                products={items}
                id="also-bought-with"
                trackFor="Also Bought"
                isInfinite
                pdpRecommendations
              />
            )}
                // eslint-disable-next-line react/no-children-prop
            children={
                  ({ View, Fallback, recommendations }) => (
                    recommendations.length
                      ? <View />
                      : <Fallback />
                  )
                }
          />

          {
            recentlyViewed && (
              <ProductCardCarousel
                title="Recently Viewed"
                products={recentlyViewed}
                id="recently-viewed"
                pdpRecommendations
                isInfinite
              />
            )
          }
        </Content>

        <ProductCategoryLinks />
        <ProductDetailScrollToTop />
      </Page>
    </div>
  );
};

export async function getServerSideProps({ params }) {
  const { slug } = params;
  // get cookie value by SiteSpect which is pulled out and replaced with false value for a while
  // const pdpRevamp = req.cookies.sitespect_pdpRevamp;
  const pdpRevamp = false;
  if (!pdpRevamp) {
    // redirect to old PDP if in control
    return {
      redirect: {
        destination: `/product/${slug}`,
        permanent: false
      }
    };
  }

  const getProduct = (id) => fetchProduct({
    uri: `/api/products/${id}`,
    scopes: [SCOPE_TYPES.SERVICES.SOLIDUS],
    id
  });

  // if there was an error fetching product
  // - return null for product,
  // - revalidation will try to fetch again on next attempt
  const product = await getProduct(slug)
    .catch((error) => {
      Sentry.withScope((scope) => {
        scope.setContext('slug', slug);
        scope.setFingerprint('/pages/product/[slug]::getServerSideProps');
        Sentry.captureException(error);
      });

      return null;
    });
  if (product && hasError(product)) return { notFound: true };

  return {
    // TODO comment this back after BE PDP variant work is completed:
    props: { product }
    // props: { product: newProductData }
  };
}

ProductDetailPage.defaultProps = {
  product: null
};

ProductDetailPage.propTypes = {
  product: PropTypes.object
};

export default ProductDetailPage;
