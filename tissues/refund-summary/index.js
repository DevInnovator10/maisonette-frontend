import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { formatMoney } from 'accounting-js';

import Typography from '../../atoms/typography';

const ListWrapper = styled(Typography)`
  color: ${(props) => (props.promo ? props.theme.color.brandGreen : props.theme.color.brand)};
  display: flex;

  dt {
    min-width: 5rem;
    padding-right: 1rem;
    flex: 1
  }
`;

const ReturnFeeLabel = styled.dt`
  color: ${(props) => props.theme.color.brandGreen};
`;

const ReturnFeeValue = styled.dd`
  color: ${(props) => props.theme.color.brandGreen};
`;

const RefundSummary = (props) => {
  const feesFiltered = props.fees?.filter((fee) => fee.fee_type === 'return');
  const feeAmount = feesFiltered?.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  return (
    <dl className={props.className}>
      <ListWrapper element="div" like="dec-1">
        <dt>Total Authorized</dt>
        <dd>{formatMoney(props.authorized, { precision: 2 })}</dd>
      </ListWrapper>

      {!!feeAmount && (
      <ListWrapper element="div" like="dec-1">
        <ReturnFeeLabel>Return Fee</ReturnFeeLabel>
        <ReturnFeeValue>
          {`-${formatMoney(feeAmount, { precision: 2 })}`}
        </ReturnFeeValue>
      </ListWrapper>
      )}

      <ListWrapper element="div" like="dec-1">
        <dt>Total Refunded</dt>
        <dd>
          {+props.refunded > 0
            ? formatMoney(props.refunded, { precision: 2 })
            : '(Pending)'}
        </dd>
      </ListWrapper>
    </dl>
  );
};

RefundSummary.defaultProps = {
  className: ''
};

RefundSummary.propTypes = {
  className: PropTypes.string,
  authorized: PropTypes.string.isRequired,
  refunded: PropTypes.string.isRequired,
  fees: PropTypes.array.isRequired
};

RefundSummary.whyDidYouRender = true;

export default RefundSummary;
