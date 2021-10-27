import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { formatMoney } from 'accounting-js';

import Typography from '../../atoms/typography';

const DescriptionList = styled.div`
  display: flex;
  flex-direction: row;
  
  ${(props) => props.total && css`
    padding-top: 1rem;
    margin-top: 1.5rem;
    border-top: 1px solid ${props.theme.color.brand};
  `}

  dt {
    flex: 1;

    ${(props) => props.total && css`
      letter-spacing: 0.2em;
      text-transform: uppercase;
      line-height: 2rem;
    `}
  }
`;

const PriceLine = (props) => (
  <DescriptionList total={props.total}>
    <Typography element="dt" like={props.total ? 'label-1' : 'dec-1'}>{props.text}</Typography>
    <Typography element="dd" like="dec-1">{formatMoney(props.price)}</Typography>
  </DescriptionList>
);

PriceLine.defaultProps = {
  total: false
};

PriceLine.propTypes = {
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  text: PropTypes.string.isRequired,
  total: PropTypes.bool
};

export default memo(PriceLine);
