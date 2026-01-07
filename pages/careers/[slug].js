import React from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Head from 'next/head';

import { Page, Content, PageWithNav } from '../../theme/page';
import InnerPageNavigation from '../../tissues/inner-page-navigation';
import Heading from '../../tissues/heading';
import DynamicInfo from '../../tissues/dynamic-info';
import CareerContent from '../../tissues/career-content';

import { getCareerBySlug } from '../api';
import SCOPE_TYPES from '../../utils/sentryScopeTypes';
import getCanonicalUrl from '../../utils/getCanonicalUrl';

const DynamicInfoWrapper = styled.div`
  div {
    justify-content: center;
  }
`;

const Loading = styled.span`
  ${(props) => props.theme.loader()}
`;

const Career = (props) => {
  const router = useRouter();

  if (router?.isFallback) {
    return (
      <Page background="default">
        <PageWithNav>
          <InnerPageNavigation activePageName={'/careers'} />
          <Loading />
        </PageWithNav>
      </Page>
    );
  }

  return (
    <>
      <Head>
        <title>Make Magic. Join Maisonette!</title>
        <meta key="og-title" property="og:title" content="Make Magic. Join Maisonette!" />
        <link key="canonical" rel="canonical" href={getCanonicalUrl(router)} />
      </Head>
      <Page background="default" id="main">
        <PageWithNav>
          <InnerPageNavigation activePageName={'/careers'} />
          <Content>
            { props.career?.title
            && <Heading data={{ heading_title: props.career?.title }} /> }
          </Content>

          <Content>
            { props.contentHtml
            && <CareerContent content={props.contentHtml} /> }
          </Content>

          <Content>
            <DynamicInfoWrapper>
              <DynamicInfo
                data={{
                  dynamic_info_heading: 'Interested?',
                  dynamic_info_elements: {
                    0: {
                      type: 'definition',
                      dynamic_info_term: `<a href=${props.career?.absolute_url}>Apply Here</a>`
                    }
                  }
                }}
              />
            </DynamicInfoWrapper>
          </Content>
        </PageWithNav>
      </Page>
    </>
  );
};

export const getServerSideProps = async ({ params }) => {
  // eslint-disable-next-line global-require
  const he = require('he');
  const { slug } = params;
  let props = {};

  const career = await getCareerBySlug({
    slug,
    base: 'https://boards-api.greenhouse.io',
    uri: '/v1/boards/maisonette/jobs',
    scopes: [SCOPE_TYPES.SERVICES.GREENHOUSE]
  });

  if (career && !career.error) {
    const { content } = career;
    const contentHtml = he.decode(content);

    props = { ...props, career, contentHtml };
  } else {
    return {
      redirect: {
        destination: '/careers'
      }
    };
  }

  return { props };
};

Career.propTypes = {
  career: PropTypes.object.isRequired,
  contentHtml: PropTypes.string.isRequired
};

export default Career;
