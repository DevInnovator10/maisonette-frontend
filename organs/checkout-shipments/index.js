import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Typography from '../../atoms/typography';
import CheckoutShipmentCard from '../../tissues/checkout-shipment-card';
import { logAmplitude } from '../../utils/amplitude';
import { removeGiftWrap, createGiftWrap, updateCheckout } from '../../pages/api';
import { toast, TOAST } from '../../utils/toastify';
import Button from '../../atoms/button';
import ShipmentToolTip from '../../molecules/checkout-shipment-tool-tip';
import InfoBox from '../../atoms/info-box';
import ShipmentProductCard from '../../molecules/shipment-product-card';
import CheckoutStepNumber from '../../atoms/checkout-step-number';

const SectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.modularScale.sixtyFour};

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    grid-area: shipments;
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
  }
`;

const Shipments = styled.div`
  width: 100%;
  position: relative;
  color: ${({ theme }) => theme.color.brand};
  font-family: ${({ theme }) => theme.font.sans};

  h2 {
    font-size: 2.4rem;
  }

  p {
    font-size: 1.6rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    grid-area: shipments;
  }
`;

const HeadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.modularScale.base};

  p {
    color: ${({ theme }) => theme.color.brandLightBlue};
  }


  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const HeadingRight = styled.div`
  display: flex;
  align-items: center;
`;

const OpenToolTipButton = styled(Button)`
  display: flex;
  align-items: center;
  font-family: ${({ theme }) => theme.font.sans};
  text-transform: none;
  letter-spacing: normal;
  line-height: normal;
`;

const ToolIcon = styled.div`
  position: relative;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: none;
  background-color: ${({ theme }) => theme.color.brandLightBlue};
  color: ${({ theme }) => theme.color.white};
  padding: 0;
  margin-left: 1rem;

  span {
    position: absolute;
    line-height: normal;
    letter-spacing: normal;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
`;

const CartItemsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1;
  grid-gap: 3.2rem;

  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: ${({ theme }) => theme.modularScale.sixtyFour};
  }
`;

const LineItems = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    order: 1;
  }
`;

const LineItemsHeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.modularScale.thirtyTwo};
`;

const LineItemHeading = styled(Typography)`
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.modularScale.sixteen};
`;

const EditBagButton = styled(Button)`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: ${({ theme }) => theme.modularScale.sixteen};
`;

const InfoBoxWrapper = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    order: 2;
  }
`;

const getShipmentLineItems = (shipment, line_items) => {
  const manifestVariantIds = shipment.manifest.map(
    (manifest) => manifest.variant_id
  );

  const lineItems = line_items.filter(
    (li) => manifestVariantIds?.includes?.(li.variant.id)
  );

  return lineItems ?? [];
};

const CheckoutShipments = (props) => {
  const [showToolTip, setShowToolTip] = useState(false);

  const handleGiftWrap = (shipment) => {
    props.setLoading(true);
    const request = shipment.giftwrap ? removeGiftWrap : createGiftWrap;

    request({ shipment_number: shipment.number, order_number: props.cartNumber })
      .then(async (res) => {
        const resData = res?.data ?? res;
        if (resData?.errors && resData.errors?.length > 0) {
          resData.errors.forEach(({ message = null }) => {
            if (typeof message === 'string') {
              toast(message, { type: TOAST.TYPE.ERROR });
              logAmplitude('Encountered Transaction Error', {
                message,
                step: props.cartState
              });
            }
          });
        }

        updateCheckout({ id: props.cartNumber, hold_state: true })
          .then((checkoutRes) => {
            const checkoutResData = checkoutRes?.data ?? checkoutRes;

            if (checkoutResData?.errors && checkoutResData.errors?.length > 0) {
              checkoutResData.errors.forEach(({ message = null }) => {
                if (typeof message === 'string') {
                  toast(message, { type: TOAST.TYPE.ERROR });
                }
              });
            } else props.updateCart(checkoutResData);
          }).then(() => props.setLoading(false));
      });
  };

  const handleShippingMethodChange = (rateId, shipment) => {
    props.setLoading(true);

    updateCheckout({
      id: props.cartNumber,
      body: {
        order: {
          shipments_attributes: {
            id: shipment.id,
            selected_shipping_rate_id: +rateId
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

        if (props.user && props.payments.length > 0) {
          await updateCheckout({ id: props.cartNumber, hold_state: true })
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
            });
        } else {
          props.updateCart(shippingResData);
        }
      }).then(() => props.setLoading(false));
  };

  const openCart = () => {
    logAmplitude('Clicked Checkout Cart Edit', {
      cartId: props.cartNumber,
      cartState: props.cartState
    });
    props.toggleCart(true);
  };

  const renderShipmentCards = (shipments, lineItems) =>
    shipments.map((shipment, index) => (
      <CheckoutShipmentCard
        key={shipment.id}
        index={index}
        shipment={shipment}
        lineItems={getShipmentLineItems(shipment, lineItems)}
        handleGiftWrap={handleGiftWrap}
        handleShippingMethodChange={handleShippingMethodChange}
        openCart={openCart}
        loading={props.loading}
      />
    ));

  const renderLineItems = () => props.lineItems?.map((item, i) => (
    <ShipmentProductCard
      key={`line-item-${item.id}`}
      noLinks
      backorder={item.variant.is_backorderable && item.backordered}
      brand={item.variant.brand}
      finalSale={item.final_sale}
      image={(item.variant.images[0] && item.variant.images[0].product_url)}
      inStock={item.variant.in_stock}
      isGiftCard={item.gift_cards.length > 0}
      item={{ ...item, index: i + 1, module: 'Checkout Shipping Step' }}
      monogram={item.monogram}
      option={item.variant.option_values.length > 0 ? item.variant.option_values[0].presentation : ''}
      optionType={item.variant.option_values.length > 0 ? item.variant.option_values[0].option_type_presentation : ''}
      price={item.price}
      promotionable={item.promotionable}
      adjustments={item.adjustments}
      quantity={item.quantity}
      stock={item.variant.total_on_hand}
      title={item.variant.name}
      vendor={item.vendor_name}
    />
  ));

  const openToolTip = () => {
    setShowToolTip(true);
  };

  const closeToolTip = () => {
    setShowToolTip(false);
  };

  const showShipments = () => props.shipments.length > 0
    && props.shipments.every((shipment) => shipment.delivery_estimation);

  return (
    <SectionWrapper
      data-test-id="shipments-wrapper"
      id="checkout-shipment-section"
    >
      <CheckoutStepNumber stepNumber="2" />
      <Shipments>
        {
          showToolTip && (
            <ShipmentToolTip
              closeToolTip={closeToolTip}
            />
          )
        }

        <HeadingWrapper>
          <Typography element="h2" like="heading-5">Shipping details</Typography>

          {
            showShipments() && (
              <HeadingRight>
                {
                  props.shipments.length > 1 ? (
                    <>
                      <OpenToolTipButton
                        aria-label="open shipment tool tip"
                        onClick={openToolTip}
                        disabled={showToolTip}
                        isText
                      >
                        <Typography element="p" like="dec-1">
                          {props.shipments.length}
                          {' '}
                          shipments
                        </Typography>
                        <ToolIcon>
                          <span>?</span>
                        </ToolIcon>
                      </OpenToolTipButton>
                    </>
                  ) : (
                    <Typography element="p" like="dec-1">
                     1 shipment
                    </Typography>
                  )
                }
              </HeadingRight>
            )
          }
        </HeadingWrapper>

        {
          showShipments()
            ? renderShipmentCards(props.shipments, props.lineItems)
            : (
              <CartItemsWrapper>
                <InfoBoxWrapper>
                  <InfoBox
                    text="Additional shipping options
                    and details will be available once
                    you provide a delivery address"
                  />
                </InfoBoxWrapper>

                <LineItems>
                  <LineItemsHeadingWrapper>
                    <LineItemHeading element="h3" like="dec-2">
                      Items in bag
                    </LineItemHeading>
                    <EditBagButton
                      type="button"
                      text="Edit bag"
                      styledLikeLink
                      onClick={openCart}
                    />
                  </LineItemsHeadingWrapper>

                  {renderLineItems()}
                </LineItems>
              </CartItemsWrapper>
            )
        }
      </Shipments>
    </SectionWrapper>
  );
};

CheckoutShipments.defaultProps = {
  shipments: [],
  lineItems: [],
  updateCart: () => {},
  setLoading: () => {},
  toggleCart: () => {},
  user: false,
  payments: [],
  loading: false
};

CheckoutShipments.propTypes = {
  shipments: PropTypes.array,
  lineItems: PropTypes.array,
  cartNumber: PropTypes.string.isRequired,
  cartState: PropTypes.string.isRequired,
  updateCart: PropTypes.func,
  setLoading: PropTypes.func,
  toggleCart: PropTypes.func,
  user: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  payments: PropTypes.array,
  loading: PropTypes.bool
};

export default CheckoutShipments;
