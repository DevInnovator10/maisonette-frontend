import * as types from './types';

export const setUserProfile = (user) => (dispatch) => {
  if (global?.document && user.first_name) {
    const userCookieData = JSON.stringify({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
      subscribed: user.subscribed
    });

    global.document.cookie = `maisonette_user_data=${userCookieData}; Max-Age=${process.env.NEXT_PUBLIC_COOKIE_MAX_AGE}; path=/;`;
  }

  return dispatch({
    type: types.PROFILE_SET_PROFILE,
    user
  });
};

export const deletePaymentSource = (payment_source_id) => (dispatch) => (
  dispatch({
    type: types.PROFILE_DELETE_PAYMENT_SOURCE,
    payment_source_id
  })
);

export const setDefaultPaymentSource = (payment_source_id) => (dispatch) => (
  dispatch({
    type: types.PROFILE_SET_DEFAULT_PAYMENT_SOURCE,
    payment_source_id
  })
);

export const resetUserProfile = () => (dispatch) => (
  dispatch({
    type: types.PROFILE_RESET_PROFILE
  })
);

export const toggleUserLoading = (loading) => (dispatch) => (
  dispatch({
    type: types.PROFILE_TOGGLE_LOADING,
    loading
  })
);

export const setAlgoliaGuestUserToken = (algoliaGuestUserToken) => (dispatch) => (
  dispatch({
    type: types.PROFILE_SET_ALGOLIA_GUEST_TOKEN,
    algoliaGuestUserToken
  })
);
