/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import Amplitude, { logAmplitude } from '../utils/amplitude';
import isMobile from '../utils/isMobile';
import { aa, generateGuestUserToken } from '../utils/algolia';
import { setKustomerChatBotStarted } from '../store/modules/interfaces/actions';

// Context
import useObserver from '../utils/hooks/useObserver';
import { useSearch } from '../utils/context/search-provider';
import { useProduct } from '../utils/context/product-provider';

const { window } = global;
const CartDrawer = dynamic(() => import('../organs/cart'));
const Vestibule = dynamic(() => import('../organs/vestibule'));
const Footer = dynamic(() => import('../organs/footer'));
const ButtonChat = dynamic(() => import('../atoms/button-chat'));

const DefaultLayout = (props) => {
  // ?? {} used to load router on server
  const {
    isKustomerChatBotStarted: chatbotStarted,
    setKustomerChatBotStarted: setChatbotStarted,
    isCartActive,
    isWishlistToShareModalOpen
  } = props;
  const router = useRouter() ?? {};
  const [displayPageOnly, setDisplayPageOnly] = useState(false);
  const navigation = useSelector((state) => state.navigation);
  const promotions = useSelector((state) => state.promotions.content);

  const { setAlgoliaUserToken } = useSearch();

  useEffect(() => {
    const { userID, algoliaGuestUserToken } = props;

    // if user is logged in and
    // was not browsing as a guest,
    // then set the userToken in Context & Algolia
    if (userID) {
      // userToken needs to be a string
      const algoliaUserToken = userID.toString();

      setAlgoliaUserToken(algoliaUserToken);
      aa('setUserToken', algoliaUserToken);
    } else if (algoliaGuestUserToken) {
      // if user is only a guest,
      // set guestUserToken in Context & Algolia

      setAlgoliaUserToken(algoliaGuestUserToken);
      aa('setUserToken', algoliaGuestUserToken);
    } else if (!algoliaGuestUserToken && !userID) {
      // Logged out situation to re-assign the algolia
      // userToken back to random hash or Amplitude UUID
      const newAlgoliaGuestUserToken = generateGuestUserToken(Amplitude);
      setAlgoliaUserToken(newAlgoliaGuestUserToken);
      aa('setUserToken', newAlgoliaGuestUserToken);
    }

    // if the user starts off
    // browsing as a guest
    // then signs into their account,
    // Algolia will use the UserID and update context
  }, [props.userID, props.algoliaGuestUserToken]);

  useEffect(() => {
    const intervalID = setInterval(() => {
      if (window?.Kustomer?.startFinished) {
        setChatbotStarted(true);
        clearInterval(intervalID);
      }
    }, 1000);

    return () => clearInterval(intervalID);
  }, [setChatbotStarted]);

  useEffect(() => {
    // this allows us to remove the header, cart drawer, and footer and only
    // display the page content so the iOS app can use them as WebViews.

    const { pageOnly } = router.query;
    if (pageOnly === 'true') {
      setDisplayPageOnly(true);
    }
  }, [router.query]);

  const chatBoxStyle = (isPageCTARefVisible, productAddedModalActive) => {
    if (isPageCTARefVisible && !productAddedModalActive) {
      return { bottom: 90 };
    }
    if (productAddedModalActive) {
      return { display: 'none' };
    }
    return null;
  };

  const RenderButtonChat = () => {
    const response = window?.Kustomer?.isChatAvailable?.();
    const {
      state: {
        onPageCTARef,
        productAddedModalActive
      }
    } = useProduct();
    const isPageCTARefVisible = useObserver(onPageCTARef, {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    });
    const isOnline = response?.availability === 'online';
    const url = router.asPath;
    const isPDP = url?.includes('/product');
    const isWishlist = url?.includes('/lists/wishlist');

    if (!isOnline || isWishlistToShareModalOpen) return null;

    const onKustomerChatbotClick = () => {
      window.Kustomer.open(() => {
        logAmplitude('Opened Kustomer Chatbot');
      });
    };

    if (isPDP && isMobile()) {
      return (
        <ButtonChat
          onClick={onKustomerChatbotClick}
          style={chatBoxStyle(isPageCTARefVisible, productAddedModalActive)}
        />
      );
    }

    if (isWishlist && isMobile()) {
      return (
        <ButtonChat
          onClick={onKustomerChatbotClick}
          style={{ bottom: 70 }}
        />
      );
    }

    return (
      <ButtonChat onClick={onKustomerChatbotClick} />
    );
  };

  const shouldRenderKustomerChatbot = chatbotStarted && !isCartActive && !router.asPath.includes('/checkout');

  return (
    <div id="main" data-invesp-id={props.pageType}>
      {!displayPageOnly && (
        <>
          <Vestibule
            navigation={navigation.desktop || {}}
            mobileNavigation={navigation.mobile || []}
            promotionContent={promotions || []}
          />

          <CartDrawer />
        </>
      )}

      {props.children}
      {shouldRenderKustomerChatbot && <RenderButtonChat />}

      {!displayPageOnly && <Footer />}
    </div>
  );
};

DefaultLayout.whyDidYouRender = true;

DefaultLayout.defaultProps = {
  userID: null,
  algoliaGuestUserToken: null,
  pageType: 'Page',
  setKustomerChatBotStarted: () => false
};

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
  userID: PropTypes.number,
  algoliaGuestUserToken: PropTypes.string,
  pageType: PropTypes.string,
  setKustomerChatBotStarted: PropTypes.func
};

const mapStateToProps = (state) => ({
  userID: state.profile.id,
  algoliaGuestUserToken: state.profile.algoliaGuestUserToken,
  pageType: state.interfaces.pageType,
  isCartActive: state.interfaces.isCartActive,
  isKustomerChatBotStarted: state.interfaces.isKustomerChatBotStarted,
  isWishlistToShareModalOpen: state.lists.wishedProductsToShareStatus
});

const mapDispatchToProps = (dispatch) => ({
  setKustomerChatBotStarted: (isStarted) => dispatch(setKustomerChatBotStarted(isStarted))
});

const ConnectedDefaultLayout = connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);

export default ConnectedDefaultLayout;
