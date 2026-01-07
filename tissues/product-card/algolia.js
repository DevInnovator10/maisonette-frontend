import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { useRouter } from 'next/router';
import { InView } from 'react-intersection-observer';
import { toast, TOAST } from '../../utils/toastify';
import Link from '../../utils/link';

import FastlyPicture from '../../atoms/fastly-picture';
import Button from '../../atoms/button';
import IconButton from '../../molecules/icon-button';
import IconHeart from '../../atoms/icon-heart';
import ProductTitle from '../../molecules/product-card-title';
import ProductBadge from '../../molecules/product-badge';

import parseSlugFromProductUrl from '../../utils/parseSlugFromProductUrl';

import { createWishedProduct, deleteWishedProduct, logClickSLI } from '../../pages/api';
import {
    addProductToList,
  addProductToAlgoliaList,
  removeProductFromAlgoliaList,
  removeProductFromList
} from '../../store/modules/lists/actions';
import { updateProduct } from '../../store/modules/products/actions';

import trackEvent, { trackProductClick } from '../../utils/tracking';
import { logAmplitude } from '../../utils/amplitude';
import handleOnImageError from '../../utils/handleOnImageError';

const FASTLY_ON = process.env.NEXT_PUBLIC_FASTLY_ON === 'true';

const Heart = styled(IconHeart)`
  fill: ${(props) => props.theme.color.white};
  stroke: ${(props) => props.theme.color.brand};

  &.active {
    fill: ${(props) => props.theme.color.brand};
  }
`;

const WishlistMobile = styled(IconButton)`
  align-self: center;
  border: 0 none;
  height: 3rem;
  justify-content: center;
  line-height: 2.8rem;
  margin-top: .5rem;
  outline: 0;

  svg {
    height: 2.2rem;
    margin-right: 0.25rem;
    width: 2.2rem;
  }

  i {
    font-size: ${(props) => props.theme.modularScale.small};
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    display: none;
  }
`;

const Wishlist = styled.button`
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.65);
  border-radius: 100%;
  border: 0 none;
  cursor: pointer;
  display: none;
  height: 4rem;
  line-height: 1;
  margin: 0;
  opacity: 0;
  outline: 0;
  padding: 0;
  position: absolute;
  right: 1rem;
  top: 1rem;
  width: 4rem;
  transition: opacity ${(props) => props.theme.animation.slow} ${(props) => props.theme.animation.easeOutQuad},
    transform ${(props) => props.theme.animation.default} ${(props) => props.theme.animation.easeOutQuad};

  svg {
    transform: scale(0.75);
  }

  :hover {
    transform: scale(1.15);
  }

  :focus {
    opacity: 1;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    display: block;
  }
`;

const QuickShopButton = styled(Button)`
  bottom: .6rem;
  display: none;
  height: calc(3rem);
  left: 50%;
  line-height: 1;
  opacity: 0;
  outline: 0;
  position: absolute;
  transform: translateX(-50%);
  width: fit-content;
  transition: opacity ${(props) => props.theme.animation.slow} ${(props) => props.theme.animation.easeOutQuad},
    transform ${(props) => props.theme.animation.default} ${(props) => props.theme.animation.easeOutQuad};

  :focus {
    opacity: 1;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    display: block;
    max-width: 16rem;
    width: 100%;
  }
`;

const QuickshopButtonWrapper = styled.div`
  position: relative;
`;

const Image = styled.img`
  left: 0;
  max-width: 100%;
  opacity: 1;
  position: absolute;
  top: 0;
  width: 100%;
`;

const FILTERED_IMGWRAPPER_EMO_PROPS = new Set(['FASTLY_ON', 'showQuickShop']);

const ImageWrapper = styled('figure', {
  shouldForwardProp: (prop) => !FILTERED_IMGWRAPPER_EMO_PROPS.has(prop)
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

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    margin-bottom: ${({ showQuickShop }) => (showQuickShop ? '4rem' : 0)};
  }
`;

const CardAnchor = styled.a`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
  text-decoration: none;

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

  :hover, :focus {
    ${QuickShopButton}, ${Wishlist} {
      opacity: 1;
    }
  }
`;

const Card = styled.article`
  align-items: stretch;
  display: flex;
  flex-direction: column;

  &.--pulse {
    ${CardAnchor} {
      animation: ${({ theme }) => theme.animations.pulse} ${({ theme }) => theme.animation.default};
    }
  }
`;

const IntersectionObserverElement = styled.span`
  visibility: hidden;
`;

export const ProductCard = (props) => {
  const router = useRouter();

  const [wishlistActive, setWishlistActive] = useState(
    props.lists.wished_products.find((p) => p.variant_id === +props.product.objectID)
  );
  const [inWishlist, setInWishlist] = useState(
    (wishlistActive?.variant_id ?? 0) === parseInt(props.product.objectID, 10)
  );
  const [isWishlistDisabled, setIsWishlistDisabled] = useState(false);

  useEffect(() => {
    setWishlistActive(
      props.lists.wished_products.find((p) => p.variant_id === +props.product.objectID)
    );

    setInWishlist(
      (wishlistActive?.variant_id ?? 0) === parseInt(props.product.objectID, 10)
    );
  });

  const handleOnWishlistClick = (e) => {
    e.preventDefault();

    setIsWishlistDisabled(true);

    if (
      props.lists.wished_products
        .find((p) => p.variant_id === +props.product.objectID)
    ) {
      const { id } = props.lists.wished_products
        .find((p) => p.variant_id === +props.product.objectID);

      deleteWishedProduct({ id })
        .then(() => {
          props.removeProductFromList(id);
          props.removeProductFromAlgoliaList(String(id));
          setIsWishlistDisabled(false);
          // track when a product is removed from wishlist using amplitude
          logAmplitude('Removed from Wishlist', {
            productId: props.product?.objectID,
            productSku: props.product?.manufacturer_id,
            name: props.product?.title,
            badges: props.product?.trends,
            category: props.product?.product_type,
            brand: props.product?.brand
          });
        });
    } else {
      createWishedProduct({
        body: {
          wished_product: {
            variant_id: +props.product.objectID
          }
        }
      })
        .then((res) => {
          setIsWishlistDisabled(false);

          if (res.errors) {

            const hasAuthError = res?.errors?.find(({ code }) => code === 401);

            if (!props.token || hasAuthError) {
              toast(
                <p>
                  You must be
                  <a href="/login">signed in</a>
                  {' '}
                  to add a product to your wishlist
                </p>,
                { type: TOAST.TYPE.INFO }
              );
            } else if (res.errors.find(({ message }) => message?.includes('has already been taken'))) {
              toast('This product has already been added to your wishlist, please refresh the page for updates', { type: TOAST.TYPE.ERROR });
            } else {
              toast('Something went wrong, please try again later', { type: TOAST.TYPE.ERROR });
            }

            return;
          }

          const algoliaContent = {

            productId: props.product?.objectID,
            productSku: props.product?.manufacturer_id,
            name: props.product?.title,
            badges: props.product?.trends,
            category: props.product?.product_type,
            brand: props.product?.brand
          };

          props.addProductToList(res);
          props.addProductToAlgoliaList({ ...algoliaContent });
          // track when a product is added to wishlist using amplitude
          logAmplitude('Add to Wishlist', { ...algoliaContent });
        });
    }
  };

  const handleOnQuickshopClick = () => {
    props.onQuickshopClick(props.product.maisonette_product_id);
    logAmplitude('Clicked Product Quick View', props);
  };

  const handleOnCardClick = (e) => {
    if (props.trackFor) {
      trackEvent({
        eventCategory: `PDP Recommendations - ${props.trackFor}`,
        eventAction: 'Product Clicked',
        eventLabel: parseSlugFromProductUrl(props.product)
      });
    }

    if (props.product?.logURL) {
      const { logURL } = props.product;
      const logURLQueries = logURL.split('?')[1];
      if (logURLQueries) {
        logClickSLI({ logURLQueries });
      }
    }

    const isQuickShop = e.target.dataset.id === 'quickshop';
    const isWishlist = e.target.dataset.id === 'wishlist';

    if (isQuickShop || isWishlist) {
      e.preventDefault();
      return;
    }

    const getListType = () => {
      switch (props.module) {
        case 'quick-search':
          return 'Quick Search Results';

        case 'plp': {
          const { query: { w } } = router;
          if (!w) return 'Wishlist';
          return w === '*' ? 'PLP' : 'Full Search Results';
        }

        case 'also-bought-with':
          return 'Also Bought With';

        case 'related-products':
          return 'Related Products';

        case 'recently-viewed':
          return 'Recently Viewed';

        case 'popular-products':
          return 'No Results - Popular Products';

        default:
          return props.module;
      }
    };

    trackProductClick({
      product: props.product,
      position: props.index,
      list: getListType()
    });

    if (props.module === 'quick-search') {
      logAmplitude('Clicked Search Product Recommendation', {
        productSku: props.product?.maisonette_product_id
      });
    }

    logAmplitude('Clicked Product Card', props);

    if (props.product?.product_slug) {
      props.updateProduct(props.product.product_slug);
    }

    props.onClick(e);
  };

  return (
    <Card
      className={props.className}
      data-test-id="quick-shop-card"
      data-slug={props.product?.slug}
    >
      <>
        {props.intersectionCallback && (
          <InView
            threshold={0}
            onChange={
              (inView) => inView && props.intersectionCallback()
            }
          >
            {({ ref }) => (
              <IntersectionObserverElement
                id={`product-card-intersection-observer-${props.intersectionPosition}`}
                ref={ref}
              />
            )}
          </InView>
        )}
        <Link href={parseSlugFromProductUrl(props.product)} passHref>
          <CardAnchor
            hasSideImage={props.product.side_image}
            onClick={handleOnCardClick}
          >
            <QuickshopButtonWrapper>
              {
                FASTLY_ON ? (
                  <ImageWrapper showQuickShop={props.showQuickShop}>
                    <FastlyPicture
                      type="taxon-product"
                      Image={Image}
                      className={props.disableLazyload ? '' : 'lazyload'}
                      src={
                        props.disableLazyload
                          ? (props.product.image || `${process.env.NEXT_PUBLIC_ASSET_HOST}/images/default-image.jpg`)
                          : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
                      }
                      data-src={props.product.image || `${process.env.NEXT_PUBLIC_ASSET_HOST}/images/default-image.jpg`}
                      alt={props.product.title}
                      onError={handleOnImageError}
                      data-id="image"
                      showDefaultOnError
                    />

                    {
                      props.product.side_image && (
                        <FastlyPicture
                          type="taxon-product"
                          Image={Image}
                          className={props.disableLazyload ? '' : 'lazyload'}
                          src={
                            props.disableLazyload
                              ? props.product.side_image
                              : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
                          }
                          data-src={props.product.side_image}
                          alt={props.product.title}
                          onError={handleOnImageError}
                          data-id="image"
                          onLoad={(e) => e.target.classList.remove('loaded')}
                          showDefaultOnError
                        />
                      )
                    }
                  </ImageWrapper>
                )

                  : (
                    <ImageWrapper showQuickShop={props.showQuickShop}>
                      <Image
                        className={props.disableLazyload ? '' : 'lazyload'}
                        src={
                          props.disableLazyload
                            ? (props.product.image || `${process.env.NEXT_PUBLIC_ASSET_HOST}/images/default-image.jpg`)
                            : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
                        }
                        data-src={props.product.image || `${process.env.NEXT_PUBLIC_ASSET_HOST}/images/default-image.jpg`}
                        alt={props.product.title}
                        onError={handleOnImageError}
                        data-id="image"
                        showDefaultOnError
                      />

                      {
                        props.product.side_image && (
                          <Image
                            className={props.disableLazyload ? '' : 'lazyload'}
                            src={
                              props.disableLazyload
                                ? props.product.side_image
                                : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
                            }
                            data-src={props.product.side_image}
                            alt={props.product.title}
                            onError={handleOnImageError}
                            data-id="image"
                            onLoad={(e) => e.target.classList.remove('loaded')}
                            showDefaultOnError
                          />
                        )
                      }
                    </ImageWrapper>
                  )
              }

              {
                props.showQuickShop
                  ? (
                    <QuickShopButton
                      aria-label={`open ${props.product.title}, quick shop`}
                      data-id="quickshop"
                      onClick={handleOnQuickshopClick}
                      outline
                    >
                      Quick Shop
                    </QuickShopButton>
                  ) : null
              }
            </QuickshopButtonWrapper>

            {
              props.showWishlist && (
                <Wishlist
                  aria-label={wishlistActive ? `remove ${props.product.title}, from wishlist` : `add ${props.product.title}, to wishlist`}
                  data-id="wishlist"
                  disabled={isWishlistDisabled}
                  isIcon
                  outline
                  onClick={handleOnWishlistClick}
                >
                  <Heart className={wishlistActive ? 'active' : ''} />
                </Wishlist>
              )
            }

            <ProductBadge badges={props.product?.trends} />

            <ProductTitle product={props.product} taxonProducts={props.taxonProducts} />
          </CardAnchor>
        </Link>

        {
          props.showWishlist
            ? <WishlistMobile text="Wishlist" clicked={handleOnWishlistClick}><Heart className={inWishlist ? 'active' : ''} /></WishlistMobile>
            : null
        }
      </>
    </Card>
  );
};

ProductCard.defaultProps = {
  className: '',
  index: null,
  onClick: () => { },
  onQuickshopClick: () => { },
  showQuickShop: true,
  showWishlist: true,
  token: '',
  trackFor: '',
  disableLazyload: false,
  intersectionPosition: null,
  intersectionCallback: null,
  taxonProducts: true
};

ProductCard.propTypes = {
  addProductToList: PropTypes.func.isRequired,
  addProductToAlgoliaList: PropTypes.func.isRequired,
  className: PropTypes.string,
  index: PropTypes.number,
  lists: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  onQuickshopClick: PropTypes.func,
  product: PropTypes.object.isRequired,
  removeProductFromList: PropTypes.func.isRequired,
  removeProductFromAlgoliaList: PropTypes.func.isRequired,
  showQuickShop: PropTypes.bool,
  showWishlist: PropTypes.bool,
  token: PropTypes.string,
  trackFor: PropTypes.string,
  module: PropTypes.string.isRequired,
  disableLazyload: PropTypes.bool,
  intersectionPosition: PropTypes.number,
  intersectionCallback: PropTypes.func,
  updateProduct: PropTypes.func.isRequired,
  taxonProducts: PropTypes.bool
};

const mapStateToProps = (state) => ({
  token: state.user.spree_api_key,
  lists: state.lists
});

const mapDispatchToProps = (dispatch) => ({
  addProductToList: (product) => dispatch(addProductToList(product)),
  addProductToAlgoliaList: (product) => dispatch(addProductToAlgoliaList(product)),
  removeProductFromList: (product) => dispatch(removeProductFromList(product)),
  removeProductFromAlgoliaList: (product) => dispatch(removeProductFromAlgoliaList(product)),
  updateProduct: (id) => dispatch(updateProduct(id))
});

const ConnectedProductCard = connect(mapStateToProps, mapDispatchToProps)(ProductCard);

ProductCard.displayName = 'ProductCard';

ConnectedProductCard.whyDidYouRender = true;

export default ConnectedProductCard;
