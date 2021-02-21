import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Price from '../../organisms/algolia-plp/product-card-price';
import Typography from '../../atoms/typography';

const StyledContainer = styled.header`
  align-items: center;
  color: ${(props) => props.theme.color.brand};
  display: flex;
  flex-direction: column;
  line-height: 2.2rem;
  text-align: center;
  line-height: 2.2rem;
`;

const BrandWrapper = styled(Typography)`
  color: #5971B4;
  order: 1;
`;

const NameWrapper = styled(Typography)`
  order: 2;
`;

const ProductTitle = (props) => (
  <StyledContainer product={props.product}>
    <NameWrapper element="h2" like="paragraph-2">{props.product.title}</NameWrapper>
    <BrandWrapper element="h3" like="paragraph-2">{props.product.brand}</BrandWrapper>
    <Price hit={props.product} css={{ order: '3', marginTop: '3px' }} />
  </StyledContainer>
);

ProductTitle.propTypes = {
  product: PropTypes.object.isRequired
};

ProductTitle.whyDidYouRender = true;

export default ProductTitle;
