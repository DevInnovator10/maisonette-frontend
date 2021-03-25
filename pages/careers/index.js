import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import { Page } from '../../theme/page';

import { getCareerDepartments } from '../api';
import SCOPE_TYPES from '../../utils/sentryScopeTypes';

import CareerBenefits from '../../tissues/career-benefits';
import CareerPress from '../../tissues/career-press';
import MeetTheTeam from '../../tissues/meet-the-team';
import JoinOurTeam from '../../tissues/join-our-team';
import OurMission from '../../tissues/our-mission';
import CoreValues from '../../tissues/career-core-values';
import JobListing from '../../tissues/job-listing';
import Timeline from '../../tissues/career-timeline';
import BuiltInNyc from '../../tissues/built-in-nyc';
import SocialProof from '../../tissues/social-proof';

const Careers = (props) => {
    const ref = useRef();

  const scrollToOpenRoles = () => {
    // eslint-disable-next-line no-unused-expressions
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>Make Magic. Join Maisonette!</title>
        <meta key="og-title" property="og:title" content="Make Magic. Join Maisonette!" />
        <link key="canonical" rel="canonical" href={`${process.env.NEXT_PUBLIC_CLIENT_HOST}/careers`} />
      </Head>

      <Page background="cream" id="main">
        <JoinOurTeam scrollToOpenRoles={scrollToOpenRoles} />
        <OurMission scrollToOpenRoles={scrollToOpenRoles} />
        <CoreValues />
        <CareerBenefits scrollToOpenRoles={scrollToOpenRoles} />
        <JobListing list={props.departments} ref={ref} />
        <Timeline scrollToOpenRoles={scrollToOpenRoles} />
        <CareerPress />
        <BuiltInNyc scrollToOpenRoles={scrollToOpenRoles} />
        <SocialProof />
        <MeetTheTeam />

      </Page>
    </>
  );
};

export const getServerSideProps = async () => {
  let props = {};

  const { departments } = await getCareerDepartments({
    base: 'https://boards-api.greenhouse.io',
    uri: '/v1/boards/maisonette/departments',
    scopes: [SCOPE_TYPES.SERVICES.GREENHOUSE]
  });

  if (departments) {
    props = { ...props, departments };
  } else {
    return { notFound: true };
  }

  return { props };
};

Careers.propTypes = {
  departments: PropTypes.object.isRequired
};

export default Careers;
