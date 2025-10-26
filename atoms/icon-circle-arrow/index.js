import React from 'react';
import styled from '@emotion/styled';
import svg from '../../public/images/circle-arrow.svg';

const StyledIcon = styled(svg)``;

const Icon = React.forwardRef((props, ref) => (
    <StyledIcon ref={ref} {...props} />
));

export default Icon;
