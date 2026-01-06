import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Typography from '../../atoms/typography';
import Heading from '../heading';

const Wrapper = styled.div`
  color: ${({ theme }) => theme.color.bluePrimary};
  text-align: center;
  padding: 6.4rem 0;
  background-image: url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-bg-right.jpg), url(${process.env.NEXT_PUBLIC_ASSET_HOST}/images/maisonette-bg-left.jpg);
  background-position: right, top left;
  background-repeat: no-repeat, no-repeat;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    padding: 6.4rem;
  }
`;

const OpenRolesButton = styled.a`
  background: ${({ theme }) => theme.color.bluePrimary};
  color: ${({ theme }) => theme.color.white};
  cursor: pointer;
  font-size: 1.8rem;
  text-decoration: none;
  padding: 1.5rem 4.5rem;
`;

const Text = styled(Typography)`

  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    margin: -2.4rem auto 2.4rem;
    line-height: 2.4rem;
    max-width: 800px;
    display: block;
  }
`;

const JoinOurTeam = ({ scrollToOpenRoles }) => (
  <Wrapper>
    <Heading data={{ heading_title: 'Join our team!' }} careerUpdate />
    <Text element="p" like="dec-3">We are a fast-growing venture-backed start-up with a unique positioning in the kid&apos;s market. With a fresh round of funding and a sky&apos;s-the-limit approach, we are seeking talented self-starters to join the team in our most exciting phase of growth.</Text>

    <OpenRolesButton onClick={scrollToOpenRoles}>See open roles</OpenRolesButton>

  </Wrapper>
);

JoinOurTeam.propTypes = {
  scrollToOpenRoles: PropTypes.func
};

JoinOurTeam.defaultProps = {
  scrollToOpenRoles: PropTypes.func
};

export default memo(JoinOurTeam);
