import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import IconQuestionCircle from '../icon-question-circle';

const IconWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9000;
  cursor: pointer;
  filter: drop-shadow(rgba(0, 0, 0, 0.3) 1px 1px 3px);
`;

const ButtonChat = ({ children, onClick, ...rest }) => (
  <IconWrapper role="button" onClick={onClick} {...rest}>
    <IconQuestionCircle />
    {children}
  </IconWrapper>
);

ButtonChat.defaultProps = {
  children: ''
};

ButtonChat.propTypes = {
  children: PropTypes.oneOfType([PropTypes.any]),
  onClick: PropTypes.func.isRequired
};

ButtonChat.whyDidYouRender = true;

export default ButtonChat;
