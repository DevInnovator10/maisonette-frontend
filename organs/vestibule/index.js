import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';

const NavigationHeaderAlgolia = dynamic(() => import('../../tissues/navigation-header'));
const CheckoutHeader = dynamic(() => import('../../molecules/checkout-header'));
const NavigationMenu = dynamic(() => import('../../tissues/navigation'));
const MobileNavigationMenu = dynamic(() => import('../../tissues/mobile-navigation'));
const PetiteDropDown = dynamic(() => import('../../tissues/petite-dropdown'));
const PromotionBanner = dynamic(() => import('../../tissues/promotion-copy'));

const Vestibule = (props) => (
  <>
    {
        props.isCheckout
          ? (
            <>
              <PromotionBanner content={props.promotionContent} />
              <CheckoutHeader />
            </>
          )
          : (
            <>
              <PromotionBanner
                content={props.promotionContent}
                isNavigationActive={props.isNavigationActive}
              />
              <NavigationHeaderAlgolia />

            </>
          )
      }

    { props.user?.spree_api_key && <PetiteDropDown /> }

    {
        !props.noNav && (
          <>
            <NavigationMenu
              navigation={props.navigation}
              isCheckout={props.isCheckout}
            />

            {
            props.mobileNavigation !== null && (
              <MobileNavigationMenu
                navigation={props.mobileNavigation}
                profile={props.profile}
                isCheckout={props.isCheckout}
              />
            )
          }
          </>
        )
      }
  </>
);

Vestibule.defaultProps = {
  promotionContent: [],
  user: {},
  profile: {},
  isCheckout: false,
  noNav: false,
  isNavigationActive: false
};

Vestibule.propTypes = {
  navigation: PropTypes.object.isRequired,
  mobileNavigation: PropTypes.array.isRequired,
  promotionContent: PropTypes.array,
  user: PropTypes.object,
  profile: PropTypes.object,
  isCheckout: PropTypes.bool,
  noNav: PropTypes.bool,
  isNavigationActive: PropTypes.bool
};

const mapStateToProps = (state) => ({
  user: state.user,
  profile: state.profile,
  isNavigationActive: state.interfaces.isNavigationActive
});

const ConnectedVestibule = connect(mapStateToProps, null)(Vestibule);

Vestibule.whyDidYouRender = true;

export default ConnectedVestibule;
