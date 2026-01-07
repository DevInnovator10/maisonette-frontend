import React, {
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import Router from 'next/router';

import getMiniQueryParam from '../../utils/getMiniQueryParam';
import useEventListener from '../../utils/hooks/useEventListener';
import manageFocus from '../../utils/manageFocus';

import Typography from '../../atoms/typography';
import PetiteDropdownList from '../../molecules/petite-profile-dropdown-list';
import CirclePlusSVG from '../../atoms/icon-circle-plus';
import IconLink from '../../molecules/icon-link';
import Button from '../../atoms/button';
import CrossIcon from '../../atoms/icon-cross';

import { togglePetiteDropdownState } from '../../store/modules/interfaces/actions';
import { updateActiveMini } from '../../store/modules/petites/actions';

const Overlay = styled.div`
  display: ${(props) => (props.isVisible ? 'block' : 'none')};
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: ${(props) => props.theme.layers.upstage};
`;

const PetiteDropdownWrapper = styled.div`
  max-height: ${(props) => (props.isPetiteDropdownActive ? `${props.scrollHeight}px` : '0')};
  overflow: hidden;
  visibility: ${(props) => (props.isPetiteDropdownActive ? 'visible' : 'hidden')};

  ${(props) => (
    props.isPetiteDropdownActive
      ? `transition: max-height ${props.theme.animation.default} ${props.theme.animation.easeInQuad};`
      : `transition: max-height ${props.theme.animation.default} ${props.theme.animation.easeOutQuad},
          visibility ${props.theme.animation.default};`
  )};
`;

const PetiteDropdownInner = styled.div`
  align-items: center;
  background: ${(props) => props.theme.color.brand};
  color: ${(props) => props.theme.color.white};
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.5rem 3rem;
  position: relative;
  z-index: ${(props) => props.theme.layers.centerstage};
`;

const PetiteDropdownLabel = styled(Typography)`
  color: #fff;
  letter-spacing: 0.24rem;
  line-height: 2;
  margin-bottom: 1.5rem;
  text-align: center;
  text-transform: uppercase;
`;

const AddEditMiniSVG = styled(CirclePlusSVG)`
  stroke-width: 5px;
  stroke: ${(props) => props.theme.color.white};
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;

  svg {
    padding: 1rem;
    stroke-width: 6;
    stroke: ${(props) => props.theme.color.white};
  }
`;

const PetiteDropdown = (props) => {
  const [height, setHeight] = useState(0);
  const [prevElement, setPrevElement] = useState(null);

  const profileLink = useRef(null);
  const petiteDropdownInner = useRef(null);

  const ref = useCallback((node) => {
    if (node !== null) {
      setHeight(props.isPetiteDropdownActive ? node.scrollHeight : 0);
    }
  }, [props.isPetiteDropdownActive]);

  // Close the bar when pressing the ESC key
  const handleEscKeypress = ({ code }) => {
    if (code !== 'Escape') return;
    props.togglePetiteDropdownState(false);
  };

  const handleClose = () => props.togglePetiteDropdownState(false);

  useEventListener('keyup', handleEscKeypress);

  useEffect(() => {
    const { current } = petiteDropdownInner;
    const previousElement = global.document.activeElement;
    if (props.isPetiteDropdownActive) setPrevElement(previousElement);
    manageFocus(current, props.isPetiteDropdownActive, prevElement, 400);
  }, [props.isPetiteDropdownActive]);

  const handleOnMiniClick = (id) => {
    props.updateActiveMini(id);
    global.document.cookie = `maisonette_active_mini=${id}; path=/`;
    props.togglePetiteDropdownState(!props.isPetiteDropdownActive);

    if (id !== 0) {
      Router.push({
        pathname: '/shop',
        query: {
          af: getMiniQueryParam(id, props.petites)
        }
      });
    } else {
      Router.push('/shop');
    }
  };

  return (
    <>
      <PetiteDropdownWrapper
        ref={ref}
        scrollHeight={height}
        isPetiteDropdownActive={props.isPetiteDropdownActive}
      >
        <PetiteDropdownInner ref={petiteDropdownInner}>
          <CloseButton aria-label="close petite profile selection dropdown" type="button" isIcon onClick={handleClose}>
            <CrossIcon />
          </CloseButton>

          <PetiteDropdownLabel element="h2" like="label-1">Petite Profiles</PetiteDropdownLabel>
          <PetiteDropdownList
            activeMini={props.activeMini}
            loading={props.loading}
            handleOnMiniClick={handleOnMiniClick}
            petites={props.petites}
          />
          <span ref={profileLink}>
            <IconLink
              text="Add/Edit Profiles"
              link="/petite-profiles"
              inverted
            >
              <AddEditMiniSVG />
            </IconLink>
          </span>
        </PetiteDropdownInner>
      </PetiteDropdownWrapper>
      <Overlay onClick={handleClose} isVisible={props.isPetiteDropdownActive} />
    </>
  );
};

PetiteDropdown.defaultProps = {
  activeMini: null
};

PetiteDropdown.propTypes = {
  activeMini: PropTypes.number,
  isPetiteDropdownActive: PropTypes.bool.isRequired,
  petites: PropTypes.object.isRequired,
  togglePetiteDropdownState: PropTypes.func.isRequired,
  updateActiveMini: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  isPetiteDropdownActive: state.interfaces.isPetiteDropdownActive,
  petites: state.petites,
  activeMini: state.petites.active_mini,
  loading: state.petites.loading
});

const mapDispatchToProps = (dispatch) => ({
  updateActiveMini: (id) => dispatch(updateActiveMini(id)),
  togglePetiteDropdownState: (flag) => dispatch(togglePetiteDropdownState(flag))
});

const ConnectedPetiteDropdown = connect(mapStateToProps, mapDispatchToProps)(PetiteDropdown);

ConnectedPetiteDropdown.displayName = 'PetiteDropdown';
ConnectedPetiteDropdown.whyDidYouRender = true;

export default ConnectedPetiteDropdown;
