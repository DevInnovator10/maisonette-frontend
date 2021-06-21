import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const CareerContentWrapper = styled.div`
  color: ${(props) => props.theme.color.brand};

  section {
    display: grid;
    grid-row-gap: ${(props) => props.theme.modularScale.medium};
    padding: ${(props) => props.theme.modularScale.large} 0;
    border-top: 1px solid ${(props) => props.theme.color.brand};

    @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
      grid-template-columns: 25% 75%;
    }
  }

  div {
    @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
      grid-column-start: 2;
    }
  }
  
  h2 {
    font-family: ${(props) => props.theme.font.heading};
    font-size: ${(props) => props.theme.modularScale.large};
    
    @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
      grid-column-start: 1;
    }
  }
  
  p, ul {
    font-size: ${(props) => props.theme.modularScale.base};
    
    @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
      grid-column-start: 2;
    }
  }

  li + li {
    margin-top: ${(props) => props.theme.modularScale.small};
  }

  p + ul {
    padding-left: ${(props) => props.theme.modularScale.small};
  }

  a {
    font: inherit;
  }
`;

const CareerContent = (props) => (
  props.content && <CareerContentWrapper dangerouslySetInnerHTML={{ __html: props.content }} />
);

CareerContent.propTypes = {
  content: PropTypes.string.isRequired
};

CareerContent.whyDidYouRender = true;

export default CareerContent;
