import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import * as Sentry from '@sentry/node';
import { toast, TOAST } from '../../utils/toastify';

import { getProduct } from '../../pages/api';
import manageFocus from '../../utils/manageFocus';
import handleOnImageError from '../../utils/handleOnImageError';

import Button from '../../atoms/button';
import Carousel from '../../atoms/carousel';
import ProductDetails from '../../organs/pdp-details';
import ProductDetailsRevamp from '../../organs/pdp-details-new';

const QuickShopWrapper = styled.section`
  border-bottom: 1px solid ${(props) => props.theme.color.brand};
  border-top: 1px solid ${(props) => props.theme.color.brand};
  display: none;
  grid-column-end: -1;
  grid-column-start: 1;
  grid-row-start: ${(props) => Math.ceil(props.row / 3) + 1};
  margin: 2rem 0;
  max-height: ${(props) => (props.row !== null ? 'auto' : '0')};
  overflow: hidden;
  padding: 4rem 0;
  position: relative;
  min-height: 30rem;

  ${(props) => props.inPopularProducts && css`
    grid-row-start: ${Math.ceil(props.row / 4) + 1};
  `}

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    display: ${(props) => (props.row !== null ? 'flex' : 'none')};
  }
`;

const QuickCarousel = styled(Carousel)`
  width: 40%;

  img {
    max-width: 100%;
  }
`;

const QuickClose = styled(Button)`
  ${(props) => props.theme.close(props.theme.color.brand, 'center center', 20)}
  border: 0;
  height: 3.2rem;
  outline: 0;
  width: 3.2rem;
  position: absolute;
  right: 0;
  top: 4rem;
`;

const Loading = styled.span`
  bottom: 0;
  left: 0;
  opacity: 0.75;
  position: absolute;
  right: 0;
  top: 0;
  z-index: ${(props) => props.theme.layers.audience};

  ${(props) => props.theme.loader(3, props.theme.color.brand)}
`;

export class QuickShop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      row: this.props.quickShopIndex,
      loading: true,
      product: props.product,
      position: props.position,
      prevElement: null
    };

    this.quickRef = createRef();

    this.carouselSettings = {
      prevNextButtons: false,
      pageDots: true
    };

    this.updateRowState = this.updateRowState.bind(this);
    this.closeQuickShop = this.closeQuickShop.bind(this);
    this.scrollToQuickShop = this.scrollToQuickShop.bind(this);
  }

  async componentDidMount() {
    this.scrollToQuickShop();

    try {
      const res = await getProduct({ id: this.props.slug });

      if (res.errors) {
        Sentry.captureException(res);
        toast(res.errors[0].message, { type: TOAST.TYPE.ERROR });
        this.closeQuickShop();
        return;
      }

      this.setState({ product: this.props.product || res });
    } catch (err) {
      this.closeQuickShop();
      Sentry.captureException(err);
    }

    this.setState({ loading: false });
    const previousElement = global.document.activeElement;
    this.setState({ prevElement: previousElement });
    manageFocus(this.quickRef, this.props.quickShopIndex, this.state.prevElement);
    this.scrollToQuickShop(true);
  }

  async componentDidUpdate(prevProps) {
    if (this.props.quickShopIndex !== prevProps.quickShopIndex) {
      await this.updateRowState();
      this.scrollToQuickShop();
    }
  }

  scrollToQuickShop(instant = false) {
    const { window } = global;

    if (window) {
      const y = this.quickRef.getBoundingClientRect().top + global.window.scrollY;
      global.window.scroll({
        top: y - 150,
        behavior: instant ? 'auto' : 'smooth'
      });
    }
  }

  updateRowState() {
    this.setState({
      row: this.props.quickShopIndex
    });
  }

  closeQuickShop() {
    const card = this.quickRef.previousSibling;
    if (card) {
      const offset = parseInt(global.window.getComputedStyle(this.quickRef).getPropertyValue('margin-top'), 0);

      global.window.scrollBy(0, -card.scrollHeight - offset);
      this.props.onQuickshopClose();

      card.classList.add('--pulse');

      setTimeout(() => {
        card.classList.remove('--pulse');
      }, 1000);
    }
    if (this.state.prevElement) this.state.prevElement.focus();
  }

  render() {
    return (
      <QuickShopWrapper
        data-test-id="quickshop-wrapper"
        ref={(node) => { this.quickRef = node; }}
        row={this.state.row}
        inProductModule={this.props.inProductModule}
        inPopularProducts={this.props.inPopularProducts}
      >
        {this.state.loading && <Loading />}

        {
          this.state.product && (
            <>
              <QuickCarousel
                type="quickshop"
                options={this.carouselSettings}
                reloadOnUpdate
                mobilePDP={this.props.revamp}
              >
                {
                  this.state.product.master.images.map(((image) => (
                    <img
                      key={`quickshop-image-${image.id}`}
                      src={image.large_url}
                      alt={this.state.product.master.name}
                      onError={handleOnImageError}
                    />
                  )))
                }
              </QuickCarousel>

              { !this.props.revamp ? (
                <ProductDetails
                  product={this.state.product}
                  isQuickshop
                  position={this.state.position}
                />
              ) : (
                <ProductDetailsRevamp
                  product={this.state.product}
                  isQuickshop
                  position={this.state.position}
                />
              )}

              <QuickClose aria-label="close quick shop" onClick={this.closeQuickShop} isIcon outline />
            </>
          )
        }
      </QuickShopWrapper>
    );
  }
}

QuickShop.defaultProps = {
  onQuickshopClose: () => { },
  product: false,
  position: null,
  inProductModule: false,
  inPopularProducts: false,
  revamp: false
};

QuickShop.propTypes = {
  product: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  position: PropTypes.number,
  inProductModule: PropTypes.bool,
  inPopularProducts: PropTypes.bool,
  slug: PropTypes.string.isRequired,
  quickShopIndex: PropTypes.number.isRequired,
  onQuickshopClose: PropTypes.func,
  revamp: PropTypes.bool
};

export default QuickShop;
