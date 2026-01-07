import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { updateQuickShopProduct, updateQuickShopIndex } from '../../store/modules/activeQuickshop/actions';

export const Product = (Component) => (props) => (
  <Component {...props} />
);

const mapStateToProps = (state) => ({
  products: state.products,
  quickShopIndex: state.activeQuickshop.index,
  quickShopProductId: state.activeQuickshop.id
});

const mapDispatchToProps = (dispatch) => ({
  updateQuickShopIndex: (index) => dispatch(updateQuickShopIndex(index)),

  updateQuickShopProduct: (id) => dispatch(updateQuickShopProduct(id))
});

export default compose(connect(mapStateToProps, mapDispatchToProps), Product);
