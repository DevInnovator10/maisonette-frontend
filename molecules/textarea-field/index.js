import React, { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { Field, ErrorMessage, useField } from 'formik';
import { useId } from '@reach/auto-id';

import Typography from '../../atoms/typography';

const errorStyles = ({ theme, revamp }) => css`
    border-color: ${revamp ? theme.color.redError : theme.color.brandError};
  color: ${revamp ? theme.color.redError : theme.color.brandError};
`;

const InputField = styled(Field, { shouldForwardProp: (prop) => prop !== 'revamp' })`
  appearance: none;
  background: ${({ theme, revamp }) => (revamp ? theme.color.backgroundLightBlue : theme.color.brandNeutral)};
  border: ${({ theme, revamp }) => (revamp ? `1px solid ${theme.color.borderBlue}` : '0 none')};
  box-sizing: border-box;
  color: ${(props) => props.theme.color.brand};
  font-family: ${(props) => props.theme.font.sans};
  font-size: ${({ theme, revamp }) => (revamp ? theme.modularScale.sixteen : theme.modularScale.small)};
  height: ${({ revamp }) => (revamp ? '14rem' : '10rem')};
  letter-spacing: 0.04em;
  outline-color: ${(props) => props.theme.color.brandLight};
  outline: 0;
  padding: 1.1rem 1.5rem;
  resize: vertical;
  width: 100%;

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

const ErrorMsg = styled(ErrorMessage, { shouldForwardProp: (prop) => prop !== 'revamp' })`
  color: ${({ theme, revamp }) => (revamp ? theme.color.redError : theme.color.brandError)};
  display: block;
  font-family: ${(props) => props.theme.font.sans};
  font-size: 1.2rem;
  left: 0;
  margin-top: 0.25rem;
  position: absolute;
  top: 100%;
  width: 100%;
`;

const Wrapper = styled('div', { shouldForwardProp: (prop) => prop !== 'revamp' })`
  display: flex;
  flex-direction: column-reverse;
  position: relative;

  ${ErrorMsg} + ${InputField} {
    border: 0.2rem solid transparent;
    ${errorStyles}

    ::placeholder {
      color: ${({ theme, revamp }) => (revamp ? theme.color.redError : theme.color.brandError)};
      opacity: 0.6;
    }
  }
`;

const Label = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: 0.5rem;
`;

const FormikField = forwardRef((props, ref) => {
  const meta = useField(props.name)[1];
  const [totalChars, setTotalChars] = useState(0);

  /**
   * get pdpRevamp value from siteSpect
   * which is pulled out and replaced with static value for a while
   */

  const pdpRevamp = false;

  useEffect(() => {
    if (pdpRevamp) {
      if (meta.value.length !== totalChars) {
        setTotalChars(meta.value.length);
        props.updateCharCount(meta.value.length);
      }
    }
  }, [meta.value]);

  return (
    <>
      {
        props.label ? (
          <Wrapper
            className={props.className}
            revamp={props.revamp}
          >
            <ErrorMsg
              id={`${props.id}-error`}
              role="alert"
              name={props.name}
              component="span"
              revamp={props.revamp}
            />
            <InputField
              innerRef={ref}
              id={props.id || `${props.label.toLowerCase().split(' ').join('-')}-${useId()}`}
              name={props.name}
              placeholder={props.placeholder}
              validate={props.validate}
              component="textarea"
              aria-describedby={meta.touched && meta.error ? `${props.id}-error` : null}
              revamp={props.revamp}
              maxLength={props.maxLength}
            />

            {
              props.label && (
                <Label
                  element="label"
                  like={props.revamp ? 'dec-3' : 'label-1'}
                  htmlFor={props.id || `${props.label.toLowerCase().split(' ').join('-')}-${useId()}`}
                >
                  {props.label}
                </Label>
              )
            }
          </Wrapper>
        ) : null
      }
    </>
  );
});

FormikField.defaultProps = {
  className: '',
  id: '',
  validate: () => { },
  revamp: false,
  updateCharCount: () => { },
  maxLength: null
};

FormikField.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  validate: PropTypes.func,
  revamp: PropTypes.bool,
  updateCharCount: PropTypes.func,
  maxLength: PropTypes.number
};

export default FormikField;
