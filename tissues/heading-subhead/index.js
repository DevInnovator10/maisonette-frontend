import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Typography from '../../atoms/typography';
import Ruler from '../../atoms/ruler';

const Wrapper = styled.section`
  display: grid;
  justify-items: center;
  grid-row-gap: ${(props) => props.theme.modularScale['2xlarge']};
  line-height: normal;
`;

const Title = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  order: ${(props) => (props.onTop ? '0' : '1')};
`;

const Subtitle = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
`;

const HeadingSubhead = (props) => (
  <Wrapper>
    <Title element="h1" like="heading-3" onTop={props.data.hs_heading_top}>
      {props.data.hs_heading}
    </Title>
    <Subtitle element="h2" like="paragraph-4">
      {props.data.hs_subhead}
    </Subtitle>
    {props.data?.hs_hr && <Ruler />}
  </Wrapper>
);

HeadingSubhead.propTypes = {
  data: PropTypes.object.isRequired
};

HeadingSubhead.whyDidYouRender = true;

export default HeadingSubhead;
