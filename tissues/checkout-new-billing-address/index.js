import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { Field, FieldArray } from 'formik';

import AddressForm from '../form-address-new-checkout';
import CheckboxField from '../../molecules/formik-checkbox';
import Typography from '../../atoms/typography';

const SectionHeading = styled(Typography)`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const StyledField = styled(Field)`
  color: ${(props) => props.theme.color.brand};

  font-size: 1.6rem;
  padding-left: 2rem;
  
  :before, :after {
    border-color: ${(props) => props.theme.color.brand};
    font-size: 1.2rem;

  }
`;

const AddressBilling = (props) => (
  <FieldArray
    name={props.name}
    render={() => (
      <>
        <SectionHeading element="h2" like="dec-2"><span>Billing Address</span></SectionHeading>

        <StyledField
          component={CheckboxField}
          id="use_billing"
          label="Same as shipping address"
          name={`${props.name}.${props.index}.use_billing`}
        />

        {

            !props.values[props.name][props.index].use_billing && (
              <AddressForm
                isBilling
                setFieldValue={props.setFieldValue}
                name={`${props.name}.${props.index}.bill_address_attributes`}
                values={props.values}
                newCheckout
              />
            )
          }
      </>
    )}
  />

);

AddressBilling.defaultProps = {
  index: 0
};

AddressBilling.propTypes = {
  index: PropTypes.number,
  name: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired
};

export default AddressBilling;
