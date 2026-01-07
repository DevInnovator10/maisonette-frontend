import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Head from 'next/head';
import LazyHydrate from 'react-lazy-hydration';
import { Page, Content, PageWithNav } from '../theme/page';
import dynamicModules from '../tissues/dynamicModules';

import { generateMeta, getMetaImage } from '../utils/meta';
import { latestCmsContent, formatCmsResponse } from '../utils/cms';
import isModuleBackgroundWhite from '../utils/isModuleBackgroundWhite';
import getUpdatedProductModuleData from '../utils/getUpdatedProductModuleData';
import hasHr from '../utils/hasHr';

import InnerPageNavigation from '../tissues/inner-page-navigation';

import { getPageParams, getContents } from './api';
import SCOPE_TYPES from '../utils/sentryScopeTypes';

const isDoubleBanner = (modulename) => modulename === 'double_banner';
const isAccordion = (modulename) => modulename === 'accordion';

const Cms = (props) => {
  const router = useRouter();

  const templates = props.modules.map((module) => (
    {
      Template: dynamicModules[module.Title],
      data: module.Content,
      cmsPosition: module.position,
      title: module.Title
    }
  ));

  useEffect(() => {
    // remove location.hash when redirected from checkout
    // after hitting back when order is completed
    if (global.window.location.hash === '#complete') {
      global.window.location.href = global.window.location.pathname;
    }
  }, []);

  return (
    <>
      <Head>
        {
          generateMeta({
            key: 'cms',
            title: props.page.metaTitle,
            description: props.page.metaDescription,
            og: {
              description: props.page.metaDescription,
              image: getMetaImage(props),
              title: props.page.metaTitle,
              url: `${process.env.NEXT_PUBLIC_CLIENT_HOST}${router.asPath}`
            },
            twitter: {
              description: props.page.metaDescription,
              image: getMetaImage(props),
              title: props.page.metaTitle
            }
          })
        }

        <link key="canonical" rel="canonical" href={process.env.NEXT_PUBLIC_CLIENT_HOST} />

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
              {
                "@context": "https://schema.org",
                "@type": "Corporation",
                "name": "Maisonette Inc.",
                "alternateName": "Maisonette",
                "url": "https://www.maisonette.com/",
                "logo": "${getMetaImage()}",
                "sameAs": [
                  "https://www.facebook.com/maisonetteworld",
                  "https://twitter.com/maisonetteworld",
                  "https://www.instagram.com/maisonetteworld/",
                  "https://www.youtube.com/c/maisonetteworld",
                  "https://www.linkedin.com/company/maisonette-inc./",
                  "https://www.pinterest.com/maisonetteworld/",
                  "https://www.maisonette.com/"
                ]
              }
            `
          }}
        />
      </Head>
      {props?.page?.innerPageNavigation ? (
        <Page background={props.page.Background} id="maincontent">
          <PageWithNav>
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
                    className="cms-content"
                    template={template}
                    isCMS
                    hasHr={hasHr(data)}
                    noPadding={title === 'markup'}
                    key={`${title}-${cmsPosition}`}
                    isWhite={isModuleBackgroundWhite(title)}
                    isDoubleBanner={isDoubleBanner(title)}
                    isAccordion={isAccordion(title)}
                    position={index}
                  >
                    <LazyHydrate whenVisible>
                      <Template data={data} disableLazyload={index < 2} homepage />
                    </LazyHydrate>
                  </Content>
                ) : null;
              })}
          </PageWithNav>
        </Page>
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
                  className="cms-content"
                  template={template}
                  isCMS
                  hasHr={hasHr(data)}
                  noPadding={title === 'markup'}
                  key={`${title}-${cmsPosition}`}
                  isWhite={isModuleBackgroundWhite(title)}
                  isDoubleBanner={isDoubleBanner(title)}
                  isAccordion={isAccordion(title)}
                  position={index}
                >
                  <LazyHydrate whenVisible>
                    <Template data={data} disableLazyload={index < 2} homepage />
                  </LazyHydrate>
                </Content>
              ) : null;
            })}
        </Page>
        )}
    </>
  );
};

export async function getServerSideProps() {
  let props = {};

  const pages = await getPageParams({
    base: process.env.CMS_HOST,
    uri: '/pages',
    queryParams: { URL: '/index' },
    scopes: [SCOPE_TYPES.SERVICES.STRAPI]
  });

  const pageData = formatCmsResponse(pages);

  if (pageData.code === 'error') {
    // product redirects handled in pages/[cms]
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
      if (moduleData.code === 'error') {
        return {
          notFound: true
        };
      }
      if (moduleData.code === 'ok') props = { ...props, modules: moduleData.data };
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
