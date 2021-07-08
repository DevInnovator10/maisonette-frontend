import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import cookies from 'next-cookies';
import { connect } from 'react-redux';
import { Form as formikForm, Formik } from 'formik';
import * as Sentry from '@sentry/node';
import { toast, TOAST } from '../../utils/toastify';
import { storeWrapper } from '../../store';

import {
  getCart,
  getUser,
  updateCheckout,
  nextCheckout,
  getCurrentCart
} from '../api';
import { updateCart } from '../../store/modules/cart/actions';
import { toggleCartModalVisibility } from '../../store/modules/interfaces/actions';
import { setUserProfile } from '../../store/modules/profile/actions';
import { setToken } from '../../store/modules/user/actions';

import DeliveryAddress from '../../tissues/checkout-new-delivery-address';
import AddressVerification from '../../tissues/address-verification-new-checkout';
import Button from '../../atoms/button';

import getCookie from '../../utils/getCookie';
import removeSearchRecursive from '../../utils/removeSearchRecursive';
import trackEvent from '../../utils/tracking';
import { logAmplitude } from '../../utils/amplitude';
import { formatAddressToCart, isSameAddress, verifiedAddressDifferences } from '../../utils/formatAddressForValidation';
import updateAddressBookInCheckout from '../../utils/updateAddressBookInCheckout';
import { Page, Content } from '../../theme/page';

import Layout from '../../layouts/checkout';

import OrderSummary from '../../tissues/order-summary';
import Typography from '../../atoms/typography';

const CheckoutPage = styled(Page)`
  min-height: unset;
  overflow: auto;
  max-width: ${(props) => props.theme.width.extraLarge};
  margin: 0 auto;
`;

const CheckoutContent = styled(Content)`
  display: grid;
  padding: 6.4rem 1.6rem 5rem;
  min-height: none;
  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    padding: 6.4rem 6.4rem 10rem;
    grid-template-columns: 0.70fr 0.30fr;
    grid-column-gap: 10rem;
    grid-template-areas:  'form summary';
  }
`;

const BackContainer = styled.div`
  display: flex;
  padding: 3.2rem 1.6rem 0;
  :hover {
    opacity: 0.75;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    padding: 3.2rem 6.4rem 0 6.4rem;
  }
`;

const ArrowSign = styled.div`
  margin: 11px 5px 13px 3px;
  display:inline-block;
  width: 7.78px;
  height: 7.78px;
  border: solid ${({ theme }) => theme.color.bluePrimary};
  border-width: 0 2px 2px 0;
  display: inline-block;
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
`;

const BackButton = styled(Button)`
  text-decoration: underline;
  text-decoration-thickness: 0.05em;
  border: 0 none;
  background: none;
  color: ${({ theme }) => theme.color.bluePrimary};
  cursor: pointer;
  font-family: ${(props) => props.theme.font.sans};
  font-size: ${(props) => props.theme.modularScale.sixteen};
  font-weight: 300;
  padding: 0 0 2px 0;
  display: flex;
  align-items: center;
  text-transform: none;
  letter-spacing: normal;
`;

const SummaryPlaceOrderWrapper = styled.div`
  display: none;

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: block;
    grid-area: summary;
  }
`;

const CheckoutOrderSummary = styled(OrderSummary)`
  border: 1px solid ${({ theme }) => theme.color.brand};
  padding: ${({ theme }) => theme.modularScale.sixteen};
`;

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

const FormWrapper = styled.div`
  display: grid;
  grid-gap: 3rem;
`;

const Error = styled.p`
  color: ${(props) => props.theme.color.redError};
  display: block;
  font-family: ${(props) => props.theme.font.sans};
  font-size: 16px;
  margin-top: 0.25rem;
  width: 100%;
`;

const SummaryHeading = styled(Typography)`
  color: ${({ theme }) => theme.color.brand};
  font-size: ${({ theme }) => theme.modularScale.twentyFour};
  margin-bottom: ${({ theme }) => theme.modularScale.sixteen};
`;

const renderCheckoutAddress = (props) => {
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [isNewAddress, setIsNewAddress] = useState(true);
  const [showAddressVerificationModal, setShowAddressVerificationModal] = useState(false);

  useEffect(() => {
    if (!props.user.loading) {
      setIsNewAddress(
        props.user.addresses
          ? props.user.addresses.length > 0
          : true
      );
      setPageLoading(false);
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

  const getDefaultAddress = (type = null) => {
    const { user, cart } = props;

    // if logged in with no address already selected
    // (uses user's default by id)
    if (user?.id && user?.addresses?.length > 0) {
      if (type && cart?.ship_address) {
        // TEMP FIX for TEC-4210, until BE work is done
        // this is not ideal, but since the cart address id rarely aligns with the address book id
        // we need to compare actual values to ensure the correct one is selected
        // after an address is updated after verification
        const selectedAddress = props.user.addresses.find((address) => isSameAddress(cart[`${type}_address`], address, true));
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
    return DEFAULT_SHIPPING_ADDRESS_OBJECT;
  };

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

  const checkErrors = (response, shipping, actions) => {
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

      response.errors.forEach((error) => {
        Object.keys(error).forEach((key) => {
          scope.setExtra(key, error[key]);
        });
      });

      scope.setExtra('shipping', shipping);

      const addressError = new global.window.Error('Add address failure');
      Sentry.captureException(addressError);
    });

    getCart({ order_number: props.cart.number })
      .then((cartRes) => {
        const cartResData = cartRes?.data ?? cartRes;
        actions.setSubmitting(false);
        setLoading(false);
        actions.setStatus({ button: props.buttonText });
        if (cartResData.errors) return;
        props.updateCart(cartResData);
      });
  };

  const finishStep = async (response, actions) => {
    props.updateCart(response);
    actions.setSubmitting(false);
    actions.setStatus({ button: props.buttonText });
    if (response.state === 'delivery' && response.ship_address && response.bill_address) {
      // transition order to next state (payment) to use default shipping and calculate tax
      await nextCheckout({ id: response.number })
        .then((nextRes) => {
          if (!nextRes.errors) {
            props.updateCart(nextRes);
          }
        });
    }
    Router.push('/checkout').then(() => setPageLoading(false));
  };

  const saveAddress = (address, type) =>
  // checks if shipping address is user address (set in form by id)
     address?.[`${type}_address_attributes`] !== undefined && typeof address?.[`${type}_address_attributes`] !== 'string';

  const updateUserAddress = (address, type) =>
  // return address id to be used in address update call
     address?.[`${type}_address_attributes`] !== undefined && typeof address?.[`${type}_address_attributes`] === 'string' && address?.[`${type}_address_attributes`];

  if (pageLoading) return <Loading data-test-id="blocking-loader" />;

  return (
    <>
      <Head>
        <title>{'Maisonette Checkout - Delivery address page'}</title>
        <link key="canonical" rel="canonical" href={`${process.env.NEXT_PUBLIC_CLIENT_HOST}/delivery-address`} />
        <script
            // Track a specific Crazy Egg snapshot by name
            // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: 'var CE_SNAPSHOT_NAME = "checkouts"' }}
        />
      </Head>
      <CheckoutPage background={'white'} id="maincontent">
        <BackContainer>
          <BackButton
            isLink
            styledLikeLink
            href="/checkout"
          >
            <ArrowSign />
            {' '}
            Go back to “Review &amp; Place Order”
          </BackButton>
        </BackContainer>

        <CheckoutContent>
          {
            props.cart?.ship_address
              && props.cart?.address_verification && (
              <AddressVerification
                active={showAddressVerificationModal}
                setShowAddressVerificationModal={setShowAddressVerificationModal}
                checkoutLoading={loading}
                setCheckoutLoading={setLoading}
                newCheckout
              />
            )
          }
          <Formik
            enableReinitialize

            initialStatus={{ button: props.buttonText }}

            initialValues={{
              shipping: [{
                ship_address_attributes: getDefaultAddress('ship')
              }]
            }}

            onSubmit={(values, actions) => {
              setLoading(true);
              // Clear out the "search" object from the values for the TEC-1780 Safari hack
              // first iterate through each object until you find a "search" key
              // then take that value and assign it as the value to the parents key
              const v = removeSearchRecursive(JSON.parse(JSON.stringify(values)));
              actions.setSubmitting(true);
              actions.setStatus({ button: 'Verifying Step...' });

              const shipping = v.shipping[0];

              const request = {
                use_billing: props.cart?.ship_address?.id === props.cart?.bill_address?.id,
                ship_address_attributes: typeof shipping.ship_address_attributes === 'string'
                && props.user.addresses
                  .find((a) => a.id === +shipping.ship_address_attributes) !== undefined
                  ? (({ country, state, ...address }) => (address))(
                    props.user.addresses.find((x) => x.id === +shipping.ship_address_attributes)
                  ) : shipping.ship_address_attributes
              };
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
                  checkErrors(verificationRes, shipping, actions);
                  return;
                }

                // address verification
                if (verificationRes.address_verification) {
                  const enoughDifferences = verifiedAddressDifferences(
                    verificationRes.ship_address, verificationRes.address_verification.address
                  )?.length > 0;

                  if (enoughDifferences || !verificationRes.address_verification.success) {
                  // add whether or not to save addresses
                  // to use in address verification modal, set state to address
                  // to not show advancement in UI while modal is present
                    const resWithoutUseBilling = {
                      ...verificationRes,
                      isNewAddress,
                      saveShipping: saveAddress(shipping, 'ship'),
                      updateShipping: updateUserAddress(shipping, 'ship')
                    };
                    props.updateCart(resWithoutUseBilling);
                    actions.setSubmitting(false);
                    setLoading(false);
                    actions.setStatus({ button: props.buttonText });
                    setShowAddressVerificationModal(true);

                    return;
                  }

                  if (verificationRes.address_verification.success) {
                    // address was successfully verified and returned, but was similar enough
                    // to not have to get confirmation from user
                    const verifiedReformatted = formatAddressToCart(
                      verificationRes.address_verification.address
                    );

                    const addressUpdateRequest = {
                      use_billing: props.cart?.ship_address?.id === props.cart?.bill_address?.id,
                      ship_address_attributes: verifiedReformatted
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
                        checkErrors(addressUpdateRes, verifiedReformatted, actions);
                        return;
                      }

                      if (props.user?.addresses?.length > 0) {
                      // This saves the user's address after adding one while in checkout.
                      // It does not have to happen if the user has no saved address
                      // since the address used after
                      // successful checkout is auto saved to the account.
                      // This allows users to see their new addresses during checkout
                      // after creating an additional address.

                        const token = getCookie('maisonette_user_token');

                        if (token) {
                          const verifiedShipping = saveAddress(shipping, 'ship') && verificationRes.ship_address;
                          const addresses = [updateUserAddress(shipping, 'ship'), verifiedShipping];
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
                      checkErrors(noVerificationRes, shipping, actions);
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
                {isSubmitting && <Loading data-test-id="blocking-loader" />}
                {
                  !canShipToAddress(values.shipping[0].ship_address_attributes) && (
                    <Error id="us-only-error" role="alert">
                    Currently we only support shipping within the US.
                    Please update your Delivery address.
                    </Error>
                  )
              }
                <FormWrapper>
                  <DeliveryAddress
                    setIsNewAddress={setIsNewAddress}
                    profile={props.user}
                    setFieldValue={setFieldValue}
                    name="shipping"
                    values={values}
                    addresses={props.user.addresses}
                    cartShippingAddress={props.cart.ship_address}
                    setUserProfile={setUserProfile}
                    isSubmitting={isSubmitting}
                    canShipToAddress={canShipToAddress}
                    status={status}
                    setLoading={setLoading}
                    getDefaultAddress={getDefaultAddress}
                  />
                </FormWrapper>
              </Form>
            )}
          </Formik>

          <SummaryPlaceOrderWrapper>
            <SummaryHeading element="h2" like="heading-2">Order summary</SummaryHeading>

            <CheckoutOrderSummary
              id="checkout-delivery-order-summary"
              newCheckout
              shipping={props.cart.subtotals.shipments_total}
              subtotal={props.cart.subtotals.item_total}
              total={props.cart.subtotals.order_total}
              tax={props.cart.subtotals.tax_adjustments}
              promotions={props.cart.subtotals.line_item_promotion_totals}
              miscellaneous={props.cart.subtotals.miscellaneous_adjustments}
              gift={props.cart.subtotals.giftwrap_amount}
              state={props.cart.state}
              threshold={props.cart.free_shipping_threshold}
            />
          </SummaryPlaceOrderWrapper>
        </CheckoutContent>
        {(loading || props.cart.loading) && <Loading data-test-id="blocking-loader" />}
      </CheckoutPage>
    </>
  );
};

const CheckoutAddress = (props) => {
  if (!props.cart.loading && props.cart.state) {
    return renderCheckoutAddress(props);
  }

  return <Loading data-test-id="blocking-loader" />;
};

renderCheckoutAddress.defaultProps = {
  buttonText: 'Review Shipping'
};

renderCheckoutAddress.propTypes = {
  buttonText: PropTypes.string,
  cart: PropTypes.object.isRequired,
  updateCart: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  toggleCart: PropTypes.func.isRequired
};

CheckoutAddress.defaultProps = {
  cart: {}
};

CheckoutAddress.propTypes = {
  cart: PropTypes.object
};

export const getServerSideProps = storeWrapper.getServerSideProps(async (ctx) => {
  const { paypal } = ctx.query;
  const userToken = cookies(ctx).maisonette_user_token;
  const orderToken = cookies(ctx).maisonette_order_token;
  const orderNumber = cookies(ctx).maisonette_order_number;

  const cartIsOnlyError = (cart) => (
    Object.keys(cart).every((key) => key === 'error')
  );

  // user is logged in
  if (userToken) {
    const requests = [];
    requests.push(getCurrentCart({ ctx }));
    requests.push(getUser({ ctx }));

    let cartData;
    let userData;
    await Promise.all(requests)
      .then(async ([cart, user]) => {
        cartData = cart;
        userData = user;

        if (userToken && userData) {
          ctx.store.dispatch(setToken('spree_api_key', userToken));
          ctx.store.dispatch(setUserProfile(userData));
        }

        if (!cartData.errors) {
          ctx.store.dispatch(updateCart(cartData));
        }
      });

    let cart;

    if (paypal) {
      cart = ctx.store.getState().cart;
    } else {
      cart = cartData;
    }

    // check if cart is not empty
    if (cart.line_items?.length === 0 || cartIsOnlyError(cart)) {
      // redirect to homepage if cart empty
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      };
    }

    const { number } = cart;
    let isStartingCheckout = false;

    if (cart.state === 'cart') {
      await nextCheckout({ id: number, ctx })
        .then((res) => {
          isStartingCheckout = true;
          cart = res?.data ?? res;
          ctx.store.dispatch(updateCart(cart));
        });
    }

    if (cart.state === 'address') {
      // addresses should already be in order
      // progress order if cart has ship and bill address
      if (cart.ship_address && cart.bill_address) {
        await nextCheckout({ id: number, ctx })
          .then((res) => {
            cart = res?.data ?? res;
            if (cart.errors?.length === 0) {
              isStartingCheckout = false;
              ctx.store.dispatch(updateCart(cart));
            }
          });
      } else {
        // need to also allow for users who log in after adding to cart
        // there will not be any addresses in the order
        // grab the user's default address or select first in list
        const address = userData.addresses.find((a) => a.default) ?? userData.addresses?.[0];

        if (address) {
          const { country, state, ...restOfAddress } = address;

          const order = {
            ship_address_attributes: restOfAddress,
            use_billing: true
          };

          await updateCheckout({ id: number, ctx, body: { order } })
            .then((res) => {
              cart = res?.data ?? res;
              if (cart.errors?.length === 0) {
                isStartingCheckout = false;
                ctx.store.dispatch(updateCart(cart));
              }
            });
        }
      }
    }

    if (cart.state === 'delivery' && cart.ship_address && cart.bill_address) {
      // transition order to next state to use default shipping and calculate tax
      await nextCheckout({ id: number, ctx })
        .then((res) => {
          cart = res?.data ?? res;
          isStartingCheckout = false;
          ctx.store.dispatch(updateCart(cart));
        });
    }

    return {
      props: {
        checkout: cart,
        isStartingCheckout
      }
    };
  }

  // when guest user
  if (orderToken && orderNumber) {
    let isStartingCheckout = false;
    const cart = await getCart({ order_number: orderNumber, ctx });
    let cartData = cart?.data ?? cart;
    if (cartData && !cartData.error) {
      ctx.store.dispatch(updateCart(cartData));
    }

    if (cartData.line_items?.length === 0 || cartIsOnlyError(cartData)) {
      // redirect to homepage if cart empty
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      };
    }

    const { email, state, number } = cartData;

    if (email) {
      if (state === 'cart') {
        await nextCheckout({ id: number, ctx })
          .then((res) => {
            isStartingCheckout = true;
            cartData = res;
            ctx.store.dispatch(updateCart(cartData));
          });
      }

      return {
        props: {
          cart: cartData,
          isStartingCheckout
        }
      };
    }
  }

  // redirect to checkout/registration
  return {
    redirect: {
      destination: '/checkout/registration',
      permanent: false
    }
  };
});

const mapStateToProps = (state) => ({
  cart: state.cart,
  user: state.profile
});

const mapDispatchToProps = (dispatch) => ({
  updateCart: (cart) => dispatch(updateCart(cart)),
  setUserProfile: (user) => dispatch(setUserProfile(user)),
  toggleCart: (flag) => dispatch(toggleCartModalVisibility(flag))
});

CheckoutAddress.Layout = Layout;

const ConnectedCheckoutAddress = connect(mapStateToProps, mapDispatchToProps)(CheckoutAddress);

ConnectedCheckoutAddress.displayName = 'CheckoutAddress';
ConnectedCheckoutAddress.whyDidYouRender = true;

export default ConnectedCheckoutAddress;
