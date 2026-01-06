import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { formatMoney } from 'accounting-js';
import Router from 'next/router';
import Typography from '../../atoms/typography';
import Button from '../../atoms/button';
import CheckoutPayment from '../../atoms/checkout-payment';
import CheckoutAddress from '../../atoms/checkout-address';
import CheckoutStepNumber from '../../atoms/checkout-step-number';
import PaymentMethodIcon from '../../atoms/icon-payment-method';

const SectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    grid-area: payment;
    flex-direction: row;
    text-align: left;
    align-items: flex-start;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  color: ${(props) => props.theme.color.brand};
`;

const Details = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    flex-direction: row;
  }
`;

const PaymentsSection = styled.div`
  flex: 1 1 calc(50% - ${({ theme }) => theme.modularScale.sixteen});
`;

const AddressSection = styled.div`
  flex: 1 1 calc(50% - ${({ theme }) => theme.modularScale.sixteen});
  margin-top: ${({ theme }) => theme.modularScale.thirtyTwo};

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    margin: 0 0 0 ${({ theme }) => theme.modularScale.thirtyTwo};
  }
`;

const SectionHeading = styled(Typography)`
  font-size: ${({ theme }) => theme.modularScale.twentyFour};
  margin-bottom: ${({ theme }) => theme.modularScale.thirtyTwo};
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    text-align: left;
  }
`;

const Heading = styled(Typography)`
  grid-area: heading;
  margin-bottom: 1rem;
  font-size: ${({ theme }) => theme.modularScale.eighteen};
`;

const SubHeading = styled(Heading)`
  margin-top: ${({ theme }) => theme.modularScale.sixteen};
`;

const AddEditButton = styled(Button)`
  padding: 0;
  width: 22rem;
  font-size: ${({ theme }) => theme.modularScale.fourteen};
  text-align: center;
  margin-top: ${({ theme }) => theme.modularScale.thirtyTwo};
  align-self: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    align-self: flex-start;
  }
`;

const Detail = styled(Typography)`
  font-size: ${({ theme }) => theme.modularScale.sixteen};
`;

const PaymentMethodIcons = styled.div`
  width: 22rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-self: center;

  img {
    margin: 0 .8rem 1rem .8rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    width: 32rem;
    align-self: flex-start;
    justify-content: space-between;

    img {
      margin: 0;
    }
  }
`;

const CheckoutPaymentSection = (props) => {
  // this is getting bigger as the designs are being changed
  // might be good idea to refactor at some point
  const validPayments = () => props.payments?.filter((payment) => payment.state === 'checkout' && payment.source_type !== 'Spree::StoreCredit');
  const showPaymentSection = () =>
    props.hasPayment || props.giftCardCoversTotal || props.useStoreCredit;
  const renderGitCard = () => props.giftCard && (
    <>
      <SubHeading element="h4" like="dec-1">Gift card</SubHeading>
      <Detail
        element="p"
        like="dec-1"
      >
        {formatMoney(props.giftCard.amount.replace('-', ''))}
        {' '}
          applied to order
      </Detail>
    </>
  );

  const renderStoreCredit = () => +props.applicableStoreCredit > 0 && (
  <>
    <SubHeading element="h4" like="dec-1">Store credit</SubHeading>
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
        <Detail
          element="p"
          like="dec-1"
        >
          Not applied to order (
          {props.availableStoreCredit}
          {' '}
          available)
        </Detail>
      )
    }
  </>
  );

  const handlePageLinkClick = (e) => {
    e.preventDefault();
    try {
      const scrollPos = global.document?.documentElement?.scrollTop
      ?? global.document?.body?.scrollTop;
      // save scrollPos to session storage to be used to scroll mobile users
      global.sessionStorage.setItem('maisonette_checkout_scrollY', scrollPos);
    } catch (error) { /*  */ }
    Router.push('/checkout/payment');
  };

  return (
    <SectionWrapper id="checkout-payment-section">
      <CheckoutStepNumber stepNumber="3" />
      <Wrapper>
        <SectionHeading element="h2" like="heading-5">Payment</SectionHeading>
        {
            showPaymentSection() && (
              <Details>
                <>
                  <PaymentsSection
                    data-test-id="submitted-payment-summary"
                  >
                    <Heading element="h3" like="dec-1">Payment method</Heading>
                    <CheckoutPayment
                      payments={validPayments()}
                    />

                    {renderGitCard()}

                    {renderStoreCredit()}
                  </PaymentsSection>

                  <AddressSection
                    data-test-id="checkout-submitted-bill-address"
                  >
                    <Heading element="h3" like="dec-1">Billing Address</Heading>
                    {
                        props.sameBilling
                          ? (
                            <Detail
                              element="p"
                              like="dec-1"
                            >
                              Same as shipping address
                            </Detail>
                          )
                          : (
                            <CheckoutAddress
                              address={props.billAddress}

                            />
                          )
                      }
                  </AddressSection>
                </>
              </Details>
            )
         }

        {
          showPaymentSection() ? (
            <AddEditButton
              outline
              isLink
              text="change payment"
              href="/checkout/payment"
              onClick={handlePageLinkClick}
            />
          ) : (
            <>
              <PaymentMethodIcons>
                <PaymentMethodIcon payment="visa" />
                <PaymentMethodIcon payment="mastercard" />
                <PaymentMethodIcon payment="discover" />
                <PaymentMethodIcon payment="amex" />
                <PaymentMethodIcon payment="apple-pay" />
                <PaymentMethodIcon payment="paypal" />
                <PaymentMethodIcon payment="afterpay" />
              </PaymentMethodIcons>
              <AddEditButton
                isLink
                outline
                text="add payment"
                href="/checkout/payment"
                disabled={!props.hasAddresses}
                onClick={handlePageLinkClick}
                data-test-id="checkout-payment-button"
              />
            </>
          )
        }
      </Wrapper>
    </SectionWrapper>
  );
};

CheckoutPaymentSection.defaultProps = {
  hasPayment: false,
  hasAddresses: false,
  billAddress: false,
  sameBilling: true,
  payments: [],
  availableStoreCredit: '0',
  applicableStoreCredit: '0',
  useStoreCredit: false,
  giftCard: false,
  giftCardCoversTotal: false
};

CheckoutPaymentSection.propTypes = {
  hasPayment: PropTypes.bool,
  hasAddresses: PropTypes.bool,
  billAddress: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  sameBilling: PropTypes.bool,
  payments: PropTypes.array,
  availableStoreCredit: PropTypes.string,
  applicableStoreCredit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  useStoreCredit: PropTypes.bool,
  giftCard: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  giftCardCoversTotal: PropTypes.bool
};

export default CheckoutPaymentSection;
