import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import { useMountTransition } from '../../utils/hooks';

function createPortalRoot() {
  const drawerRoot = global.document.createElement('div');
  drawerRoot.setAttribute('data-test-id', 'drawer-root');

  return drawerRoot;
}

const MobileMenu = styled.div`
  transition-speed: ${(props) => props.theme.animation.default};
  [data-modal-transitioning="true"][data-modal-open="true"] {
    transform: translateY(0);
  }
  .backdrop-open-inT {
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
    z-index: ${(props) => props.theme.layers.balcony - 1};
  }
`;

const Container = styled.div`
width: 100%;
bottom: 0;
left: 0;
right: 0;
width: 100%;
transform: translateY(100%);
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
  background: rgba(148, 148, 148, 0.6);
  transition: opacity ${(props) => props.theme.animation.default} ease,
  visibility ${(props) => props.theme.animation.default} ease;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  pointer-events: none;
  z-index: 0;
`;

const MobileBottomSheet = ({
  isOpen,
  children,
  className,
  onClose,
  removeWhenClosed = true
}) => {
  const bodyRef = useRef(global.document.querySelector('body'));
  const portalRootRef = useRef(
    global.document.querySelector('[data-test-id=\'drawer-root\']') || createPortalRoot()
  );
  const isTransitioning = useMountTransition(isOpen, 400);

  // This appends react portal root on mount
  useEffect(() => {
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

    if (isOpen) {
      global.window.addEventListener('keyup', onKeyPress);
    }

    return () => {
      global.window.removeEventListener('keyup', onKeyPress);
    };
  }, [isOpen, onClose]);

  if (!isTransitioning && removeWhenClosed && !isOpen) {
    return null;
  }

  return createPortal(
    <MobileMenu
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
        className={`backdrop-${isOpen ? 'open' : '-'}-${isTransitioning ? 'inT' : '-'}`}
        onClick={onClose}
      />
    </MobileMenu>,
    portalRootRef.current
  );
};

MobileBottomSheet.defaultProps = {
  isOpen: false,
  children: null,
  className: '',
  onClose: () => {},
  removeWhenClosed: true
};

MobileBottomSheet.propTypes = {
  isOpened: PropTypes.bool,
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  removeWhenClosed: PropTypes.bool
};

export default MobileBottomSheet;
