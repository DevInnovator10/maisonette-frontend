import React from 'react';
import { useField } from 'formik';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Typography from '../../atoms/typography';

const InputWrapper = styled.div`
  margin-bottom: .4rem;
  position: relative;
`;

const InputField = styled.input`
  appearance: none;
  background: ${(props) => (props.disabled ? '' : props.theme.color.brandNeutral)};
  border-color: ${(props) => (props?.errors?.length > 0 ? props.theme.color.brandError : '')};
  box-sizing: border-box;
  color: ${(props) => (props?.errors?.length > 0 ? props.theme.color.brandError : props.theme.color.brand)};
  font-family: ${(props) => props.theme.font.sans};
  font-size: ${(props) => props.theme.modularScale.small};
  height: 4rem;
  letter-spacing: 0.04em;
  outline-color: ${(props) => props.theme.color.brandLight};
  outline: 0;
  padding: 1.25rem 1.5rem;
  width: 100%;
  border-radius: 0;

  ::placeholder {
    color: ${(props) => props.theme.color.brandLight};
  }

  :-internal-autofill-selected {
    /* TODO: go away Google! */
    color: ${(props) => props.theme.color.brand} !important;
  }

  & ~ & {
    margin-top: 1rem;
  }
`;

const ErrorMsg = styled.div`
  color: ${(props) => props.theme.color.brandError};
  display: block;
  font-family: ${(props) => props.theme.font.sans};
  font-size: 1.2rem;
  left: 0;
  margin-top: 0.25rem;
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: ${(props) => props.theme.layers.backstage};
  background-color: var(--background-color);
`;

const Label = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  letter-spacing: 0.2em;
  margin-bottom: 0.5rem;
`;

// eslint-disable-next-line react/destructuring-assignment
const PetiteProfileField = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  if (props.native && field.value) {
    field.value = (() => {
      const [month, day, year] = field.value.split('-');
      if (month.length > 2) {
        return field.value;
      }
      return `${year}-${month}-${day}`;
    })();
  }

  return (
    <InputWrapper>
      <Label element="label" like="label-1" htmlFor={field.name}>{label}</Label>
      <InputField
        aria-describedby={meta.touched && meta.error ? `${field.name}-error` : null}
        errors={meta.touched ? meta.error : false}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <ErrorMsg id={`${field.name}-error`} role="alert">{meta.error}</ErrorMsg>
      ) : null}
    </InputWrapper>
  );
};

PetiteProfileField.defaultProps = {
  native: false
};

PetiteProfileField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  native: PropTypes.bool
};

export default PetiteProfileField;
