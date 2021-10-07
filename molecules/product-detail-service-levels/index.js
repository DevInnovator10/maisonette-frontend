import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Link from '../../utils/link';

import Typography from '../../atoms/typography';

const Line = styled.hr`
  border: 0;
  border-top: 1px solid ${(props) => props.theme.color.bluePrimary};
  opacity: 0.25;
  display: block;
  height: 1px;
  margin: 1.5rem 0;
  padding: 0;

  @media (max-width: ${({ theme }) => theme.breakpoint.medium}) {
    margin: 1.5rem -3rem;
  }
`;

const ProductServiceLevelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const ServiceLevelDescription = styled.dl`
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 16px;
`;

const ServiceText = styled(Typography)`
  color: ${({ theme }) => theme.color.bluePrimary};
`;

const Anchor = styled.a`
  letter-spacing: 0;
`;

const ServiceLevelCallout = ({
  text,
  anchorText,
  url
}) => (
  <ServiceLevelDescription>
    <ServiceText element="dt" like="dec-4">
      {text}
    </ServiceText>

    <ServiceText element="dd" like="dec-4">
      <Link href={url} passHref>
        <Anchor>{anchorText}</Anchor>
      </Link>
    </ServiceText>
  </ServiceLevelDescription>
);

ServiceLevelCallout.propTypes = {
  text: PropTypes.string.isRequired,
  anchorText: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

const ProductServiceLevel = ({ finalSale }) => (
  <ProductServiceLevelWrapper>

    {!finalSale && (
    <>
      <Line />
      <ServiceLevelCallout
        text={'Free 30 Day Returns'}
        anchorText={'Learn more'}
        url={'/returns-guide'}
      />
    </>
    )}

    <Line />

    <ServiceLevelCallout
      text={'What is Maisonette?'}
      anchorText={'About us'}
      url={'/about'}
    />

    <Line />

    <ServiceLevelCallout
      text={'Get in Touch'}
      anchorText={'Customer Care'}
      url={'/contact'}
    />

    <Line />
  </ProductServiceLevelWrapper>
);

ProductServiceLevel.defaultProps = {
  finalSale: false
};

ProductServiceLevel.propTypes = {
  finalSale: PropTypes.bool
};

export default ProductServiceLevel;
