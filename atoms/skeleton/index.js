import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';

export const skeleton = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0;}
`;

export const Skeleton = styled.span`
  display: block;
  width: 100%;
  height: auto;
  background-image: linear-gradient(270deg, #fafafa, #eaeaea, #eaeaea, #fafafa);
  background-size: 400% 100%;
  animation: ${() => skeleton} 8s ease-in-out infinite;
`;

export const SkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
