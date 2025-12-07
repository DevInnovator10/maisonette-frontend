import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { setActivePetiteProfile } from '../../store/modules/activePetiteProfile/actions';
import { togglePetiteDropdownState } from '../../store/modules/interfaces/actions';
import {
  updatePetiteProfiles,
  addMiniToActivelyEditingList,
  removeMiniFromPetiteProfiles,
  updateIsAddingNewPetiteProfile
} from '../../store/modules/user/actions';

export const Petite = (Component) => (props) => (
  <Component {...props} />
);

const mapStateToProps = (state) => ({
  activelyEditingPetiteProfiles: state.user.activelyEditingPetiteProfiles,
  activeMini: state.activePetiteProfile.id,
  isAddingNewPetiteProfile: state.user.isAddingNewPetiteProfile,
  isPetiteDropdownActive: state.interfaces.isPetiteDropdownActive,
  minis: state.user.petiteProfiles
});

const mapDispatchToProps = (dispatch) => ({
  addMiniToActivelyEditingList: (id) => dispatch(addMiniToActivelyEditingList(id)),
  deletePetiteProfile: (id) => dispatch(removeMiniFromPetiteProfiles(id)),
  togglePetiteDropdownState: (isActive) => dispatch(togglePetiteDropdownState(isActive)),
  updateActivePetiteProfile: (id) => dispatch(setActivePetiteProfile(id)),
  updateIsAddingNewPetiteProfile: (flag) => dispatch(updateIsAddingNewPetiteProfile(flag)),
  updatePetiteProfiles: (mini) => dispatch(updatePetiteProfiles(mini))
});

export default compose(connect(mapStateToProps, mapDispatchToProps), Petite);
