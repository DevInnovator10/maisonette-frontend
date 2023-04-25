import produce from '../../produce';

import * as types from './types';

const initialState = {
  products: [],
  scrollY: 0,
  slug: '',
  pages: null,
  sort: '',
  facets: [],
  meta: {},
  slider: [],
  tracking: {},
  product: null
};

/* eslint-disable consistent-return */
/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
const reducer = produce((draft, action) => {
  switch (action.type) {
    case types.PRODUCTS_UPDATE_PRODUCTS:
      draft.products = action.products;
      break;

    case types.PRODUCTS_UPDATE_SCROLL_Y:
      draft.scrollY = action.scrollY;
      break;

    case types.PRODUCTS_UPDATE_SLUG:
      draft.slug = action.slug;
      break;

    case types.PRODUCTS_UPDATE_PAGES:
      draft.pages = action.pages;
      break;

    case types.PRODUCTS_UPDATE_SORT:
      draft.sort = action.sort;
      break;

    case types.PRODUCTS_UPDATE_FACETS:
      draft.facets = action.facets;
      break;

    case types.PRODUCTS_UPDATE_META:
      draft.meta = action.meta;
      break;

    case types.PRODUCTS_UPDATE_SLIDER:
      draft.slider = action.slider;
      break;

    case types.PRODUCTS_UPDATE_TRACKING:
      draft.tracking = action.tracking;
      break;

    case types.PRODUCTS_UPDATE_CLICKED_PRODUCT:
      draft.product = action.id;
      break;
  }
}, initialState);

export default reducer;
