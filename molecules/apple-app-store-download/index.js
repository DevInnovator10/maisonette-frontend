import React from 'react';
import styled from '@emotion/styled';

// components
import Typography from '../../atoms/typography';

/*
  Apple App Store Download Molecule
    This component renders some informational copy and a link to send users
    to the Apple App store to download or open our iOS App. It is
    only rendered in the footer under the email subscription input and is functionally static.

    The href for the link to the App store contains tracking parameters specific to the
    rendering location of this component and the image is stored in
    /public/images/apple-app-store-button.svg
*/

const Wrapper = styled.div`
  background: ${({ theme }) => theme.color.darkBlue};
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.modularScale.thirtyTwo};
  padding: ${({ theme }) => theme.modularScale.twelve} ${({ theme }) => theme.modularScale.sixteen};

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    margin-top: ${({ theme }) => theme.modularScale.twentyFour};
  }
`;

const Information = styled.div``;

const Title = styled(Typography)`
  letter-spacing: 0.2rem;
  line-height: 1.9rem;
  text-transform: uppercase;
  margin-bottom: 0.4rem;
`;

const Copy = styled(Typography)`
  line-height: 1.7rem;
`;

const AppStoreLink = styled.a`
  max-height: 4rem;
  max-width: 12rem;
  margin: auto 0 auto 1rem;
`;

const AppStoreImage = styled.img``;

const AppleAppStoreDownload = () => (
  <Wrapper>
    <Information>
      <Title element="h4" like="label-4">Download the app</Title>
      <Copy element="p" like="paragraph-3">Download our official app from the app store</Copy>
    </Information>
    <AppStoreLink
      href="https://apps.apple.com/app/apple-store/id1607354539?pt=118811622&ct=Website%20Footer&mt=8"
      target="_blank"
      rel="noopener"
    >
      <AppStoreImage
        src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/apple-app-store-button.svg`}
        alt="View the Maisonette App at the Apple App Store"
      />
    </AppStoreLink>
  </Wrapper>
);

export default AppleAppStoreDownload;
