import * as types from './types';

export const updateAlgoliaWishlist = (algoliaWishList) => (dispatch) => (
    dispatch({
    type: types.LISTS_UPDATE_ALGOLIA_LIST,
    algoliaWishList
  })
);

export const updateWishlist = (wishlist) => (dispatch) => (
  dispatch({
    type: types.LISTS_UPDATE_WISHLIST,
    wishlist
  })
);

export const addProductToList = (product) => (dispatch) => (
  dispatch({
    type: types.LISTS_ADD_PRODUCT_TO_LIST,
    product
  })
);

export const removeProductFromList = (product) => (dispatch) => (
  dispatch({
    type: types.LISTS_REMOVE_PRODUCT_FROM_LIST,
    product
  })
);

export const addProductToAlgoliaList = (product) => (dispatch) =>
  dispatch({
    type: types.LISTS_ADD_PRODUCT_TO_ALGOLIA_LIST,
    product
  });

export const removeProductFromAlgoliaList = (product) => (dispatch) =>
  dispatch({
    type: types.LISTS_REMOVE_PRODUCT_FROM_ALGOLIA_LIST,
    product
  });

export const addProductToShareableList = (product) => (dispatch) =>
  dispatch({
    type: types.LISTS_ADD_PRODUCT_TO_SHAREABLE_LIST,
    product
  });

export const removeProductFromShareableList = (product) => (dispatch) =>
  dispatch({
    type: types.LISTS_REMOVE_PRODUCT_FROM_SHAREABLE_LIST,
    product
  });

export const updateShareableListStatus = (status) => (dispatch) =>
  dispatch({
    type: types.LISTS_UPDATE_SHAREABLE_LIST_STATUS,
    status
  });

export const updateShareableList = (newShareableList) => (dispatch) =>
  dispatch({

    type: types.LISTS_UPDATE_SHAREABLE_LIST,
    newShareableList
  });

export const shareWishedProducts = (status) => (dispatch) =>
  dispatch({
    type: types.LISTS_SHARE_WISHED_PRODUCTS_LIST,
    status
  });
