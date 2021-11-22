import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Flag from 'react-flagkit';
import { formatMoney } from 'accounting-js';

import ProductPropertyTab from '../../molecules/product-detail-accordion';
import Typography from '../../atoms/typography';
import Radio from '../../atoms/radio';

const VendorList = styled.ul`
    color: ${({ theme }) => theme.color.darkBlue};
  margin: 1rem 3rem 1rem 3rem;

  @media screen and (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    margin-left: 1.75rem;
    margin-right: 1.75rem;
  }

`;

const Country = styled(Flag)`
  margin-left: 1rem;
  width: 4rem;
`;

const Variant = styled(Radio)`
  display: flex;
  color: ${({ theme }) => theme.color.darkBlue};

  ${Country} {
    margin: 0 0.5rem 0 -0.5rem;
    height: 2rem;
  }

  > span {
    font-size: ${({ theme }) => theme.modularScale.eighteen};
    white-space: pre;
  }
`;

const ParagraphText = styled(Typography)`
  margin: 1rem 3rem 0 3rem;
  line-height: 24px;
  color: ${({ theme }) => theme.color.darkBlue};

  @media screen and (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    margin-left: 1.75rem;
    margin-right: 1.75rem;
  }
`;

const ShippingFromRevamp = (props) => {
  const getVendorPrice = (vendor) => {
    const price = props.variant.prices.find((v) => v.vendor_id === vendor.vendor_id);
    return price ? price.price : 0;
  };

  if (!props.vendor || !props.variant) return null;

  return (
    <ProductPropertyTab title="Shipping From" product={props.product} revamp>
      <ParagraphText element="p" like="dec-4">
          We partner with the best boutiques from around the world,
          which means many of those boutiques might carry the same product.
          So we’ve automatically picked the lowest price based on your location,
          but feel free to change the selection above.

      </ParagraphText>
      <VendorList>
        {
          props.variant.stock_items
            .filter((stock) => stock.available)
            .map((vendor) => (
              <Variant
                key={vendor.id}
                active={props.vendor === vendor.vendor_id}
                id={`vendor-${vendor.vendor_id}`}
                name={`vendor-${vendor.vendor_id}`}
                changed={() => props.onVendorChange(vendor.vendor_id)}
                revamp
              >

                <Country country={vendor.country_iso} />
                <span>{`${vendor.stock_location_name}: `}</span>
                <span>{formatMoney(getVendorPrice(vendor))}</span>
              </Variant>
            ))
        }
      </VendorList>
    </ProductPropertyTab>
  );
};

ShippingFromRevamp.defaultProps = {
  variant: null,
  vendor: null
};

ShippingFromRevamp.propTypes = {
  product: PropTypes.object.isRequired,
  variant: PropTypes.object,
  vendor: PropTypes.number,
  onVendorChange: PropTypes.func.isRequired
};

export default ShippingFromRevamp;
