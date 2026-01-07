import styled from '@emotion/styled';
import { css } from '@emotion/core';

const selectColors = (props) => {
  let colors = {};

  if (!props.outline) {
    if (!props.inverted) {
      colors = {
        background: props.theme.color.brand,
        border: props.theme.color.brand,
        color: props.theme.color.white
      };
    } else {
      colors = {
        background: props.theme.color.brandNeutral,
        border: props.theme.color.brandNeutral,
        color: props.theme.color.brand
      };
    }
  } else if (props.outline) {
    if (props.inverted) {
      colors = {
        background: 'transparent',
        border: props.theme.color.white,
        color: props.theme.color.white
      };
    } else if (props.revamp) {
      colors = {
        background: props.theme.color.backgroundLightBlue,
        border: props.theme.color.borderBlue,
        color: props.theme.color.brand
      };
    } else {
      colors = {
        background: props.theme.color.white,
        border: props.theme.color.brand,
        color: props.theme.color.brand
      };
    }
  }

  if (props.warning) {
    colors = {
      ...colors,
      border: props.theme.color.redError
    };
  }

  return colors;
};

const SelectReset = () => css`
  background: transparent;
  border-radius: 0;
  border: none;
  color: inherit;
  font: inherit;
  line-height: normal;
  margin: 0;
  overflow: visible;
  padding: 0;
  width: auto;
  -moz-osx-font-smoothing: inherit;
  appearance: none;
  -webkit-font-smoothing: inherit;
  :active {
    outline: 0;
  }
`;

const FILTERED_SELECT_EMO_PROPS = new Set(['outline', 'revamp']);

export const Select = styled('select', {
  shouldForwardProp: (prop) => !FILTERED_SELECT_EMO_PROPS.has(prop)
})`
  ${SelectReset}

  ${(props) => props.theme.arrow('down', selectColors(props).color, 'right calc(1.5rem - 5px) center')}
  background-color: ${(props) => selectColors(props).background};
  border: ${({ revamp }) => (revamp ? '0.1rem' : '0.2rem')} solid ${(props) => selectColors(props).border};
  box-sizing: border-box;
  color: ${(props) => selectColors(props).color};
  font-family: ${(props) => props.theme.font.sans};
  font-size: ${(props) => props.theme.modularScale.small};
  height: 4rem;
  letter-spacing: .04em;
  padding-left: 1.5rem;
  padding-right: 3rem;
  position: relative;
  width: 100%;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (max-width: ${(props) => props.theme.breakpoint.medium}) {
    :focus, textarea:focus, input:focus {
      font-size: 16px;
    }
  }
`;

Select.whyDidYouRender = true;

export default Select;
