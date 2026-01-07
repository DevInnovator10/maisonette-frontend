import React, {
  useRef,
  useState,
  useEffect,
  useCallback
} from 'react';
import * as Sentry from '@sentry/browser';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import PropTypes from 'prop-types';
import { toast, TOAST } from '../../utils/toastify';

import { getProduct } from '../../pages/api';
import { logAmplitude } from '../../utils/amplitude';

import { Skeleton, SkeletonWrapper } from '../../atoms/skeleton';
import Button from '../../atoms/button';
import Carousel from '../../atoms/carousel';
import ProductDetails from '../../organs/pdp-details';
import ProductDetailsRevamp from '../../organs/pdp-details-new';

const QuickShopWrapper = styled.section(({ theme, position }) => ({
  borderBottom: `1px solid ${theme.color.brand}`,
  borderTop: `1px solid ${theme.color.brand}`,
  display: 'none',
  margin: '2rem 0',
  minHeight: '30rem',
  overflow: 'hidden',
  padding: '4rem 0',
  position: 'relative',
  gridColumnEnd: -1,
  gridColumnStart: 1,
  gridRowStart: Math.ceil(position / 3) + 1,
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    display: 'flex'
  }
}));

const QuickCarousel = styled(Carousel)(() => ({
  textAlign: 'center',
  width: '40%',
  img: { maxWidth: '100%' }
}));

const QuickClose = styled(Button)(({ theme }) => {
  const crossStyles = css`
    ${theme.close(theme.color.brand, 'center center', 20)}
    border: 0;
    height: 3.2rem;
    outline: 0;
    width: 3.2rem;
    position: absolute;
    right: 0;
    top: 4rem;
  `;

  return crossStyles;
});

const QuickShop = ({
  slug,
  position,
  quickshopPosition,
  onQuickShopClose,
  ...props
}) => {
  const ref = useRef();

  /**
   * get pdpRevamp value from siteSpect
   * which is pulled out and replaced with static value for a while
   */
  const pdpRevamp = false;

  const [product, setProduct] = useState(null);

  const getProductResponse = async () => {
    await getProduct({ id: slug }).then((res) => {
      if (res.errors) {
        Sentry.captureException(res);
        toast(res.errors[0].message, { type: TOAST.TYPE.ERROR });
        onQuickShopClose();
        return;
      }

      setProduct(res);
    }).catch((error) => {
      onQuickShopClose();
      Sentry.captureException(error);
    });
  };

  useEffect(() => {
    getProductResponse();
  }, []);

  useEffect(() => {
    if (ref.current && product) {
      ref.current.scrollIntoView({
        // TODO: smooth scrolling is not working. need to revisit
        // behavior: 'smooth',
        block: 'center'
      });
    }
  }, [product]);

  const onQuickshopCarouselRef = useCallback((node) => {
    let prevIndex = 0;

    if (node !== null) {
      node.on('change', (i) => {
        if (product.master.images[i]) {
          // in order to track if the user swiped LEFT to view the next image
          // for the first time, use prevIndex and closure to ensure
          // the user is visiting the image for the 1st time
          if (i > prevIndex) {
            logAmplitude('PDP Interaction', {
              product,
              position,
              imagePosition: i + 1,
              interactionType: 'Product Image Swipe',
              image: product.master.images[i].product_url
            });

            prevIndex += 1;
          }
        }
      });
    }

    // Cleanup the event listener when the component unmounts
    return () => {
      node.off('change');
    };
  }, [product]);

  if (!product) {
    return (
      <QuickShopWrapper ref={ref} position={position} {...props}>
        <SkeletonWrapper css={{ alignItems: 'center' }}>
          <Skeleton
            css={{
              maxHeight: 300,
              maxWidth: 300,
              height: '100%',
              width: '100%',
              marginBottom: 10
            }}
          />
          <Skeleton css={{ height: 18, width: 50 }} />
        </SkeletonWrapper>

        <SkeletonWrapper css={{ alignItems: 'center' }}>
          <Skeleton css={{ height: 36, width: '75%', marginBottom: 10 }} />
          <Skeleton css={{ height: 36, width: '90%', marginBottom: 10 }} />
          <Skeleton css={{ height: 18, width: 100, marginBottom: 30 }} />
          <Skeleton
            css={{
              height: 50,
              width: '50%',
              alignSelf: 'start',
              marginBottom: 10
            }}
          />
          <Skeleton css={{ height: 40, marginBottom: 10 }} />
          <Skeleton css={{ height: 40, marginBottom: 10 }} />
        </SkeletonWrapper>
      </QuickShopWrapper>
    );
  }

  return (
    <QuickShopWrapper ref={ref} position={quickshopPosition} {...props}>
      {product.title}
      <QuickCarousel
        type={'quickshop'}
        flickityRef={onQuickshopCarouselRef}
        options={{
          prevNextButtons: false,
          pageDots: pdpRevamp ? product.master.images.length > 1 : true
        }}
        mobilePDP={pdpRevamp}
      >
        {
          product.master.images.map(((image) => (
            <div key={`quickshop-image-${image.id}`}>
              <img
                key={image.id}
                alt={product.master.name}
                src={image.product_url}
              />
            </div>
          )))
        }
      </QuickCarousel>

      {!pdpRevamp ? (
        <ProductDetails
          product={product}
          position={position}
          insights={props.insights}
          isQuickshop
        />
      ) : (
        <ProductDetailsRevamp
          product={product}
          position={position}
          insights={props.insights}
          isQuickshop
        />
      )}

      <QuickClose aria-label="close quick shop" onClick={onQuickShopClose} isIcon outline />
    </QuickShopWrapper>
  );
};

QuickShop.propTypes = {
  onQuickShopClose: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
  slug: PropTypes.string.isRequired,
  insights: PropTypes.func.isRequired,
  quickshopPosition: PropTypes.number.isRequired
};

export default QuickShop;
