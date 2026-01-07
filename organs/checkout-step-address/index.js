import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { Form as formikForm, Formik } from 'formik';
import * as Yup from 'yup';
import * as Sentry from '@sentry/node';
import { toast, TOAST } from '../../utils/toastify';

import { updateCheckout, getCart } from '../../pages/api';
import { updateCart } from '../../store/modules/cart/actions';
import { toggleCartModalVisibility } from '../../store/modules/interfaces/actions';
import { setUserProfile } from '../../store/modules/profile/actions';

import BillingStep from '../../tissues/checkout-address-billing';
import Button from '../../atoms/button';
import FormField from '../../molecules/formik-input';
import ShippingAddress from '../../tissues/checkout-address-shipping';
import Typography from '../../atoms/typography';

import formatPhoneNumber from '../../utils/formatPhoneNumber';
import getCookie from '../../utils/getCookie';
import removeSearchRecursive from '../../utils/removeSearchRecursive';
import trackEvent from '../../utils/tracking';
import { logAmplitude } from '../../utils/amplitude';
import { formatAddressToCart, isSameAddress, verifiedAddressDifferences } from '../../utils/formatAddressForValidation';
import updateAddressBookInCheckout from '../../utils/updateAddressBookInCheckout';

const Loading = styled.div`
  background-color: ${(props) => props.theme.color.background};
  bottom: 0;
  left: 0;
  opacity: 0.75;
  position: fixed;
  right: 0;
  top: 0;
  visibility: visible;
  z-index: ${(props) => props.theme.layers.balcony};

  ${(props) => props.theme.loader()}
`;

const Form = styled(formikForm)`
  display: grid;
  grid-gap: 3rem;
`;

const FormButton = styled(Button)`
  outline: 0;
  width: 100%;
`;

const HeadingWrapper = styled('div', { shouldForwardProp: (prop) => prop !== 'active' })`
  display: flex;
  border-bottom: 1px solid ${({ active, theme }) => (active ? theme.color.brand : theme.color.brandLight)};
  color: ${({ active, theme }) => (active ? theme.color.brand : theme.color.brandLight)};
`;

const Step = styled(Typography)`
  width: 100%;
`;

const EditStep = styled(Button)`
  line-height: 2.5rem;
  height: 2.5rem;
  border: 0;
  padding: 0;
  margin: 0 0 0 auto;
  display: flex;
  align-self: center;
  outline: 0;
  text-decoration: underline;
`;

const CompleteWrapper = styled.div`
  display: grid;
  grid-column-gap: 5rem;
  grid-row-gap: 3rem;

  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SectionLabel = styled(Typography)`
  border-bottom: 1px solid ${({ theme }) => theme.color.brandLight};
  color: ${({ theme }) => theme.color.brandLight};
  margin-bottom: 1rem;
  display: block;
  width: 100%;
`;

const SelectedText = styled(Typography)`
  color: ${({ theme }) => theme.color.brandLight};
`;

const FormWrapper = styled.div`
  display: grid;
  grid-gap: 3rem;
`;

const Error = styled.p`
  color: ${(props) => props.theme.color.brandError};
  display: block;
  font-family: ${(props) => props.theme.font.sans};
  font-size: 1.2rem;
  margin-top: 0.25rem;
  width: 100%;
`;

const CheckoutAddress = (props) => {
  const [loading, setLoading] = useState(true);
  const [isNewAddress, setIsNewAddress] = useState(true);

  useEffect(() => {
    if (!props.user.loading) {
      setIsNewAddress(
        props.user.addresses
          ? props.user.addresses.length > 0
          : true
      );
      setLoading(false);
    }
  }, [props.user.loading]);

  // see onSubmit in Formik component below for details about 'search' keys
  const DEFAULT_SHIPPING_ADDRESS_OBJECT = {
    first_name: { search: '' },
    last_name: { search: '' },
    address1: { search: '' },
    address2: { search: '' },
    city: { search: '' },
    zipcode: { search: '' },
    phone: { search: '' },
    country_iso: { search: 'US' },
    state_name: { search: '' }
  };

  const DEFAULT_BILLING_ADDRESS_OBJECT = {
    first_name: { search: '' },
    last_name: { search: '' },
    address1: { search: '' },
    address2: { search: '' },
    city: { search: '' },
    zipcode: { search: '' },
    phone: { search: '' },
    country_iso: { search: '' },
    state_name: { search: '' }
  };

  const getDefaultAddress = (type = null) => {
    const { user, cart } = props;
    // if logged in with no address already selected
    // (uses user's default by id)
    if (user?.id && user?.addresses?.length > 0) {
      if (type && cart?.[`${type}_address`]) {
        // TEMP FIX for TEC-4210, until BE work is done
        // this is not ideal, but since the cart address id rarely aligns with the address book id
        // we need to compare actual values to ensure the correct one is selected
        // after an address is updated after verification
        const selectedAddress = props.user.addresses.find((address) => isSameAddress(cart[`${type}_address`], address));
        if (selectedAddress) {
          return selectedAddress?.id?.toString?.();
        }
      }

      const defaultAddress = props.user.addresses.find((a) => a.default);
      return defaultAddress ? defaultAddress.id.toString() : user.addresses[0].id.toString();
    }

    // if guest user with previously filled in address or paypal/apple pay address
    // or logged in user deletes all of their addresses while using same cart
    if (type && cart?.[`${type}_address`]) {
      // see onSubmit in Formik component below for details about 'search' keys
      return {
        first_name: { search: cart[`${type}_address`].firstname },
        last_name: { search: cart[`${type}_address`].lastname },
        address1: { search: cart[`${type}_address`].address1 },
        address2: { search: cart[`${type}_address`].address2 },
        city: { search: cart[`${type}_address`].city },
        zipcode: { search: cart[`${type}_address`].zipcode },
        phone: { search: cart[`${type}_address`].phone },
        country_iso: { search: cart[`${type}_address`].country_iso },
        state_name: { search: cart[`${type}_address`].state_text }
      };
    }

    if (type === 'bill') {
      return DEFAULT_BILLING_ADDRESS_OBJECT;
    }

    return DEFAULT_SHIPPING_ADDRESS_OBJECT;
  };

  const useBilling = () =>
    // the cart address id's will be the same if the user selects 'same as shipping'
    props.cart?.ship_address?.id === props.cart?.bill_address?.id;

  const canShipToAddress = (address) => {
    if (!address) return true;
    let addressToShip = address;

    if (typeof address === 'object') {
      addressToShip = removeSearchRecursive({ ...address });
    }

    const hasAddresses = props?.user?.addresses?.length > 0;

    if (hasAddresses) {
      if (typeof addressToShip === 'string') {
        return props?.user?.addresses.find((a) => a.id === +address)?.country_iso === 'US';
      }
      return addressToShip?.country_iso === 'US';
    }

    return true;
  };

  const checkErrors = (response, billing, shipping, actions) => {
    trackEvent({
      eventCategory: 'Address',
      eventAction: 'Add address',
      eventLabel: 'Failure'
    });

    const errors = response.errors.filter(({ message }) =>
      message && message !== 'The order could not be transitioned. Please fix the errors and try again.');

    errors.forEach(({ message = null }) => {
      if (typeof message === 'string') {
        toast(
          message,
          {
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

      response.errors.forEach((error) => {
        Object.keys(error).forEach((key) => {
          scope.setExtra(key, error[key]);
        });
      });

      scope.setExtra('billing', billing);
      scope.setExtra('shipping', shipping);

      const addressError = new global.window.Error('Add address failure');
      Sentry.captureException(addressError);
    });

    getCart({ order_number: props.cart.number })
      .then((cartRes) => {
        const cartResData = cartRes?.data ?? cartRes;
        actions.setSubmitting(false);
        actions.setStatus({ button: props.buttonText });
        if (cartResData.errors) return;
        props.updateCart(cartResData);
      });
  };

  const finishStep = (response, actions) => {
    props.updateCart(response);
    actions.setSubmitting(false);
    actions.setStatus({ button: props.buttonText });
    props.setCompletedSteps([...props.completedSteps, response.state]);
    global.window.location.hash = response.state;
  };

  const saveAddress = (address, type) =>
    // checks if billing or shipping address are user addresses (set in form by id)
    address?.[`${type}_address_attributes`] !== undefined && typeof address?.[`${type}_address_attributes`] !== 'string';

  const updateUserAddress = (address, type) =>
    // return address id to be used in address update call
    address?.[`${type}_address_attributes`] !== undefined && typeof address?.[`${type}_address_attributes`] === 'string' && address?.[`${type}_address_attributes`];

  if (loading) return <Loading />;

  return (
    <Formik
      enableReinitialize

      initialStatus={{ button: props.buttonText }}

      initialValues={{
        email: props.cart?.email ?? '',
        billing: [{
          use_billing: useBilling(),
          ...(!useBilling() && { bill_address_attributes: getDefaultAddress('bill') })
        }],
        shipping: [{
          ship_address_attributes: getDefaultAddress('ship')
        }]
      }}

      validationSchema={
        Yup.object().shape({
          email: Yup.string().email('Please enter a valid Email Address').required('Email is required')
        })
      }

      onSubmit={(values, actions) => {
        // Clear out the "search" object from the values for the TEC-1780 Safari hack
        // first iterate through each object until you find a "search" key
        // then take that value and assign it as the value to the parents key
        const v = removeSearchRecursive(JSON.parse(JSON.stringify(values)));
        actions.setSubmitting(true);
        actions.setStatus({ button: 'Verifying Step...' });

        const shipping = v.shipping[0];
        const billing = v.billing[0];

        const request = {
          email: v.email,
          use_billing: billing.use_billing,
          ship_address_attributes: typeof shipping.ship_address_attributes === 'string'
            && props.user.addresses
              .find((a) => a.id === +shipping.ship_address_attributes) !== undefined
            ? (({ country, state, ...address }) => (address))(
              props.user.addresses.find((x) => x.id === +shipping.ship_address_attributes)
            ) : shipping.ship_address_attributes
        };

        if (!billing.use_billing) {
          request.bill_address_attributes = typeof billing.bill_address_attributes === 'string'
            && props.user.addresses
              .find((a) => a.id === +billing.bill_address_attributes) !== undefined
            ? (({ country, state, ...address }) => (address))(
              props.user.addresses.find((x) => x.id === +billing.bill_address_attributes)
            ) : billing.bill_address_attributes;
        }

        // want to hold state until user makes decision about address verification via modal
        const verificationResponse = updateCheckout({
          id: props.cart.number,
          body: { order: request },
          hold_state: true,
          address_verification: true
        });

        logAmplitude('Submitted Checkout Address', { cart: props.cart });

        verificationResponse.then((verificationRes) => {
          if (verificationRes.errors?.length > 0) {
            checkErrors(verificationRes, billing, shipping, actions);
            return;
          }

          // address verification
          if (verificationRes.address_verification) {
            const enoughDifferences = verifiedAddressDifferences(
              verificationRes.ship_address, verificationRes.address_verification.address
            )?.length > 0;

            if (enoughDifferences || !verificationRes.address_verification.success) {
              // add use_billing and whether or not to save addresses
              // to use in address verification modal, set state to address
              // to not show advancement in UI while modal is present
              const resWithUseBilling = {
                ...verificationRes,
                isNewAddress,
                saveShipping: saveAddress(shipping, 'ship'),
                saveBilling: saveAddress(billing, 'bill'),
                updateShipping: updateUserAddress(shipping, 'ship'),
                use_billing: billing.use_billing
              };

              props.updateCart(resWithUseBilling);
              actions.setSubmitting(false);
              actions.setStatus({ button: props.buttonText });
              props.setShowAddressVerificationModal(true);
              return;
            }

            if (verificationRes.address_verification.success) {
              // address was successfully verified and returned, but was similar enough
              // to not have to get confirmation from user
              const verifiedReformatted = formatAddressToCart(
                verificationRes.address_verification.address
              );

              const addressUpdateRequest = {
                ship_address_attributes: verifiedReformatted,
                use_billing: billing.use_billing
              };

              const addressUpdateResponse = props.cart.state === 'address' ? updateCheckout({
                id: props.cart.number,
                body: { order: addressUpdateRequest }
              }) : updateCheckout({
                id: props.cart.number,
                body: { order: addressUpdateRequest },
                hold_state: true
              });

              addressUpdateResponse.then((addressUpdateRes) => {
                if (addressUpdateRes.errors?.length > 0) {
                  checkErrors(addressUpdateRes, billing, verifiedReformatted, actions);
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
                    const verifiedShipping = saveAddress(shipping, 'ship') && verificationRes.ship_address;
                    const billingAddress = props.cart?.use_billing
                      ? null : saveAddress(billing, 'bill') && verificationRes.bill_address;
                    const addresses = [updateUserAddress(shipping, 'ship'), verifiedShipping, billingAddress];
                    updateAddressBookInCheckout(addresses, props, addressUpdateRes);
                  }
                }

                finishStep(addressUpdateRes, actions);
              });
            }
          } else {
            // if an address has already been verified, the backend will not return
            // address_verification in res
            // need to remake call without hold_state
            const noVerificationResponse = props.cart.state === 'address' ? updateCheckout({
              id: props.cart.number,
              body: { order: request }
            }) : updateCheckout({
              id: props.cart.number,
              body: { order: request },
              hold_state: true
            });

            noVerificationResponse.then((noVerificationRes) => {
              if (noVerificationRes.errors?.length > 0) {
                checkErrors(noVerificationRes, billing, shipping, actions);
                return;
              }

              finishStep(noVerificationRes, actions);
            });
          }
        });
      }}
    >
      {({
        values,
        isSubmitting,
        status,
        setFieldValue
      }) => (
        <Form id="address" tabIndex="0">
          {isSubmitting && <Loading />}

          <HeadingWrapper active={props.active ? 'true' : undefined}>
            <Step role="heading" aria-level="2" element="legend" like="heading-4">
              1. Address
            </Step>
            {!props.active && <EditStep aria-label="edit address details" onClick={() => props.handleOnEditClick('address')} outline>Edit</EditStep>}
          </HeadingWrapper>

          {
            !canShipToAddress(values.shipping[0].ship_address_attributes) && (
              <Error id="us-only-error" role="alert">
                Currently we only support shipping within the US.
                Please update your Shipping Address
              </Error>
            )
          }

          {
            !props.active && (
              <CompleteWrapper>
                <div data-test-id="checkout-submitted-email-address">
                  <SectionLabel element="p" like="heading-6"><span>Email</span></SectionLabel>
                  <SelectedText element="p" like="dec-1">{props.cart.email}</SelectedText>
                </div>

                <div data-test-id="checkout-submitted-ship-address">
                  <SectionLabel element="p" like="heading-6"><span>Shipping Address</span></SectionLabel>
                  {props.cart.ship_address && (
                    <SelectedText element="p" like="dec-1">
                      {`${props.cart.ship_address.firstname} ${props.cart.ship_address.lastname}`}
                      <br />
                      {`${props.cart.ship_address.address1}`}
                      {props.cart.ship_address.address2 && `, ${props.cart.ship_address.address2}`}
                      <br />
                      {`${props.cart.ship_address.city}, ${props.cart.ship_address.state_text} ${props.cart.ship_address.zipcode}`}
                      <br />
                      {props.cart.ship_address.country.name}
                      <br />
                      {formatPhoneNumber(props.cart.ship_address.phone)}
                    </SelectedText>
                  )}
                </div>

                <div data-test-id="checkout-submitted-bill-address">
                  <SectionLabel element="p" like="heading-6"><span>Billing Address</span></SectionLabel>
                  {props.cart.bill_address && (
                    <SelectedText element="p" like="dec-1">
                      {`${props.cart.bill_address.firstname} ${props.cart.bill_address.lastname}`}
                      <br />
                      {`${props.cart.bill_address.address1}`}
                      {props.cart.bill_address.address2 && `, ${props.cart.bill_address.address2}`}
                      <br />
                      {`${props.cart.bill_address.city}, ${props.cart.bill_address.state_text} ${props.cart.bill_address.zipcode}`}
                      <br />
                      {props.cart.bill_address.country.name}
                      <br />
                      {formatPhoneNumber(props.cart.bill_address.phone)}
                    </SelectedText>
                  )}
                </div>
              </CompleteWrapper>
            )
          }
          {props.active && (
            <FormWrapper>
              <FormField name="email" type="email" label="Email Address" required autoComplete="email" />

              <ShippingAddress
                setIsNewAddress={setIsNewAddress}
                profile={props.user}
                setFieldValue={setFieldValue}
                name="shipping"
                values={values}
                addresses={props.user.addresses}
                cartShippingAddress={props.cart.ship_address}
              />
              <BillingStep
                setIsNewAddress={setIsNewAddress}
                setFieldValue={setFieldValue}
                name="billing"
                profile={props.user}
                values={values}
                addresses={props.user.addresses}
                cartBillingAddress={props.cart.bill_address}
              />

              <FormButton data-test-id="address-submit" type="submit" disabled={isSubmitting || !canShipToAddress(values.shipping[0].ship_address_attributes)}>
                {status.button}
              </FormButton>
            </FormWrapper>
          )}
        </Form>
      )}
    </Formik>
  );
};

CheckoutAddress.defaultProps = {
  buttonText: 'Review Shipping',
  handleOnEditClick: () => { }
};

CheckoutAddress.propTypes = {
  active: PropTypes.bool.isRequired,
  buttonText: PropTypes.string,
  cart: PropTypes.object.isRequired,
  handleOnEditClick: PropTypes.func,
  updateCart: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  completedSteps: PropTypes.array.isRequired,
  setCompletedSteps: PropTypes.func.isRequired,
  toggleCart: PropTypes.func.isRequired,
  setShowAddressVerificationModal: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  user: state.profile
});

const mapDispatchToProps = (dispatch) => ({
  updateCart: (cart) => dispatch(updateCart(cart)),
  setUserProfile: (user) => dispatch(setUserProfile(user)),
  toggleCart: (flag) => dispatch(toggleCartModalVisibility(flag))
});

const ConnectedCheckoutAddress = connect(mapStateToProps, mapDispatchToProps)(CheckoutAddress);

ConnectedCheckoutAddress.displayName = 'CheckoutAddress';
ConnectedCheckoutAddress.whyDidYouRender = true;

export default ConnectedCheckoutAddress;
