import produce from '../../produce';

import * as types from './types';

const initialState = {
  wished_products: [],
  wishedProductsFromAlgolia: [],
  wishedProductsToShare: [],
  wishedProductsToShareStatus: false,
  wishedProductsShareableStatus: false
};

/* eslint-disable consistent-return */
/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
const reducer = produce((draft, action) => {
  switch (action.type) {
    case types.LISTS_UPDATE_ALGOLIA_LIST:
      draft.wishedProductsFromAlgolia = action.algoliaWishList;
      break;

    case types.LISTS_UPDATE_WISHLIST:
      draft.wished_products = action.wishlist;
      break;

    case types.LISTS_ADD_PRODUCT_TO_LIST:
      draft.wished_products.push(action.product);
      break;

    case types.LISTS_REMOVE_PRODUCT_FROM_LIST:
      draft.wished_products = draft.wished_products.filter(
        (x) => x.id !== action.product
      );
      break;

    case types.LISTS_ADD_PRODUCT_TO_ALGOLIA_LIST:
      draft.wishedProductsFromAlgolia.push(action.product);
      break;

    case types.LISTS_REMOVE_PRODUCT_FROM_ALGOLIA_LIST:
      draft.wishedProductsFromAlgolia = draft.wishedProductsFromAlgolia.filter(
        (x) => x.productId !== action.product
      );
      break;

    case types.LISTS_UPDATE_SHAREABLE_LIST_STATUS:

      draft.wishedProductsToShareStatus = action.status;
      break;

    case types.LISTS_SHARE_WISHED_PRODUCTS_LIST:
      draft.wishedProductsShareableStatus = action.status;
      break;

    case types.LISTS_UPDATE_SHAREABLE_LIST:
      draft.wishedProductsToShare = action.newShareableList;
      break;

    case types.LISTS_ADD_PRODUCT_TO_SHAREABLE_LIST:
      draft.wishedProductsToShare.push(action.product);
      break;

    case types.LISTS_REMOVE_PRODUCT_FROM_SHAREABLE_LIST:
      draft.wishedProductsToShare = draft.wishedProductsToShare.filter(
        (product) => product !== action.product
      );
      break;
  }
}, initialState);

export default reducer;
