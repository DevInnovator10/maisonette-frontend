import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Typography from '../../atoms/typography';
import { trackProductClick } from '../../utils/tracking';

const Wrapper = styled.div`

  &.bold {
    font-weight: 800;
  }

  &.spaced {
    padding: ${(props) => props.theme.modularScale.medium} 0 0;
  }
`;

const Brand = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  font-style: italic;
`;

const Name = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
`;

const Price = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
`;

const ThreeWaysProduct = (props) => {
  const [classNames, setClassNames] = useState(false);

  useEffect(() => {
    setClassNames(`${props.bold ? 'bold' : false} ${props.spaced ? 'spaced' : false}`);
  }, []);

  const handleOnProductClick = () => {
    trackProductClick({
      product: props.product,
      position: props.index,
      list: 'three_ways'
    });
  };

  return (
    <Wrapper className={classNames} onClick={handleOnProductClick}>
      <Brand element="p" like="paragraph-2">{ props.master?.brand }</Brand>
      <Name element="p" like="paragraph-2">{ props.product?.title }</Name>
      <Price element="p" like="dec-1">{ props.product?.price_quickview }</Price>
    </Wrapper>
  );
};

ThreeWaysProduct.defaultProps = {
  bold: false,
  spaced: false
};

ThreeWaysProduct.propTypes = {
  index: PropTypes.number.isRequired,
  product: PropTypes.object.isRequired,
  master: PropTypes.object.isRequired,
  bold: PropTypes.bool,
  spaced: PropTypes.bool
};

ThreeWaysProduct.whyDidYouRender = true;

export default ThreeWaysProduct;
