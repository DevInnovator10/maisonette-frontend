import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Router from 'next/router';
import styled from '@emotion/styled';
import { toast, TOAST } from '../../utils/toastify';
import Link from '../../utils/link';

import AccountSection from '../../molecules/account-section';
import Button from '../../atoms/button';
import CrossSVG from '../../atoms/icon-cross';
import IconButton from '../../molecules/icon-button';
import IconPlus from '../../atoms/icon-circle-plus';
import Radio from '../../atoms/radio';
import Typography from '../../atoms/typography';

import formatPhoneNumber from '../../utils/formatPhoneNumber';
import { deleteAddress, updateAddress } from '../../pages/api';

import { setUserProfile } from '../../store/modules/profile/actions';

const Body = styled.form`
  position: relative;
`;

const NoAddress = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
`;

const AddressWrapper = styled.fieldset`
  display: flex;
  flex-direction: column;
  label {
    button {
      line-height: 1;
    }
    @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
      button {
        opacity: 0;
      }
      :hover {
        button {
          opacity: 1;
        }
      }
    }
  }
`;

const Address = styled(Radio)`
  position: relative;
`;

const Actions = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 0.8rem;
`;

const ActionEdit = styled(Button)`
  text-decoration: underline;

  :focus {
    opacity: 1;
  }
`;

const ActionDelete = styled(Button)`
  align-items: center;
  color: ${({ theme }) => theme.color.brand};
  display: inline-flex;
  outline: 0;

  svg {
    stroke: ${(props) => props.theme.color.brand};
    stroke-width: 1rem;
    margin-right: 0.7rem;
    width: 0.8rem;
    height: 0.8rem;
  }

  :focus {
    opacity: 1;
  }
`;

const NewAddress = styled(IconButton)`
  border: 0;
  outline: 0;
`;

const AccountAddressSection = (props) => {
  const [defaultAddress, setDefaultAddress] = useState(
    props.addresses && props.addresses.find((addr) => addr.default)
      ? props.addresses.find((addr) => addr.default).id
      : null
  );

  const handleOnAddressClick = async (address) => {
    setDefaultAddress(address.id);

    const { default: d, country, ...addressObj } = address;
    await updateAddress({
      address_id: addressObj.id,
      body: {
        id: addressObj.id,
        default: true,
        ...addressObj
      },
      id: props.user
    }).then((res) => {
      if (!res.errors) toast('Default Address selection has been updated', { type: TOAST.TYPE.SUCCESS });
    });
  };

  const handleOnAddressDelete = async (address) => {
    await deleteAddress({ id: props.user, address_id: address.id })
      .then(async (addresses) => {
        const addressesData = addresses?.data ?? addresses;
        props.setUserProfile({ addresses: addressesData });

        if (address.id === defaultAddress && props.addresses.length > 1) {
          handleOnAddressClick(props.addresses[1]);
        }

        Router.push('/account');
      });
  };

  const accountAddressBody = (
    <Body>
      <AddressWrapper>
        {
          props.addresses && props.addresses.length > 0
            ? (
              props.addresses.map((address) => (
                <Address
                  key={`${address.id}`}
                  id={`address-${address.id}`}
                  name={`address-${address.id}`}
                  value={address.id}
                  active={defaultAddress === address.id}
                  changed={() => handleOnAddressClick(address)}
                >
                  {`${address.firstname} ${address.lastname}`}
                  <br />
                  {`${address.address1}${address.address2 ? `, ${address.address2}` : ''}`}
                  <br />
                  {`${address.city}, ${address.state_text} ${address.zipcode}`}
                  <br />
                  {address.country.name}
                  <br />
                  {formatPhoneNumber(address.phone)}

                  <Actions>
                    <ActionDelete
                      aria-label={`delete address, ${address.address1}`}
                      isIcon
                      inverted
                      outline
                      onClick={() => handleOnAddressDelete(address)}
                    >
                      <CrossSVG />
                      Delete
                    </ActionDelete>

                    <Link href={`/address/edit?id=${address.id}`}>
                      <ActionEdit aria-label={`edit address, ${address.address1}`} isText>Edit</ActionEdit>
                    </Link>
                  </Actions>
                </Address>
              ))
            ) : <NoAddress element="p" like="paragraph-3">You have no saved addresses.</NoAddress>
        }
      </AddressWrapper>
    </Body>
  );

  const accountAddressFooter = (
    <NewAddress
      isText
      text="Add New Address"
      clicked={() => Router.push('/address/new')}
    >
      <IconPlus strokeWidth="5" />
    </NewAddress>
  );

  return (
    <AccountSection
      className={props.className}
      title="Addresses"
      body={accountAddressBody}
      footer={accountAddressFooter}
    />
  );
};

AccountAddressSection.defaultProps = {
  className: ''
};

AccountAddressSection.propTypes = {
  addresses: PropTypes.array.isRequired,
  className: PropTypes.string,
  user: PropTypes.number.isRequired,
  setUserProfile: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  setUserProfile: (addresses) => dispatch(setUserProfile(addresses))
});

const ConnectedAccountAddressSection = connect(
  mapStateToProps, mapDispatchToProps
)(AccountAddressSection);

AccountAddressSection.displayName = 'AccountAddressSection';

AccountAddressSection.whyDidYouRender = true;

export default ConnectedAccountAddressSection;
