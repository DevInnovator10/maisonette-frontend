import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import { useMountTransition } from '../../utils/hooks';

// This function creates the div with data-test-id='drawer-root' to use by Portal
// in case of the body doesn't have. It's similar to MobileBottomSheet.
function createPortalRoot() {
  const drawerRoot = global.document.createElement('div');
  drawerRoot.setAttribute('data-test-id', 'drawer-root');

  return drawerRoot;
}

const Menu = styled.div`
  .backdrop-open-inT {
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
    z-index: ${(props) => props.theme.layers.balcony - 1};
  }
`;

const Container = styled.div`
  max-width: 375px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding-top: 1rem;
  background-color: white;
  overflow: auto;
  position: fixed;
  transition: transform ${(props) => props.theme.animation.default} ease;
  z-index: ${(props) => props.theme.layers.balcony};
`;

const Backdrop = styled.div`
  visibility: hidden;
  opacity: 0;
  background: rgba(0, 0, 0, 0.25);
  transition: opacity ${(props) => props.theme.animation.default} ease,
    visibility ${(props) => props.theme.animation.default} ease;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  z-index: 0;
`;

const DesktopModal = ({
  isOpen,
  children,
  className,
  onClose,
  removeWhenClosed = true
}) => {
  const bodyRef = useRef(null);
  const portalRootRef = useRef(null);
  const isTransitioning = useMountTransition(isOpen, 100);

  // This appends react portal root on mount
  useEffect(() => {
    bodyRef.current = global.document.querySelector('body');
    portalRootRef.current = global.document.querySelector("[data-test-id='drawer-root']") || createPortalRoot();
    bodyRef.current.appendChild(portalRootRef.current);
    const portal = portalRootRef.current;
    const bodyEl = bodyRef.current;

    return () => {
      // This cleans up the portal when drawer component unmounts
      portal.remove();
      // Ensures scroll overflow is removed
      bodyEl.style.overflow = '';
    };
  }, []);

  // Prevents page scrolling when the drawer is open
  useEffect(() => {
    const updatePageScroll = () => {
      if (isOpen) {
        bodyRef.current.style.overflow = 'hidden';
      } else {
        bodyRef.current.style.overflow = '';
      }
    };

    updatePageScroll();
  }, [isOpen]);

  // Allows Escape key to dismiss the drawer
  useEffect(() => {
    const onKeyPress = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) global.window.addEventListener('keyup', onKeyPress);

    return () => global.window.removeEventListener('keyup', onKeyPress);
  }, [isOpen, onClose]);

  if (!isTransitioning && removeWhenClosed && !isOpen) {
    return null;
  }

  return createPortal(
    <Menu
      aria-hidden={isOpen ? 'false' : 'true'}
      className={className}
      data-modal-part={'drawer-container'}
    >
      <Container
        data-modal-part={'drawer'}
        data-modal-position={'bottom'}
        role={'dialog'}
        data-modal-open={isOpen}
        data-modal-transitioning={isTransitioning}
      >
        {children}
      </Container>
      <Backdrop
        data-modal-part={'backdrop'}
        className={`backdrop-${isOpen ? 'open' : '-'}-${
          isTransitioning ? 'inT' : '-'
        }`}
        onClick={onClose}
      />
    </Menu>,
    portalRootRef.current
  );
};

DesktopModal.defaultProps = {
  isOpen: false,
  children: null,
  className: '',
  onClose: () => {},
  removeWhenClosed: true
};

DesktopModal.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  removeWhenClosed: PropTypes.bool
};

export default DesktopModal;
