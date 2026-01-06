import React from 'react';
import PropTypes from 'prop-types';

import styled from '@emotion/styled';
import { css } from '@emotion/core';

const selectBorder = (props) => {
  if (props.warning) return props.theme.color.redError;
  return props.theme.color.borderBlue;
};

const properties = (props) => {
  if (props.revamp) {
    return css`
      background: ${props.theme.color.backgroundLightBlue};
      box-sizing: border-box;

      border: 0.1rem solid ${selectBorder(props)};
      color: ${props.theme.color.bluePrimary};
      font-family: ${props.theme.font.sans};
      font-size: ${props.theme.modularScale.eighteen};
      height: 4rem;
      letter-spacing: 0.04em;
      padding: 0 1.5rem;
      width: 100%;
      ::placeholder {
        color: ${props.theme.color.brandLightBlue};
      }
    `;
  }

  if (props.inverted && props.outline) {
    return css`
      background: ${props.theme.color.brand};
      border: 1px solid ${props.theme.color.white};
      box-sizing: border-box;
      color: ${props.theme.color.white};
      font-family: ${props.theme.font.caption};
      font-size: ${props.theme.modularScale.small};
      height: 4.7rem;
      letter-spacing: 0.24em;
      padding-left: 3.6rem;
      text-transform: uppercase;
      width: 100%;
      ::placeholder {
        color: ${props.theme.color.white};
        text-transform: uppercase;
      }
    `;
  }
  if (props.inverted && props.underline) {
    return css`
      background: transparent;
      border-bottom: 1px solid ${props.theme.color.brandNeutral};
      box-sizing: border-box;
      color: ${props.theme.color.white};
      font-family: ${props.theme.font.caption};
      font-size: ${props.theme.modularScale.small};
      height: 4.4rem;
      letter-spacing: 0.24em;
      width: 100%;
      ::placeholder {
        color: ${props.theme.color.white};
        text-transform: uppercase;
      }
    `;
  }
  if (props.underline) {
    return css`
      background: transparent;
      border-bottom: 2px solid ${props.theme.color.brand};
      box-sizing: border-box;
      color: ${props.theme.color.brand};
      font-family: ${props.theme.font.sans};
      font-size: ${props.theme.modularScale.small};
      height: 4rem;
      letter-spacing: 0.04em;
      padding: 0;
      width: 100%;
      ::placeholder {
        color: ${props.theme.color.brandLight};
      }
    `;
  }
  return css`
    background: ${props.theme.color.brandNeutral};
    box-sizing: border-box;
    color: ${props.theme.color.brand};
    font-family: ${props.theme.font.sans};
    font-size: ${props.theme.modularScale.small};
    height: 4rem;
    letter-spacing: 0.04em;
    padding: 0 15px;
    width: 100%;
    ::placeholder {
      color: ${props.theme.color.brandLight};
    }
  `;
};

const StyledInput = styled.input`
  appearance: none;
  border-radius: 0;
  ${(props) => properties(props)}

  @media (max-width: ${(props) => props.theme.breakpoint.medium}) {
    :focus {
      font-size: 16px;
    }
  }
`;

const InputEmail = (props) => (
  <StyledInput
    {...props}
    id={props.id}
    type="email"
    placeholder={props.placeholder}
  />
);

InputEmail.defaultProps = {
  underline: false,
  outline: false,
  inverted: false,
  revamp: false,
  placeholder: '',
  id: ''
};

InputEmail.propTypes = {
  underline: PropTypes.bool,
  outline: PropTypes.bool,
  inverted: PropTypes.bool,
  revamp: PropTypes.bool,
  placeholder: PropTypes.string,
  id: PropTypes.string
};

export default InputEmail;
