import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import styled from '@emotion/styled';

import AccountNavigation from '../molecules/account-navigation';
import PageHeading from '../molecules/page-heading';
import Typography from '../atoms/typography';
import PetiteProfilesForm from '../organs/petite-profile-form';

import { Page, Content } from '../theme/page';
import { withAuthComponent, withAuthServerSideProps } from '../utils/auth/with-auth';

const PageTitle = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  line-height: 1.4;
  text-align: center;
  margin-bottom: 4rem;
`;

const ImageWrapper = styled.figure`
  display: block;

  padding-top: 100%;
  position: relative;
  margin-bottom: 2rem;
`;

const Image = styled.img`
  border-radius: 100%;
  bottom: 0;
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
`;

const Step = styled.li`
  color: ${(props) => props.theme.color.brand};
  text-align: center;
  line-height: 1.3;
`;

const Steps = styled.ol`
  display: grid;
  grid-gap: 8rem;
  margin-bottom: 3rem;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 3rem;
  }
`;

const StepLabel = styled(Typography)`
  letter-spacing: 0.2em;
  line-height: 2rem;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

const PetiteProfilesPage = (props) => (
  <>
    <Head>
      <title>{`${props.profile.first_name || 'Friend'}'s Minis'`}</title>
      <link key="canonical" rel="canonical" href={`${process.env.NEXT_PUBLIC_CLIENT_HOST}/petite-profiles`} />
    </Head>
    <Page id="maincontent">
      <PageHeading title={`Hi, ${props.profile.first_name || 'Friend'}!`} />
      <AccountNavigation active="/petite-profiles" />

      <Content layout="medium">
        <PageTitle element="h1" like="heading-5">
          Save time! Tell us a bit about your minis so we can customize your shopping results.
        </PageTitle>

        <Steps>
          <Step>
            <ImageWrapper>
              <Image alt="child on small car" src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/petite-profiles-1.jpg`} />
            </ImageWrapper>

            <StepLabel element="h2" like="label-1">Step 1</StepLabel>
            <Typography element="p" like="paragraph-2">Share your minis&apos; ages and genders.</Typography>
          </Step>

          <Step>
            <ImageWrapper>
              <Image alt="laptop screen" src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/petite-profiles-2.jpg`} />
            </ImageWrapper>

            <StepLabel element="h2" like="label-1">Step 2</StepLabel>
            <Typography element="p" like="paragraph-2">Find their names in the top nav and select whom you are shopping for.</Typography>
          </Step>

          <Step>
            <ImageWrapper>
              <Image alt="pair of shoes" src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/petite-profiles-3.jpg`} />
            </ImageWrapper>

            <StepLabel element="h2" like="label-1">Step 3</StepLabel>
            <Typography element="p" like="paragraph-2">Enjoy selections based on your minis&apos; age and gender.</Typography>
          </Step>
        </Steps>

        <PetiteProfilesForm
          token={props.token}
          updateMinis={props.updateMinis}
          profile={props.profile}
        />
      </Content>
    </Page>
  </>
);

PetiteProfilesPage.propTypes = {
  profile: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  updateMinis: PropTypes.func.isRequired
};

PetiteProfilesPage.whyDidYouRender = true;

export const getServerSideProps = withAuthServerSideProps();

export default withAuthComponent(PetiteProfilesPage);
