import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { formatMoney } from 'accounting-js';

import Typography from '../../atoms/typography';
import Checkbox from '../../atoms/checkbox';

const Detail = styled(Typography)`
  font-size: 1.6rem;
`;

const AvailableStoreCredit = styled(Typography)`
  font-size: 1.4rem;
  color: ${(props) => props.theme.color.brandLightBlue};
  margin-top: 0.5rem;
`;

const StyledCheckbox = styled(Checkbox)`
  font-size: 1.6rem;
  padding-left: 2rem;

  :before, :after {
    font-size: 1.2rem;
  }
`;

const StoreCreditCheckbox = (props) => {
  const updateStoreCredit = () => {
    props.updateUseStoreCredit(!props.useStoreCredit);
  };

  return (
    <StyledCheckbox
      id="apply-store-credit"
      name="apply-store-credit"
      value={props.useStoreCredit}
      active={props.useStoreCredit}
      changed={updateStoreCredit}
    >
      {
        props.useStoreCredit ? (
          <Detail
            element="p"
            like="dec-1"
          >
            {formatMoney(props.applicableStoreCredit)}
            {' '}
            applied to order
          </Detail>
        ) : (
          <>
            <Detail
              element="p"
              like="dec-1"
            >
              Apply store credit (
              {formatMoney(props.applicableStoreCredit)}
              )
            </Detail>
            <AvailableStoreCredit
              element="p"
              like="dec-1"
            >
              {props.availableStoreCredit}
              {' '}
              available
            </AvailableStoreCredit>
          </>
        )
      }
    </StyledCheckbox>
  );
};

StoreCreditCheckbox.defaultProps = {
  useStoreCredit: false,
  applicableStoreCredit: '',
  availableStoreCredit: '',
  updateUseStoreCredit: () => {}
};

StoreCreditCheckbox.propTypes = {
  useStoreCredit: PropTypes.bool,
  applicableStoreCredit: PropTypes.string,
  availableStoreCredit: PropTypes.string,
  updateUseStoreCredit: PropTypes.func
};

export default StoreCreditCheckbox;
