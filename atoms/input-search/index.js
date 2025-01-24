import React from 'react';
import PropTypes from 'prop-types';

import styled from '@emotion/styled';

const StyledSearch = styled.input`
    appearance: none;
  font-family: ${(props) => props.theme.font.sans};
  font-size: 1.3rem;
  height: 4rem;

  padding: 6px 6px 6px 31px;

  width: 100%;

  @media (max-width: ${(props) => props.theme.breakpoint.medium}) {
    :focus {
      font-size: 16px;
    }
  }
`;

const InputSearch = (props) => (
  <StyledSearch
    {...props}
    id={props.id}
    type="search"
    placeholder={props.placeholder}
  />
);

InputSearch.defaultProps = {
  placeholder: '',
  id: ''
};

InputSearch.propTypes = {
  placeholder: PropTypes.string,
  id: PropTypes.string
};

export default InputSearch;
