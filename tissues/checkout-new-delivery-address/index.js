import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { Field, FieldArray } from 'formik';

import AddressForm from '../form-address-new-checkout';
import EditAddressForm from '../address-create-new';
import { deleteAddress } from '../../pages/api';

import ButtonAtom from '../../atoms/button';
import RadioField from '../../molecules/formik-radio';
import Typography from '../../atoms/typography';

import getCookie from '../../utils/getCookie';
import formatPhoneNumber from '../../utils/formatPhoneNumber';

const SectionLabel = styled(Typography)`
  color: ${({ theme }) => theme.color.brand};
  display: block;
  font-size: 24px;
`;

const AddressRadioWrapper = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(1fr, 1fr);
  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Button = styled(ButtonAtom)`
  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    grid-column: -1 / 1;
    outline: 0;
  };
`;

const CancelButton = styled(ButtonAtom)`
  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    grid-column: 1fr;
    outline: 0;
  };
`;

const AddressControls = styled.div`
  display: flex;
  max-width: 350px;
  column-gap: 1rem;
  margin-top: ${(props) => props.theme.modularScale.twenty};

  ${Button}:not([data-id="view-all"]) {
    flex-grow: 2;
  }
`;

const SingleButtonControl = styled.div`
display: grid;
margin-top: ${(props) => props.theme.modularScale.twenty};

${Button}:not([data-id="view-all"]) {
  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    max-width: 21.4rem;
  };
}
@media (min-width: ${(props) => props.theme.breakpoint.medium}) {
  width: 35%;
}
`;

const NewAddressContainer = styled.div`
  display: flex;
  max-width: 180px;
  :hover {
    opacity: 0.75;
  }
`;

const PlusSign = styled.div`
  margin: 11px 5px 13px 5px;
  display:inline-block;
  width: ${(props) => props.theme.modularScale.small};
  height: ${(props) => props.theme.modularScale.small};
  background:
    linear-gradient(
      #2F4DA1,
      #2F4DA1),
    linear-gradient(
      #2F4DA1,
      #2F4DA1);
  background-position:center;
  background-size: 16.14px 2px,2px 16.14px;
  background-repeat:no-repeat;
`;

const NewAddressButton = styled(Typography)`
  border: 0 none;
  background: none;
  text-decoration: underline;
  text-decoration-thickness: 0.05em;
  color: #2F4DA1;
  cursor: pointer;
  font-family: ${(props) => props.theme.font.sans};
  font-size: ${(props) => props.theme.modularScale.sixteen};
  font-weight: 300;
  padding: 0 0 2px 0;
  outline: 0;
  z-index: ${({ theme }) => theme.layers.backstage};
`;

const EditAddress = styled(Typography)`
  font-family: ${(props) => props.theme.font.sans};
  align-self: flex-start;
  border: 0 none;
  background: none;
  text-decoration: underline;
  color: ${({ theme }) => theme.color.brand};
  cursor: pointer;
  outline: 0;
  font-size: 16px;
  padding: 0;
  z-index: ${({ theme }) => theme.layers.backstage};

  :hover {
    opacity: 0.75;
  }
`;

const Address = styled('div', { shouldForwardProp: (prop) => prop !== 'isPickedBackground' })`
  display: flex;
  flex-direction: column;
  background-color: ${({ isPickedBackground, theme }) => (isPickedBackground ? 'none' : theme.color.backgroundLightBlue)};
  border: ${({ isPickedBackground, theme }) => (isPickedBackground ? `1px solid ${theme.color.bluePrimary}` : 'none')};
  padding: ${({ theme }) => theme.modularScale.sixteen};
`;

const RadioFieldHidden = styled(RadioField, { shouldForwardProp: (prop) => prop !== 'inverted' })`
  color: ${(props) => (props.inverted ? props.theme.color.white : props.theme.color.brand)};
  font-size: 16px;
  line-height: 1.5;
  padding: 0;
  ::after {
    visibility: hidden;
  }
  ::before {
    visibility: hidden;
  }
`;

const EditRemoveButtons = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: ${(props) => props.theme.modularScale.sixteen};
`;

const RemoveContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const RemoveAddress = styled(Typography)`
  font-family: ${(props) => props.theme.font.sans};
  align-self: flex-start;
  border: 0 none;
  background: none;
  text-decoration: underline;
  color: ${({ theme }) => theme.color.brand};
  cursor: pointer;
  padding: 0;
  outline: 0;
  font-size: 16px;
  z-index: ${({ theme }) => theme.layers.backstage};
  :hover {
    opacity: 0.75;
  }
`;

const AreYouSure = styled.div`
  color: ${({ theme }) => theme.color.brand};
  font-family: ${({ theme }) => theme.font.caption};
  line-height: normal;
  font-size: 16px;
  margin-left: 2rem;
  margin-top: auto;
  outline: 0;
  padding-right: 0.4rem;
`;

const AddressShipping = (props) => {
  const DEFAULT_ADDRESS_OBJECT = {
    first_name: { search: '' },
    last_name: { search: '' },
    address1: { search: '' },
    address2: { search: '' },
    city: { search: '' },
    zipcode: { search: '' },
    phone: { search: '' },
    country_iso: { search: 'US' },
    state_name: { search: '' },
    state_id: { search: '' }
  };

  const [useNewAddress, setUseNewAddress] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isPicked, setIsPicked] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(
    props.values.shipping[0].ship_address_attributes
  );

  useEffect(() => {
    const foundAddress = props.addresses.find((address) => address.id === +selectedAddress);
    const foundaddressIndex = props.addresses.indexOf(foundAddress);
    if (foundAddress) {
      setIsPicked(foundaddressIndex);
    }
  }, []);

  const handleScroll = () => {
    // scrolls window to previous position if editing address.
    // scrolls to top if not.
    // the timeout allows for some race conditions to settle first
    // otherwise, it scrolls to the bottom of the page
    // if the original scrollY is larger than the address form
    setTimeout(() => {
      if (editAddress) {
        global.window.scrollTo(0, scrollY);
      } else {
        global.window.scrollTo(0, 0);
      }
    }, 0);
  };

  const handleScrollPos = () => {
    // set the scroll position when button is pressed
    // for later use
    const scrollPos = global.document?.documentElement?.scrollTop
      ?? global.document?.body?.scrollTop;
    setScrollY(scrollPos);
    // scroll user to show top of form
    global.window.scrollTo(0, 0);
  };

  const handleOnNewAddressClick = (replace) => {
    replace(props.index, {
      ...props.values[props.name][props.index],
      ship_address_attributes: DEFAULT_ADDRESS_OBJECT
    });
    // scroll user to top of page when adding new address
    global.window.scrollTo(0, 0);
    setSelectedAddress(props.values[props.name][props.index].ship_address_attributes);
    setUseNewAddress(true);
    props.setIsNewAddress(true);
  };

  // Sends logged in user back to list of addresses
  const handleOnCancelClick = (replace) => {
    handleScroll();
    setUseNewAddress(false);
    props.setIsNewAddress(false);
    setEditAddress(false);

    replace(props.index, {
      ...props.values[props.name][props.index],
      ship_address_attributes: selectedAddress
    });
  };

  useEffect(() => {
    if (props.addresses.length === 0) {
      setUseNewAddress(true);
      props.setIsNewAddress(true);
    }
  }, [props.addresses.length]);

  // Manages the toggle between "Delete" and "Are you sure? Yes, delete" component
  const handleConfirmDelete = (index) => {
    setConfirmDelete(index);
  };

  const handleOnAddressDelete = async (address) => {
    props.setLoading(true);
    await deleteAddress({ id: props.profile.id, address_id: address.id })
      .then(async (addresses) => {
        const addressesData = addresses?.data ?? addresses;
        props.setUserProfile({ addresses: addressesData });
      });
    Router.reload();
    setConfirmDelete(null);
  };

  // Manages the style toggle between which component is currently picked
  const handleIsPicked = (index) => {
    setIsPicked(index);
  };

  return (
    <FieldArray
      name={props.name}
      render={({ replace }) => (
        <>
          <SectionLabel element="p" like="heading-6"><span>Delivery address</span></SectionLabel>

          {
            props.addresses && props.addresses.length > 0 && !useNewAddress && (
              <>
                <AddressRadioWrapper>
                  {
                    props.addresses.map((address, index) => (
                      <Address key={`shipping-${address.id}`} isPickedBackground={isPicked === index}>
                        <Field
                          aria-describedby="us-only-error"
                          id={`shipping-${address.id}`}
                          value={address.id}
                          component={RadioFieldHidden}
                          onClick={() => handleIsPicked(index)}
                          name={`${props.name}.${props.index}.ship_address_attributes`}
                          label={(
                            <>
                              {`${address.firstname} ${address.lastname}`}
                              <br />
                              {`${address.address1}`}
                              {address.address2 && `, ${address.address2}`}
                              <br />
                              {`${address.city}, ${address.state_text} ${address.zipcode}`}
                              <br />
                              {address.country.name}
                              <br />
                              {formatPhoneNumber(address.phone)}
                            </>
                          )}
                        />
                        <EditRemoveButtons>
                          <EditAddress
                            aria-label={`edit address, ${address.address1}`}
                            element="button"
                            type="button"
                            like="label-1"
                            onClick={() => {
                              setEditAddress(address);
                              handleScrollPos();
                              setUseNewAddress(true);
                            }}
                          >
                            Edit
                          </EditAddress>
                          {
                            <RemoveContainer>
                              {confirmDelete === index && (
                                <AreYouSure>Are you sure?</AreYouSure>)}
                              <RemoveAddress
                                aria-label={`delete address, ${address.address1}`}
                                element="button"
                                type="button"
                                like="label-1"
                                onClick={() => (
                                  confirmDelete === index ? handleOnAddressDelete(address)
                                    : handleConfirmDelete(index))}
                              >
                                {confirmDelete === index ? 'Yes, remove' : 'Remove'}
                              </RemoveAddress>
                            </RemoveContainer>
                          }
                        </EditRemoveButtons>
                      </Address>
                    ))
                  }
                </AddressRadioWrapper>
              </>
            )
          }
          {
            !useNewAddress && (
              <NewAddressContainer onClick={() => handleOnNewAddressClick(replace)}>
                <PlusSign />
                <NewAddressButton
                  data-test-id="new-ship-address-button"
                  aria-label="add new address"
                  element="button"
                  type="button"
                  like="label-1"
                  disabled={useNewAddress}
                >
                  Add new address
                </NewAddressButton>
              </NewAddressContainer>
            )
          }
          {
            props.addresses.length > 0 && !useNewAddress && (
              <SingleButtonControl>
                <Button data-test-id="address-submit" type="submit" disabled={props.isSubmitting || !props.canShipToAddress(props.values.shipping[0].ship_address_attributes)}>
                  Use Address
                </Button>
              </SingleButtonControl>
            )

          }

          {
            useNewAddress && !editAddress && (
              <>
                <AddressForm
                  setFieldValue={props.setFieldValue}
                  name={`${props.name}.${props.index}.ship_address_attributes`}
                  values={props.values}
                  address={editAddress || null}
                  newCheckout
                />
                {
                  props.addresses.length > 0 ? (
                    <AddressControls>
                      <Button data-test-id="address-submit" type="submit" disabled={props.isSubmitting || !props.canShipToAddress(props.values.shipping[0].ship_address_attributes)}>
                        Add Address
                      </Button>
                      <CancelButton
                        data-test-id="ship-address-book-button"
                        type="button"
                        onClick={() => handleOnCancelClick(replace)}
                        disabled={!useNewAddress}
                        outline
                      >
                        Cancel
                      </CancelButton>
                    </AddressControls>
                  ) : (
                    <SingleButtonControl>
                      <Button data-test-id="address-submit" type="submit" disabled={props.isSubmitting || !props.canShipToAddress(props.values.shipping[0].ship_address_attributes)}>
                        Add Address
                      </Button>
                    </SingleButtonControl>
                  )
                }
              </>
            )
          }

          {
            useNewAddress && editAddress && (
              <EditAddressForm
                newCheckout
                buttonText="Update Address"
                address={editAddress}
                profile={props.profile}
                token={getCookie('maisonette_user_token')}
                redirect={false}
                onComplete={(address, addresses) => {
                  setEditAddress(false);
                  setUseNewAddress(false);
                  props.setIsNewAddress(false);
                  const ids = props.addresses.map((a) => a.id);
                  const selected = addresses.find((a) => !ids.includes(a.id));
                  // updated address gets moved closer to top of list, so should
                  // scroll to top so it is in view
                  global.window.scrollTo(0, 0);

                  replace(props.index, {
                    ...props.values[props.name][props.index],
                    ship_address_attributes: selected.id.toString()
                  });
                }}
                handleOnCancelClick={() => handleOnCancelClick(replace)}
              />
            )
          }
        </>
      )}
    />
  );
};

AddressShipping.defaultProps = {
  addresses: [],
  index: 0,
  profile: {},
  setIsNewAddress: () => { },
  setLoading: () => { }
};

AddressShipping.propTypes = {
  addresses: PropTypes.array,
  index: PropTypes.number,
  name: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  profile: PropTypes.object,
  setIsNewAddress: PropTypes.func,
  setUserProfile: PropTypes.func.isRequired,
  isSubmitting: PropTypes.any.isRequired,
  canShipToAddress: PropTypes.func.isRequired,
  setLoading: PropTypes.func
};

AddressShipping.whyDidYouRender = true;

export default AddressShipping;
