import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import AccountSection from '../../molecules/account-section';
import Typography from '../../atoms/typography';
import Link from '../../atoms/anchor';

const Password = styled.div`
  align-items: center;
  border-top: 1px solid ${(props) => props.theme.color.brandLight};
  display: flex;
  flex-direction: row;
  margin-bottom: -1rem;
  margin-top: 1rem;
`;

const Mask = styled(Typography)`
  color: ${(props) => props.theme.color.brandLight};
  flex: 1;
  line-height: 4rem;
  max-height: 4rem;
`;

const Field = styled(Typography)`
  min-height: 2.4rem;
`;

const ChangePasswordLink = styled(Link)`
  color: ${(props) => props.theme.color.brand};
  line-height: 4rem;
`;

const EditLink = styled(Link)`
  position: absolute;
  right: 0;
  top: 1rem;
`;

const AccountProfileSection = (props) => {
  const defaultAddress = props.profile?.addresses?.find((addr) => addr.default);
  const country = defaultAddress
    ? defaultAddress.country.name
    : 'United States';

  const accountProfileBody = (
    <>
      <Field element="p" like="dec-1">
        {props.profile.first_name}
        {' '}
        {props.profile.last_name}
      </Field>
      <Field element="p" like="dec-1">{props.profile.email}</Field>
      <Field element="p" like="dec-1">{country}</Field>

      <Password>
        <Mask aria-hidden="true" element="p" like="dec-1"><span>⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎⁎</span></Mask>
        <ChangePasswordLink uppercase underline href="/account/edit">Change Password</ChangePasswordLink>
      </Password>

      <EditLink uppercase underline href="/account/edit">Edit</EditLink>
    </>
  );

  return (
    <AccountSection
      className={props.className}
      title="Profile"
      body={accountProfileBody}
    />
  );
};

AccountProfileSection.defaultProps = {
  className: '',
  profile: {}
};

AccountProfileSection.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.object
};

AccountProfileSection.whyDidYouRender = true;

export default AccountProfileSection;
