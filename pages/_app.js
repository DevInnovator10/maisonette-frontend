// import '../utils/wdyr';
import { useRouter } from 'next/router';
import 'lazysizes';
import { Provider, useStore } from 'react-redux';
import { ThemeProvider } from 'emotion-theming';
import * as Sentry from '@sentry/node';
import { ExtraErrorData } from '@sentry/integrations';
import dynamic from 'next/dynamic';
import NProgress from 'accessible-nprogress';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import sha1 from 'sha1';
import App from 'next/app';

/* Utils */
import contentGrouping, {
  isBrandPLP,
  isLeScoop,
  isProductListing,
  isSharedWishlist
} from '../utils/contentGrouping';
import deleteCookies from '../utils/deleteCookies';
import getCookie from '../utils/getCookie';
import setSubscribedInWindow from '../utils/setSubscribedInWindow';
import hasError from '../utils/hasError';
import Amplitude, { logAmplitude, setUser as setUserAmplitude } from '../utils/amplitude';
import { trackPageType } from '../utils/tracking';

import { SearchProvider } from '../utils/context/search-provider';
import { ProductProvider } from '../utils/context/product-provider';
import { getPromoContent, getMobileNavigation } from '../cms-generals';
import { generateGuestUserToken } from '../utils/algolia';

/* Redux Store */
import { setMobileNavigation, setDesktopNavigation } from '../store/modules/navigation/actions';
import { setPetiteProfiles, updateActiveMini } from '../store/modules/petites/actions';
import { setPromotions } from '../store/modules/promotions/actions';
import { storeWrapper } from '../store';
import { updateWishlist } from '../store/modules/lists/actions';
import {
  toggleUserLoading,
  setUserProfile,
  resetUserProfile,
  setAlgoliaGuestUserToken
} from '../store/modules/profile/actions';

import {
  resetUser,
  setLastPageVisited,
  setToken,
  updateIsSubscribedToReceiveEmails
} from '../store/modules/user/actions';

import {
  toggleCartModalVisibility,
  toggleNavigationVisibility,
  togglePetiteDropdownState,
  setGlobalPageType
} from '../store/modules/interfaces/actions';

import {
  updateCart,
  updateCount,
  updateCartLoading,
  removeCart
} from '../store/modules/cart/actions';

/* Theme */
import theme from '../theme';
import GlobalStyles from '../theme/styles';

/* API */
import {
  getCart,
  getCurrentCart,
  getDefaultWishlist,
  getGenerals,
  getMinis,
  getNavigation,
  getUser,
  identifyKustomer
} from './api';

/* Layout */
import DefaultLayout from '../layouts/default';

/* Components */
const Subscribe = dynamic(() => import('../organs/subscribe'));
const ToastContainer = dynamic(() => import('../atoms/toast-container'));

/* Constants */
const VALID_USER_TOKEN_LENGTH = 48;
const SUBSCRIBE_WAIT_DURATION = 10000;

let PENDING_LUX_TRACKING = false;
let SUBSCRIBE_SHOW_TIMER = null;

Sentry.init({
  environment: process.env.NEXT_PUBLIC_SENTRY_ENV,
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  release: process.env.npm_package_version,
  integrations: [new ExtraErrorData()],
  ignoreErrors: ['Non-Error promise rejection captured']
});

Amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_KEY, null,
  {
    includeUtm: true,
    includeReferrer: true,
    saveParamsReferrerOncePerSession: false,
    unsetParamsReferrerOnNewSession: true
  });

const Maisonette = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { Component, pageProps } = props;
  const Layout = Component.Layout || DefaultLayout;

  // ?? {} used to load router on server
  const router = useRouter() ?? {};
  const store = useStore();

  const history = useRef([]);
  const [showModal, setShowModal] = useState(0);
  const [subscribedToEmails, setIsSubscribedToEmails] = useState(0);

  const SUBSCRIBE_BLACKLIST = [
    '/account',
    '/orders',
    '/returns',
    '/credits',
    '/petite-profiles',
    '/login',
    '/password',
    '/signup',
    '/checkout'
  ];

  const containsBlacklistedString = (urlPath) =>
    SUBSCRIBE_BLACKLIST.some((str) => urlPath.includes(str));

  const toggleEmailModal = (url) => {
    const disableSubscription = router.query.disable_subscribe === '1';
    const emailSubscription = getCookie('subscribed_to_emails');
    const emailSubscriptionSuppress = getCookie('subscribed_to_emails_suppression');

    store.dispatch(
      updateIsSubscribedToReceiveEmails(
        emailSubscriptionSuppress || emailSubscription || disableSubscription
      )
    );

    if (!containsBlacklistedString(url) && !(subscribedToEmails || emailSubscriptionSuppress)) {
      SUBSCRIBE_SHOW_TIMER = setTimeout(() => setShowModal(true), SUBSCRIBE_WAIT_DURATION);
    }
  };

  const loadKustomer = (id = null) => {
    // let this catch up before executing
    setTimeout(() => {
      if (process.env.NEXT_PUBLIC_KUSTOMER_ACTIVE === 'true') {
        try {
          identifyKustomer({ id });
        } catch (e) {
          identifyKustomer({ id: null });
        }
      }
    }, 0);
  };

  const fetchCurrentCart = () => {
    store.dispatch(updateCartLoading(true));

    getCurrentCart().then((cart) => {
      if (hasError(cart)) {
        cart.errors.map((error) => Sentry.captureMessage(error));
        store.dispatch(updateCartLoading(false));
        return;
      }

      // save cart to store
      if (cart) store.dispatch(updateCart(cart));
      else store.dispatch(updateCount(0));

      store.dispatch(updateCartLoading(false));
    }).catch(() => deleteCookies(true));
  };

  const fetchUserData = () => {
    const userData = getCookie('maisonette_user_data');

    const saveUserDataToStore = (user) => {
      const spreeApiKey = getCookie('maisonette_user_token');

      if (spreeApiKey && user) {
        // save spree_api_key
        store.dispatch(setToken('spree_api_key', spreeApiKey));
        // save user to store
        store.dispatch(setUserProfile(user));
        // set user subscribed cookie
        setIsSubscribedToEmails(user.subscribed);
        // check to show email modal
        toggleEmailModal('/');
        // load kustomer
        loadKustomer(user.id);
      }
    };

    if (userData) {
      const user = JSON.parse(userData);
      saveUserDataToStore(user);
    }

    getUser().then((user) => {
      // reset Sentry user scope
      Sentry.configureScope((scope) => scope.setUser(null));
      if (hasError(user)) {
        user.errors.map((error) => Sentry.captureMessage(error));
        return;
      }

      // set Sentry user scope if user returned
      Sentry.configureScope((scope) => {
        scope.setUser({ id: user.id, email: user.email });
      });

      // set Amplitude user
      setUserAmplitude({ user });

      saveUserDataToStore(user);
    })
      .catch(() => deleteCookies(true))
      .finally(() => store.dispatch(toggleUserLoading(false)));
  };

  const fetchMinis = () => {
    getMinis().then((minis) => {
      if (hasError(minis)) {
        minis.errors.map((error) => Sentry.captureMessage(error));
        return;
      }

      // save petite profile to store
      store.dispatch(setPetiteProfiles(minis));
    }).catch(() => deleteCookies(true));
  };

  const fetchWishlist = () => {
    getDefaultWishlist().then((wishlist) => {
      if (hasError(wishlist)) {
        wishlist.errors.map((error) => Sentry.captureMessage(error));
        return;
      }

      // save wishlist to store
      store.dispatch(updateWishlist(wishlist?.wished_products ?? []));
    }).catch(() => deleteCookies(true));
  };

  const getUserAppData = async () => {
    fetchCurrentCart();
    fetchUserData();
    fetchMinis();
    fetchWishlist();
  };

  const getGuestAppData = () => {
    const token = getCookie('maisonette_order_token');
    const number = getCookie('maisonette_order_number');

    if (token && number) {
      getCart({ order_number: number }).then((cart) => {
        // save cart to store
        if (cart) store.dispatch(updateCart(cart));
        else store.dispatch(updateCount(0));
      }).catch((error) => {
        Sentry.captureException(error);
        // error fetching user data, delete all user data
        deleteCookies(true);
      }).finally(() => {
        store.dispatch(updateCartLoading(false));
      });
    } else {
      store.dispatch(updateCartLoading(false));
    }

    // set Amplitude user
    setUserAmplitude({ user: null });

    // generate Algolia guest user token and save to store
    const algoliaUserToken = generateGuestUserToken(Amplitude);

    store.dispatch(setAlgoliaGuestUserToken(algoliaUserToken));

    store.dispatch(toggleUserLoading(false));
  };

  const fetchMainNavigation = () => {
    getNavigation().then((res) => {
      if (hasError(res)) {
        res.errors.map((error) => Sentry.captureMessage(error));
        return;
      }

      store.dispatch(setDesktopNavigation(res));
    }).catch((error) => Sentry.captureMessage(error));
  };

  const storeMobileNavigation = (siteConstants) => {
    try {
      store.dispatch(setMobileNavigation(getMobileNavigation(siteConstants)));
    } catch (error) {
      Sentry.captureMessage(error);
    }
  };

  const storePromoContent = (siteConstants) => {
    try {
      store.dispatch(setPromotions(getPromoContent(siteConstants)));
    } catch (error) {
      Sentry.captureMessage(error);
    }
  };

  const getAppConstants = async () => {
    const siteConstants = await getGenerals();

    fetchMainNavigation();
    storeMobileNavigation(siteConstants);
    storePromoContent(siteConstants);
  };

  const getAppData = () => {
    getAppConstants();

    const token = getCookie('maisonette_user_token');

    if (token && token.length !== VALID_USER_TOKEN_LENGTH) {
      global.document.cookie = 'maisonette_user_token=; Max-Age=0; path=/;';
      global.document.cookie = 'maisonette_user_data=; Max-Age=0; path=/;';
      return;
    }

    try {
      if (!getCookie('maisonette_session_token')) {
        global.fetch('/api/session-token')
          .then((r) => r.json())
          .then((response) => {
            global.document.cookie = `maisonette_session_token=${response.token}; path=/;`;
            Sentry.setTags({
              maisonette_session_token: response.token
            });
          });
      }
    } catch (error) {
      Sentry.captureMessage(error);
    }

    if (token) getUserAppData();
    else getGuestAppData();
  };

  const setPageType = (url) => {
    const path = url || router.asPath || global.pathname;
    const token = getCookie('maisonette_session_token');

    const pageType = path === '/404'
      ? 'Page Not Found'
      : contentGrouping(props);

    store.dispatch(setGlobalPageType(pageType));
    if (pageType !== 'Product Description Pages') {
      // do not call the page view event for PDPs
      // need to call this on the page itself to ensure
      // GA page and product view events fire in correct order
      trackPageType(pageType, path);
    }

    Sentry.setTags({
      'page.group': pageType,
      'page.path': global.window.location.pathname,
      maisonette_session_token: token
    });
  };

  const checkIsValidUser = () => {
    const { user } = store.getState();
    const token = getCookie('maisonette_user_token');

    if (user.spree_api_key !== token) {
      store.dispatch(resetUser());
      store.dispatch(resetUserProfile());
      store.dispatch(removeCart());
      deleteCookies();
    }
  };

  const resetInterfaces = (url) => {
    const activeMini = getCookie('maisonette_active_mini');
    store.dispatch(setLastPageVisited(url));
    store.dispatch(updateActiveMini(+activeMini));
    store.dispatch(toggleNavigationVisibility(false));
    store.dispatch(togglePetiteDropdownState(false));
    store.dispatch(toggleCartModalVisibility(false));
  };

  const identifyUser = () => {
    const userCookie = getCookie('maisonette_user_data');
    const user = userCookie ? JSON.parse(userCookie) : null;

    global.ire('identify', {
      customerId: user?.id ?? '',
      customerEmail: user?.email
        ? sha1(user.email)
        : ''
    });
  };

  const onRouteChangeStart = (url, { shallow }) => {
    if (PENDING_LUX_TRACKING) {
      global.LUX.send();
      PENDING_LUX_TRACKING = false;
    }

    global.LUX.init();

    if (!shallow) {
      NProgress.start();
    }

    checkIsValidUser();

    // close all modals and set previous page active
    resetInterfaces(url);

    if (SUBSCRIBE_SHOW_TIMER) {
      clearTimeout(SUBSCRIBE_SHOW_TIMER);
      SUBSCRIBE_SHOW_TIMER = null;
    }
  };

  const onRouteChangeComplete = (url) => {
    global.LUX.send();
    setPageType(url);
    NProgress.done();
    toggleEmailModal(url);

    if (history?.current?.length) {
      const previous = history?.current[history?.current?.length - 1];
      if (previous && previous !== url) identifyUser();
    }
  };

  const onRouteChangeError = () => {
    NProgress.done();
  };

  const setActiveMini = () => {
    const mini = getCookie('maisonette_active_mini');
    if (mini) store.dispatch(updateActiveMini(+mini));
  };

  const resetAppState = () => {
    store.dispatch(toggleNavigationVisibility(false));
    store.dispatch(togglePetiteDropdownState(false));
    store.dispatch(toggleCartModalVisibility(false));
  };

  // component did mount
  useEffect(() => {
    getAppData();

    setPageType();
    setActiveMini();
    resetAppState();

    const { utmMedium } = router.query;

    if (utmMedium === 'email') {
      global.document.cookie = 'subscribed_to_emails=1; path=/';
      global.document.cookie = 'subscribed_to_emails_suppression=1; Max-Age=31556926';
    }

    toggleEmailModal(router.asPath);

    setSubscribedInWindow();

    global.history.scrollRestoration = 'manual';

    NProgress.configure({ trickleSpeed: 400 });

    identifyUser();

    // bind events
    router.events.on('routeChangeStart', onRouteChangeStart);
    router.events.on('routeChangeComplete', onRouteChangeComplete);
    router.events.on('routeChangeError', onRouteChangeError);

    // unbind events
    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart);
      router.events.off('routeChangeComplete', onRouteChangeComplete);
      router.events.off('routeChangeError', onRouteChangeError);
    };
  }, []);

  // component did update
  useEffect(() => {
    if (history.current[history.length - 1] !== router.asPath) {
      history.current = [...history.current, router.asPath];
    }

    Sentry.configureScope((scope) => {
      try {
        // send cookies to sentry
        const allCookies = getCookie();
        scope.setContext('cookies', allCookies);
      } catch (e) { /* noop */ }

      try {
        // send local storage to sentry
        scope.setContext('local storage', { ...global.localStorage });
      } catch (e) { /* noop */ }

      try {
        // send cart state to sentry
        const state = Object.entries(
          store.getState().cart
        ).reduce((acc, [key, value]) => {
          const temp = acc;

          // stringify store values since Sentry
          // doesn't expand objects in context
          if (typeof temp[key] !== 'object') {
            temp[key] = JSON.stringify(value);
          }

          return temp;
        }, {});
        scope.setContext('cart', state);
      } catch (e) { /* noop */ }
    });
  });

  useEffect(() => {
    // tracks Amplitude page view events
    // some page view events require data

    // prevent tracking for Listing and brand related pathnames
    // as prop pageProps not update on filter and moved listing tracking to Algolia.js file
    if (!isBrandPLP(router)
       && !isProductListing(router)
       && !isLeScoop(router)
       && !isSharedWishlist(router)) {
      logAmplitude(null, props.pageProps);
    }

    // notify VWO on each page transition
    global.window.VWO = global.window.VWO || [];
    global.window.VWO.push(['activate', {
      customUrl: router.asPath
    }]);
  }, [router.asPath]);

  return (
    <Provider store={store}>
      {GlobalStyles}

      <a className="skiptocontent" href="#maincontent">skip to main content</a>

      <ToastContainer />
      <SearchProvider>
        <ProductProvider>
          <ThemeProvider theme={theme}>
            <Layout>
              {
                  process.env.NEXT_PUBLIC_SHOW_EMAIL_MODAL === 'true'
                  && !store.getState().user?.isSubscribedToReceiveEmails
                  && showModal
                  && !containsBlacklistedString(router.asPath) ? <Subscribe /> : null
                }

              <Component
                {...pageProps}
                store={store}
                key={router.route}
                history={history?.current ?? []}
              />
            </Layout>
          </ThemeProvider>
        </ProductProvider>
      </SearchProvider>

    </Provider>
  );
};

Maisonette.defaultProps = {
  Component: null,
  pageProps: {}
};

Maisonette.propTypes = {
  Component: PropTypes.elementType,
  pageProps: PropTypes.object
};

Maisonette.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default storeWrapper.withRedux(Maisonette);
