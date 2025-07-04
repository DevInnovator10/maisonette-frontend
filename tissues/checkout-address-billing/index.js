import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { Field, FieldArray } from 'formik';

import AddressForm from '../form-address';
import ButtonAtom from '../../atoms/button';
import CheckboxField from '../../molecules/formik-checkbox';
import RadioField from '../../molecules/formik-radio';
import Typography from '../../atoms/typography';
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

const AddressBilling = (props) => {
  const MAX_ADDRESSES = 4;

  const DEFAULT_ADDRESS_OBJECT = {
    first_name: { search: '' },
    last_name: { search: '' },
    address1: { search: '' },
    address2: { search: '' },
    city: { search: '' },
    zipcode: { search: '' },
    phone: { search: '' },
    country_iso: { search: '' },
    state_name: { search: '' },
    state_id: { search: '' }
  };

  const hasMoreAddresses = () => props.addresses.length > MAX_ADDRESSES;

  const getDefaultAddress = () => {
    // use cart billing address if previously selected

    if (props.cartBillingAddress?.id) {
      return props.cartBillingAddress.id.toString();
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

  const resetState = () => {
    setShowAllAddresses(false);
    setUseNewAddress(false);
    props.setIsNewAddress(false);
  };

  const getIndexOfProperty = (property) => {
    const obj = props.values[props.name][0];
    return Object.keys(obj).indexOf(property);
  };

  const handleOnNewAddressClick = (replace) => {
    setSelectedAddress(props.values[props.name][props.index].bill_address_attributes);
    setUseNewAddress(true);
    props.setIsNewAddress(true);

    replace(props.index, {
      ...props.values[props.name][props.index],
      bill_address_attributes: DEFAULT_ADDRESS_OBJECT
    });
  };

  const handleOnAddressBookClick = (replace) => {
    setUseNewAddress(false);
    props.setIsNewAddress(false);

    replace(props.index, {
      ...props.values[props.name][props.index],
      bill_address_attributes: selectedAddress
    });
  };

  return (
    <FieldArray
      name={props.name}
      render={({ remove, replace }) => (
        <>
          <SectionLabel element="p" like="heading-6"><span>Billing Address</span></SectionLabel>

          <Field
            component={CheckboxField}
            id="use_billing"
            label="Same as shipping"
            name={`${props.name}.${props.index}.use_billing`}
            onClick={() => {
              if (!props.values[props.name][props.index].use_billing) {
                remove(getIndexOfProperty('bill_address_attributes'));
                resetState();
                return;
              }

              if (props.addresses.length > 0) {
                replace(props.index, {
                  ...props.values[props.name][props.index],
                  bill_address_attributes: selectedAddress
                });
              } else {
                handleOnNewAddressClick(replace);
              }
            }}
          />

          {
            !props.values[props.name][props.index].use_billing && (
              <>
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
                                      key={`billing-${address.id}`}
                                      id={`billing-${address.id}`}
                                      value={address.id}
                                      component={RadioField}
                                      name={`${props.name}.${props.index}.bill_address_attributes`}
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
                                        key={`billing-${address.id}`}
                                        id={`billing-${address.id}`}
                                        value={address.id}
                                        component={RadioField}
                                        name={`${props.name}.${props.index}.bill_address_attributes`}
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
                                <Field
                                  key={`billing-${address.id}`}
                                  id={`billing-${address.id}`}
                                  value={address.id}
                                  component={RadioField}
                                  name={`${props.name}.${props.index}.bill_address_attributes`}
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
                        data-test-id="bill-address-book-button"
                        type="button"
                        onClick={() => handleOnAddressBookClick(replace)}
                        disabled={!useNewAddress}
                      >
                        Address Book
                      </Button>

                      <Button
                        data-test-id="new-bill-address-button"
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
                  (useNewAddress || !props.profile?.id)
                    && (
                    <AddressForm
                      isBilling
                      setFieldValue={props.setFieldValue}
                      name={`${props.name}.${props.index}.bill_address_attributes`}
                      values={props.values}
                    />
                    )
                }
              </>
            )
          }
        </>
      )}
    />
  );
};

AddressBilling.defaultProps = {
  addresses: [],
  index: 0,
  setIsNewAddress: () => {},
  profile: {},
  cartBillingAddress: {}
};

AddressBilling.propTypes = {
  addresses: PropTypes.array,
  index: PropTypes.number,
  name: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setIsNewAddress: PropTypes.func,
  profile: PropTypes.object,
  cartBillingAddress: PropTypes.object
};

export default AddressBilling;
