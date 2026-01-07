/* eslint-disable no-underscore-dangle */
import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { connectHitInsights } from 'react-instantsearch-dom';

import FastlyPicture from '../../atoms/fastly-picture';
import Button from '../../atoms/button';
import Price, { PriceSale } from './product-card-price';
import QuickShop from './product-card-quickshop';
import WishlistButton, { WishlistShareButton } from './product-card-wishlist';

import { aa } from '../../utils/algolia';
import { useSearch } from '../../utils/context/search-provider';
import { logAmplitude } from '../../utils/amplitude';
import parseSlugFromProductUrl from '../../utils/parseSlugFromProductUrl';
import handleOnImageError from '../../utils/handleOnImageError';
import { addProductToShareableList, removeProductFromShareableList } from '../../store/modules/lists/actions';

const FASTLY_ON = process.env.NEXT_PUBLIC_FASTLY_ON === 'true';

const CardPrice = styled(Price)`
  width: 100%;
  justify-content: flex-start;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: ${({ theme }) => theme.modularScale.thirteen};
  font-weight: 400;
  margin-top: 0.4rem;
  > ${PriceSale} {
    justify-content: flex-start;
    margin-right: 0.8rem;
  };
  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    font-size: ${({ theme }) => theme.modularScale.fourteen};
  }
`;

const Wishlist = styled(WishlistButton)``;

const CardTitle = styled.h2(() => ({
  lineHeight: 1.4,
  marginBottom: '0.4rem',
  width: '100%',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden'
}));

const CardBrand = styled.h2(() => ({
  lineHeight: 1.1,
  marginBottom: '0.4rem',
  textTransform: 'uppercase',
  width: '100%',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden'
}));

const CardBadges = styled.ul(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
  listStyleType: 'disc',
  fontSize: '1.2rem',
  lineHeight: '1.4rem',
  gridGap: '0.8rem'
}));

const Badge = styled.li(() => ({
  paddingRight: '0.8rem',
  ':first-child': {
    listStyleType: 'none'
  }
}));

const Image = styled.img`
  left: 0;
  max-width: 100%;
  opacity: 1;
  position: absolute;
  top: 0;
  width: 100%;
`;

const FILTERED_IMGWRAP_EMO_PROPS = new Set(['FASTLY_ON', 'showQuickstop']);
const FILTERED_CARD_EMO_PROPS = new Set(['isShareableActive', 'checked']);

const ImageWrapper = styled('figure', {
  shouldForwardProp: (prop) => !FILTERED_IMGWRAP_EMO_PROPS.has(prop)
})`
  margin-bottom: ${({ showQuickShop }) => (showQuickShop ? '3rem' : 0)};
  overflow: hidden;
  padding-top: 100%;
  position: relative;
  text-align: center;

  ${FASTLY_ON ? 'picture' : Image} + ${FASTLY_ON ? 'picture' : Image} {
    opacity: 0;
    pointer-events: none;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    ${(props) => (
    props.hasSideImage
      ? css`
          ${FASTLY_ON ? 'picture' : Image} {
            transition: opacity ${props.theme.animation.slow} ${props.theme.animation.easeOutQuad};
          }
          :hover {
            ${FASTLY_ON ? 'picture' : Image} {
              opacity: 0;

              + ${FASTLY_ON ? 'picture' : Image} {
                opacity: 1;
              }
            }
          }
        ` : ''
  )}
  }


  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    margin-bottom: ${({ showQuickShop }) => (showQuickShop ? '4rem' : 0)};
  }
`;

const QuickShopButton = styled(Button)(({ theme }) => ({
  margin: '0.5rem auto 0 auto',
  display: 'none',
  height: '3rem',
  lineHeight: 'calc(3rem - 6px)',
  opacity: 0,
  transition: `opacity ${theme.animation.slow} ${theme.animation.easeOutQuad}`,
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    display: 'flex'
  }
}));

const CardAnchor = styled.a`
  text-decoration: none;
`;

const Card = styled('article', {
  shouldForwardProp: (prop) => !FILTERED_CARD_EMO_PROPS.has(prop)
})(({ isShareableActive, checked, theme }) => ({
  border:
    !isShareableActive || !checked
      ? `1px solid ${theme.color.brandBorder}`
      : `2px solid ${theme.color.bluePrimary}`,
  position: 'relative',
  cursor: 'pointer',
  padding: !isShareableActive ? '3.2rem 2.25rem' : '0.8rem',
  header: {
    alignItems: 'center',
    color: theme.color.bluePrimary,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.font.sans,
    fontSize: theme.modularScale.thirteen,
    fontWeight: 400,
    letterSpacing: 0.5,
    marginBottom: '1.6rem',
    marginTop: '1.6rem',
    textAlign: 'left',
    [CardBrand]: { order: 1 },
    [CardTitle]: { order: 2 },
    [CardPrice]: { order: 3 }
  },
  '&.--pulse': {
    animation: `${theme.animations.pulse} ${theme.animation.default}`
  },
  '> a': {
    display: 'block',
    textDecoration: 'none'
  },
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    border:
      ((isShareableActive && !checked) && '1px solid #CDCBE7')
      || ((isShareableActive && checked) && `2px solid ${theme.color.bluePrimary}`)
      || (isShareableActive && '1px solid #CDCBE7')
      || 'none',
    padding: '1.6rem',
    header: {
      fontSize: theme.modularScale.fourteen,
      letterSpacing: '0.1rem',
      lineHeight: '1.5rem'
    },
    ':hover': {
      '> a > button': { opacity: 1 },
      [Wishlist]: { opacity: 1 },
      [QuickShopButton]: { opacity: 1 }
    }
  }
}));

const ProductCard = ({
  hit,
  idx,
  removeLoadingState,
  hitPageNumber,
  pageSlug,
  activeQuickShopID,
  setActiveQuickshopID,
  isWishlistEnabled,
  insights,
  sponsored
}) => {
  const ref = useRef();
  const router = useRouter();
  const dispatch = useDispatch();
  const [wishedProductsToShareStatus, wishedProductsToShare] = useSelector((state) => [
    state.lists.wishedProductsToShareStatus,
    state.lists.wishedProductsToShare
  ]);
  const { updateAlgoliaSearchParams, updateScrollPage, updateScrollSlug } = useSearch();
  const isProductShared = wishedProductsToShare.some((objectID) => hit.objectID === objectID);
  const isShareableActive = wishedProductsToShareStatus;

  const calculateQuickshopPosition = () => hit.__position - (24 * (hitPageNumber - 1));

  const handleShareProduct = (productId) => {
    /** There is a list in store called wishedProductsToShare
     * (list of the products to be copied as a link). In onClick event on the Card
     * is checked if the product there is in this list. If exists, so the Product will be removed
     * and unchecked, in another case will be added in the list and checked. isProductShared
     * is a variable that returns this verification on line 236.
     */
    if (isProductShared) {
      return dispatch(removeProductFromShareableList(productId));
    }
    return dispatch(addProductToShareableList(productId));
  };

  const onCardClick = (e) => {
    if (isShareableActive) {
      e.preventDefault();
      e.stopPropagation();
      return handleShareProduct(hit.objectID);
    }
    const params = {
      eventName: 'Product Clicked',
      objectID: hit.objectID,
      position: hit.__position,
      queryID: hit.__queryID
    };
    const { objectID, queryID } = params;
    const { target } = e;
    const isQuickShopButton = target.dataset.id === 'quickshop';

    updateAlgoliaSearchParams({ objectID, queryID });
    insights('clickedObjectIDsAfterSearch', params);

    const eventProps = {
      product: {
        ...hit,
        category: hit.product_type?.[0],
        sku: hit.manufacturer_id
      },
      index: hit.__position,
      module: 'plp'
    };

    if (isQuickShopButton) {
      e.preventDefault();
      logAmplitude('Clicked Product Quick View', eventProps);
      setActiveQuickshopID(+hit.objectID);
    } else {
      updateAlgoliaSearchParams({ objectID, queryID });
      insights('clickedObjectIDsAfterSearch', params);
      logAmplitude('Clicked Product Card', eventProps);

      // remove page query param  in case its value is 1
      const [path, queryParams] = pageSlug.split('?');
      const searchParams = new global.URLSearchParams(queryParams);
      if (searchParams.get('page') === '1') { searchParams.delete('page'); }

      const newQueryParams = searchParams.toString();
      const newPageSlug = newQueryParams === '' ? path : `${path}?${newQueryParams}`;

      // to store product & page slug for scroll restoration
      updateScrollPage(newPageSlug);
      updateScrollSlug(hit.slug);

      // in the case that the user clicked on a product
      // that is on a different page number from
      // the current page number in the URL,
      // push the correct page number slug
      // next.js's router to have the correct history
      // for scroll restoration
      if (!pageSlug.includes('/lists/wishlist/shared') && router.asPath !== pageSlug) {
        router.push(newPageSlug, undefined, { shallow: true });
      }

      router.push(`/product/${hit.slug}`);
    }
    return null;
  };

  const onQuickShopClose = () => {
    setActiveQuickshopID(-1);

    if (ref.current) {
      ref.current.scrollIntoView({ block: 'center' });
      ref.current.classList.add('--pulse');
      setTimeout(() => ref.current.classList.remove('--pulse'), 400);
    }
  };

  return (
    <>
      <Card
        data-test-id="plp-product-card"
        ref={ref}
        isShareableActive={isShareableActive}
        checked={isProductShared}
        onClick={onCardClick}
      >
        {router.asPath.includes('/lists/wishlist') && (
          <WishlistShareButton product={hit} />
        )}
        <Link href={parseSlugFromProductUrl(hit)} passHref>
          <CardAnchor data-productslug={hit.slug} onClick={onCardClick}>
            {FASTLY_ON ? (
              <ImageWrapper hasSideImage={hit.side_image}>
                <FastlyPicture
                  Image={Image}
                  src={
                    hit.image

                    || `${process.env.NEXT_PUBLIC_ASSET_HOST}/images/default-image.jpg`
                  }
                  alt={hit.title}
                  onLoad={() => {
                    if (idx === 0) removeLoadingState(hitPageNumber);
                  }}
                  onError={handleOnImageError}
                />

                {hit.side_image && (
                  <FastlyPicture
                    Image={Image}
                    src={hit.side_image}
                    alt={hit.title}
                    onError={handleOnImageError}
                  />
                )}
              </ImageWrapper>
            ) : (
              <ImageWrapper hasSideImage={hit.side_image}>
                <Image
                  src={
                    hit.image
                    || `${process.env.NEXT_PUBLIC_ASSET_HOST}/images/default-image.jpg`
                  }
                  alt={hit.title}
                  onLoad={() => {
                    if (idx === 0) removeLoadingState(hitPageNumber);
                  }}
                  onError={handleOnImageError}
                />

                {hit.side_image && (
                  <Image
                    src={hit.side_image}
                    alt={hit.title}
                    onError={handleOnImageError}
                  />
                )}
              </ImageWrapper>
            )}

            <QuickShopButton
              data-id="quickshop"
              aria-label={`open "${hit.title}", quick shop`}
              outline
            >
              Quick Shop
            </QuickShopButton>

            <header>
              <CardTitle>{hit.title}</CardTitle>
              {hit.brand && <CardBrand>{hit.brand}</CardBrand>}
              <CardPrice hit={hit} />
            </header>
            <CardBadges>
              <Badge>{sponsored ? 'Sponsored' : hit.trends?.[0]}</Badge>
            </CardBadges>
          </CardAnchor>
        </Link>
        {isWishlistEnabled && <Wishlist product={hit} />}
      </Card>

      {activeQuickShopID === +hit.objectID && (
        <QuickShop
          slug={hit.slug}
          onQuickShopClose={onQuickShopClose}
          position={hit.__position}
          quickshopPosition={calculateQuickshopPosition()}
          insights={insights}
        />
      )}
    </>
  );
};

ProductCard.defaultProps = {
  isWishlistEnabled: true,
  idx: 0,
  removeLoadingState: () => { },
  sponsored: false
};

ProductCard.propTypes = {
  hit: PropTypes.object.isRequired,
  pageSlug: PropTypes.string.isRequired,
  isWishlistEnabled: PropTypes.bool,
  activeQuickShopID: PropTypes.number.isRequired,
  setActiveQuickshopID: PropTypes.func.isRequired,
  insights: PropTypes.func.isRequired,
  hitPageNumber: PropTypes.number.isRequired,
  idx: PropTypes.number,
  removeLoadingState: PropTypes.func,
  sponsored: PropTypes.bool
};

export default connectHitInsights(aa)(ProductCard);
