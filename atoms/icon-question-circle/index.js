import React from 'react';
import styled from '@emotion/styled';
import svg from '../../public/images/question-mark-circle.svg';

const StyledIcon = styled(svg)`
  transition: all 150ms ease-in-out 0s;
  &:hover {
    transform: scale(1.3);
  }
`;

const Icon = (props) => <StyledIcon {...props} />;

export default Icon;
