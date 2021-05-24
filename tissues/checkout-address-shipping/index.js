import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { Field, FieldArray } from 'formik';

import AddressForm from '../form-address';
import EditAddressForm from '../address-create-new';
import ButtonAtom from '../../atoms/button';
import RadioField from '../../molecules/formik-radio';
import Typography from '../../atoms/typography';

import getCookie from '../../utils/getCookie';
import formatPhoneNumber from '../../utils/formatPhoneNumber';

const SectionLabel = styled(Typography)`
  border-bottom: 1px solid ${({ theme }) => theme.color.brand};
  color: ${({ theme }) => theme.color.brand};
  display: block;
`;

const AddressRadioWrapper = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(2, 1fr);

  > div > label {
    margin-bottom: 1rem;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Button = styled(ButtonAtom)`
  grid-column: -1 / 1;
  outline: 0;
`;

const AddressControls = styled.div`
  display: grid;
  grid-gap: 1rem;


  ${Button}:not([data-id="view-all"]) {
    grid-column: auto;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const EditAddress = styled(Typography)`
  align-self: flex-start;
  background: ${({ theme }) => theme.color.brand};
  border: 0 none;
  color: ${({ theme }) => theme.color.white};
  cursor: pointer;
  letter-spacing: 0.2em;
  margin-left: 2rem;
  margin-top: auto;
  outline: 0;
  padding: 0.5rem 0;
  /* because the font stinks, and doesn't look centered */
  padding-left: calc(0.75rem + 2px);
  padding-right: 0.75rem;
  text-transform: uppercase;
  z-index: ${({ theme }) => theme.layers.backstage};

  :hover {
    opacity: 0.75;
  }
`;

const Address = styled.div`
  display: flex;
  flex-direction: column;
`;

const AddressShipping = (props) => {
  const MAX_ADDRESSES = 4;

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

  const hasMoreAddresses = () => props.addresses.length > MAX_ADDRESSES;

  const getDefaultAddress = () => {
    // use cart shipping address if previously selected
    if (props.cartShippingAddress?.id) {
      return props.cartShippingAddress.id.toString();
    }

    // use default user address if no address is already selected
    if (props.addresses && props.addresses.length > 0) {
      const defaultAddress = props.addresses.find((a) => a.default);
      return defaultAddress ? defaultAddress.id.toString() : props.addresses[0].id.toString();
    }

    return '';
  };

  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(getDefaultAddress());
  const [editAddress, setEditAddress] = useState(false);

  const handleOnNewAddressClick = (replace) => {
    replace(props.index, {
      ...props.values[props.name][props.index],
      ship_address_attributes: DEFAULT_ADDRESS_OBJECT
    });

    setSelectedAddress(props.values[props.name][props.index].ship_address_attributes);
    setUseNewAddress(true);
    props.setIsNewAddress(true);
  };

  const handleOnAddressBookClick = (replace) => {
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

  return (
    <FieldArray
      name={props.name}
      render={({ replace }) => (
        <>
          <SectionLabel element="p" like="heading-6"><span>Shipping Address</span></SectionLabel>

          {
            props.addresses && props.addresses.length > 0 && !useNewAddress && (
              <>
                <AddressRadioWrapper>
                  {
                    hasMoreAddresses()
                      ? (
                        <>
                          {
                            props.addresses.slice(0, MAX_ADDRESSES).map((address) => (
                              <Field
                                aria-describedby="us-only-error"
                                key={`shipping-${address.id}`}
                                id={`shipping-${address.id}`}
                                value={address.id}
                                component={RadioField}
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
                            ))
                          }

                          {
                            showAllAddresses && props.addresses.slice(MAX_ADDRESSES).map(
                              (address) => (
                                <Field
                                  aria-describedby="us-only-error"
                                  key={`shipping-${address.id}`}
                                  id={`shipping-${address.id}`}
                                  value={address.id}
                                  component={RadioField}
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
                              )
                            )
                          }
                        </>
                      ) : (
                        props.addresses.map((address) => (
                          <Address key={`shipping-${address.id}`}>
                            <Field
                              aria-describedby="us-only-error"
                              id={`shipping-${address.id}`}
                              value={address.id}
                              component={RadioField}
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

                            <EditAddress
                              aria-label={`edit address, ${address.address1}`}
                              element="button"
                              type="button"
                              like="label-1"
                              onClick={() => {
                                setEditAddress(address);
                                setUseNewAddress(true);
                              }}
                            >
                              Edit
                            </EditAddress>
                          </Address>
                        ))
                      )
                  }
                </AddressRadioWrapper>
              </>
            )
          }

          {
            props.addresses.length > 0 && (
              <AddressControls>
                {
                  showAllAddresses && !useNewAddress && (
                    <Button type="button" onClick={() => setShowAllAddresses(false)} data-id="view-all">
                      Show Fewer Addresses
                    </Button>
                  )
                }

                {
                  // eslint-disable-next-line max-len
                  !showAllAddresses && !useNewAddress && props.addresses.length > MAX_ADDRESSES && (
                    <Button type="button" onClick={() => setShowAllAddresses(true)} data-id="view-all">
                      {`View All Addresses (${props.addresses.slice(MAX_ADDRESSES).length})`}
                    </Button>
                  )
                }

                <Button
                  data-test-id="ship-address-book-button"
                  type="button"
                  onClick={() => handleOnAddressBookClick(replace)}
                  disabled={!useNewAddress}
                >
                  Address Book
                </Button>

                <Button
                  data-test-id="new-ship-address-button"
                  aria-label="add new address"
                  type="button"
                  onClick={() => handleOnNewAddressClick(replace)}
                  disabled={useNewAddress}
                >
                  New
                </Button>
              </AddressControls>
            )
          }

          {
            useNewAddress && !editAddress && (
            <AddressForm
              setFieldValue={props.setFieldValue}
              name={`${props.name}.${props.index}.ship_address_attributes`}
              values={props.values}
              address={editAddress || null}
            />
            )
          }

          {
            useNewAddress && editAddress && (
              <EditAddressForm
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

                  replace(props.index, {
                    ...props.values[props.name][props.index],
                    ship_address_attributes: selected.id.toString()
                  });
                }}
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
  setIsNewAddress: () => {},
  cartShippingAddress: {}
};

AddressShipping.propTypes = {
  addresses: PropTypes.array,
  index: PropTypes.number,
  name: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  profile: PropTypes.object,
  setIsNewAddress: PropTypes.func,
  cartShippingAddress: PropTypes.object
};

AddressShipping.whyDidYouRender = true;

export default AddressShipping;
