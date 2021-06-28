import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import manageBodyOverflow from '../../utils/manageBodyOverflow';

const MobileMenuClose = styled.button`
  ${(props) => props.theme.close(props.theme.color.white, 'right', 16)}
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: block;
  height: 3.5rem;
  margin-top: 4rem;
  margin-left: auto;
  width: 3.5rem;
`;

const MobileMenu = styled.div`
  background: ${(props) => props.theme.color.brand};
  visibility: hidden;
  height: 100%;
  left: 0;
  overflow: scroll;
  padding: 1rem;
  position: fixed;
  top: 0;
  transform: translate(0, -100%);
  transition: transform ${(props) => props.theme.animation.fast} ${(props) => props.theme.animation.easeOutQuad};
  width: 100%;
  z-index: -1;

  ${(props) => props.isOpened && css`
    visibility: visible;
    transform: translate(0, 0);
    z-index: ${props.theme.layers.downstage};
  `}
`;

const MobileModal = (props) => {
  /**
   * TODO: Top blue banner should be behind the filters when active
   */
  const closeModalRef = useRef(null);

  useEffect(() => {
    const closeButton = closeModalRef.current;

    if (closeButton) closeButton.focus();

    manageBodyOverflow(props.isOpened);
  }, [props.isOpened]);

  return (
    <MobileMenu className={props.className} isOpened={props.isOpened}>
      <MobileMenuClose ref={closeModalRef} aria-label="close modal" type="button" onClick={props.onClose} />
      {props.children}
    </MobileMenu>
  );
};

MobileModal.defaultProps = {
  className: ''
};

MobileModal.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  isOpened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default MobileModal;
