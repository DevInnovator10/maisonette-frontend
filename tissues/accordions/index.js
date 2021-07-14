import React from 'react';
import PropTypes from 'prop-types';

import Accordion from '../accordion';

const Accordions = (props) => (
  <dl>
    {
      Object.values(props.data).map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Accordion data={item} key={index} />

      ))
    }
  </dl>
);

Accordions.propTypes = {
  data: PropTypes.object.isRequired
};

export default Accordions;
