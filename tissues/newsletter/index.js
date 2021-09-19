import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import SignupInput from '../../molecules/newsletter-signup';

const Promotion = styled.section`
  background: ${(props) => props.theme.color.softNavy};
  padding: ${(props) => props.theme.modularScale['2xlarge']} 0;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    padding: ${(props) => props.theme.modularScale['3xlarge']} 0;
  }

  &::before {
    background-color: ${(props) => props.theme.color.softNavy};
    content: "";
    display: block;
    height: 100%;
    left: 50%;
    position: absolute;
    top: 0;
    transform: translate(-50%);
    width: 100%;
  }
`;

const Newsletter = (props) => (
  <Promotion>
    <SignupInput title={props.data.newsletter_heading} promos={props.data.newsletter_elements} />
  </Promotion>
);

Newsletter.propTypes = {
  data: PropTypes.object.isRequired
};

Newsletter.whyDidYouRender = true;

export default Newsletter;
