import React from 'react';
import styled from '@emotion/styled';

import { SkeletonWrapper, Skeleton } from '../../atoms/skeleton';

const Wrapper = styled(SkeletonWrapper)(({ isLarge }) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirect: 'column',
  [Skeleton]: {
    '&:nth-of-type(1)': {
      marginBottom: '1rem',
      height: isLarge ? '90%' : '13rem',
      width: isLarge ? '90%' : '13rem',
      ...(isLarge && {
        '::before': {
          content: '""',
          display: 'block',
          paddingTop: '100%'
        }
      })
    },
    '&:nth-of-type(2)': {
      height: isLarge ? '2rem' : '1rem',
      marginBottom: '0.5rem',
      width: isLarge ? '60%' : '6.5rem'
    },
    '&:nth-of-type(3)': {
      height: isLarge ? '2rem' : '1.5rem',
      marginBottom: '0.5rem',
      width: isLarge ? '80%' : '11rem'
    },
    '&:nth-of-type(4)': {
      height: isLarge ? '2rem' : '1.5rem',
      marginBottom: '0.5rem',
      width: isLarge ? '80%' : '11rem'
    },
    '&:nth-of-type(5)': {
      height: isLarge ? '1.5rem' : '1rem',
      width: isLarge ? '40%' : '2.5rem'
    }
  }
}));

const ProductSkeleton = (props) => (
  <Wrapper {...props}>
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
  </Wrapper>
);

export default ProductSkeleton;
