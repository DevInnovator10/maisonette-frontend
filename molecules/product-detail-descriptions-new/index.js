import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Typography from '../../atoms/typography';

const Descriptions = styled.div`
  color: ${(props) => props.theme.color.bluePrimary};
  line-height: 1.5;
  margin-top: 3rem;
  margin-bottom: 7rem;
`;

const ProductDescriptionsRevamp = (props) => (
  <Descriptions className={props.className}>
    <Typography
      element="p"
      like="paragraph-5"
      dangerouslySetInnerHTML={{ __html: props.description }}
    />
  </Descriptions>
);

ProductDescriptionsRevamp.defaultProps = {
  description: '',
  className: ''
};

ProductDescriptionsRevamp.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string
};

export default ProductDescriptionsRevamp;
