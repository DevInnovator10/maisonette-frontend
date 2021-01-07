import React from 'react';
import PropTypes from 'prop-types';

const Markup = (props) => (
  // eslint-disable-next-line react/no-danger
  <div className="markup" dangerouslySetInnerHTML={{ __html: props.data.markup }} />
);

Markup.propTypes = {
  data: PropTypes.object.isRequired
};

export default Markup;
