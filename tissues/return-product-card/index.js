import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { formatMoney } from 'accounting-js';

import handleOnImageError from '../../utils/handleOnImageError';
import Typography from '../../atoms/typography';
import CartProductTitle from '../../molecules/cart-product-title';

const Card = styled.div`
  border-top: 1px solid ${(props) => props.theme.color.brandLight};
  display: grid;
  grid-template-areas: "image info price";
  grid-template-columns: auto 1fr auto;
  padding: ${(props) => props.theme.modularScale.base} 0;

  &:first-of-type {
    border-top: 0 none;
  }
`;

const Image = styled.img`
  display: block;
  grid-area: image;
  height: 6.5rem;
  width: 6.5rem;
`;

const InfoWrapper = styled.div`
  grid-area: info;
  padding: 0 ${(props) => props.theme.modularScale.base};
`;

const Text = styled(Typography)`
  color: ${(props) => props.theme.color.brandLight};

  > span {
    color: ${(props) => props.theme.color.brand};
  }
`;

const Info = styled.span`
  display: flex;
  flex-direction: row;

  ${Text}:first-of-type {
    margin-right: 1.5rem;
  }
`;

const Price = styled(Typography)`
  color: ${(props) => props.theme.color.brandLight};
  grid-area: price;
`;

const ReturnProductCard = (props) => (
  <Card className={props.className}>
    <Image src={props.image} alt={props.title?.name} onError={handleOnImageError} />

    <InfoWrapper>
      <CartProductTitle brand={props.brand} product={props.title} />

      <Info>
        <Text element="p" like="dec-1">
          {props.optionType}
          {': '}
          {props.option}
        </Text>
      </Info>
    </InfoWrapper>

    <Price element="p" like="dec-1">{formatMoney(props.price, { precision: 2 })}</Price>
  </Card>
);

ReturnProductCard.defaultProps = {
  brand: null,
  className: '',
  image: '',
  option: '',
  optionType: ''
};

ReturnProductCard.propTypes = {
  brand: PropTypes.object,
  className: PropTypes.string,
  image: PropTypes.string,
  option: PropTypes.string,
  optionType: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.object.isRequired
};

ReturnProductCard.whyDidYouRender = true;

export default ReturnProductCard;
