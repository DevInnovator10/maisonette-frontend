import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PetiteProfileSelector from '../../molecules/petite-profile-selector';

import { togglePetiteDropdownState } from '../../store/modules/interfaces/actions';

export const PetiteDropdownTrigger = (props) => {
  if (props.loading) {
    const mini = { name: 'Loading...', id: -1 };
    return <PetiteProfileSelector mini={mini} />;
  }

  const getActiveMini = (id) => {
    if (props.minis && props.minis.length > 0) {
      if (id === 0) return { name: 'Everything', id: 0 };
      if (id > 0) return props.minis.find((m) => m.id === id);
    }

    return { name: 'Your Mini', id: -1 };
  };

  const updatePetiteDropdownState = () => {
    props.togglePetiteDropdownState(!props.isPetiteDropdownActive);
    const { window } = global;

    if (window && window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <PetiteProfileSelector
      mini={getActiveMini(props.activeMini)}
      handleOnTriggerClicked={updatePetiteDropdownState}
      isActive={props.isPetiteDropdownActive}
    />
  );
};

PetiteDropdownTrigger.defaultProps = {
  activeMini: null
};

PetiteDropdownTrigger.propTypes = {
  activeMini: PropTypes.number,
  isPetiteDropdownActive: PropTypes.bool.isRequired,
  minis: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  togglePetiteDropdownState: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  isPetiteDropdownActive: state.interfaces.isPetiteDropdownActive,
  minis: state.petites.minis,
  loading: state.petites.loading,
  activeMini: state.petites.active_mini
});

const mapDispatchToProps = (dispatch) => ({
  togglePetiteDropdownState: (flag) => dispatch(togglePetiteDropdownState(flag))
});

const ConnectedPetiteDropdownTrigger = connect(
  mapStateToProps, mapDispatchToProps
)(PetiteDropdownTrigger);

ConnectedPetiteDropdownTrigger.displayName = 'PetiteDropdownTrigger';
ConnectedPetiteDropdownTrigger.whyDidYouRender = true;

export default ConnectedPetiteDropdownTrigger;
