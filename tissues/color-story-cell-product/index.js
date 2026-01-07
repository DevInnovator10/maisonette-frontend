import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import ProductCard from '../product-card';

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  justify-content: center;
  padding: ${(props) => props.theme.modularScale.xlarge} ${(props) => props.theme.modularScale.large};
  text-align: center;
  width: 100%;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    width: 33.3333%;
  }

  a {
    text-decoration: none;
  }

  > article {
    width: 100%;
  }
`;

const ColorStoryCellProduct = (props) => {
  const [product] = useState(Object.values(props.data)[1]);

  return product ? (
    <Wrapper>
      {

        product && (
          <ProductCard product={product} showQuickShop={false} index={props.data.index} module="color_story" />
        )
       }
    </Wrapper>
  ) : null;
};

ColorStoryCellProduct.propTypes = {
  data: PropTypes.object.isRequired
};

ColorStoryCellProduct.whyDidYouRender = true;

export default ColorStoryCellProduct;
