import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { toggleGlobalSearchVisibility } from '../../store/modules/interfaces/actions';
import {
    updateSearchTerm,
  updateSearchHint,
  updateSearchResultsCount,
  updateSearchResultsCorrected
} from '../../store/modules/user/actions';

export const Search = (Component) => (props) => (
  <Component {...props} />
);

const mapStateToProps = (state) => ({
  activeMini: state.petites?.active_mini,
  isGlobalSearchActive: state.interfaces.isGlobalSearchActive,
  isNavigationActive: state.interfaces.isNavigationActive,
  areSearchResultsCorrected: state.user.areSearchResultsCorrected,
  globalSearchTerm: state.user.searchTerm,
  globalSearchHint: state.user.searchHint,
  globalSearchResultsCount: state.user.searchResultsCount,
  petites: state.petites
});

const mapDispatchToProps = (dispatch) => ({
  toggleGlobalSearchVisibility: (isActive) => dispatch(toggleGlobalSearchVisibility(isActive)),
  updateSearchTerm: (term) => dispatch(updateSearchTerm(term)),
  updateSearchHint: (hint) => dispatch(updateSearchHint(hint)),
  updateSearchResultsCorrected: (flag) => dispatch(updateSearchResultsCorrected(flag)),
  updateSearchResultsCount: (count) => dispatch(updateSearchResultsCount(count))
});

export default compose(connect(mapStateToProps, mapDispatchToProps), Search);
