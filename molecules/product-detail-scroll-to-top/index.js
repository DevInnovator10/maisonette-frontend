import React, { memo } from 'react';
import styled from '@emotion/styled';

const ArrowSign = styled.div`
  margin-right: 1.5rem;
  display:inline-block;
  width: 10.5px;
  height: 10.5px;
  border: solid ${({ theme }) => theme.color.bluePrimary};
  border-width: 2px 0px 0px 2px;
  display: inline-block;
  transform: rotate(45deg);
`;

const ButtonWrapper = styled.div`
  background: rgba(47, 77, 161, 0.05);
  border-top: 1px solid ${({ theme }) => theme.color.bluePrimary};
  color: ${({ theme }) => theme.color.bluePrimary};
  font-size: 20px;

  font-family: ${({ theme }) => theme.font.sans};
  padding: 1.3rem 0.5rem;
  text-align: center;
  transition: bottom ${({ theme }) => theme.animation.fast} ${({ theme }) => theme.animation.easeInQuad};

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: none;
  }
`;

const ProductDetailScrollToTop = () => (
  <ButtonWrapper onClick={() => global.window.scrollTo({ top: 0, behavior: 'smooth' })}>
    To top
    {' '}
    <ArrowSign />
  </ButtonWrapper>
);

export default memo(ProductDetailScrollToTop);
