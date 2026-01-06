import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {

  toggleCartModalVisibility,
  toggleNavigationVisibility
} from '../../store/modules/interfaces/actions';

export const Navigation = (Component) => (props) => (
  <Component {...props} />
);

const mapStateToProps = (state) => ({
  cartCount: state.cart.count,
  isCartActive: state.interfaces.isCartActive,
  isNavigationActive: state.interfaces.isNavigationActive,
  isGlobalSearchActive: state.interfaces.isGlobalSearchActive,
  profileId: state.profile.id,
  profileEmail: state.profile.email,
  profileFirstName: state.profile.first_name
});

const mapDispatchToProps = (dispatch) => ({
  toggleCartModal: (isActive) => dispatch(toggleCartModalVisibility(isActive)),
  toggleNavigation: (isActive) => dispatch(toggleNavigationVisibility(isActive))
});

const composedNavigationWrapper = compose(
  connect(mapStateToProps, mapDispatchToProps),
  Navigation
);

export default composedNavigationWrapper;
