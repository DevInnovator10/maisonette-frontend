import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Typography from '../../atoms/typography';
import calculateLeadTime from '../../utils/calculateLeadTime';

const ImportDuties = styled(Typography)``;
const LeadTime = styled(Typography)``;

const Restrictions = styled.div`
  color: ${(props) => props.theme.color.brandLightBlue};
  line-height: 1.2;
  margin-bottom: 1.6rem;

  > span {
    padding-right: 1rem;
    display: inline-block;

    &:last-of-type {
      padding-right: 0;
    }
  }
`;

const ProductRestrictions = (props) => (
  <Restrictions className={props.className}>
    {props.importDuties && <ImportDuties element="span" like="dec-5">Import duties included</ImportDuties>}
    {
      !props.isGiftCard && props.leadTime && (
        <LeadTime element="span" like="dec-5">{`Usually ships within  ${calculateLeadTime(props.leadTime)}`}</LeadTime>
      )
    }
  </Restrictions>
);

ProductRestrictions.defaultProps = {
  className: '',
  importDuties: false,
  leadTime: 0,
  isGiftCard: false
};

ProductRestrictions.propTypes = {
  className: PropTypes.string,
  importDuties: PropTypes.bool,
  leadTime: PropTypes.number,
  isGiftCard: PropTypes.bool
};

export default ProductRestrictions;
