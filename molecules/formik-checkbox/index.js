/* eslint-disable eqeqeq */
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

const checkedStyles = (props) => css`
  color: ${(props.inverted ? props.theme.color.white : props.theme.color.brand)};

  ::after {
    opacity: 1
  }

  ::before {
    border-color: ${(props.inverted ? props.theme.color.white : props.theme.color.brand)};
  }
`;

const StyledCheckbox = styled.label`
  color: ${(props) => (props.inverted ? props.theme.color.white : props.theme.color.brandLight)};
  cursor: pointer;
  display: block;
  font-family: ${(props) => props.theme.font.sans};
  font-size: ${(props) => props.theme.modularScale.small};
  line-height: 18px;
  padding: 0.5rem 0 0.5rem 2em;
  position: relative;
  transition-duration: ${(props) => props.theme.animation.default};
  transition-property: color;
  transition-timing-function: ${(props) => props.theme.animation.easeOutQuad};

  ::after,
  ::before {
    position: absolute;
    transition-duration: ${(props) => props.theme.animation.default};
    transition-timing-function: ${(props) => props.theme.animation.easeOutQuad};
  }

  ::after {
    background: ${(props) => (props.inverted ? props.theme.color.white : props.theme.color.brand)};
    content: "";
    display: inline-block;
    height: 1px;
    left: -1px;
    opacity: 0;
    top: 13px;
    transform: rotate(45deg);
    transition-property: opacity;
    width: calc(1em + 2px);
  }

  ::before {
    border-color: ${(props) => (props.inverted ? props.theme.color.white : props.theme.color.brandLight)};
    border-radius: 1px;
    border-style: solid;
    border-width: 1px;
    content: "";
    display: inline-block;
    height: 1em;
    left: 0;
    top: 8px;
    transition-property: border-color;
    width: 1em;
  }

  ${(props) => (props.checked ? checkedStyles : '')};

  input[type="checkbox"] {
    opacity: 0;
    width: 0;
    position: absolute;
  }

  &.is-hidden {
    display: none;
  }
`;

const RadioField = (props) => (
  <StyledCheckbox
    htmlFor={props.id}
    className={props.className}
    checked={props.field.value}
  >
    <input
      name={props.field.name}
      id={props.id}
      type="checkbox"
      value={props.field.value}
      checked={props.field.value}
      onChange={props.field.onChange}
      onBlur={props.field.onBlur}
      {...props}
    />
    {props.label}
  </StyledCheckbox>
);

RadioField.defaultProps = {
  className: ''
};

RadioField.propTypes = {
  className: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  field: PropTypes.object.isRequired
};

export default RadioField;
