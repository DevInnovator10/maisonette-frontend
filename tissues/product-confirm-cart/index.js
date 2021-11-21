import React, { useRef } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { formatMoney } from 'accounting-js';
import { logAmplitude } from '../../utils/amplitude';
import handleOnImageError from '../../utils/handleOnImageError';
import Typography from '../../atoms/typography';
import Button from '../../atoms/button';

import GreenCheckMark from '../../public/images/green-check-mark.svg';

const ProductAddedWrapper = styled.div`
  background: ${(props) => props.theme.color.white};
  color: ${(props) => props.theme.color.brand};
  padding: ${(props) => props.theme.modularScale.sixteen};
`;

const HeadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${(props) => props.theme.modularScale.sixteen};
`;

const GreenCheckMarkIcon = styled(GreenCheckMark)`
`;

const Heading = styled(Typography)`
  margin-top: 2.05rem;
  line-height: 2.8rem;
`;

const Card = styled.div`
  border-top: 1px solid rgba(47, 77, 161, 0.1);
  display: grid;
  grid-template-areas: "image info price";
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto;
  padding: ${(props) => props.theme.modularScale.sixteen} 0;
  }
`;

const Image = styled.img`
  display: block;
  grid-area: image;
  height: 9.1rem;
  width: 6.4rem;

  &.--wiggle {
    animation: ${({ theme }) => theme.animations.wiggle} ${({ theme }) => theme.animation.slow};
  }
`;

const InfoWrapper = styled.div`
  flex-grow: 1;
  grid-area: info;
  padding: 1.258rem ${(props) => props.theme.modularScale.eight};
  display: flex;
  flex-direction: column;
  align-items: flex-start;

`;

const BrandInfo = styled(Typography)`
line-height: ${(props) => props.theme.modularScale.fourteen};
color: ${(props) => props.theme.color.brandLightBlue};
margin-bottom: 0.4rem;
`;

const TitleInfo = styled(Typography)`
line-height: ${(props) => props.theme.modularScale.sixteen};
color: ${(props) => props.theme.color.brand};
`;

const PriceWrapper = styled.div`
  grid-area: price;

  padding: 1.258rem 1.0rem;
`;

const Price = styled(Typography)`
  color: ${(props) => props.theme.color.brandLightBlue};
  text-align: center;
  line-height: ${(props) => props.theme.modularScale.fourteen};
`;

const CTA = styled(Button)`
  width: 100%;
  text-transform: initial;
  padding: ${(props) => props.theme.modularScale.fourteen} 0;
  line-height: 0;

  :first-of-type {
    margin: ${(props) => props.theme.modularScale.eight} 0 0.4rem;
  }
  :last-of-type {
    margin: 0.4rem 0 ${(props) => props.theme.modularScale.eight};
    border: 0.1rem solid rgba(47, 77, 161, 0.25);
  }
`;

const CTAText = styled(Typography)`
  font-weight: 600;
  line-height: ${(props) => props.theme.modularScale.sixteen};
  letter-spacing: normal;
`;

const ProductAddedConfirmation = (props) => {
  const imageRef = useRef();

  const openCart = () => {
    props.closeModal();
    props.toggleCart(true);
    logAmplitude('Add to Cart Confirmation', {
      product: props.product,
      isViewed: false,
      isViewShop: true
    });
  };

  const closeModal = () => {
    props.closeModal();
    logAmplitude('Add to Cart Confirmation', {
      product: props.product,
      isViewed: false,
      isContinue: true
    });
  };

  const imageUrl = props.variant?.images[0]?.product_url || `${process.env.NEXT_PUBLIC_ASSET_HOST}/images/default-image.jpg`;

  return (
    <ProductAddedWrapper>
      <HeadingWrapper>
        <GreenCheckMarkIcon />
        <Heading element="h2" like="dec-7">
          Added to Shopping Bag!
        </Heading>
      </HeadingWrapper>

      <Card>
        <Image
          ref={imageRef}
          src={imageUrl}
          alt={props.variant?.name}
          onError={handleOnImageError}
        />

        <InfoWrapper>
          <BrandInfo element="p" like="dec-1">
            {props.brand}
          </BrandInfo>
          <TitleInfo element="p" like="dec-5">
            {props.variant?.name}
          </TitleInfo>
        </InfoWrapper>
        <PriceWrapper>
          <Price element="p" like="dec-1">{ formatMoney(props.variant?.price, { precision: 2 }) }</Price>
        </PriceWrapper>
      </Card>
      <>
        <CTA type="button" onClick={openCart}>
          <CTAText element="span" like="dec-5">
            View shopping bag
            {props.quantity > 1 && `${' '}(${props.quantity})`}
          </CTAText>
        </CTA>
        <CTA outline type="button" onClick={closeModal}>
          <CTAText element="span" like="dec-5"> Continue shopping </CTAText>
        </CTA>
      </>
    </ProductAddedWrapper>
  );
};

ProductAddedConfirmation.defaultProps = {
  variant: null,
  brand: '',
  product: {},
  quantity: null,
  closeModal: () => {},
  toggleCart: () => {}
};

ProductAddedConfirmation.propTypes = {
  variant: PropTypes.object,
  brand: PropTypes.string,
  quantity: PropTypes.string,
  closeModal: PropTypes.func,
  toggleCart: PropTypes.func,
  product: PropTypes.object
};

export default ProductAddedConfirmation;
