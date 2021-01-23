import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { InView } from 'react-intersection-observer';

import { Page, Content, PageWithNav } from '../../../../theme/page';
import {
  getPageParams
} from '../../../api';

import dynamicModules from '../../../../tissues/dynamicModules';
import MoreStories from '../../../../tissues/more-stories';
import InnerPageNavigation from '../../../../tissues/inner-page-navigation';
import formatCatSubcatFromHM from '../../../../organisms/algolia-cms/utils/formatCatSubcatFromHM/index';
import LeScoopBreadCrumbs from '../../../../organisms/algolia-cms/le_scoop-breadcrumbs';
import { articleGSSP } from '../../../../organisms/algolia-cms/gssp/index';

import isFullWidthBelowMedium from '../../../../utils/isFullWidthBelowMedium';
import isFullWidthMobileOnly from '../../../../utils/isFullWidthMobileOnly';
import dateToString from '../../../../utils/dateToString';
import getCmsCanonicalUrl from '../../../../utils/getCmsCanonicalUrl';
import hasHr from '../../../../utils/hasHr';
import { generateMeta, getMetaImage } from '../../../../utils/meta';
import isModuleBackgroundWhite from '../../../../utils/isModuleBackgroundWhite';
import { logAmplitude } from '../../../../utils/amplitude';
import deconstructPath from '../../../../organisms/algolia-plp/utils/deconstructPath';

const isCircleBanner = (modulename) => modulename === 'circle_banner';
const isHeading = (modulename) => modulename === 'heading';
const isDoubleBanner = (modulename) => modulename === 'double_banner';
const isAccordion = (modulename) => modulename === 'accordion';
const isSocialShare = (modulename) => modulename === 'social_share';
const isBlockQuote = (modulename) => modulename === 'block_quote';

const Loading = styled.span`
  ${(props) => props.theme.loader()}
`;

const IntersectionObserverElement = styled.div`
  height: 0px;
  width: 100%;
`;

const Story = (props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [moreStories, setMoreStories] = useState({});
  const needsSocialShare = props.modules.findIndex((element) => element.Title === 'social_share') === -1;
  const hasHero = props.modules.findIndex((element) => element.Title === 'hero');
  const { isFallback } = useRouter();

  useEffect(() => {
    // grab previously visited page using history, default to current page
    // for direct visit
    let parentPage = router.asPath;

    if (props.history?.length > 0) {
      const { length } = props.history;
      parentPage = props.history[length - 1];
    }

    logAmplitude(null, {
      parentPage,
      category: props.category?.displayName,
      subcategory: props.subcategory?.displayName
    });
  }, []);

  const addSocialShare = (templates) => {
    // move the positions
    const newTemplates = templates.map((template) => ({
      Template: dynamicModules[template.Title],
      data: template.Content,
      position: template.position,
      title: template.Title
    }));
    // get the social_share data
    const socialData = {
      Template: dynamicModules.social_share,
      data: {
        socialshare_email: true,
        socialshare_twitter: true,
        socialshare_facebook: true,
        socialshare_pinterest: true
      },
      position: newTemplates[hasHero].position + 0.5,
      title: 'social_share'
    };
    newTemplates.splice(hasHero + 1, 0, socialData);
    return newTemplates;
  };

  const templates = needsSocialShare && hasHero >= 0
    ? addSocialShare(props.modules)
    : props.modules.map((module) => (
      {
        Template: dynamicModules[module.Title],
        data: module.Content,
        position: module.position,
        title: module.Title
      }
    ));
  const needsMoreStories = templates.findIndex((element) => element.title === 'more_stories') === -1;

  const renderMoreStories = async () => {
    if (needsMoreStories) {
      const date = Date.now();
      // make a call to the strapi endpoint to get the data inside the content
      const moreStoriesRes = await getPageParams({
        params: {
          type: 'story',
          active: 'true',
          inLeScoopModule: 'true',
          publishDate_lte: date,
          _sort: 'publishDate:DESC',
          _limit: 4,
          URL_ne: props.page.URL
        }
      });

      if (moreStoriesRes?.length > 0) {
        const moreStoriesData = moreStoriesRes.reduce((acc, cur, idx) => {
          const dataFormat = {
            more_stories_url: cur?.URL,
            more_stories_image: cur?.socialImage,
            more_stories_heading: cur?.Title,
            more_stories_image_alt: cur?.metaDescription ?? cur?.Title
          };
          const retVal = {
            more_stories: {
              ...acc.more_stories,
              [idx]: dataFormat
            }
          };
          return retVal;
        }, { more_stories: {} });
        setMoreStories(moreStoriesData);
        setLoading(false);
      }
    }
    setLoading(false);
  };

  const handleOnIntersectionChange = (inView) => {
    if (!inView) return;
    renderMoreStories();
  };

  if (isFallback) {
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
              url: `${process.env.NEXT_PUBLIC_CLIENT_HOST}${router.asPath}`
            },
            twitter: {
              description: props.page.metaDescription,
              image: getMetaImage(props),
              title: props.page.metaTitle
            }
          })
        }

        <link key="canonical" rel="canonical" href={getCmsCanonicalUrl(router)} />

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "${process.env.NEXT_PUBLIC_CLIENT_HOST}${props.page.URL}"
              },
              "headline": "${props.page.metaTitle}",
              "description": "${props.page.metaDescription}",
              "image": "${getMetaImage(props)}",
              "author": {
                "@type": "Organization",
                "name": "Maisonette"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Maisonette",
                "logo": {
                  "@type": "ImageObject",
                  "url": "${getMetaImage()}"
                }
              },
              "datePublished": "${dateToString(props.page.publishDate, 'YYYY-MM-DD')}",
              "dateModified": "${dateToString(props.page.updated_at, 'YYYY-MM-DD')}"
            }`
          }}
        />

      </Head>
      {props?.page?.innerPageNavigation ? (
        <Page background={props.page.Background} id="maincontent">
          <LeScoopBreadCrumbs
            category={props.category}
            subcategory={props.subcategory}
            path={router.asPath}
            isStory
          />
          <PageWithNav>
            <InnerPageNavigation activePageName={props.page.URL} />
            {templates.sort((a, b) => a.position - b.position)
              .map((template, index) => {
                const {
                  Template,
                  data,
                  title,
                  position
                } = template;
                return data && Object.keys(data).length > 0 ? (
                  <Content
                    className="cms-content"
                    template={template}
                    isCMS
                    hasHr={hasHr(data)}
                    isDoubleBanner={isDoubleBanner(title)}
                    noPadding={title === 'markup'}
                    key={`${props.page.id}-${title}-${position}`}
                    isCircleBanner={isCircleBanner(title)}
                    isWhite={isModuleBackgroundWhite(title)}
                    isHeading={isHeading(title)}
                    isAccordion={isAccordion(title)}
                    isSocialShare={isSocialShare(title)}
                    isFullWidthBelowMedium={isFullWidthBelowMedium(title)}
                    isFullWidthMobileOnly={isFullWidthMobileOnly(title)}
                  >
                    <Template data={data} isStory disableLazyload={index < 2} />
                  </Content>
                ) : null;
              })}
            {(needsMoreStories && !loading) && (
              <Content isCMS>
                <MoreStories data={moreStories} />
              </Content>
            )}
          </PageWithNav>
        </Page>
      ) : (
        <Page background={props.page.Background} id="maincontent">
          <LeScoopBreadCrumbs
            category={props.category}
            subcategory={props.subcategory}
            path={router.asPath}
            isStory
          />
          {templates.sort((a, b) => a.position - b.position)
            .map((template, index) => {
              const {
                Template,
                data,
                title,
                position
              } = template;
              return data && Object.keys(data).length > 0 ? (
                <Content
                  className="cms-content"
                  template={template}
                  isCMS
                  hasHr={hasHr(data)}
                  isDoubleBanner={isDoubleBanner(title)}
                  noPadding={title === 'markup'}
                  key={`${props.page.id}-${title}-${position}`}
                  isCircleBanner={isCircleBanner(title)}
                  isWhite={isModuleBackgroundWhite(title)}
                  isAccordion={isAccordion(title)}
                  isSocialShare={isSocialShare(title)}
                  isBlockQuote={isBlockQuote(title)}
                  isNeon={props.page.Background === 'neon'}
                  isFullWidthBelowMedium={isFullWidthBelowMedium(title)}
                  isFullWidthMobileOnly={isFullWidthMobileOnly(title)}
                >
                  <Template data={data} isStory disableLazyload={index < 2} />
                </Content>
              ) : null;
            })}
          <InView threshold={0} onChange={handleOnIntersectionChange}>
            {({ ref }) => <IntersectionObserverElement ref={ref} />}
          </InView>
          {(needsMoreStories && !loading) && (
            <Content isCMS>
              <MoreStories data={moreStories} />
            </Content>
          )}
        </Page>
      )}
    </>
  );
};

export const getServerSideProps = async ({ params }) => {
  let props = {};
  props = await articleGSSP({ params });

  if (props.code !== 'error' && props.page.URL) {
    const { hierarchicalMenu } = deconstructPath(props.page.URL);

    const { categoryData, subcategoryData } = formatCatSubcatFromHM(
      { hierarchicalMenu }
    );

    if (categoryData) props = { ...props, category: categoryData };
    if (subcategoryData) props = { ...props, subcategory: subcategoryData };
  }

  if (props.code === 'error') {
    return {
      redirect: {
        destination: '/le_scoop'
      }
    };
  }

  return {
    props: {
      ...props
    }
  };
};

Story.defaultProps = {
  modules: [],
  page: {},
  category: null,
  subcategory: null
};

Story.propTypes = {
  page: PropTypes.object,
  modules: PropTypes.array,
  history: PropTypes.array.isRequired,
  category: PropTypes.object,
  subcategory: PropTypes.object
};

export default Story;
