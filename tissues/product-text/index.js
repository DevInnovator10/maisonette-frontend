import React from 'react';

import ProductText from '../../molecules/product-text';
import Ruler from '../../atoms/ruler';

const ProductTextCMS = (props) => props.data?.product_elements
&& (
  <>
    <ProductText products={props.data.product_elements} />
    { props.data?.product_elements_hr && <Ruler /> }
  </>
);

ProductTextCMS.whyDidYouRender = true;

export default ProductTextCMS;
