import React, { useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/node';
import { useSelector } from 'react-redux';
import { css } from '@emotion/core';

import IconClose from '../../atoms/icon-close';
import Typography from '../../atoms/typography';
import InputText from '../../atoms/input-text';
import Button from '../../atoms/button';
import { logAmplitude } from '../../utils/amplitude';
import copyToClipboard from '../../utils/copyToClipboard';

const FILTERED_COPY_LINK_BUTTON_PROPS = new Set(['displayOpacity', 'linkCopied']);

const ProductShareWrapper = styled.div`
    padding: 0.6rem 1.6rem 3.2rem 1.6rem;
`;

const CopyLinkButton = styled(Button, {
  shouldForwardProp: (prop) => !FILTERED_COPY_LINK_BUTTON_PROPS.has(prop)
})`
  font-family: ${({ theme }) => theme.font.sans};
  font-size: ${({ theme }) => theme.modularScale.fourteen};
  outline: 0;
  padding: inherit;
  text-transform: none;
  letter-spacing: 0;
  transition: background-color 0.8s, border-color 0.8s;
  ${({ linkCopied, theme }) => linkCopied && css`
    background-color: ${theme.color.brandGreen};
    border-color: ${theme.color.brandGreen};
  `};

  ${({ displayOpacity }) =>
    displayOpacity
    && css`
      :hover {
        opacity: 1;
      }
    `}
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 1.6rem;
  border-bottom: 1px solid ${({ theme }) => theme.color.brandBorder};
`;

const ShareWishlistItemsHeaderText = styled(Typography)`
  color: ${(props) => props.theme.color.bluePrimary};
  line-height: 3.2rem;
  font-weight: 400;
`;

const DescriptionText = styled(ShareWishlistItemsHeaderText)`
  line-height: 2.2rem;
  margin-top: 2.4rem;
  overflow-wrap: break-word;
  @media (max-width: ${({ theme }) => theme.breakpoint.small}) {
    inline-size: 250px;
  }
`;

const CopyLinkText = styled(DescriptionText)`
  margin-bottom: 0.8rem;
`;

const CopyLinkInputText = styled(InputText)`
  height: auto;
  text-overflow: ellipsis;
  pointer-events: none;
`;

const CloseButton = styled.button`
  padding: 0;
  border: 0;
  background: none;
  box-shadow: none;
`;

const FooterWrapper = styled.div`
  display: grid;
  grid-template-columns: 60% 40%;
  grid-gap: 0.8rem;
  overflow: hidden;
`;

const ProductShareConfirmation = ({ onClose }) => {
  const wishedProductsToShare = useSelector((state) => state.lists.wishedProductsToShare);
  const [linkCopied, setLinkCopied] = useState(false);
  const shareableProductsAmount = wishedProductsToShare.length;
  const shareableList = wishedProductsToShare.toString();
  const { window: { btoa } } = global;
  const headerText = shareableProductsAmount > 1 ? `Share wishlist (${shareableProductsAmount} items)` : `Share wishlist (${shareableProductsAmount} item)`;
  const inputValue = `${process.env.NEXT_PUBLIC_CLIENT_HOST}/lists/wishlist/shared/?wl=${btoa(encodeURIComponent(shareableList))}`;

  const handleCopy = async () => {
    try {
      copyToClipboard(
        inputValue,
        'Link Copied Succesfully!',
        'An error has occurred to copy the link'
      );
      logAmplitude('Share Wishlist', { position: 'Wishlist', totalWishlistSize: shareableProductsAmount, url: inputValue });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      Sentry.captureException(error);
      onClose();
    } finally {
      setLinkCopied((prevStatus) => !prevStatus);
    }
  };

  return (
    <ProductShareWrapper>
      <HeaderWrapper>
        <ShareWishlistItemsHeaderText element="p" like="dec-6">
          {headerText}
        </ShareWishlistItemsHeaderText>
        <CloseButton onClick={onClose}>
          <IconClose />
        </CloseButton>
      </HeaderWrapper>
      <DescriptionText element="p" like="dec-4">
        Anyone with this link will be able to view your list.
      </DescriptionText>
      <CopyLinkText element="p" like="dec-4">
        Copy link to share with others
      </CopyLinkText>
      <FooterWrapper>
        <CopyLinkInputText
          id="wished-products-link-to-share"
          type="text"
          value={inputValue}
          revamp
          readOnly
        />
        <CopyLinkButton
          displayOpacity
          linkCopied={linkCopied}
          data-test-id="copy_shareable_wishlist_link"
          id="copy-shareable-wishlist-link-button"
          onClick={handleCopy}
        >
          {!linkCopied ? 'Copy Link' : 'Copied!'}
        </CopyLinkButton>
      </FooterWrapper>
    </ProductShareWrapper>
  );
};

ProductShareConfirmation.propTypes = {
  onClose: PropTypes.func.isRequired
};

ProductShareConfirmation.whyDidYouRender = true;

export default ProductShareConfirmation;
