import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from '@emotion/core';
import * as Sentry from '@sentry/node';
import { toast, TOAST } from '../../utils/toastify';

import Address from '../../molecules/address-verification-address';

import { updateCheckout, getCart } from '../../pages/api';

import { setUserProfile } from '../../store/modules/profile/actions';
import { updateCart } from '../../store/modules/cart/actions';
import Typography from '../../atoms/typography';
import IconCross from '../../atoms/icon-cross';
import Button from '../../atoms/button';
import { formatAddressToVerified, formatAddressToCart, verifiedAddressDifferences } from '../../utils/formatAddressForValidation';

import addressVerificationMessageMap from '../../utils/addressVerificationMessageMap.json';
import manageFocus from '../../utils/manageFocus';
import manageBodyOverflow from '../../utils/manageBodyOverflow';
import { logAmplitude } from '../../utils/amplitude';
import getCookie from '../../utils/getCookie';
import updateAddressBookInCheckout from '../../utils/updateAddressBookInCheckout';

const Overlay = styled.span`
    background: ${(props) => props.theme.color.black};
    bottom: 0;
  height: 0;
  opacity: 0;
  position: fixed;
  right: 0;
  top: 0;
  transition: opacity ${(props) => props.theme.animation.fast} ${(props) => props.theme.animation.easeOutQuad};
  width: 100%;
  z-index: ${(props) => props.theme.layers.downstage};

  ${(props) => props.active && css`
    opacity: 0.5;
    height: 100%;
  `}
`;

const VerificationWrapper = styled.div`
  position: fixed;
  z-index: ${(props) => props.theme.layers.downstage + 1};
  background: ${(props) => props.theme.color.white};
  color: ${(props) => props.theme.color.brand};
  width: 92%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: ${(props) => props.theme.modularScale.base};
  text-align: center;
  
  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    padding: ${(props) => props.theme.modularScale['2xlarge']};
    width: 60rem;
  }
`;

const HeadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled(Button)`
  background-color: ${(props) => props.theme.color.white};
  border: 0;
  height: ${(props) => props.theme.modularScale.base};
  width: ${(props) => props.theme.modularScale.base};
  line-height: normal;
  outline: 0;
  margin-left: auto;
  padding: 0;

  svg {
    stroke-width: 6;
    stroke: ${(props) => props.theme.color.brand};
  }
`;

const Heading = styled(Typography)`
  margin-bottom: ${(props) => props.theme.modularScale.small};
`;

const Copy = styled(Typography)`
  font-size: ${(props) => props.theme.modularScale.base};
`;

const AddressWrapper = styled.div`
  margin: ${(props) => props.theme.modularScale.xlarge} 0;
`;

const CTA = styled(Button)`
  width: 100%;

  :first-of-type {
    margin-bottom: ${(props) => props.theme.modularScale.small};
  }
`;

const AddressVerification = (props) => {
  const modalRef = useRef();
  const [selectedAddress, setSelectedAddress] = useState('suggested');
  const [hasSuggestions, setHasSuggestions] = useState(
    props.cart?.address_verification?.suggestions?.length > 0
  );

  useEffect(() => {
    manageBodyOverflow(props.active);
    const { current } = modalRef;
    if (current) {
      manageFocus(current, props.active, null);
    }
  }, [props.active]);

  useEffect(() => {
    setHasSuggestions(props.cart?.address_verification?.suggestions?.length > 0);
    if (!hasSuggestions) {
      logAmplitude('Shown Address Verification Modal', { cartId: props.cart?.number, modalType: 'suggestion' });
    }
  }, [props.cart?.address_verification]);

  const updateAddress = (address) => {
    props.setShowAddressVerificationModal(false);
    props.setCheckoutLoading(true);

    const addressUpdateRequest = {
      ship_address_attributes: address,
      use_billing: props.cart.use_billing
    };

    const addressUpdateResponse = props.cart.state === 'address' ? updateCheckout({
      id: props.cart.number,
      body: { order: addressUpdateRequest }
    }) : updateCheckout({
      id: props.cart.number,
      body: { order: addressUpdateRequest },
      hold_state: true
    });

    logAmplitude('Submitted Checkout Address', { cart: props.cart });

    addressUpdateResponse.then((addressUpdateRes) => {
      if (addressUpdateRes.errors?.length > 0) {
        const errors = addressUpdateRes.errors.filter(({ message }) =>
          message && message !== 'The order could not be transitioned. Please fix the errors and try again.');

        errors.forEach(({ message = null }) => {
          if (typeof message === 'string') {
            toast(
              message, {
                type: TOAST.TYPE.ERROR,
                onClose: () => {
                  if (message === 'Order can’t be advanced because the inventory for an item in your cart is 0.') {
                    props.toggleCart(true);
                  }
                }
              }
            );
            logAmplitude('Encountered Transaction Error', {
              message,
              step: 'address'
            });
          }
        });

        Sentry.withScope((scope) => {
          scope.setLevel(Sentry.Severity.Info);

          addressUpdateRes.errors.forEach((error) => {
            Object.keys(error).forEach((key) => {
              scope.setExtra(key, error[key]);
            });
          });

          scope.setExtra('shipping', address);

          const addressError = new global.window.Error('Add address failure');
          Sentry.captureException(addressError);
        });

        getCart({ order_number: props.cart.number })
          .then((cartRes) => {
            const cartResData = cartRes?.data ?? cartRes;
            props.setCheckoutLoading(false);
            if (cartRes.errors) return;
            props.updateCart(cartResData);
          });

        return;
      }

      if (props.user?.addresses?.length > 0) {
        // This saves the user's address after adding one while in checkout.
        // It does not have to happen if the user has no saved address
        // since the address used after successful checkout is auto saved to the account.
        // This allows users to see their new addresses during checkout
        // after creating an additional address.

        const token = getCookie('maisonette_user_token');

        if (token) {
          const verifiedShipping = props.cart?.saveShipping && addressUpdateRes.ship_address;
          const billingAddress = props.cart?.use_billing
            ? null : props.cart?.saveBilling && addressUpdateRes.bill_address;
          const addresses = [
            props.cart?.updateShipping, verifiedShipping, billingAddress
          ];
          updateAddressBookInCheckout(addresses, props, addressUpdateRes);
        }
      }

      props.setCheckoutLoading(false);
      props.updateCart(addressUpdateRes);
      global.window.location.hash = addressUpdateRes.state;
    });
  };

  const handleCloseModal = () => {
    logAmplitude('Submitted Address Verification Modal', {
      cartId: props.cart?.number,
      modalType: hasSuggestions ? 'error' : 'suggestion',
      buttonType: 'X'
    });
    props.setShowAddressVerificationModal(false);
  };

  const handleContinueWithAddress = () => {
    logAmplitude('Submitted Address Verification Modal', {
      cartId: props.cart?.number,
      modalType: 'error',
      buttonType: 'Continue with Address'
    });
    // need to remove country and state from ship_address for request
    const { country, state, ...rest } = props.cart.ship_address;
    updateAddress(rest);
  };

  const handleOpenEditAddressStep = () => {
    logAmplitude('Submitted Address Verification Modal', {
      cartId: props.cart?.number,
      modalType: 'error',
      buttonType: 'Edit Address'
    });
    props.setShowAddressVerificationModal(false);
    props.setActiveStep('address');

    setTimeout(() => {
      // for users with one or more saved addresses.
      // since the ids for the addresses in the radio buttons do not match the cart addresses
      // we are limited in ways to find the right address edit button to click to open the form.
      // this uses a value from the address obj to find the button
      // // since there can be multiple addresses with the same value,
      // // we focus on the address section if there is more than one match
      // this should be refactored along with the getDefaultAddress
      // in organs/checkout-step-address/index

      const { address1 } = props.cart.ship_address;
      const addressEditButtons = global.document.querySelectorAll(`button[aria-label="edit address, ${address1}"]`);
      const addressForm = global.document.getElementById('address');
      if (addressEditButtons?.length === 1) {
        addressEditButtons[0].click();
        // id for inputs are dynamic, so need to use name attribute
        const address1Input = global.document
          .querySelector('input[name="address1.search"]');
        if (address1Input) address1Input.focus();
      } else if (addressForm) {
        // focus on the form instead of individual inputs to
        // scroll the form into view on Safari
        addressForm.focus();
      }
    }, 0);
  };

  const handleSelectAddress = () => {
    logAmplitude('Submitted Address Verification Modal', {
      cartId: props.cart?.number,
      modalType: 'suggestion',
      buttonType: selectedAddress === 'suggested' ? 'Submitted Suggested Address' : 'Submitted Original Address'
    });

    // need to remove country and state from ship_address for request
    const { country, state, ...rest } = props.cart.ship_address;
    const address = selectedAddress === 'suggested' ? formatAddressToCart(props.cart.address_verification.address) : rest;
    updateAddress(address);
  };

  const useDefaultMessage = (suggestions = []) => {
    // when an address cannot be found we get the message 'Address not found'
    // this can be sent with additional messages, but we should show the default if it is not.
    // we also want to show the default if any of the messages come from international addresses
    // or PO Box errors
    const onlyNotFound = suggestions.length === 1 && suggestions[0].message === 'Address not found';
    const defaultList = ['Cannot verify international PO Box', 'Box number is invalid', 'Box number is missing'];
    const includesDefaultList = suggestions
      .some((suggestion) => defaultList.includes(suggestion?.message));

    return onlyNotFound || includesDefaultList;
  };

  const renderSuggestions = () => {
    logAmplitude('Shown Address Verification Modal', { cartId: props.cart?.number, modalType: 'Error', errorCode: props.cart?.address_verification?.suggestions });

    if (useDefaultMessage(props.cart?.address_verification?.suggestions)) {
      return <li>{addressVerificationMessageMap.default}</li>;
    }

    return props.cart?.address_verification?.suggestions
      .map((suggestion) => {
        const { message } = suggestion;
        return <li key={suggestion.field}>{addressVerificationMessageMap[message] ?? message}</li>;
      });
  };

  return (
    props.active
    && (
      <>
        <Overlay active={props.active} />
        <VerificationWrapper role="dialog" ref={modalRef}>
          <HeadingWrapper>
            <CloseButton
              aria-label="close address verification modal"
              type="button"

              onClick={handleCloseModal}
            >
              <IconCross />
            </CloseButton>
            <Heading element="h2" like="heading-5">
              {
                hasSuggestions ? 'Please review your shipping address' : 'Please select a shipping address'
              }
            </Heading>

            <Copy element="ul" like="paragraph-4">

              {
                hasSuggestions ? renderSuggestions()
                  : <li>To ensure accurate delivery, consider the changes highlighted below.</li>
              }
            </Copy>
          </HeadingWrapper>

          <AddressWrapper>
            {
              hasSuggestions ? (
                <Address
                  heading="provided"
                  address={formatAddressToVerified(props.cart.ship_address)}
                />
              ) : (
                <>
                  <Address
                    isRadio
                    key="verified-address"
                    isVerified
                    heading="suggested"
                    selectedAddress={selectedAddress}
                    setSelectedAddress={setSelectedAddress}
                    address={props.cart.address_verification.address}
                    differences={
                      verifiedAddressDifferences(
                        props.cart.ship_address,
                        props.cart.address_verification.address
                      )
                    }
                  />
                  <Address
                    key="original-address"
                    isRadio
                    selectedAddress={selectedAddress}
                    setSelectedAddress={setSelectedAddress}
                    heading="original"
                    address={formatAddressToVerified(props.cart.ship_address)}
                  />
                </>
              )
            }
          </AddressWrapper>

          {
            hasSuggestions
              ? (
                <>
                  <CTA
                    type="button"
                    onClick={handleOpenEditAddressStep}
                  >
                    Edit Address
                  </CTA>

                  <CTA
                    onClick={handleContinueWithAddress}
                    outline
                    type="button"
                  >
                    Continue with address

                  </CTA>
                </>
              )
              : (
                <CTA
                  type="button"
                  onClick={handleSelectAddress}
                >
                  Continue with this address
                </CTA>
              )
            }
        </VerificationWrapper>
      </>
    )
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  user: state.profile
});

const mapDispatchToProps = (dispatch) => ({
  updateCart: (cart) => dispatch(updateCart(cart)),
  setUserProfile: (user) => dispatch(setUserProfile(user))
});

AddressVerification.defaultProps = {
  cart: {},
  setShowAddressVerificationModal: () => {},
  setActiveStep: () => {},
  updateCart: () => {},
  setCheckoutLoading: () => {},
  active: false
};

AddressVerification.propTypes = {
  cart: PropTypes.object,
  setShowAddressVerificationModal: PropTypes.func,
  setActiveStep: PropTypes.func,
  updateCart: PropTypes.func,
  setCheckoutLoading: PropTypes.func,
  active: PropTypes.bool
};

const ConnectedAddressVerification = connect(
  mapStateToProps, mapDispatchToProps
)(AddressVerification);

export default ConnectedAddressVerification;
