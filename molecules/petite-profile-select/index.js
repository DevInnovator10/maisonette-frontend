import React from 'react';
import { useField } from 'formik';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Typography from '../../atoms/typography';

const InputWrapper = styled.div`
  position: relative;
`;

const InputField = styled.select`
  appearance: none;
  background: ${(props) => (props.disabled ? 'none' : props.theme.color.brandNeutral)};
  border-color: ${(props) => (props?.errors?.length > 0 ? props.theme.color.brandError : 'transparent')};
  border-radius: 0;
  color: ${(props) => (props?.errors?.length > 0 ? props.theme.color.brandError : props.theme.color.brand)};
  display: block;
  font-family: ${(props) => props.theme.font.sans};
  font-size: ${(props) => props.theme.modularScale.small};
  height: 4rem;
  letter-spacing: 0.04em;
  outline-color: ${(props) => props.theme.color.brandLight};
  outline: 0;
  padding: 0 1.5rem;
  width: 100%;

  &:disabled {
    background: none;
    border: none;
    outline: none;
    opacity: 1;
    padding: 0;
  }

  &::placeholder {
    color: ${(props) => props.theme.color.brandLight};
  }

  &:-internal-autofill-selected {
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
`;

const Label = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  letter-spacing: 0.2em;
  margin-bottom: 0.5rem;
`;

// eslint-disable-next-line react/destructuring-assignment
const PetiteProfileSelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <InputWrapper>
      <Label element="label" like="label-1" htmlFor={field.name}>{label}</Label>
      <InputField
        errors={meta.error}
        {...field}
        {...props}
        aria-describedby={meta.touched && meta.error ? `${field.name}-error` : null}
      >
        {props.children}
      </InputField>
      {meta.touched && meta.error ? (
        <ErrorMsg id={`${field.name}-error`} role="alert">{meta.error}</ErrorMsg>
      ) : null}
    </InputWrapper>
  );
};

PetiteProfileSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default PetiteProfileSelect;
