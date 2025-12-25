import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { toast, TOAST } from '../../utils/toastify';

import AccountSection from '../../molecules/account-section';
import Button from '../../atoms/button';
import CrossSVG from '../../atoms/icon-cross';
import Radio from '../../atoms/radio';
import Typography from '../../atoms/typography';

import { deletePaymentSource, setDefaultPaymentSource } from '../../store/modules/profile/actions';
import { removePaymentMethod, setDefaultPaymentMethod } from '../../pages/api';

const NoCards = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
`;

const ActionDelete = styled(Button)`
  height: 3rem;
  outline: 0;
  padding: 0.75rem;
  position: absolute;
  right: 0;
  top: 0;
  width: 3rem;

  svg {
    stroke: ${(props) => props.theme.color.brand};
    stroke-width: 1rem;
    width: 1rem;
    height: 1rem;
  }
`;

const CardWrapper = styled.fieldset`
  label {
    button {
      text-decoration: underline;
      margin-left: 1.5rem;
      line-height: 1;
    }

    @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
      ${ActionDelete} {
        opacity: 0;
      }

      &:hover {
        ${ActionDelete} {
          opacity: 1;
        }
      }
    }
  }
`;

const Row = styled.span`
  display: block;
`;

const AccountCardSection = (props) => {
  const ccPaymentSources = props?.payment_sources
    ?.filter((ps) => ps.source.payment_type === 'CreditCard') ?? [];

  const cards = ccPaymentSources;
  const defaultCard = props?.payment_sources?.find((ps) => ps.default) ?? false;

  const handleOnCardClick = async (card) => {
    await setDefaultPaymentMethod({ id: card.id })
      .then((res) => {
        const resData = res?.data ?? res;
        if (!resData.errors) toast('Default Payment Method selection has been updated', { type: TOAST.TYPE.SUCCESS });
        props.setDefaultPaymentSource(card.id);
      });
  };

  const handleOnCardDelete = async (card) => {
    await removePaymentMethod({ id: card.id })
      .then(async () => {
        props.deletePaymentSource(card.id);

        if (defaultCard && defaultCard.id === card.id) {
          const sorted_ps = props.payment_sources
            .filter((ps) => ps.id !== card.id)
            .sort((first_ps, second_ps) => {
              if (first_ps.source.payment_type < second_ps.source.payment_type) return -1;
              if (first_ps.source.payment_type > second_ps.source.payment_type) return 1;

              return 0;
            });

          if (sorted_ps && sorted_ps.length > 0) {
            await setDefaultPaymentMethod({ id: sorted_ps[0].id })
              .then(() => props.setDefaultPaymentSource(sorted_ps[0].id));

          }
        }
      });
  };

  const accountCardBody = (
    <form>
      <CardWrapper>
        {
          cards && cards.length > 0
            ? (
              cards.map((card) => (
                <Radio
                  key={card.id}
                  id={`credit-card-${card.id}`}
                  name={`credit-card-${card.id}`}
                  value={card.id}
                  active={defaultCard && (defaultCard.id === card.id)}
                  changed={() => handleOnCardClick(card)}
                >
                  {/*
                    TODO: Not captured on braintree side at the moment - Señor Nolan
                    {card.name}
                    <br />
                  */}
                  <Row>
                    {`${card.source.cc_type.toUpperCase()} ending in ${card.source.last_digits}`}
                  </Row>
                  <Row>
                    {`${card.source.month} / ${card.source.year}`}
                  </Row>

                  <ActionDelete
                    aria-label={`delete payment method, ${card.source.cc_type}, ending in, ${card.source.last_digits}`}
                    isIcon
                    inverted
                    outline
                    onClick={() => handleOnCardDelete(card)}
                  >
                    <CrossSVG />
                  </ActionDelete>
                </Radio>
              ))
            ) : <NoCards element="p" like="paragraph-3">You can save payment methods during checkout.</NoCards>
        }
      </CardWrapper>
    </form>
  );

  return (
    <AccountSection
      className={props.className}
      title="Payment Methods"
      body={accountCardBody}
    />
  );
};

AccountCardSection.defaultProps = {
  className: 'AccountCardSection',
  payment_sources: []
};

AccountCardSection.propTypes = {
  className: PropTypes.string,
  payment_sources: PropTypes.array,
  deletePaymentSource: PropTypes.func.isRequired,
  setDefaultPaymentSource: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  payment_sources: state.profile.payment_sources
});

const mapDispatchToProps = (dispatch) => ({
  deletePaymentSource: (ps_id) => dispatch(deletePaymentSource(ps_id)),
  setDefaultPaymentSource: (payment_source_id) => dispatch(
    setDefaultPaymentSource(payment_source_id)
  )
});

const ConnectedAccountCardSection = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountCardSection);

AccountCardSection.whyDidYouRender = true;

export default ConnectedAccountCardSection;
