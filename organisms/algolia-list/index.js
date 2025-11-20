import React from 'react';

import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const baseStyles = (props) => ({
  alignItems: 'center',
  borderBottom: '1px solid #EBEBEB',
  color: props.theme.color.brand,
  display: 'flex',
  fontFamily: props.theme.font.sans,
  fontSize: props.theme.modularScale.base,
  height: '3rem',
  padding: 0,
  a: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    textDecoration: 'none'
  }
});

export const ListItem = styled.li((props) => baseStyles(props));

const List = styled.ul(
  (props) => (props.direction === 'row' ? ({
    marginBottom: '-1rem',
    li: {
      background: '#2B47981A',
      borderBottom: 0,
      borderRadius: '1.5rem',
      display: 'inline-flex',
      margin: '0 1rem 1rem 0',
      a: {
        padding: '0 1.5rem'
      }
    }
  }) : ({
    li: {
      marginBottom: '1rem',
      a: { width: '100%', paddingBottom: '1rem' }
    }
  }))
);

const UnorderedList = (props) => (
  <List direction={props.direction} {...props}>
    { props.children }
  </List>
);

UnorderedList.defaultProps = {
  children: null,
  direction: 'column'
};

UnorderedList.propTypes = {
  children: PropTypes.node,
  direction: PropTypes.oneOf(['row', 'column'])
};

export default UnorderedList;
