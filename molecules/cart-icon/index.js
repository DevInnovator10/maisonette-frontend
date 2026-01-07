import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Button from '../../atoms/button';
import IconCart from '../../atoms/icon-cart';
import Typography from '../../atoms/typography';

const CartButton = styled(Button, { shouldForwardProp: (prop) => prop !== 'count' })`
  align-items: center;
  background-color: ${(props) => (props.count > 0 ? props.theme.color.brand : props.theme.color.backgroundLight)};
  border: 0;
  display: flex;
  height: 3.2rem;
  justify-content: center;
  letter-spacing: initial;
  line-height: 1;
  min-width: 4.4rem;
  outline: none;
  margin-right: ${(props) => (props.count > 0 ? '1rem' : '0')};
  width: auto;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    padding-left: 1rem;
    padding-right: 1rem;
    margin-right: 0;
  }

  span {
    display: block;
    min-width: 1.2rem;
    text-align: center;
  }

  svg {
    stroke: ${(props) => (props.count > 0 ? props.theme.color.white : props.theme.color.brand)};
    fill: transparent;
    stroke-width: 2px;
    width: 2rem;
    height: 2rem;
  }

  &.--wiggle {
    animation: ${({ theme }) => theme.animations.wiggle} ${({ theme }) => theme.animation.default};
  }
`;

const Icon = styled(IconCart)`

  font-style: italic;
  font-size: ${(props) => props.theme.modularScale.base};
`;

const CartIcon = (props) => {
  const cartRef = useRef();

  useEffect(() => {
    if (props.count > 0) {
      const elem = cartRef.current.buttonRef;

      elem.classList.add('--wiggle');

      setTimeout(() => {
        elem.classList.remove('--wiggle');
      }, 1000);
    }
  }, [props.count]);

  return (
    <CartButton
      {...props}
      ref={cartRef}
      count={props.count ?? undefined}
      inverted={props.count === 0}
      isIcon
    >
      <Icon />
      {props.count > 0
        ? <Typography element="span" like="dec-1">{props.count}</Typography>
        : ''}
    </CartButton>
  );
};

CartIcon.propTypes = {
  count: PropTypes.number.isRequired
};

CartIcon.whyDidYouRender = true;

export default CartIcon;
