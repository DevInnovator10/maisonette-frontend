import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import StickyBox from 'react-sticky-box';
import { SkeletonWrapper, Skeleton } from '../../atoms/skeleton';
import { SortByDesktop, items } from './sort-by';
import Categories, { attributes } from './hierarchical-menu';
import Refinements from './refinements';

const Facets = styled(StickyBox)(({ theme }) => ({
  alignSelf: 'flex-start',
  display: 'none',
  marginRight: '5rem',
  width: '25%',
  '> section': {
    marginBottom: '3.2rem'
  },
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    display: 'block'
  }
}));

const Wrapper = styled(SkeletonWrapper)(() => ({
  alignItems: 'center',
  display: 'flex',
  flexDirect: 'column',
  [Skeleton]: {
    '&:nth-of-type(1)': {
      marginBottom: '5rem',
      height: '8rem',
      width: '100%'
    },
    '&:nth-of-type(2)': {
      marginBottom: '5rem',
      height: '40rem',
      width: '100%'
    },
    '&:nth-of-type(3)': {
      marginBottom: '5rem',
      height: '30rem',
      width: '100%'
    }
  }
}));

export const RefinementsSkeleton = (props) => (
  <Facets offsetTop={200} as="aside">
    <Wrapper {...props}>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </Wrapper>
  </Facets>
);

const LeftRail = (props) => (
  <Facets offsetTop={200} as="aside" {...props}>

    <SortByDesktop
      defaultRefinement={process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX}
      items={items}
    />

    <Refinements isBrandRefined={props.isBrandRefined} isShop={props.isShop} />

    {
      !props.isEdit && (
      <span css={{ display: 'none' }}>
        <Categories attributes={attributes} />
      </span>
      )
    }

  </Facets>
);

LeftRail.defaultProps = {
  isBrandRefined: false,
  isShop: false,
  isEdit: false
};

LeftRail.propTypes = {
  isBrandRefined: PropTypes.bool,
  isShop: PropTypes.bool,
  isEdit: PropTypes.bool
};

export default LeftRail;
