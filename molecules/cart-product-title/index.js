import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Link from '../../utils/link';

import Typography from '../../atoms/typography';

const Brand = styled(Typography, { shouldForwardProp: (prop) => prop !== 'newcheckout' })`
    color: #5971B4;
  display: inline-block;
  line-height: 2rem;
  text-decoration: none;

  ${({ newcheckout, theme }) => newcheckout && css`
    font-size: 1.6rem;
    font-family: ${theme.font.sans};
    font-style: normal;
  `};
`;

const Product = styled(Typography, { shouldForwardProp: (prop) => prop !== 'newcheckout' })`
  color: ${({ theme }) => theme.color.brand};
  display: inline-block;
  line-height: 1.5;
  text-decoration: none;

  ${({ newcheckout, theme }) => newcheckout && css`
    font-size: 1.6rem;
    font-family: ${theme.font.sans};
`};
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;

  > a {
    align-self: flex-start;
  }
`;

const CartProductTitle = (props) => (
  <Title {...props} data-test-id="order-product-title" className={props.className}>
    {
      props.brand.name && props.brand.permalink && (
        <Link href={props.brand.permalink} passHref>
          <Brand newcheckout={props.isNewCheckout ? 'true' : undefined} element="a" like="paragraph-3">{props.brand.name}</Brand>
        </Link>
      )
    }

    <Link href={props.product.permalink} passHref>
      <Product newcheckout={props.isNewCheckout ? 'true' : undefined} element="a" like="paragraph-3">{props.product.name}</Product>
    </Link>
  </Title>
);

CartProductTitle.defaultProps = {
  brand: false,
  className: '',
  isNewCheckout: false
};

CartProductTitle.propTypes = {
  className: PropTypes.string,
  isNewCheckout: PropTypes.bool,
  brand: PropTypes.shape({
    name: PropTypes.string,
    permalink: PropTypes.string
  }),
  product: PropTypes.shape({
    name: PropTypes.string,
    permalink: PropTypes.string
  }).isRequired
};

export default CartProductTitle;
