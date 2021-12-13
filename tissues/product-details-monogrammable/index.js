import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Colors from '../../molecules/product-options-color';
import Typography from '../../atoms/typography';
import Select from '../../atoms/select';
import InputText from '../../atoms/input-text';

import { useProduct } from '../../utils/context/product-provider';

const MonogrammableWrapper = styled.section`
  padding-left: 2rem;
  border-left: 2px solid ${(props) => props.theme.color.brandLight};
`;

const MonogramLabel = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  letter-spacing: 0.2em;
  line-height: 2rem;
  text-transform: uppercase;

  > span {
    color: ${(props) => props.theme.color.brandLight};
  }
`;

const MonogramNote = styled(Typography)`
  color: ${(props) => props.theme.color.brandLight};
  line-height: 1.5;
  margin-top: 1rem;
`;

const Line = styled.hr`
  border: 0;
  border-top: 1px solid ${(props) => props.theme.color.brandLight};
  display: block;
  height: 1px;
  margin: 2rem 0;
  padding: 0;
`;

const ColorOptions = styled(Colors)`
  margin-bottom: 2rem;
`;

const StyleSelect = styled(Select, {
  shouldForwardProp: (prop) => prop !== 'changed'
})`
  color: ${(props) => (props.changed ? props.theme.color.brand : props.theme.color.brandLight)};
  margin-bottom: 2rem;
  outline: 0;
  width: 100%;
`;

const MonogramTextWrapper = styled.div`
  display: flex;

  ${MonogramLabel}:last-child {
    color: ${(props) => props.theme.color.brandLight};
    flex: 1;
    text-align: right;
  }
`;

const MonogramText = styled(InputText)`
  text-align: center;
  margin-bottom: 1rem;
  outline: 0;
  width: 100%;
`;

const MonogramTextImportant = styled(Typography)`
  color: ${(props) => props.theme.color.brandA11yRed};
  display: block;
  line-height: 1.5;
`;

const ProductMonogrammable = (props) => {
  const formRef = useRef(null);
  const [color, setColor] = useState({});
  const [style, setStyle] = useState('0');
  const [monogram, setMonogram] = useState('');
  const [styleChanged, setStyleChanged] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const { setMonogramFormRef } = useProduct();

  const getMonogramCharCount = () => {
    const charsLeft = props.maxTextLength - charCount;
    const charsText = charsLeft === 1 ? 'character' : 'characters';
    return `${charsLeft} ${charsText} left`;
  };

  const handleOnTextChange = (e) => {
    const { value } = e.target;

    props.setText(value);
    setCharCount(value.length);
    setMonogram(value);
  };

  const handleOnColorChange = (c) => {
    props.setColor(c);
    setColor(c);

  };

  const handleOnTypeSelectChange = (e) => {
    const { value } = e.currentTarget;

    props.setFont(value);
    setStyle(value);
    setStyleChanged(value !== '0');
  };

  const mapMonogramFonts = () => {
    const fonts = props.fonts.reduce((acc, curr) => {
      const i = curr.name.match(/\d+/)[0];
      const title = curr.name.match(/Title/);

      if (!acc[i]) acc[i] = {};

      if (title) {
        acc[i].value = curr.value;
        acc[i].name = curr.name;
      } else acc[i].font = curr.value;

      return acc;
    }, {});

    return Object.values(fonts);
  };

  const resetState = () => {
    setColor({});
    setStyle('0');
    setMonogram('');
    setStyleChanged(false);
    setCharCount(0);

    props.setText(false);
    props.setColor(false);
    props.setFont(false);
  };

  useEffect(() => {
    setMonogramFormRef(formRef.current);
  }, []);

  useEffect(() => {
    resetState();
  }, [props.variant]);

  useEffect(() => {
    if (global?.document && props.colors.length === 2) {
      const colorsElem = global?.document.getElementById('monogram-colors');
      const colorElem = colorsElem?.querySelector('[name="product-color-option"]');
      const event = new global.Event('click', { bubbles: true });
      if (colorElem) {
        setTimeout(() => colorElem.dispatchEvent(event), 0);
      }
    }
  }, [props.variant]);

  return (
    <MonogrammableWrapper className={props.className} ref={formRef}>
      <MonogramLabel element="h1" like="label-1">Monogram</MonogramLabel>

      <MonogramNote element="p" like="paragraph-2">
        As this is a customized item, please allow additional processing time for your order.
      </MonogramNote>

      <Line />

      {
        props.colors.length > 0 && (
          <ColorOptions
            id="monogram-colors"
            label="Thread Color"
            color={color}
            colors={props.colors}
            onChange={handleOnColorChange}
          />
        )
      }

      {
        mapMonogramFonts().length > 0 && (
          <>
            <MonogramLabel element="p" like="label-1">
              Font Style
              {': '}
              {
                style !== '0'
                  ? style
                  : <span>Select a Style</span>
              }
            </MonogramLabel>

            <StyleSelect
              aria-label="monogram fonts"
              id="monogram-fonts"
              name="monogram-font-style"
              changed={styleChanged}
              onChange={handleOnTypeSelectChange}
              value={style}
              outline
            >
              <option value="0" disabled>-- Select a Style --</option>
              {
                mapMonogramFonts().map((s) => (
                  <option key={s.name} value={s.value}>{s.value}</option>
                ))
              }
            </StyleSelect>
          </>
        )
      }

      <MonogramTextWrapper>
        <MonogramLabel element="p" like="label-1" left="true">Monogram Text</MonogramLabel>
        <MonogramLabel element="p" like="label-1" right="true">
          {props.maxTextLength && getMonogramCharCount()}
        </MonogramLabel>
      </MonogramTextWrapper>

      <MonogramText
        aria-label="monogram text input"
        name="monogram-text"
        maxLength={props.maxTextLength}
        placeholder={'Enter text exactly as you\'d like it to appear'}
        value={monogram}
        onChange={handleOnTextChange}
      />

      {
        props.maxTextLength && (charCount === props.maxTextLength) && (
          <MonogramTextImportant element="span" like="label-1">
            You have reached the maximum
            {` (${props.maxTextLength}) `}
            number of characters
          </MonogramTextImportant>
        )
      }
    </MonogrammableWrapper>
  );
};

ProductMonogrammable.defaultProps = {
  className: '',
  colors: [],
  fonts: [],
  variant: false
};

ProductMonogrammable.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.number,
  maxTextLength: PropTypes.number.isRequired,
  colors: PropTypes.array,
  fonts: PropTypes.array,
  setColor: PropTypes.func.isRequired,
  setFont: PropTypes.func.isRequired,
  setText: PropTypes.func.isRequired
};

export default ProductMonogrammable;
