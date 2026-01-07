import React, {
    forwardRef, useState, useEffect, useRef
} from 'react';
import { connect } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { toast, TOAST } from '../../utils/toastify';

import Typography from '../../atoms/typography';
import Button from '../../atoms/button';
import Input from '../../molecules/formik-input';
import Text from '../../molecules/textarea-field';
import AddToWishlist from '../../molecules/add-to-wishlist';

import { addToCart } from '../../pages/api';
import { trackAddToCart, LUX } from '../../utils/tracking';
import WaitlistEmail from '../../molecules/product-waitlist-email';
import { updateCart } from '../../store/modules/cart/actions';

const GiftOptionsFieldset = styled.div`
  margin-bottom: 2rem;
  margin-top: -1rem;
`;

const ErrorMessage = styled(Typography)`
  color: ${(props) => props.theme.color.brandError};
  display: block;
  margin-top: 0.25rem;
  width: 100%;
`;

const Radio = styled.input`
  user-select: none;
  /* hidden */
  border: 0px;
  clip: rect(0px, 0px, 0px, 0px);
  height: 1px;
  width: 1px;
  margin: -1px;
  padding: 0px;
  overflow: hidden;
  white-space: nowrap;
  position: absolute;
`;

const TextArea = styled(Text)`
  label {
    font-family: ${(props) => props.theme.font.sans};
    letter-spacing: 0.04em;
  }
`;

const RadioLabel = styled.label`
  border: 1px solid ${({ theme }) => theme.color.brand};
  color: ${({ theme }) => theme.color.brand};
  cursor: pointer;
  display: inline-flex;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 12px;
  justify-content: center;
  line-height: 3rem;
  margin: 1rem 1rem 0px 0px;
  min-width: 6rem;
  padding: 0px 1rem;

  ${(props) => props['aria-checked'] && css`
    background: ${props.theme.color.brand};
    color: ${props.theme.color.white};
  `}

  ${(props) => (
    props.disabled
      ? css`
        position: relative;
        cursor: not-allowed;
        opacity: .5;

        ::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          background: linear-gradient(to top left, transparent calc(50% - 1px), ${props.theme.color.brand}, transparent calc(50% + 1px));
          z-index: -1;
        }
      ` : css`
        :hover {
          opacity: 0.75;
        }
      `
  )}
`;

const OptionHelper = styled(Typography)`
  color: ${({ theme }) => theme.color.brand};
  letter-spacing: 0.2em;
  line-height: 2rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;

  > span {
    color: ${({ theme }) => theme.color.brandLight};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-row-gap: 2rem;
  margin-bottom: 3rem;
`;

const SubmitButton = styled(Button)`
  margin-top: 1rem;
`;

const TextFlair = styled(Typography)`
  align-self: center;
  color: ${({ theme }) => theme.color.brandA11yRed};
  letter-spacing: 0.1em;
  position: relative;
  text-align: center;
  text-transform: uppercase;
  padding: 0 ${({ theme }) => theme.modularScale.base};
`;

/** ******************************************** */

const GiftOption = forwardRef(({
  field: {
    name,
    value,
    onChange,
    onBlur
  },
  className,
  id,
  label,
  disabled,
  ...props
}, ref) => (
  <RadioLabel
    ref={ref}
    aria-checked={id === value}
    aria-label="Gift Card Variant"
    aria-labelledby={id}
    className={className}
    htmlFor={id}
    disabled={disabled}
    name="gift-card-option"
  >
    <Radio
      name={name}
      id={id}
      type="radio"
      value={id}
      checked={id === value}
      onChange={onChange}
      onBlur={onBlur}
      {...props}
    />
    {label}
  </RadioLabel>
));

GiftOption.defaultProps = {
  className: '',
  id: '',
  field: {},
  isChecked: false,
  disabled: false
};

GiftOption.propTypes = {
  className: PropTypes.string,
  isChecked: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  field: PropTypes.object,
  disabled: PropTypes.bool
};

GiftOption.displayName = 'GiftOption';

/** ******************************************** */

const GiftOptionsGroup = forwardRef(({
  error,
  touched,
  className,
  children
}, ref) => (
  <GiftOptionsFieldset className={className} ref={ref}>
    {children}
    {touched && error && <ErrorMessage role="alert" element="span" like="dec-1">{error}</ErrorMessage>}
  </GiftOptionsFieldset>
));

GiftOptionsGroup.defaultProps = {
  className: '',
  touched: false,
  error: ''
};

GiftOptionsGroup.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  touched: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  error: PropTypes.string
};

GiftOptionsGroup.displayName = 'GiftOptionsGroup';

/** ******************************************** */

const SUBMIT_BUTTON_TEXT = 'ADD TO BAG';

const GiftCardAddToCart = forwardRef(({
  product,
  variant,
  onVariantChange,
  profile,
  cart,
  ...props
}, ref) => {
  const [optionType] = useState(product?.option_types?.[0]?.name || 'Amount');
  const [outOfStock, setOutOfStock] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  const dateRef = useRef();

  const today = () => {
    const d = new Date();
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear();

    if (month.length < 2) { month = `0${month}`; }
    if (day.length < 2) { day = `0${day}`; }

    return [year, month, day].join('-');
  };

  const isProductAvailable = () => product.available;
  const isProductDiscontinued = () => product.discontinued;
  const isVariantDiscontinued = () => variant && variant.discontinued;

  const availabilityMessage = isProductDiscontinued()
    ? 'This product is no longer available'
    : 'This product is not available yet';

  useEffect(() => {
    if (dateRef.current && !dateRef.current.getAttribute('min')) {
      dateRef.current.setAttribute('min', today());
    }
  });

  if (isProductDiscontinued() || !isProductAvailable()) {
    return (
      <TextFlair element="p" like="label-1">
        {availabilityMessage}
      </TextFlair>
    );
  }

  return (
    <Formik
      initialValues={{
        'gift-card-option': [],
        'gift-card-recipients-name': '',
        'gift-card-recipients-email': '',
        'gift-card-senders-name': '',
        'gift-card-message': '',
        'gift-card-delivery-date': today()
      }}

      validationSchema={
        Yup.object().shape({
          'gift-card-option': Yup.string().required('Please select a gift card amount'),
          'gift-card-recipients-email': Yup.string().email('Please enter a valid email address').required('Email is required'),
          'gift-card-delivery-date': Yup.date()
        })
      }

      initialStatus={{ button: SUBMIT_BUTTON_TEXT }}

      validateOnChange={false}

      onSubmit={(values, actions) => {
        setSubmitting(true);
        actions.setStatus({ button: 'ADDING TO BAG...' });

        const request = {
          line_item: {
            variant_id: variant.id,
            quantity: 1,
            vendor_id: variant.stock_items[0].vendor_id,
            gift_card_details_attributes: {
              purchaser_name: values['gift-card-senders-name'],
              recipient_name: values['gift-card-recipients-name'],
              recipient_email: values['gift-card-recipients-email'],
              gift_message: values['gift-card-message'],
              send_email_at: values['gift-card-delivery-date']
            }
          }
        };

        if (profile.id) request.user_id = profile.id;
        if (cart.token) request.order_token = cart.token;

        LUX.addedToCart();

        addToCart({ body: request })
          .then((response) => {
            if (response.errors) {
              response.errors.forEach(({ message = null }) => {
                if (typeof message === 'string') {
                  toast(message, { type: TOAST.TYPE.ERROR });
                }
              });
            } else {
              props.updateCart(response);

              global.document.cookie = `maisonette_order_token=${response.token}; max-age=15768017; path=/;`;
              global.document.cookie = `maisonette_order_number=${response.number}; max-age=15768017; path=/;`;

              actions.setStatus({ button: 'ADDED TO BAG ✓' });

              LUX.cartValue(response);
              LUX.cartSize(response);

              trackAddToCart({
                product,
                cart: response,
                quantity: 1,
                variant,
                user: props.profile
              });
            }
          })
          .finally(() => {
            actions.resetForm();

            setTimeout(() => {
              actions.setStatus({ button: 'Add to Bag' });
              setSubmitting(false);
            }, 1500);
          });
      }}
    >
      {({
        status,
        values,
        errors,
        touched,
        setFieldValue,
        setFieldTouched
      }) => (
        <Form ref={ref} {...props}>
          <OptionHelper element="p" like="label-1">
            {
              variant ? variant.options_text : (
                <>
                  {optionType}
                  {': '}
                  <span>{`Select an ${optionType}`}</span>
                </>
              )
            }
          </OptionHelper>

          <GiftOptionsGroup
            id="gift-card-option"
            value={values['gift-card-option']}
            error={errors['gift-card-option']}
            touched={touched['gift-card-option']}
            onChange={setFieldValue}
            onBlur={setFieldTouched}
          >
            {
              product.variants.map((v) => (
                <Field
                  component={GiftOption}
                  disabled={!v.in_stock}
                  id={v.id.toString()}
                  key={v.id}
                  label={v.option_values[0].name}
                  name="gift-card-option"
                  onClick={() => {
                    setOutOfStock(!v.in_stock);
                    onVariantChange(v);
                  }}
                />
              ))
            }
          </GiftOptionsGroup>

          <FormGrid>
            {
              isVariantDiscontinued() ? (
                <TextFlair element="p" like="label-1">
                  The selected amount is not available
                </TextFlair>
              ) : (
                <>
                  <Input
                    label="Recipient's name"
                    name="gift-card-recipients-name"
                    placeholder="Recipient's name"
                    required
                  />

                  <Input
                    label="Recipient's email"
                    name="gift-card-recipients-email"
                    placeholder="Recipient's email"
                    type="email"
                    required
                  />

                  <Input
                    label="Sender's name"
                    name="gift-card-senders-name"
                    placeholder="Sender's name"
                    required
                  />

                  <TextArea
                    label="Gift message"
                    name="gift-card-message"
                    placeholder="Gift message"
                    type="textarea"
                  />

                  <Input
                    ref={dateRef}
                    label="Delivery date"
                    name="gift-card-delivery-date"
                    type="date"
                    required
                  />

                  <SubmitButton
                    id="product-add-to-cart-button"
                    type="submit"
                    disabled={isSubmitting || outOfStock}
                  >
                    {status.button}
                  </SubmitButton>

                  <AddToWishlist product={product} />
                </>
              )
            }

            <WaitlistEmail active={outOfStock} variant={variant?.id ?? null} />
          </FormGrid>
        </Form>
      )}
    </Formik>
  );
});

GiftCardAddToCart.defaultProps = {
  variant: null,
  profile: null,
  cart: null,
  updateCart: () => {}
};

GiftCardAddToCart.propTypes = {
  variant: PropTypes.object,
  profile: PropTypes.object,
  cart: PropTypes.object,
  updateCart: PropTypes.func,
  product: PropTypes.object.isRequired,
  onVariantChange: PropTypes.func.isRequired
};

GiftCardAddToCart.displayName = 'GiftCardAddToCart';

const mapStateToProps = (state) => ({
  cart: state.cart,
  profile: state.profile
});

const mapDispatchToProps = (dispatch) => ({
  updateCart: (cart) => dispatch(updateCart(cart))
});

const ConnectedGiftCardAddToCart = connect(
  mapStateToProps, mapDispatchToProps
)(GiftCardAddToCart);

GiftCardAddToCart.displayName = 'GiftCardAddToCart';

export default ConnectedGiftCardAddToCart;
