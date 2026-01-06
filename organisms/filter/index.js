import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { updateFilters } from '../../store/modules/user/actions';
import { toggleActiveFilterAccordion } from '../../store/modules/activeFilterAccordion/actions';

export const Filter = (Component) => (props) => (
  <Component {...props} />
);

const mapStateToProps = (state) => ({
  activeFilter: state.activeFilterAccordion.filter,
  activeFilters: state.user.filters,
  priceFilter: state.user.priceFilter
});

const mapDispatchToProps = (dispatch) => ({
  toggleActiveFilterAccordion: (filter) => dispatch(toggleActiveFilterAccordion(filter)),
  updateSelectedFilters: (filter) => dispatch(updateFilters(filter))
});

export default compose(connect(mapStateToProps, mapDispatchToProps), Filter);
