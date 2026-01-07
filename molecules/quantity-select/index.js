import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Typography from '../../atoms/typography';

const sharedStyles = css`
  display: inline-block;
  letter-spacing: .04em;
`;

const Label = styled(Typography)`
  ${sharedStyles}
  color: ${(props) => props.theme.color.brandLight};
  padding-right: 1rem;
`;

const SelectLabel = styled.label`
  opacity: 0;
  pointer-events: none;
  position: absolute;
`;

const SelectWrapper = styled(Typography)`
  ${sharedStyles}

  > select {
    ${(props) => !props.disabled && props.theme.arrow('down', props.theme.color.brand, 'right 3px center', 4)}
    ${sharedStyles}
    appearance: none;
    background-color: transparent;
    border: 0;
    color: ${(props) => props.theme.color.brand};
    cursor: pointer;
    height: 100%;
    outline: 0;
    padding-right: 1.5rem;
    position: relative;
  }
`;

const QuantitySelectWrapper = styled.dl`
  font-size: 1.2rem;
`;

const QuantitySelect = (props) => {
  const [selected, setSelected] = useState(props.selected);

  useEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);

  const createOptions = () => {
    const maxQuantity = props.stock <= 10 ? props.stock : 10;

    if (props.isCart) {
      const qty = selected < 10
        ? maxQuantity
        : selected;

      const arr = Array.from({ length: qty }, (v, k) => k + 1);
      return arr.map((x) => <option key={x} value={x}>{x}</option>);
    }

    const arr = Array.from({
      length: maxQuantity
    }, (v, k) => k + 1);

    return arr.map((x) => <option key={x} value={x}>{x}</option>);
  };

  const handleOnChange = (e) => {
    setSelected(e.target.value);
    props.onChange(e.target.value);
  };

  return (
    <QuantitySelectWrapper>
      <Label element="dt" like="dec-1">Qty</Label>
      <SelectWrapper element="dd" like="dec-1" disabled={props.stock === 1}>
        <SelectLabel htmlFor="quantity-select">Quantity Select</SelectLabel>
        <select
          id="quantity-select"
          value={selected}
          onChange={handleOnChange}
          disabled={props.stock === 1}
        >
          {createOptions()}
        </select>
      </SelectWrapper>
    </QuantitySelectWrapper>
  );
};

QuantitySelect.defaultProps = {
  stock: 10,
  selected: 1,
  onChange: () => {},
  isCart: false
};

QuantitySelect.propTypes = {
  stock: PropTypes.number,
  selected: PropTypes.number,
  onChange: PropTypes.func,
  isCart: PropTypes.bool
};

export default memo(
  QuantitySelect,
  (prevProps, nextProps) => prevProps.selected === nextProps.selected
);
