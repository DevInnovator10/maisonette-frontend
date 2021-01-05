import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Typography from '../../atoms/typography';
import Link from '../../utils/link';
import Button from '../../atoms/button';

const Wrapper = styled.section`
  color: ${({ theme }) => theme.color.brand};
  margin-bottom: ${({ theme }) => theme.modularScale.sixtyFour};

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    grid-area: gift;
    // step number + margin for delivery address = 4.8rem;
    margin-left: 4.8rem;
  }
`;

const Heading = styled(Typography)`
  font-size: ${({ theme }) => theme.modularScale.twenty};
  margin-bottom: 1rem;
`;

const EditStepLink = styled(Button)`
  padding: 0;
  width: 22rem;
  font-size: ${({ theme }) => theme.modularScale.fourteen};
  text-align: center;
  margin: ${({ theme }) => theme.modularScale.thirtyTwo} auto 0;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    margin: ${({ theme }) => theme.modularScale.thirtyTwo} 0 0 0;
  }
`;

const GiftInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoHeading = styled(Typography)`
  font-family: ${(props) => props.theme.font.sans};
  font-size: ${({ theme }) => theme.modularScale.sixteen};
  text-transform: uppercase;
  letter-spacing: 0.24em;
  margin-bottom: 1rem;
`;

const InfoContent = styled(Typography)`
  font-size: ${({ theme }) => theme.modularScale.eighteen};
  margin-bottom: ${({ theme }) => theme.modularScale.sixteen};

  :last-of-type {
    font-size: ${({ theme }) => theme.modularScale.sixteen};
    margin-bottom: 0;
  }
`;

const CheckoutAddGiftSection = (props) => (
  <Wrapper id="gift-message" data-test-id="gift-message-wrapper">
    <Heading element="h2" like="dec-2">{props.isGift ? 'Gift options' : 'Is this order a gift?'}</Heading>
    {
        props.isGift
          ? (
            <GiftInfo>
              <InfoHeading element="h3" like="label-1">Message</InfoHeading>
              <InfoContent element="p" like="dec-2">{props.message ? props.message : ''}</InfoContent>
              <InfoHeading element="h3" like="label-1">Recipient</InfoHeading>
              <InfoContent element="p" like="dec-2">{props.recipient ? props.recipient : ''}</InfoContent>
              <EditStepLink
                outline
                isLink
                href="/checkout/gift-message"
              >
                Edit gift options
              </EditStepLink>
            </GiftInfo>
          )
          : (
            <Link href="/checkout/gift-message" passHref>
              <a data-test-id="gift-message-link">Add a gift message</a>
            </Link>
          )
      }
  </Wrapper>
);

CheckoutAddGiftSection.defaultProps = {
  isGift: false,
  recipient: '',
  message: ''
};

CheckoutAddGiftSection.propTypes = {
  isGift: PropTypes.bool,
  recipient: PropTypes.string,
  message: PropTypes.string
};

export default CheckoutAddGiftSection;
