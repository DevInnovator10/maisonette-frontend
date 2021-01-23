import React from 'react';
import Head from 'next/head';

import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import dynamicModules from '../../tissues/dynamicModules';
import { Page, Content, PageWithNav } from '../../theme/page';
import { generateMeta, getMetaImage } from '../../utils/meta';
import InnerPageNavigation from '../../tissues/inner-page-navigation';

import isModuleBackgroundWhite from '../../utils/isModuleBackgroundWhite';
import isFullWidthBelowMedium from '../../utils/isFullWidthBelowMedium';
import isFullWidthMobileOnly from '../../utils/isFullWidthMobileOnly';
import hasHr from '../../utils/hasHr';

const isCircleBanner = (modulename) => modulename === 'circle_banner';
const isHeading = (modulename) => modulename === 'heading';
const isDoubleBanner = (modulename) => modulename === 'double_banner';
const isAccordion = (modulename) => modulename === 'accordion';
const isBlockQuote = (modulename) => modulename === 'block_quote';

const Preview = (props) => {
  // this page handles the rendering logic for all preview pages that are built
  // from CMS pages, not stories, or pillars. Those are handled by /algolia-cms/index
  const router = useRouter();
  const isStory = props.page.type === 'story';
  const isHomepage = props.page.URL === '/index';

  const templates = props.modules?.map((module) => (
    {
      Template: dynamicModules[module.Title],
      data: module.Content,
      cmsPosition: module.position,
      title: module.Title
    }
  ));

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
                  cmsPosition,
                  title
                } = template;
                return Object.keys(data).length > 0 && (
                <Content
                  isCMS
                  hasHr={hasHr(data)}
                  noPadding={title === 'markup'}
                  key={`${title}-${cmsPosition}`}
                  isCircleBanner={isCircleBanner(title)}
                  isWhite={isModuleBackgroundWhite(title)}
                  isHeading={isHeading(title)}
                  isDoubleBanner={isDoubleBanner(title)}
                  isAccordion={isAccordion(title)}
                  isFullWidthBelowMedium={isFullWidthBelowMedium(title)}
                  isFullWidthMobileOnly={isFullWidthMobileOnly(title)}
                  position={index}
                >
                  <Template
                    data={data}
                    isStory={isStory}
                    disableLazyload={index < 2}
                    homepage={isHomepage}
                  />
                </Content>
                );
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
                cmsPosition,
                title
              } = template;
              return Object.keys(data).length > 0 && (
                <Content
                  isCMS
                  hasHr={hasHr(data)}
                  noPadding={title === 'markup'}
                  key={`${title}-${cmsPosition}`}
                  isCircleBanner={isCircleBanner(title)}
                  isWhite={isModuleBackgroundWhite(title)}
                  isDoubleBanner={isDoubleBanner(title)}
                  isAccordion={isAccordion(title)}
                  isBlockQuote={isBlockQuote(title)}
                  isNeon={props.page.Background === 'neon'}
                  isFullWidthBelowMedium={isFullWidthBelowMedium(title) && !isHomepage}
                  isFullWidthMobileOnly={isFullWidthMobileOnly(title) && !isHomepage}
                  position={index}
                >
                  <Template
                    data={data}
                    isStory={isStory}
                    disableLazyload={index < 2}
                    homepage={isHomepage}
                  />
                </Content>
              );
            })}
        </Page>
      )}
    </>
  );
};

Preview.defaultProps = {
  modules: [],
  page: {}
};

Preview.propTypes = {
  modules: PropTypes.array,
  page: PropTypes.object
};

export default Preview;
