import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { setActivePromo } from '../../store/modules/activePromo/actions';

export const Promotion = (Component) => (props) => (
    <Component {...props} />
);

const mapStateToProps = (state) => ({
  activePromo: state.activePromo.index
});

const mapDispatchToProps = (dispatch) => ({
  setActivePromo: (index) => dispatch(setActivePromo(index))
});

export default compose(connect(mapStateToProps, mapDispatchToProps), Promotion);
