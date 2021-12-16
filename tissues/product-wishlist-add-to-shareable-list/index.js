import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Button from '../../atoms/button';
import Typography from '../../atoms/typography';

import { updateShareableListStatus, updateShareableList, shareWishedProducts } from '../../store/modules/lists/actions';

const ChooseProductsButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'displayOpacity'
})`
  font-family: ${(props) => props.theme.font.sans};
  font-size: ${(props) => props.theme.modularScale.fourteen};
  height: 45px;
  padding: 0 0.8rem;
  outline: 0;
  text-transform: none;
  letter-spacing: 0;

  ${({ displayOpacity }) =>
    displayOpacity
    && css`
      :hover {
        opacity: 1;
      }
    `}
`;

const ShareProductsButton = styled(ChooseProductsButton)``;

const CancelButton = styled(ChooseProductsButton)`
  border: 1px solid ${({ theme }) => theme.color.brandBorder};
`;

const BadgeText = styled(Typography)`
  text-transform: uppercase;
  color: white;
`;

const NewBadge = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0.2rem 0.4rem 0rem;
  gap: 0.8rem;
  width: 3.5rem;
  background-color: ${(props) => props.theme.color.brandGreen};
  border-radius: 0.2rem;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

const ShareWishlistWrapper = styled.div`
  display: flex;

  margin: 2.2rem 0;
`;

const ShareWishlistText = styled(Typography)`
  color: ${(props) => props.theme.color.bluePrimary};
  margin-left: 0.4rem;
`;

const ShareWishlistTextDesktop = styled(Typography)`
  color: ${(props) => props.theme.color.bluePrimary};
  margin-left: 0;
  margin-top: 1rem;
`;

const ShareProductsWrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-gap: 0.8rem;
  width: 100%;
  animation: ${({ theme }) => css`${theme.animations.stickyAppear} ${theme.animation.fast}`};
`;

const ShareProductsDesktopWrapper = styled(ShareProductsWrapper)`
  display: grid;
  grid-template-columns: 20fr 5fr 10fr;
`;

const ChooseProductsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const FILTERED_STICKYMOBILE_EMO_PROPS = new Set([
  'isVisible',
  'notAvailable',
  'showWarningMsg',
  'isWishlistShareableActive'
]);

const StickyMobileProductAdd = styled('div', {
  shouldForwardProp: (prop) => !FILTERED_STICKYMOBILE_EMO_PROPS.has(prop)
})`
  position: fixed;
  left: 0;
  bottom: 0;
  padding: ${({ isWishlistShareableActive }) => (!isWishlistShareableActive ? '8px 8px 8px 16px' : '8px')};
  height: 61px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  box-shadow: 0px -2px 16px rgba(0, 0, 0, 0.1);
  z-index: ${(props) => props.theme.layers.downstage - 1};

  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    display: flex;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: none;
  }
`;

const StickyProductAdd = styled.div`
  position: fixed;
  bottom: 2.9rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.8rem 0.8rem 0.8rem 1.6rem;
  height: 61px;
  display: none;
  min-width: 437px;
  background-color: white;
  border: 1px solid ${({ theme }) => theme.color.brandBorder};
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.07);
  z-index: ${({ theme }) => theme.layers.downstage - 1};

  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    display: none;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: flex;
  }
`;

const StickyWishlistProducts = () => {
  const [scrollY, wishedProductsToShare, wishedProductsToShareStatus] = useSelector(
    (state) =>
      [
        state.products.scrollY,
        state.lists.wishedProductsToShare,
        state.lists.wishedProductsToShareStatus
      ]
  );
  const dispatch = useDispatch();
  const isWishlistShareableActive = wishedProductsToShareStatus;
  const shareableProductsAmount = wishedProductsToShare.length;
  const scrollToTop = () => global.window.scroll({ top: scrollY || 0, left: 0, behavior: 'smooth' });

  const handleChooseProducts = () => {
    scrollToTop();
    dispatch(updateShareableListStatus(true));
  };

  const handleCancelShareProducts = () => {
    scrollToTop();
    dispatch(updateShareableListStatus(false));
    dispatch(updateShareableList([]));
  };

  const handleShareProducts = () => {
    scrollToTop();
    if (wishedProductsToShare.length === 0) return;
    dispatch(shareWishedProducts(true));
  };

  const ChooseProducts = () => (
    <ChooseProductsWrapper>
      <ShareWishlistWrapper>
        <NewBadge>
          <BadgeText element="p" like="dec-1">
            New
          </BadgeText>
        </NewBadge>
        <ShareWishlistText element="p" like="dec-4">
          Share your wishlist
        </ShareWishlistText>
      </ShareWishlistWrapper>
      <ChooseProductsButton
        type="submit"
        displayOpacity
        data-test-id="enable_shareable_wishlist"
        id="sticky-enable-shareable-wishlist-button"
        onClick={handleChooseProducts}
      >
        Choose products
      </ChooseProductsButton>
    </ChooseProductsWrapper>
  );

  return (
    <>
      <StickyMobileProductAdd
        isWishlistShareableActive={isWishlistShareableActive}
      >
        {!isWishlistShareableActive ? <ChooseProducts /> : (
          <ShareProductsWrapper>
            <ShareProductsButton
              type="submit"
              displayOpacity
              data-test-id="enable_shareable_wishlist"
              id="sticky-enable-shareable-wishlist-button"
              onClick={handleShareProducts}
            >
              {`Share products (${shareableProductsAmount})`}
            </ShareProductsButton>
            <CancelButton
              type="submit"
              displayOpacity
              outline
              data-test-id="clear_shareable_wishlist"
              id="sticky-clear-shareable-wishlist-button"
              onClick={handleCancelShareProducts}
            >
            Cancel
            </CancelButton>
          </ShareProductsWrapper>
        )}
      </StickyMobileProductAdd>

      <StickyProductAdd>
        {!isWishlistShareableActive ? (
          <ChooseProducts />
        ) : (
          <ShareProductsDesktopWrapper>
            <ShareWishlistTextDesktop element="p" like="dec-4">
              {`You have selected ${shareableProductsAmount} ${
                shareableProductsAmount === 1 ? 'product' : 'products'
              }`}
            </ShareWishlistTextDesktop>
            <CancelButton
              type="submit"
              displayOpacity
              outline
              data-test-id="clear_shareable_wishlist"
              id="sticky-clear-shareable-wishlist-button"
              onClick={handleCancelShareProducts}
            >
              Deselect All
            </CancelButton>
            <ShareProductsButton
              type="submit"
              displayOpacity
              data-test-id="enable_shareable_wishlist"
              id="sticky-enable-shareable-wishlist-button"
              onClick={handleShareProducts}
            >
              {`Share products (${shareableProductsAmount})`}
            </ShareProductsButton>
          </ShareProductsDesktopWrapper>
        )}
      </StickyProductAdd>
    </>
  );
};

export default StickyWishlistProducts;
