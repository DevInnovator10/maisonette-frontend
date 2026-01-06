import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { Field } from 'formik';

import Button from '../../atoms/button';
import IconCircleArrow from '../../atoms/icon-circle-arrow';
import withSearchActions from '../../organisms/search';
import InputSearch from '../../atoms/input-search';

const FormInner = styled.div`
  position: relative;
`;

const searchInputStyles = (props) => css`
  -webkit-appearance: none;
  background: transparent;
  border-bottom: 1px solid ${props.theme.color.white};
  border-radius: 0;
  box-sizing: border-box;
  color: ${props.theme.color.white};
  font-family: ${props.theme.font.heading};
  font-size: 3.5rem;
  height: 5.5rem;
  letter-spacing: 0.04em;
  line-height: 1;
  outline-color: ${props.theme.color.brandLight};
  outline-offset: 1px;
  padding: 0;
  width: 100%;

  ::placeholder {
    color: ${props.theme.color.white};
    opacity: 1;
  }
  ::-moz-placeholder {
    color: ${props.theme.color.white};
    opacity: 1;
  }
  ::-webkit-input-placeholder {
    color: ${props.theme.color.white};
    opacity: 1;
  }
  ::-webkit-search-decoration,
  ::-webkit-search-cancel-button,
  ::-webkit-search-results-button,
  ::-webkit-search-results-decoration {
    appearance: none;
  }
`;

const FormInput = styled(InputSearch)`
  ${searchInputStyles}
  position: relative;
  z-index: 20;

  &:invalid {
    box-shadow: none;
  }

  &::-webkit-calendar-picker-indicator {
    display: none;
  }
`;

const FormLabel = styled.label`
  opacity: 0;
  pointer-events: none;
  position: absolute;
`;

const Submit = styled(Button)`
  height: 3.2rem;
  overflow: visible;
  position: absolute;
  right: 0.2rem;
  top: 1.2rem;
  width: 3.2rem;
  z-index: ${({ theme }) => theme.layers.downstage};

  svg {
    fill: transparent;
    height: 2.8rem;
    stroke-width: 3;
    stroke: #fff;
    width: 2.8rem;

    path {
      transform: translate3d(0, 0, 0);
    }
  }

  :focus,
  :hover:not(:disabled) {
    svg {
      path {
        animation: arrow-head;
        animation-duration: ${(props) => props.theme.animation.slow};
        animation-timing-function: ${(props) => props.theme.animation.easeMove};
        animation-delay: 0s;
        animation-iteration-count: 1;
        animation-direction: normal;
        animation-fill-mode: forwards;
        animation-play-state: running;
      }
    }
  }
`;

const GlobalSearch = (props) => {
  const handleOnMouseDown = () => {
    props.setElementClicked('Arrow Icon');
  };

  return (
    <FormInner className={props.className}>
      <FormLabel htmlFor="w">
        Search
      </FormLabel>
      <Field name="w">
        {({ field }) => (
          <FormInput
            {...field}
            name="w"
            id="w"
            type="search"
            autoComplete="off"
            placeholder="Search"
            spellcheck="false"
            autocorrect="off"
            required={props.required}
            onChange={(e) => {
              props.onChange(e);
              field.onChange(e);
            }}
          />
        )}
      </Field>

      <Submit
        aria-label="submit search"
        type="submit"
        value="search"
        disabled={props.disabled}
        isIcon
        onMouseDown={handleOnMouseDown}
      >
        <IconCircleArrow />
      </Submit>
    </FormInner>
  );
};

GlobalSearch.defaultProps = {
  className: '',
  disabled: true,
  required: false,
  isActive: false,
  onChange: () => { },
  setElementClicked: () => { }
};

GlobalSearch.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  isActive: PropTypes.bool,
  onChange: PropTypes.func,
  setElementClicked: PropTypes.func
};

const ConnectedGlobalSearch = withSearchActions(GlobalSearch);

ConnectedGlobalSearch.displayName = 'GlobalSearch';

export default ConnectedGlobalSearch;
