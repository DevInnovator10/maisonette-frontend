import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

const rtlStyles = css`
  margin: 0 1.5rem 0 0;
  direction: rtl;

  > li {
    padding: 0 0 0 2.5rem;
  }
`;

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: disc;
  color: ${(props) => props.theme.color.brand};
  margin-left: 1.5rem;

  > li {
    flex: 0 0 ${(props) => (props.mode === 'ttb' ? '100%' : '50%')};
    padding-right: 2.5rem;
  }

  ${(props) => (props.mode === 'rtl' ? rtlStyles : '')};
`;

const BulletList = (props) => (
  <List mode={props.mode}>
    { props.children }
  </List>
);

BulletList.defaultProps = {
  mode: 'ttb'
};

BulletList.propTypes = {
  mode: PropTypes.oneOf(['ttb', 'rtl', 'ltr']),
  children: PropTypes.any.isRequired
};

export default BulletList;
