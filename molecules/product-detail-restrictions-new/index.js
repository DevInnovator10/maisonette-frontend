import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Typography from '../../atoms/typography';
import calculateLeadTime from '../../utils/calculateLeadTime';

const Statement = styled(Typography)`
  color: ${({ theme }) => theme.color.bluePrimary};
  white-space: pre;
`;

const RedStatement = styled(Typography)`
  color: ${({ theme }) => theme.color.redError};
  white-space: pre;
`;

const Restrictions = styled('div', { shouldForwardProp: (prop) => prop !== 'hasVariants' })`
  margin-top: ${({ theme, hasVariants }) => (hasVariants ? '-1.5rem' : theme.modularScale.twenty)};
  ${({ hasVariants }) => (hasVariants && css`margin-bottom: 2rem`)};
`;

const ProductRestrictionsRevamp = (props) => (
  <Restrictions className={props.className} hasVariants={props.hasVariants}>
    {props.hasVariants && (props.optionOutOfStock || props.reachedStockLimit) ? (
      <Statement
        element="p"
        like="dec-4"
        css={(theme) => ({
          color: theme.color.redError,
          marginTop: '4rem'
        })}
      >
        {props.optionOutOfStock && 'Out of stock'}
        {props.reachedStockLimit && 'No more left'}
      </Statement>
    ) : (
      <>
        {!props.hasVariants && props.reachedStockLimit
          ? (
            <RedStatement element="span" like="dec-4">
              No more left
            </RedStatement>
          ) : (
            <>
              {
                (props.onlyOneLeft)
                && (
                  <>
                    <RedStatement element="span" like="dec-4">
                      {props.onlyOneLeft && 'Only 1 Left '}
                    </RedStatement>
                    <Statement element="span" like="dec-4"> | </Statement>
                  </>
                )
              }

              {
                (props.finalSale || props.isGiftCard)
                && (
                  <>
                    <RedStatement element="span" like="dec-4">
                      {props.onlyOneLeft && ' '}
                      {props.finalSale && 'Final sale '}
                    </RedStatement>
                    <Statement element="span" like="dec-4"> | </Statement>
                  </>
                )
              }

              {
                !props.isGiftCard && props.leadTime
                && (
                  <>
                    <Statement element="span" like="dec-4">
                      {(props.onlyOneLeft || props.finalSale) && ' '}
                      {`Ships within ${calculateLeadTime(props.leadTime)}`}
                    </Statement>
                  </>
                )
              }
            </>
          )}
      </>
    )}
  </Restrictions>
);

ProductRestrictionsRevamp.defaultProps = {
  className: '',

  finalSale: false,
  leadTime: 0,
  isGiftCard: false,
  onlyOneLeft: false,
  hasVariants: false,
  optionOutOfStock: false,
  reachedStockLimit: false
};

ProductRestrictionsRevamp.propTypes = {
  className: PropTypes.string,
  finalSale: PropTypes.bool,
  leadTime: PropTypes.number,
  isGiftCard: PropTypes.bool,
  onlyOneLeft: PropTypes.bool,
  hasVariants: PropTypes.bool,
  optionOutOfStock: PropTypes.bool,
  reachedStockLimit: PropTypes.bool
};

export default ProductRestrictionsRevamp;
