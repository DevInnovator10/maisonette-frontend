import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

import Typography from '../../atoms/typography';

const FinalSaleWrapper = styled.div`
    display: flex;
`;

const FinalSaleText = styled(Typography)`
  color: ${(props) => props.theme.color.redError};
  line-height: 1.8rem;
  font-weight: 400;
  }
`;

const FinalSaleWarning = (props) => (
  <FinalSaleWrapper className={props.className}>
    <FinalSaleText element="span" like="dec-5">
      Final sale items are not returnable.
    </FinalSaleText>
  </FinalSaleWrapper>
);

FinalSaleWarning.defaultProps = {
  className: ''
};

FinalSaleWarning.propTypes = {
  className: PropTypes.string
};

export default FinalSaleWarning;
