import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { Field } from 'formik';
import { toast, TOAST } from '../../utils/toastify';
import Typography from '../../atoms/typography';
import Select from '../../atoms/select';

import { updateCheckout } from '../../pages/api';
import { updateCart } from '../../store/modules/cart/actions';
import { logAmplitude } from '../../utils/amplitude';

const ShippingMethod = styled.div``;

const ShippingMethodLabel = styled(Typography)`
  color: ${({ theme }) => theme.color.brand};
  letter-spacing: 0.2em;
  line-height: 2rem;
  margin: 1rem 0;
  text-transform: uppercase;
`;

const EstimatedArrival = styled(Typography)`
  color: ${({ theme }) => theme.color.brand};
  margin: 1rem 0;

  > span {
    color: ${({ theme }) => theme.color.brand};
  }
`;

const CheckoutShippingMethod = (props) => {
  const [
    selectedShippingId,
    setSelectedShippingId
  ] = useState(props.shipment.selected_shipping_rate.id);

  const handleOnShippingMethodUpdate = (e) => {
    const { value } = e.target;

    props.handleLoading(true);

    updateCheckout({
      id: props.cart.number,
      body: {
        order: {
          shipments_attributes: {
            id: props.shipment.id,
            selected_shipping_rate_id: +value
          }
        }
      },
      hold_state: true
    })
      .then(async (shippingRes) => {
        const shippingResData = shippingRes?.data ?? shippingRes;

        if (shippingResData?.errors && Array.isArray(shippingResData.errors)) {
          shippingResData.errors.forEach(({ message = null }) => {
            if (typeof message === 'string') {
              toast(message, { type: TOAST.TYPE.ERROR });
            }
          });
        }

        if (props.user && props.cart.payments.length > 0) {
          await updateCheckout({ id: props.cart.number, hold_state: true })
            .then((res) => {
              const resData = res?.data ?? res;

              if (resData?.errors && resData?.errors?.length > 0) {
                resData.errors.forEach(({ message = null }) => {
                  if (typeof message === 'string') {
                    toast(message, { type: TOAST.TYPE.ERROR });
                  }
                });
              }

              logAmplitude('Submitted Checkout Shipping', { cart: resData });

              props.updateCart(resData);
              setSelectedShippingId(value);
            });
        } else {
          props.updateCart(shippingResData);
          setSelectedShippingId(value);
        }
      })
      .finally(() => {
        props.handleLoading(false);
      });
  };

  return (
    <ShippingMethod className={props.className}>
      <ShippingMethodLabel htmlFor={`${props.shipment.id}.shipping_methods`} element="label" like="label-1">Shipping Method</ShippingMethodLabel>

      <Field name={`${props.shipment.id}.shipping_methods`}>
        {({ field }) => (
          <Select
            inverted
            id={`${props.shipment.id}.shipping_methods`}
            defaultValue={selectedShippingId}
            onChange={(e) => {
              handleOnShippingMethodUpdate(e);
              field.onChange(e);
            }}
          >
            <option value="-1" disabled>Select a shipping method</option>
            {
              props.shipment.shipping_rates.map((rate, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <option key={`shipping-method-${props.shipment.id}-${index}`} value={rate.id}>
                  {`${rate.name} ${rate.extra_cost}`}
                </option>
              ))
            }
          </Select>
        )}
      </Field>

      <EstimatedArrival element="p" like="dec-1">
        Estimated arrival:
        {' '}
        <span>{props.shipment.delivery_estimation}</span>
      </EstimatedArrival>
    </ShippingMethod>
  );
};

CheckoutShippingMethod.defaultProps = {
  className: '',
  user: false
};

CheckoutShippingMethod.propTypes = {
  cart: PropTypes.object.isRequired,
  className: PropTypes.string,
  handleLoading: PropTypes.func.isRequired,
  shipment: PropTypes.object.isRequired,
  updateCart: PropTypes.func.isRequired,
  user: PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  user: state.profile
});

const mapDispatchToProps = (dispatch) => ({
  updateCart: (cart) => dispatch(updateCart(cart))
});

const ConnectedCheckoutShippingMethod = connect(
  mapStateToProps, mapDispatchToProps
)(memo(CheckoutShippingMethod));

CheckoutShippingMethod.displayName = 'CheckoutShippingMethod';

export default ConnectedCheckoutShippingMethod;
