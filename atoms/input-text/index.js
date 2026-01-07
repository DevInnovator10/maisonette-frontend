import React, { useState, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';

import styled from '@emotion/styled';

const selectBorder = (props) => {
  if (props.warning) return props.theme.color.redError;
  return props.theme.color.borderBlue;
};
const StyledInput = styled('input', { shouldForwardProp: (prop) => prop !== 'revamp' })`
  appearance: none;
  background: ${({ theme, revamp }) => (revamp ? theme.color.backgroundLightBlue : theme.color.brandNeutral)};
  ${(props) => (props.revamp && `border: 0.1rem solid ${selectBorder(props)}`)};
  box-sizing: border-box;
  color: ${(props) => props.theme.color.brand};

  font-family: ${(props) => props.theme.font.sans};
  font-size: ${({ theme, revamp }) => (revamp ? theme.modularScale.eighteen : theme.modularScale.small)};
  height: 4rem;
  ${({ revamp }) => (!revamp && 'letter-spacing: 0.04em;')}
  padding: 0 15px;
  width: 100%;
  border-radius: 0;

  ::placeholder {
    color: ${(props) => props.theme.color.brandLight};
  }

  @media (max-width: ${(props) => props.theme.breakpoint.medium}) {
    :focus, textarea:focus, input:focus {
      font-size: 16px;
    }
  }
`;

const InputText = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const handleChange = (e) => {
    e.persist();
    setValue(e.target.value);
    props.onChange(e);
  };

  return (
    <StyledInput
      {...props}
      ref={ref}
      id={props.id}
      type={props.type}
      value={value}
      placeholder={props.placeholder}
      onChange={(e) => handleChange(e)}
    />
  );
});

InputText.defaultProps = {
  id: '',
  onChange: () => { },
  placeholder: '',
  type: 'text',
  value: '',
  revamp: false
};

InputText.propTypes = {
  id: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  revamp: PropTypes.bool
};

export default InputText;
