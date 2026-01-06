import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Radio from '../../atoms/radio';
import Typography from '../../atoms/typography';

const AddressWrapper = styled('div', { shouldForwardProp: (prop) => prop !== 'active' })`
  display: grid;
  grid-row-gap: ${(props) => props.theme.modularScale.base};
  padding: ${(props) => props.theme.modularScale.base};
  text-align: left;
  background: ${(props) => (props.active ? props.theme.color.backgroundLightBlue : props.theme.color.white)};

  strong {
    background: #F0E4E3;
    color: #C04318;
    display: inline-block;
  }
`;

const Heading = styled(Typography, { shouldForwardProp: (prop) => prop !== 'active' })`
  font-size: ${(props) => props.theme.modularScale.base};
  letter-spacing: 0.25rem;
  margin-bottom: ${(props) => props.theme.modularScale.small};
`;

const Address = styled(Typography)`
  font-size: ${(props) => props.theme.modularScale.medium};
`;

const VerificationRadio = styled(Radio)`
  align-self: center;
  color: ${(props) => props.theme.color.brand};
  width: 100%;

  :after {
    top: 50%;
  }

  :before {
    top: calc(50% - 3px);
    border-color: ${(props) => props.theme.color.brand};
  }

  ${Heading}, ${Address} {
    margin-left: ${(props) => props.theme.modularScale.small};
  }
`;

const NotFoundWrapper = styled.div`
  margin: 0 auto;
`;

const AddressVerificationAddress = (props) => {
  const handleSelectedAddress = () => {
    props.setSelectedAddress(props.heading);
  };

  const highlightDifference = (addressValue, key) => {
    if (addressValue && props.differences?.includes(key)) {
      return `<strong>${addressValue}</strong>`;
    }

    return addressValue;
  };

  return (
    <AddressWrapper active={props.selectedAddress === props.heading}>
      {
        props.isRadio
          ? (
            <VerificationRadio
              id={`${props.heading}-address-radio`}
              name={`${props.heading}-address`}
              active={props.selectedAddress === props.heading}
              changed={handleSelectedAddress}
              value={'verified-address-radio'}
            >
              <Heading element="p" like="label-1">
                {props.heading.toUpperCase()}
                {' '}
                ADDRESS
              </Heading>
              <Address
                element="div"
                like="paragraph-4"
                dangerouslySetInnerHTML={{
                  __html: `
                  <p>${highlightDifference(props.address?.street1, 'street1')}</p>
                  <p>${highlightDifference(props.address?.street2, 'street2')}</p>
                  <p>${highlightDifference(props.address?.city, 'city')}, ${highlightDifference(props.address?.state, 'state')} ${highlightDifference(props.address.zip, 'zip')}</p>
                  <p>${props.address?.country === 'US' ? 'UNITED STATES' : props.address?.country}</p>`
                }}
              />
            </VerificationRadio>
          )
          : (
            <NotFoundWrapper>
              <Heading element="p" like="label-1">
                {props.heading.toUpperCase()}
                {' '}
                ADDRESS
              </Heading>
              <Address
                element="p"
                like="paragraph-4"
              >
                {props.address?.street1}
                {props.address?.street2 && `, ${props.address.street2}`}
                <br />
                {props.address?.city}
                ,
                {' '}
                {props.address?.state}
                {' '}
                {props.address?.zip}
                <br />
                {props.address?.country === 'US' ? 'United States' : props.address?.country}
              </Address>
            </NotFoundWrapper>
          )
      }
    </AddressWrapper>
  );
};

AddressVerificationAddress.defaultProps = {
  differences: [],
  selectedAddress: 'suggested',
  setSelectedAddress: () => { },
  isRadio: false
};

AddressVerificationAddress.propTypes = {
  isRadio: PropTypes.bool,
  heading: PropTypes.string.isRequired,
  address: PropTypes.object.isRequired,
  differences: PropTypes.array,
  selectedAddress: PropTypes.string,
  setSelectedAddress: PropTypes.func
};

export default AddressVerificationAddress;
