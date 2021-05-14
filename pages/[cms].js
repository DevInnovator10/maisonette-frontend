import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Head from 'next/head';

import { Page, Content, PageWithNav } from '../theme/page';
import {
  getProduct, getBrand, getPageParams, getContents
} from './api';

import dynamicModules from '../tissues/dynamicModules';

import { generateMeta, getMetaImage } from '../utils/meta';
import { latestCmsContent, formatCmsResponse } from '../utils/cms';
import getCmsSeoSchema from '../utils/cmsSeoSchema';
import isModuleBackgroundWhite from '../utils/isModuleBackgroundWhite';
import isFullWidthBelowMedium from '../utils/isFullWidthBelowMedium';
import isFullWidthMobileOnly from '../utils/isFullWidthMobileOnly';
import getUpdatedProductModuleData from '../utils/getUpdatedProductModuleData';
import hasHr from '../utils/hasHr';

import InnerPageNavigation from '../tissues/inner-page-navigation';

import SCOPE_TYPES from '../utils/sentryScopeTypes';
import getCmsCanonicalUrl from '../utils/getCmsCanonicalUrl';

const isCircleBanner = (modulename) => modulename === 'circle_banner';
const isHeading = (modulename) => modulename === 'heading';
const isDoubleBanner = (modulename) => modulename === 'double_banner';
const isAccordion = (modulename) => modulename === 'accordion';
const isBlockQuote = (modulename) => modulename === 'block_quote';

const Loading = styled.span`
  ${(props) => props.theme.loader()}
`;

const Cms = (props) => {
  const router = useRouter();

  useEffect(() => {
    if (global.window?.location?.hash) {
      const elem = global.document.querySelector(global.window.location.hash);

      if (elem) {
        const stickyHeaderHeight = 200;
        const elDistanceToTop = global.window.pageYOffset + elem.getBoundingClientRect().top
        - stickyHeaderHeight;
        global.window.scroll({ top: elDistanceToTop, behavior: 'smooth' });
      }
    }
  });

  const templates = props.modules.map((module) => (
    {
      Template: dynamicModules[module.Title],
      data: module.Content,
      cmsPosition: module.position,
      title: module.Title
    }
  ));

  if (router?.isFallback) {
    return (
      <Page background="default">
        <Loading />
      </Page>
    );
  }

  return (
    <>
      <Head>
        {
          Object.entries(props.page).length > 0 && generateMeta({
            key: 'cms',
            title: props.page.metaTitle,
            description: props.page.metaDescription,
            og: {
              description: props.page.metaDescription,
              image: getMetaImage(props),
              title: props.page.metaTitle,
              url: `${process.env.NEXT_PUBLIC_CLIENT_HOST}${router?.asPath}`
            },
            twitter: {
              description: props.page.metaDescription,
              image: getMetaImage(props),
              title: props.page.metaTitle
            }
          })
        }

        {
          getCmsSeoSchema(props)
              && (
                <script
                  type="application/ld+json"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: `${getCmsSeoSchema(props)}`
                  }}
                />
              )
        }

        <link key="canonical" rel="canonical" href={getCmsCanonicalUrl(router)} />
      </Head>
      {props?.page?.innerPageNavigation ? (
        <PageWithNav background={props.page.Background} id="maincontent">
          <InnerPageNavigation activePageName={props.page.URL} />
          {templates.sort((a, b) => a.cmsPosition - b.cmsPosition)
            .map((template, index) => {
              const {
                Template,
                data,
                title,
                cmsPosition
              } = template;
              return data && Object.keys(data).length > 0 ? (
                <Content
                  template={template}
                  isCMS
                  hasHr={hasHr(data)}
                  className="cms-content"
                  noPadding={title === 'markup'}
                  key={`${props.page.id}-${title}-${cmsPosition}`}
                  isCircleBanner={isCircleBanner(title)}
                  isWhite={isModuleBackgroundWhite(title)}
                  isHeading={isHeading(title)}
                  isDoubleBanner={isDoubleBanner(title)}
                  isAccordion={isAccordion(title)}
                  isFullWidthBelowMedium={isFullWidthBelowMedium(title)}
                  isFullWidthMobileOnly={isFullWidthMobileOnly(title)}
                  position={index}
                >
                  <Template data={data} />
                </Content>
              ) : null;
            })}
        </PageWithNav>
      ) : (
        <Page background={props.page.Background} id="maincontent">
          {templates.sort((a, b) => a.cmsPosition - b.cmsPosition)
            .map((template, index) => {
              const {
                Template,
                data,
                title,
                cmsPosition
              } = template;
              return data && Object.keys(data).length > 0 ? (
                <Content
                  template={template}
                  isCMS
                  hasHr={hasHr(data)}
                  className="cms-content"
                  noPadding={title === 'markup'}
                  key={`${props.page.id}-${title}-${cmsPosition}`}
                  isCircleBanner={isCircleBanner(title)}
                  isWhite={isModuleBackgroundWhite(title)}
                  isDoubleBanner={isDoubleBanner(title)}
                  isAccordion={isAccordion(title)}
                  isBlockQuote={isBlockQuote(title)}
                  isNeon={props.page.Background === 'neon'}
                  isFullWidthBelowMedium={isFullWidthBelowMedium(title)}
                  isFullWidthMobileOnly={isFullWidthMobileOnly(title)}
                  position={index}
                >
                  <Template data={data} />
                </Content>
              ) : null;
            })}
        </Page>
        )}
    </>
  );
};

export async function getServerSideProps({ params }) {
  const { cms } = params;
  let props = {};

  const pages = await getPageParams({
    base: process.env.CMS_HOST,
    uri: '/pages',
    queryParams: { URL: `/${cms}` },
    scopes: [SCOPE_TYPES.SERVICES.STRAPI]
  });

  const pageData = formatCmsResponse(pages);

  if (pageData.code === 'error') {
    try {
      // possible product redirection
      const brokenQuery = cms.split('/');
      const slug = brokenQuery[brokenQuery.length - 1];
      let possibleRedirect = await getProduct({ id: slug });
      let possibleRedirectData = possibleRedirect?.data ?? possibleRedirect;
      if (!Object.prototype.hasOwnProperty.call(possibleRedirectData, 'errors')) {
        if (possibleRedirectData.slug) {
          return {
            redirect: {
              destination: `/product/${slug}`,
              permanent: false
            }
          };
        }
      }

      // possible brand redirection
      possibleRedirect = await getBrand({ brand: slug });
      possibleRedirectData = possibleRedirect?.data ?? possibleRedirect;
      if (!Object.prototype.hasOwnProperty.call(possibleRedirectData, 'errors')) {
        if (possibleRedirectData?.count) {
          return {
            redirect: {
              destination: `/brands/${slug}`,
              permanent: false
            }
          };
        }
      }
    } catch (e) {
      return {
        notFound: true
      };
    }

    return {
      notFound: true
    };
  }

  if (pageData.code === 'ok') {
    props = { ...props, page: pageData.data };
    const activeContents = pageData.data.content.filter((content) => content.active);
    const currentDateTime = Date.now();
    const pagePublishDateTime = Date.parse(pageData.data.publishDate);

    if (!pageData.data.active
      || activeContents.length === 0
      || pagePublishDateTime > currentDateTime) {
      return {
        notFound: true
      };
    }

    const activeContent = latestCmsContent(activeContents, currentDateTime);
    const contentsData = formatCmsResponse([activeContent]);
    const contentPublishDateTime = Date.parse(contentsData.data.publishDate);

    if (contentsData.code === 'error') {
      return {
        notFound: true
      };
    }

    if (contentsData.code === 'ok' && contentPublishDateTime < currentDateTime) {
      const { id } = contentsData.data;
      const contentRes = await getContents({
        base: process.env.CMS_HOST,
        uri: `/contents/${id}`,
        scopes: [SCOPE_TYPES.SERVICES.STRAPI]
      });

      const modules = await getUpdatedProductModuleData(contentRes);
      const moduleData = formatCmsResponse([modules]);
      if (moduleData.code === 'error') return { notFound: true };
      if (moduleData.code === 'ok') props = { ...props, modules: moduleData.data };
    } else {
      return {
        notFound: true
      };
    }
  }

  return { props };
}

Cms.defaultProps = {
  modules: [],
  page: {}
};

Cms.propTypes = {
  page: PropTypes.object,
  modules: PropTypes.array
};

export default Cms;
