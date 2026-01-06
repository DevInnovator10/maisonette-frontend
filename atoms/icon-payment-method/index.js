import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import handleOnImageError from '../../utils/handleOnImageError';

const StyledIcon = styled.img`
  // to handle image error height
  max-height: 4rem;
  height: auto;
  width: auto;
`;

const Icon = (props) => (
  <StyledIcon
    src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/checkout/${props.payment}.svg`}
    alt={`${props.payment} display icon`}
    onError={handleOnImageError}
    {...props}
  />
);

Icon.propTypes = {
  payment: PropTypes.string.isRequired
};

export default Icon;
