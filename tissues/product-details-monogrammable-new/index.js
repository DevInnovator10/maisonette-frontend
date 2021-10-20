import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Colors from '../../molecules/product-options-color';
import Typography from '../../atoms/typography';
import Select from '../../atoms/select';
import InputText from '../../atoms/input-text';

import { useProduct } from '../../utils/context/product-provider';

const MonogrammableWrapper = styled.section`
  color: ${({ theme }) => theme.color.bluePrimary};
  font-size: ${({ theme }) => theme.modularScale.sixteen};
  margin-top: 1rem;
`;

const MonogramLabel = styled(Typography)`
  color: ${(props) => props.theme.color.bluePrimary};
  line-height: 2rem;

  > span {
    color: ${(props) => props.theme.color.brandLight};
  }
`;

const MonogramWarning = styled(Typography)`
  color: ${({ theme }) => theme.color.redError};
  margin-bottom: -1.5rem;
`;

const ColorOptions = styled(Colors)`
  margin-bottom: 1rem;
`;

const StyleSelect = styled(Select, { shouldForwardProp: (prop) => prop !== 'changed' })`
  color: ${({ changed, theme }) => (changed ? theme.color.bluePrimary : theme.color.brandLightBlue)};
  font-size: ${({ theme }) => theme.modularScale.eighteen};
  margin-top: 1rem;
  margin-bottom: 2rem;
  outline: 0;
  width: 100%;
`;

const MonogramTextWrapper = styled('div', { shouldForwardProp: (prop) => prop !== 'max' })`
  display: flex;
  margin-top: -0.5rem;

  ${MonogramLabel}:last-child {
    color: ${({ theme, max }) => (max ? theme.color.redError : theme.color.brandLightBlue)};
    flex: 1;
    text-align: right;
  }
`;

const MonogramTextInput = styled(InputText)`
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
  outline: 0;
  width: 100%;
`;

const MonogramTextInputWrapper = styled('div', {
  shouldForwardProp: (prop) => !['hasFonts', 'isQuickshop'].includes(prop)
})`
  ${({ isQuickshop, hasFonts }) => isQuickshop && css`
    width: ${hasFonts ? '48%' : '100%'};
  `}
`;

const MonogramFontWrapper = styled('div', { shouldForwardProp: (prop) => prop !== 'isQuickshop' })`
  ${({ isQuickshop }) => isQuickshop && css`
    width: 48%;
  `}
`;

const MonogramFontAndTextWrapper = styled('div', { shouldForwardProp: (prop) => prop !== 'isQuickshop' })`
  ${({ isQuickshop }) => isQuickshop && css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  `}
`;

const ProductMonogrammableRevamp = (props) => {
  const formRef = useRef(null);
  const [color, setColor] = useState({});
  const [style, setStyle] = useState('0');
  const [monogram, setMonogram] = useState('');
  const [styleChanged, setStyleChanged] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const {
    state: {
      missingMonogramColor,
      missingMonogramFont,
      missingMonogramText
    },
    setMonogramFormRef,
    setMissingMonogramFields,
    setMonogramColor,
    setMonogramFont,
    setMonogramText
  } = useProduct();

  const getMonogramCharCount = () => {
    const charsLeft = props.maxTextLength - charCount;
    const charsText = charsLeft === 1 ? 'character' : 'characters';
    return `${charsLeft} ${charsText} left`;
  };

  const handleOnTextChange = (e) => {
    const { value } = e.target;

    setMonogramText(value);
    if (missingMonogramText) setMissingMonogramFields({ missingMonogramText: false });
    setCharCount(value.length);
    setMonogram(value);
  };

  const handleOnColorChange = (c) => {
    setMonogramColor(c);
    if (missingMonogramColor) setMissingMonogramFields({ missingMonogramColor: false });
    setColor(c);
  };

  const handleOnTypeSelectChange = (e) => {
    const { value } = e.currentTarget;

    setMonogramFont(value);
    if (missingMonogramFont) setMissingMonogramFields({ missingMonogramFont: false });
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

    setMonogramColor(false);
    setMonogramFont(false);
    setMonogramText(false);
  };

  useEffect(() => {
    setMonogramFormRef(formRef.current);
  }, []);

  useEffect(() => {
    if (!props.variant) resetState();
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
      {
        <>
          {props.colors.length > 0 && (
            <ColorOptions
              id="monogram-colors"
              label="Color"
              color={color}
              colors={props.colors}
              onChange={handleOnColorChange}
              revamp
            />
          )}

          {missingMonogramColor && (
            <>
              <MonogramWarning element="p" like="dec-5">
                Select a color
              </MonogramWarning>
              <br />
            </>
          )}
        </>
      }

      <MonogramFontAndTextWrapper isQuickshop={props.isQuickshop}>
        {
          mapMonogramFonts().length > 0 && (
            <MonogramFontWrapper isQuickshop={props.isQuickshop}>
              <MonogramLabel element="p" like="dec-4">
                Font Style
              </MonogramLabel>

              <StyleSelect
                aria-label="monogram fonts"
                id="monogram-fonts"
                name="monogram-font-style"
                changed={styleChanged}
                onChange={handleOnTypeSelectChange}
                value={style}
                outline
                revamp
                warning={missingMonogramFont}
              >
                <option value="0" disabled>Select a Style</option>
                {
                  mapMonogramFonts().map((s) => (
                    <option key={s.name} value={s.value}>{s.value}</option>
                  ))
                }
              </StyleSelect>

              {missingMonogramFont && (
                <>
                  <MonogramWarning element="p" like="dec-5" css={{ marginTop: '-1.5rem' }}>
                    Select a text style
                  </MonogramWarning>
                  <br />
                </>
              )}
            </MonogramFontWrapper>
          )
        }

        <MonogramTextInputWrapper
          isQuickshop={props.isQuickshop}
          hasFonts={mapMonogramFonts().length > 0}
        >
          <MonogramLabel element="p" like="dec-4" left="true">Text</MonogramLabel>

          <MonogramTextInput
            aria-label="monogram text input"
            name="monogram-text"
            maxLength={props.maxTextLength}
            value={monogram}
            onChange={handleOnTextChange}
            revamp
            warning={missingMonogramText}
          />

          <MonogramTextWrapper max={props.maxTextLength === charCount}>
            {missingMonogramText ? (
              <MonogramWarning element="p" like="dec-5">
                Enter monogram text
              </MonogramWarning>
            ) : (
              <MonogramLabel element="span" like="dec-4" right="true">
                {props.maxTextLength && getMonogramCharCount()}
              </MonogramLabel>
            )}
          </MonogramTextWrapper>
        </MonogramTextInputWrapper>

      </MonogramFontAndTextWrapper>
    </MonogrammableWrapper>
  );
};

ProductMonogrammableRevamp.defaultProps = {
  className: '',
  colors: [],
  fonts: [],
  variant: false,
  isQuickshop: false
};

ProductMonogrammableRevamp.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.number,
  maxTextLength: PropTypes.number.isRequired,
  colors: PropTypes.array,
  fonts: PropTypes.array,
  isQuickshop: PropTypes.bool
};

export default ProductMonogrammableRevamp;
