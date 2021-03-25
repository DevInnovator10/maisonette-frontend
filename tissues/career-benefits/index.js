import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Heading from '../heading';

// icons
import EmployeePerks from '../../public/images/careers-benefits-icon/Employee-perks.svg';
import HealthInsurance from '../../public/images/careers-benefits-icon/Health-insurance.svg';
import NewParent from '../../public/images/careers-benefits-icon/New-parent.svg';
import StockOptions from '../../public/images/careers-benefits-icon/Stock-options.svg';
import TimeOff from '../../public/images/careers-benefits-icon/Time-off.svg';
import Wellness from '../../public/images/careers-benefits-icon/Wellness.svg';
import Blocks from '../blocks';
import { Content } from '../../theme/page';

const BenefitWrapper = styled.div`
  background-color: #fff;
  padding: 6.4rem 1.6rem;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    padding: 6.4rem;
  }
`;

const BenefitButton = styled.a`
  border: 1px solid ${({ theme }) => theme.color.bluePrimary};
  cursor: pointer;
  font-size: 1.8rem;
  text-decoration: none;
  padding: 1.5rem 4.5rem;
  
`;

const IconStyling = css`
  margin-bottom: 2.8rem;
`;

const benfitBlocks = [
  {
    icon: <HealthInsurance css={IconStyling} />,
    title: 'Health Insurance & Retirement Benefits',
    text: 'We offer partial employer-paid medical, dental, and vision benefits, and all employees are invited to participate in our 401(k) program.'
  },
  {
    icon: <StockOptions css={IconStyling} />,
    title: 'Stock Option Benefits',
    text: 'We offer equity to all full-time employees.'
  },
  {
    icon: <TimeOff css={IconStyling} />,
    title: 'Time Off Benefits',
    text: 'We offer a generous time off policy for vacation days, sick days, and holidays.'
  },
  {
    icon: <Wellness css={IconStyling} />,
    title: 'Wellness Days',
    text: 'We offer employees Duvet Days: Company-wide days off to recharge.'
  },
  {
    icon: <EmployeePerks css={IconStyling} />,
    title: 'Employee Perks',
    text: 'We offer a 25% employee discount to shop our marketplace, plus free snacks and beverages, and a relaxed, dog-friendly environment.'
  },
  {
    icon: <NewParent css={IconStyling} />,
    title: 'NEW PARENT POLICY',
    text: 'We offer up to 13 weeks of fully paid new parent/legal guardian leave for primary caregivers, 6 weeks of fully paid new parent/legal guardian leave for secondary caregivers, and one additional part-time week for all new parents to assist in the back-to-work transition.'
  }
];

const CareerBenefits = ({ scrollToOpenRoles }) => (

  <BenefitWrapper>
    <Content>
      <Heading data={{ heading_title: 'Benefits' }} careerUpdate />

      <Blocks data={benfitBlocks} />

      <BenefitButton onClick={scrollToOpenRoles}>See open roles</BenefitButton>
    </Content>
  </BenefitWrapper>

);

CareerBenefits.propTypes = {
  scrollToOpenRoles: PropTypes.func
};

CareerBenefits.defaultProps = {
  scrollToOpenRoles: PropTypes.func
};
export default memo(CareerBenefits);
