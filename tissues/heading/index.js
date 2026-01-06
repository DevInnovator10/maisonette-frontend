import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Typography from '../../atoms/typography';
import Ruler from '../../atoms/ruler';

const FILTERED_HEADING_EMO_PROPS = new Set(['careerUpdate', 'pillar', 'timeline']);

const StyledHeading = styled(Typography, {
  shouldForwardProp: (prop) => !FILTERED_HEADING_EMO_PROPS.has(prop)
})`
  color: ${(props) => props.theme.color.brand};
  text-align: center;
  margin-bottom: ${({ careerUpdate }) => (careerUpdate ? '3.6rem' : '')};
  overflow-wrap: break-word;
  hyphens: auto;
  position: relative;
  line-height: 40px;

  a {
    display: inline;
  }

  ${({ pillar }) =>
    pillar
    && css`
      text-align: left;
      font-size: 4.8rem;
    `}
  ${({ careerUpdate, theme }) => careerUpdate && css`
      margin-bottom: 3.6rem;
      line-height: 48px;
      @media (max-width: ${theme.breakpoint.medium}) {
        font-size: ${theme.modularScale.thirtyTwo};
        margin-bottom: 1.6rem;
      }
    `};
  ${({ timeline, theme }) => timeline && css`
      margin-bottom: 3.2rem;
      line-height: 56px;
      @media (max-width: ${theme.breakpoint.medium}) {
        font-size: ${theme.modularScale.thirtyTwo};
        margin-bottom: 1.6rem;
      }
    `};
`;

const Heading = (props) => (
  <>
    <StyledHeading
      element="h1"
      pillar={props.pillar}
      like={props.careerUpdate ? 'heading-2' : 'heading-3'}
      careerUpdate={props.careerUpdate}
      timeline={props.timeline}
      dangerouslySetInnerHTML={{ __html: props.data.heading_title }}
    />

    {props?.data?.heading_hr && <Ruler />}
  </>
);

Heading.defaultProps = {
  pillar: false
};

Heading.propTypes = {
  data: PropTypes.object.isRequired,
  pillar: PropTypes.bool,
  careerUpdate: PropTypes.bool,
  timeline: PropTypes.bool
};

Heading.defaultProps = {
  careerUpdate: false,
  timeline: false
};

Heading.whyDidYouRender = true;

export default memo(Heading);
