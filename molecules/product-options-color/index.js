import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Typography from '../../atoms/typography';

const ColorOptionsWrapper = styled.div``;

const ColorText = styled(Typography, { shouldForwardProp: (prop) => prop !== 'revamp' })`
  color: ${(props) => props.theme.color.bluePrimary};
  ${({ revamp }) => !revamp && 'letter-spacing: 0.2em;'}
  line-height: 2rem;
  ${({ revamp }) => !revamp && 'text-transform: uppercase;'}

  > span {
    color: ${(props) => props.theme.color.brandLight};
  }
`;

const ColorOptionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ColorOption = styled.span`
  background-color: ${(props) => props.color};
  border-radius: 100%;
  border: 0.2em solid ${(props) => props.theme.color.white};
  height: 100%;
  left: 0;
  overflow: hidden;
  position: absolute;
  text-indent: -99999px;
  top: 0;
  width: 100%;
`;

const ColorOptionsItem = styled.label`
  border-radius: 100%;
  border: 1px solid transparent;
  cursor: pointer;
  height: 4rem;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
  position: relative;
  transition: border ${(props) => props.theme.animation.fast} ${(props) => props.theme.animation.easeIn};
  width: 4rem;

  &:last-of-type {
    margin-right: 0;
  }

  &:hover {
    border: 1px solid ${(props) => props.theme.color.brandLight};
  }

  ${(props) => props.active && css`
    border: 1px solid ${props.theme.color.bluePrimary};

    &:hover {
      border: 1px solid ${props.theme.color.bluePrimary};
    }
  `}
`;

const Option = styled.input`
  opacity: 0;
  position: absolute;
  z-index: -1;
`;

const ColorOptions = (props) => {
  const mapMonogramColors = () => {
    const colors = props.colors.reduce((acc, curr) => {
      const i = curr.name.match(/\d+/)[0];
      const title = curr.name.match(/Title/);

      if (!acc[i]) acc[i] = {};

      if (title) acc[i].name = curr.value;
      else acc[i].hex = curr.value;

      return acc;
    }, {});

    return Object.values(colors);
  };

  return (
    <ColorOptionsWrapper id={props.id} className={props.className}>
      <ColorText
        element={props.revamp ? 'span' : 'p'}
        like={props.revamp ? 'dec-4' : 'label-1'}
        revamp={props.revamp}
      >
        {props.label}
        {': '}
        {
          props.color?.name
            ? props.color.name
            : <span>Select a Color</span>
        }
      </ColorText>

      <ColorOptionsList>
        {
          mapMonogramColors().map((c) => (
            <ColorOptionsItem
              key={c.name}
              title={c.name}
              active={props.color.name === c.name}
            >
              <ColorOption color={c.hex.toLowerCase() === '#ffffff' ? '#f1f1f1' : c.hex}>{c.name}</ColorOption>

              <Option
                id={c.name}
                name="product-color-option"
                type="radio"
                value={c.name}
                onClick={() => props.onChange(c)}
              />
            </ColorOptionsItem>
          ))
        }
      </ColorOptionsList>
    </ColorOptionsWrapper>
  );
};

ColorOptions.defaultProps = {
  className: '',
  color: {},
  label: 'Color',
  id: '',
  revamp: false
};

ColorOptions.propTypes = {
  className: PropTypes.string,
  color: PropTypes.object,
  colors: PropTypes.array.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  revamp: PropTypes.bool
};

export default ColorOptions;
