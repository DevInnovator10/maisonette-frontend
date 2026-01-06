import React from 'react';
import styled from '@emotion/styled';

import Anchor from '../../atoms/anchor';
import FooterCopy from '../../molecules/footer-copy';
import SocialMediaIcons from '../../molecules/social-media-icons';

const Title = styled(Anchor)`
  color: ${(props) => props.theme.color.white};
  letter-spacing: .24em;
  margin-bottom: 5rem;
  padding: 0;
  text-align: center;
  text-transform: uppercase;
  transition: color .4s cubic-bezier(.39,.575,.565,1);
  min-height: 3.2rem;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    margin-bottom: 5rem;

    :not(:last-of-type) {
      text-align: left;
    }
  }

  &:visited {
    color: ${(props) => props.theme.color.white};
  }

  &:hover {
    color: ${(props) => props.theme.color.brandLight};
  }
`;

const Contact = styled(FooterCopy)`
  margin-bottom: 2rem;
  font-size: ${(props) => props.theme.modularScale.small};
  line-height: ${(props) => props.theme.modularScale.large};
`;

const icons = [
  { icon: 'instagram', action: null },
  { icon: 'twitter', action: null },
  { icon: 'facebook', action: null },
  { icon: 'pinterest', action: null }
];

const FooterContact = () => (
  <>
    <Title href="/contact" hed>Contact Us</Title>
    <Contact
      email="customercare@maisonette.com"
      phone={{
        formatted: '1 844-624-7663',
        unformatted: '18446247663',
        pretty: '1 844-MAISONETTE'
      }}
    />
    <SocialMediaIcons
      icons={icons}
      inverted
    />
  </>
);

export default FooterContact;
