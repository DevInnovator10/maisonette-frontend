import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Typography from '../../atoms/typography';
import Heading from '../heading';

const Wrapper = styled.div`
  background-color: #fff;
  padding: 6.4rem 0;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    padding: 6.4rem;
  }
`;

const OpenRolesButton = styled.a`
  border: 1px solid ${({ theme }) => theme.color.bluePrimary};
  cursor: pointer;
  font-size: 1.8rem;
  text-decoration: none;
  padding: 1.5rem 4.5rem;
`;

const Text = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'heading'
})`
  color: ${({ theme }) => theme.color.bluePrimary};
  margin: -1.6rem auto 2.4rem;
  padding: 0 1.6rem;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    padding: 0;
    margin: 0 auto 3.2rem;
    max-width: 800px;
    font-size: 2.4rem;
    line-height: 3.2rem;
  }

  ${(props) => props.heading && css`
    font-family: ${props.theme.font.heading};
  `}

`;

const Image = styled.img`
  display: block;
  max-width: 100%;
  margin: 6.4rem auto;
  height: auto;
`;

const ImageMobile = styled(Image)`
  display: block;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    display: none;
  }
`;

const ImageDesktop = styled(Image)`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    display: block;
  }
`;

const OurMission = ({ scrollToOpenRoles }) => (
  <Wrapper>
    <Text element="p" like="dec-6" heading>Maisonette is an online marketplace for high quality baby and kids products across every category; from apparel to gear to toys and home decor. Founded by two moms in 2017 with the goal of helping modern families raise the next generation, Maisonette carries over 1000 unique brands from around the globe, providing relevant, high quality product at every price point, and expert-led content tailored to every stage of parenthood.</Text>
    <ImageMobile src="/images/careers-our-mission/Hero-Mobile.jpg" alt="Our Team" />
    <ImageDesktop src="/images/careers-our-mission/Hero-Desktop.jpg" alt="Our Team" />
    <Heading data={{ heading_title: 'Our mission' }} careerUpdate />
    <Text element="p" like="dec-3">Maisonette helps modern families navigate the adventure of parenthood. We provide an expertly curated world of products for kids—plus trusted guidance and inspiration for those who love them. Because what you consume for kids matters.</Text>
    <OpenRolesButton onClick={scrollToOpenRoles}>
      See open roles

    </OpenRolesButton>
  </Wrapper>
);

OurMission.propTypes = {
  scrollToOpenRoles: PropTypes.func
};

OurMission.defaultProps = {
  scrollToOpenRoles: PropTypes.func
};

export default memo(OurMission);
