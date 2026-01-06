import React, { Fragment, createElement } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import { useRouter } from 'next/router';
import getPLPCanonicalUrl from '../organisms/algolia-plp/utils/getPLPCanonicalUrl';
import { getBasePath } from './navigation';
import SLIHyphenMap from './SLIHyphenMap.json';
import getPLPMetadata from '../organisms/algolia-plp/utils/plpMetadata';
import formatString from './formatString';
import prettifySlug from './prettifySlug';

const DEFAULTS = {
  description: 'Your favorite children’s luxury brands and independent boutiques, all in one magical place. Shop Maisonette for the best in kids clothing, furniture, decor, or toys.',
  image: `${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette.jpg`,
  title: 'Maisonette - Online Shop For Children\'s Clothes, Furniture, Decor, Gifts | Maisonette'
};

export const getMetaImage = (props) => {
  if (props?.page?.socialImage?.uri) {
    const img = props.page.socialImage;

    if (img.types?.length > 0) {
      const type = img.types[img.types.length - 1];

      let src = `${process.env.NEXT_PUBLIC_ASSET_HOST}/${img.uri}${img.imageName.split('.')[0]}-large.${type}`;
      if (props?.preview) {
        src = `${process.env.NEXT_PUBLIC_ASSET_HOST}/${img.uri}${img.imageName}`;
      } else if (img.raw || !img.uri) {
        src = `${process.env.NEXT_PUBLIC_ASSET_HOST}/${img.uri}${img.imageName}`;
      }

      return src;
    }
  }

  return DEFAULTS.image;
};

export const meta = {
  title: DEFAULTS.title,
  description: DEFAULTS.description,
  og: {
    description: DEFAULTS.description,
    image: DEFAULTS.image,
    title: DEFAULTS.title,
    type: 'website',
    url: process.env.NEXT_PUBLIC_CLIENT_HOST
  },
  twitter: {
    card: 'summary_large_image',
    description: DEFAULTS.description,
    image: DEFAULTS.image,
    title: DEFAULTS.title
  }
};

export const generateMeta = (o = {}) => {
  const options = { ...meta, key: 'default', ...o };
  const children = [];

  /* HTML Meta Tags */
  children.push(createElement('title', { key: 'title' }, options.title));
  children.push(createElement('meta', { key: 'description', name: 'description', content: options.description }));
  if (options.viewport) children.push(createElement('meta', { key: 'viewport', name: 'viewport', content: options.viewport.content }));

  /* Facebook Meta Tags */
  Object.entries(options.og).forEach(([key, value]) => {
    if (value != null) children.push(createElement('meta', { key: `og-${key}`, property: `og:${key}`, content: value }));
    else children.push(createElement('meta', { key: `og-${key}`, property: `og:${key}`, content: meta.og[key] }));
  });

  /* Twitter Meta Tags */
  Object.entries(options.twitter).forEach(([key, value]) => {
    if (value != null) children.push(createElement('meta', { key: `twitter-${key}`, name: `twitter:${key}`, content: value }));
    else children.push(createElement('meta', { key: `twitter-${key}`, name: `twitter:${key}`, content: meta.twitter[key] }));
  });

  return createElement(Fragment, {}, [...children]);
};

const getBreadcrumbCats = (props) => {
  let crumbs;

  if (props?.product) {
    crumbs = props.product.breadcrumb_taxons;
  }

  if (props?.headers?.subHeaders) {
    // a plp will have subheaders that are not links on the page
    // use these for breadcrumbs
    crumbs = props.headers.subHeaders;

    if (props.trend || props.edit) {
      // a trend/edit plp will have subheaders we can use (set above), but we need to add the
      // trend/edit to position 1 in the breadcrumbs
      const name = props.trendName || props.editName;
      const baseCrumb = {
        name: formatString('capitalize', name)
      };

      crumbs = [baseCrumb, ...crumbs];
    }
  }

  return crumbs;
};

const hyphenateCrumbId = (crumb) => {
  const parts = crumb?.id?.split?.('_');
  const hyphenatedParts = parts?.map?.((part) => SLIHyphenMap[part] ?? part);
  const id = hyphenatedParts?.join('_') ?? crumb.id;
  return {
    ...crumb,
    id
  };
};

const createCrumbItem = (crumb, index, props) => {
  const cats = crumb.url?.split('/category/')[1];
  let path = getBasePath(props);
  if (crumb?.url) path = `/shop/${cats}`;
  if (!crumb?.url && crumb?.id) path = `${path}/${crumb.id.split('_').join('/')}`;

  const item = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${path}`;
  return ({
    '@type': 'ListItem',
    position: `${index + 1}`,
    name: `${crumb.name}`,
    item
  });
};

const generateBreadcrumbItems = (crumbs, props) => {
  const breadcrumbItems = crumbs?.reduce?.((acc, curr, index) => {
    const crumb = hyphenateCrumbId(curr);
    const item = createCrumbItem(crumb, index, props);
    acc.push(item);
    return acc;
  }, []);

  return breadcrumbItems?.length > 0 && JSON.stringify(breadcrumbItems || []);
};

export const generateBreadcrumbSeoSchema = (props) => {
  const crumbs = getBreadcrumbCats(props);
  const items = generateBreadcrumbItems(crumbs, props);

  return (
    items && (
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
            {
              "@context": "https://schema.org/",
              "@type": "BreadcrumbList",
              "itemListElement": ${items}
            }
          `
        }}
      />
    )
  );
};

const PLPMeta = (props) => {
  const router = useRouter();

  const getMetaData = () => {
    const hasNoResults = () => {
      if (!props.resultsState) return true;

      if (props.resultsState?.rawResults?.length) {
        return props.resultsState.rawResults[0].nbHits === 0;
      }

      return true;
    };

    const metaData = {
      shop: () => ({
        title: 'Shop | Maisonette',
        description: DEFAULTS.description,
        ...getPLPMetadata('shop', props)
      }),
      trend: () => ({
        title: `Shop ${prettifySlug(props.trend)} | Maisonette`,
        description: DEFAULTS.description,
        ...getPLPMetadata('trend', props)
      }),
      edit: () => ({
        title: `${prettifySlug(props.edit)} | Maisonette`,
        description: DEFAULTS.description,
        ...getPLPMetadata('edit', props)
      })
    };

    if (hasNoResults()) {
      const pageTypes = ['brand', 'edit', 'trend'];
      const pageType = pageTypes.find((page) => props[page]) ?? 'shop';
      const noResultsMeta = pageType !== 'shop'
        ? getPLPMetadata(pageType, props)
        : metaData.shop();

      if (props.searchState?.query) {
        const title = `No results for '${props.searchState?.query}' | Maisonette`;

        return generateMeta({
          key: 'no-results',
          title,
          facebook: { title },
          twitter: { title }
        });
      }

      const noResultsTitle = 'No results | Maisonette';
      if (noResultsMeta && pageType === 'shop') noResultsMeta.title = noResultsTitle;

      const title = noResultsMeta ? noResultsMeta.title : noResultsTitle;
      const description = noResultsMeta
        ? noResultsMeta.description
        : DEFAULTS.description;

      return noResultsMeta ? generateMeta({
        key: pageType,
        title: noResultsMeta.title,
        description,
        og: {
          title: noResultsMeta.title,
          // TODO: confirm we want to use the 1st product's image
          // image: props.results?.[0]?.image,
          url: global.window?.location,
          description
        },
        twitter: {
          title: noResultsMeta.title,
          // TODO: confirm we want to use the 1st product's image
          // image: props.results?.[0]?.image,
          description
        }
      }) : generateMeta({
        key: 'no-results', title, facebook: { title }, twitter: { title }
      });
    }

    if (props.searchState?.query) {
      return generateMeta({
        key: 'search-results',
        title: `Search results for ${props.searchState.query} | Maisonette`,
        facebook: { title: `Search results for ${props.searchState.query} | Maisonette` },
        twitter: { title: `Search results for ${props.searchState.query} | Maisonette` }
      });
    }

    if (props.brand) {
      const brandMetaData = getPLPMetadata('brand', props);

      return generateMeta({
        key: 'brands',
        title: brandMetaData.title,
        description: brandMetaData.description,
        og: {
          description: brandMetaData.description,
          image: props.brand.icon ?? `${process.env.NEXT_PUBLIC_ASSET_HOST}/images/default_taxon.jpg`,
          title: brandMetaData.title,
          url: global.window?.location
        },
        twitter: {
          description: brandMetaData.description,
          image: props.brand.icon ?? `${process.env.NEXT_PUBLIC_ASSET_HOST}/images/default_taxon.jpg`,
          title: brandMetaData.title
        }
      });
    }

    if (props.edit) {
      const editMetaData = metaData.edit();
      return generateMeta({
        key: 'edit',
        title: editMetaData.title,
        description: editMetaData.description,
        og: {
          title: editMetaData.title,
          // TODO: confirm we want to use the 1st product's image
          // image: props.results?.[0]?.image,
          url: global.window?.location,
          description: editMetaData.description
        },
        twitter: {
          title: editMetaData.title,
          // TODO: confirm we want to use the 1st product's image
          // image: props.results?.[0]?.image,
          description: editMetaData.description
        }
      });
    }

    if (props.trend) {
      const trendMetaData = metaData.trend();

      return generateMeta({
        key: 'trend',
        title: trendMetaData.title,
        description: trendMetaData.description,
        og: {
          title: trendMetaData.title,
          // TODO: confirm we want to use the 1st product's image
          // image: props.results?.[0]?.image,
          url: global.window?.location,
          description: trendMetaData.description
        },
        twitter: {
          title: trendMetaData.title,
          // TODO: confirm we want to use the 1st product's image
          // image: props.results?.[0]?.image
          description: trendMetaData.description
        }
      });
    }

    const shopMeta = metaData.shop();

    return generateMeta({
      key: 'shop',
      title: shopMeta.title,
      description: shopMeta.description,
      og: {
        title: shopMeta.title,
        // image: props.results?.[0]?.image, // TODO: confirm we want to use the 1st product's image
        url: global.window?.location,
        description: shopMeta.description
      },
      twitter: {
        title: shopMeta.title,
        // image: props.results?.[0]?.image, // TODO: confirm we want to use the 1st product's image
        description: shopMeta.description
      }
    });
  };

  return (
    <Head>
      {getMetaData()}
      {generateBreadcrumbSeoSchema(props)}
      {router && <link key="canonical" rel="canonical" href={getPLPCanonicalUrl(router)} />}
      {props.brand ? <link rel="preload" as="image" href={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-header-bg.jpg`} /> : null}
    </Head>
  );
};

PLPMeta.defaultProps = {
  brand: null,
  edit: null,
  resultsState: null,
  searchState: null,
  trend: null
};

PLPMeta.propTypes = {
  brand: PropTypes.object,
  edit: PropTypes.string,
  resultsState: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  searchState: PropTypes.object,
  trend: PropTypes.string
};

export default PLPMeta;
