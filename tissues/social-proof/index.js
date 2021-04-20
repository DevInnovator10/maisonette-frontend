import React from 'react';
import styled from '@emotion/styled';
import Heading from '../heading';

const Content = styled.section`
  background-color: #fff;
  padding: 0 0.8rem 6.4rem;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    padding: 3.2rem 1.6rem 12.8rem;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  gap: 0.8rem;
  grid-template-columns: 1fr 1fr;
  padding: 1.6rem 0.8rem;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    gap: 3.2rem;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 0 7.2rem 3.2rem 7.2rem;
  }
`;

const Image = styled.img`
  object-fit: contain;
  width: 100%;
  height: auto;
  aspect-ratio: 1/1;
  display: ${(props) => (props.mobileOnly ? 'none' : 'block')};

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    display: block;
  }
`;

const InstaLink = styled.a`
  background: url('/images/icon/Arrow-Offsite.svg') right -4px no-repeat;
  padding-right: 4.2rem;
  display: inline-block;
  text-underline-position: under;
  text-underline-offset: 8px;
  text-decoration-thickness: 0.075em;
  font-size: 1.6rem;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    background-position: right 4px;
    font-size: 2.4rem;
    text-underline-offset: 4px;
    padding-left: 4.8rem;
  }
`;

const imageData = [
  {
    href: 'https://www.instagram.com/p/Cgj0D9mj8t7',
    src: '/images/social-proof/french_baby_names.jpg',
    alt: 'French baby names',
    mobileOnly: false
  },
  {
    href: 'https://www.instagram.com/p/CgHwtG9Fxqv',
    src: '/images/social-proof/everything_possible.jpg',
    alt: 'Everything is possible',
    mobileOnly: false
  },
  {
    href: 'https://www.instagram.com/p/Cf-E3rcjZZN',
    src: '/images/social-proof/things_in_life.png',
    alt: 'Things in life',
    mobileOnly: false
  },
  {
    href: 'https://www.instagram.com/p/CeuKIothYnP',
    src: '/images/social-proof/visit_paris.jpg',
    alt: 'Visit Paris',
    mobileOnly: false
  },
  {
    href: 'https://www.instagram.com/p/CgAjhKxhmCH',
    src: '/images/social-proof/paint_ideas.jpg',
    alt: 'Paint ideas',
    mobileOnly: true
  },
  {
    href: 'https://www.instagram.com/p/Cc_mRZIhkxz',
    src: '/images/social-proof/absence_heart_fonder.jpg',
    alt: 'Absence makes the heart grow fonder',
    mobileOnly: true
  }
];

const SocialProof = () => (
  <Content>
    <Heading
      data={{ heading_title: 'Social posts' }}
      careerUpdate
    />
    <ImageGrid>
      {
        imageData.map(({ href, ...imageProps }) => (
          <a href={href} target="_blank" rel="noopener noreferrer nofollow" key={href}>
            <Image {...imageProps} />
          </a>
        ))
      }
    </ImageGrid>
    <InstaLink
      href="https://www.instagram.com/maisonetteworld"
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label="Visit the Maisonette Instagram page"
    >
      Follow us on Instagram
    </InstaLink>
  </Content>
);

export default SocialProof;
