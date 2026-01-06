import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Anchor from '../../atoms/anchor';

import SVGIcon from '../../public/images/logos/icon.svg';
import SVGText from '../../public/images/logos/text.svg';

const SVGWrapper = styled(Anchor)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Text = styled(SVGText)`
  padding: 2rem 0;
  height: 4.8rem;
`;

const Icon = styled(SVGIcon)``;

const Logo = (props) => (
  <SVGWrapper href="/" small={props.small}>
    <Icon />
    { !props.small ? <Text /> : undefined }
  </SVGWrapper>
);

Logo.defaultProps = {
  small: false
};

Logo.propTypes = {
  small: PropTypes.bool
};

export default Logo;
