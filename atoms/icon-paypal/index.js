import React from 'react';
import styled from '@emotion/styled';
import svg from '../../public/images/paypal.svg';

const StyledIcon = styled(svg)``;

const Icon = (props) => (
    <StyledIcon {...props} />
);

export default Icon;
