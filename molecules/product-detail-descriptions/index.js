import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Typography from '../../atoms/typography';
import ProductPropertyTab from '../product-detail-accordion';

const ParagraphText = styled(Typography)`
    strong {
    font-weight: bold ;
  }

  ul {
    list-style-type: disc;
    margin: 1rem 0 0 1.75rem;
  }
`;

const Descriptions = styled.div`
  color: ${(props) => props.theme.color.brand};
  line-height: 1.5;

  ${ParagraphText} + ${ParagraphText} {
    margin-top: 1.5rem;
  }
`;

const ProductDescriptions = (props) => (
  <ProductPropertyTab title="Description" product={props.product} isDescription>
    <Descriptions className={props.className}>
      <ParagraphText
        element="p"
        like="dec-4"
        dangerouslySetInnerHTML={{ __html: props.description }}
      />

      {
        props.brandDescription && (
          <ParagraphText element="p" like="dec-4">
            {`About ${props.brand}: ${props.brandDescription}`}
          </ParagraphText>
        )
      }

      {props.finalSale && <ParagraphText element="p" like="dec-4">Final sale - no returns.</ParagraphText>}
    </Descriptions>
  </ProductPropertyTab>

);

ProductDescriptions.defaultProps = {
  brand: '',
  description: '',
  className: '',
  brandDescription: '',
  finalSale: false
};

ProductDescriptions.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,
  brand: PropTypes.string,
  brandDescription: PropTypes.string,
  product: PropTypes.object.isRequired,
  finalSale: PropTypes.bool
};

export default ProductDescriptions;
