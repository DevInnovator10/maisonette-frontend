import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Typography from '../../atoms/typography';

const Wrapper = styled.div`
    align-items: center;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  width: 100%;
  order: -1;
  
  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    padding: ${(props) => props.theme.modularScale.xlarge} ${(props) => props.theme.modularScale.large};
    width: 33.3333%;
    order: 0;
  }
`;

const Title = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: 0.85em;
`;

const Subtitle = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  order: -1;
`;

const Copy = styled(Typography)`
  color: ${(props) => props.theme.color.brand};

  a {
    font-family: inherit;
  }
`;

const ColorStoryCellText = (props) => (
  <Wrapper>
    <Title element="h1" like="heading-3">{props.data.color_story_cell_title}</Title>
    <Subtitle element="h2" like="paragraph-4">{props.data.color_story_cell_subtitle}</Subtitle>
    <Copy element="p" like="paragraph-1">{props.data.color_story_cell_body}</Copy>
  </Wrapper>
);

ColorStoryCellText.propTypes = {
  data: PropTypes.object.isRequired
};

ColorStoryCellText.whyDidYouRender = true;

export default ColorStoryCellText;
