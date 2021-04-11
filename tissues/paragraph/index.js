import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Paragraph from '../../atoms/paragraph';
import Ruler from '../../atoms/ruler';

const StyledParagraph = styled(Paragraph)`
  margin: 0 auto;
  max-width: 50rem;
  text-align: ${(props) => (props.isStory ? 'left' : 'center')};

  a {
    font-family: inherit;
    display: inline;
  }

  p {
    margin: ${(props) => props.theme.modularScale.base} 0;
  }

  strong {
    font-weight: 600;
  }

  sub,
  sup {
    font-size: 0.6em;
  }

  sup {
    vertical-align: top;
  }

  sub {
    position: relative;
    top: 0.3em;
  }
`;

const ParagraphCms = (props) => (
  <>
    <StyledParagraph {...props} />
    { props.data?.paragraph_hr && <Ruler /> }
  </>
);

ParagraphCms.defaultProps = {
  isStory: false
};

ParagraphCms.propTypes = {
  data: PropTypes.object.isRequired,
  isStory: PropTypes.bool
};

export default ParagraphCms;
