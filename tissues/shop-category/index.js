import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Link from '../../utils/link';
import Typography from '../../atoms/typography';
import Picture from '../../atoms/picture';
import IconCircleArrow from '../../atoms/icon-circle-arrow';

const Wrapper = styled.section`
  padding: ${(props) => props.theme.modularScale['3xlarge']} ${(props) => props.theme.modularScale.large};
  text-align: center;
`;

const Title = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: 1em;
`;

const Products = styled.ul`
  align-items: start;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Product = styled.li`
  flex: 0 0 auto;
  padding: ${(props) => props.theme.modularScale.large};
  width: 100%;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    width: 25%;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    width: ${100 / 7}%;
  }

  a {
    align-items: center;
    display: flex;
    flex-direction: column;
    text-decoration: none;
  }
`;

const ProductImage = styled(Picture)`
  margin-bottom: ${(props) => props.theme.modularScale.medium};

  img {
    max-width: 100%;
  }
`;

const ProductName = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  margin-bottom: 1em;
`;

const ProductArrowIcon = styled(IconCircleArrow)`
  height: 2.7rem;
  margin-bottom: ${(props) => props.theme.modularScale.small};
  width: 2.7rem;

  circle,
  path {
    fill: none;
    stroke: ${(props) => props.theme.color.brand};
    stroke-width: 4;
    transform: translate3d(0, 0, 0);

  }

  :focus,
  :hover:not(:disabled) {
    path {
      animation: arrow-head;
      animation-duration: ${(props) => props.theme.animation.slow};
      animation-timing-function: ${(props) => props.theme.animation.easeMove};
      animation-delay: 0s;
      animation-iteration-count: 1;
      animation-direction: normal;
      animation-fill-mode: forwards;
      animation-play-state: running;
    }
  }
`;

const ShopCategory = (props) => (
  <Wrapper>
    <Title element="h1" like="heading-3">{ props.data.category_taxon_shop_heading }</Title>
    {
      props.data.category_taxon_shop_elements ? (
        <Products>
          {
          Object.values(props.data.category_taxon_shop_elements).map((product, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Product key={`shop-category-item-${index}`}>
              <Link href={product.category_taxon_shop_taxon_path} passHref>
                <a>
                  {product?.category_taxon_shop_element_icon
                    && <ProductImage {...product.category_taxon_shop_element_icon} />}
                  <ProductName element="p" like="paragraph-4">
                    { product.category_taxon_shop_taxon_cta }
                  </ProductName>
                  <ProductArrowIcon />
                </a>
              </Link>
            </Product>
          ))
        }
        </Products>
      ) : null
    }
  </Wrapper>
);

ShopCategory.propTypes = {
  data: PropTypes.object.isRequired
};

export default ShopCategory;
