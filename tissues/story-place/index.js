import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Typography from '../../atoms/typography';
import Ruler from '../../atoms/ruler';

const Wrapper = styled.section`
  align-items: center;
  display: flex;
  flex-direction: column;
  text-align: center;
  max-width: 480px;
  margin: auto;

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    padding: 0 ${(props) => props.theme.modularScale.large};
  }
`;

const Title = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: ${(props) => props.theme.modularScale.medium};
`;

const Copy = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: ${(props) => props.theme.modularScale.base};
  a {
    font-family: inherit;
    display: inline;
  }
`;

const Row = styled.div`
  align-items: center;
  color: ${(props) => props.theme.color.brand};
  display: flex;
  justify-content: center;
`;

const RowText = styled(Typography)`
  padding: 0 5px;
  width: 45%;

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    width: auto;
  }
`;

const StoryPlace = (props) => (
  <Wrapper>
    <Title element="h1" like="heading-3">
      {props.data.story_place_heading}
    </Title>
    <Copy element="p" like="paragraph-1" dangerouslySetInnerHTML={{ __html: props.data.story_place_description }} />
    {
      props.data.story_place_left && props.data.story_place_right
      && (
        <Row>
          <RowText element="span" like="paragraph-4">{props.data.story_place_left}</RowText>
          <span aria-hidden="true">|</span>
          <RowText element="span" like="paragraph-4">{props.data.story_place_right}</RowText>
        </Row>
      )
    }
    {props.data?.story_place_hr && <Ruler />}
  </Wrapper>
);

StoryPlace.propTypes = {
  data: PropTypes.object.isRequired
};

StoryPlace.whyDidYouRender = true;

export default StoryPlace;
