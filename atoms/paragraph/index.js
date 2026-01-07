import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Typography from '../typography';

const P = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: 1em;
`;

const Paragraph = (props) => (
  <P className={props.className} element="p" like="paragraph-1" dangerouslySetInnerHTML={{ __html: props.data.paragraph }} />
);

Paragraph.defaultProps = {
  className: ''
};

Paragraph.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object.isRequired
};

export default Paragraph;
