import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Typography from '../../atoms/typography';

import { logAmplitude } from '../../utils/amplitude';

const dynamicHeight = ({ contentHeight }) => `max-height: ${contentHeight}px`;

const FILTERED_EMO_PROPS = new Set(['active', 'contentHeight', 'revamp', 'isBNPL']);

const AccordionTab = styled('dl', {
  shouldForwardProp: (prop) => !FILTERED_EMO_PROPS.has(prop)
})`
  border-bottom: 1px solid ${({ active, isBNPL }) => ((!active && !isBNPL) ? 'rgba(43, 70, 152, .1)' : 'none')};
  overflow: hidden;
  transition: max-height ${(props) => props.theme.animation.fast} ${(props) => props.theme.animation.easeInQuad};
  ${({ revamp }) => (revamp && 'padding: 1rem 0;')}

  ${({ active, isBNPL }) => ((active && isBNPL) && css`
    margin-bottom: 3.2rem;
  `
  )}

  ${({ active, isBNPL }) => ((!active && isBNPL) && css`
    min-height: 6.7rem;
    min-width: 3.8rem;
  `
  )}

  ${({ active, contentHeight, revamp }) => {
    const defaultHeight = revamp ? '50' : '35';
    return `max-height: ${active ? contentHeight() : defaultHeight}px;`;
  }}
  }

  ${dynamicHeight};

  ~ dl {
    border-top: 0;
  }
`;

const AccordionTitle = styled(Typography, {
  shouldForwardProp: (prop) => !FILTERED_EMO_PROPS.has(prop)
})`
  ${({ revamp, active, theme }) => (
    !revamp && theme.filterArrow(active ? 'up' : 'down', theme.color.brand, 'right 1px center', 5)
  )}
  
  ${({ isBNPL }) => (
    isBNPL && css`
    width: 18.7rem;
    `
  )}

  color: ${({ theme }) => theme.color.bluePrimary};
  cursor: pointer;
  display: flex;
  line-height: 3.5rem;
  position: relative;
  border-bottom: ${({ active, isBNPL }) => ((active && !isBNPL) ? '1px solid rgba(43, 70, 152, .1)' : 'none')};

  margin-bottom: ${({ isBNPL }) => ((isBNPL) ? '0' : '.8rem')};

  ${({ revamp }) => (revamp && css`
    margin-left: 3rem;
    justify-content: space-between;
  `)}

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    ${({ revamp }) => (revamp && css`
      margin-left: 1.75rem;
    `)}
  }
`;

const AccordionSubTitle = styled(Typography)`
  color: ${(props) => props.theme.color.bluePrimary};
  flex: 1;
  display: flex;
  letter-spacing: initial;
  text-align: right;
  text-transform: initial;
  padding-right: 2rem;
`;

const AccordionPlusMinusWrapper = styled.div`
  display: flex;
`;

const AccordionMinus = styled.label`
  margin-right: 3rem;
  align-self: center;
  background: ${({ theme }) => theme.color.bluePrimary};
  width: 16px;
  height: 1px;
  top: 14px;
  left: 327px;

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    margin-right: 2rem;
  }
`;

const AccordionPlus = styled('label', { shouldForwardProp: (prop) => prop !== 'active' })`
  ${({ active, theme }) => (
    !active && css`
      position: absolute;
      margin-right: 2rem;
      align-self: center;
      background: ${theme.color.bluePrimary};
      width: 16px;
      height: 1px;
      transform: rotate(90deg);
    `
  )}
`;

const AccordionContent = styled('dd', {
  shouldForwardProp: (prop) => !FILTERED_EMO_PROPS.has(prop)
})`
  ${({ isBNPL }) => ((!isBNPL) && css`
    padding-bottom: 2.4rem;
  `
  )}

  ${({ active, isBNPL }) => ((!active && isBNPL) && css`
    visibility: hidden;
  `
  )}
`;

export const PropertyList = styled(Typography, { shouldForwardProp: (prop) => prop !== 'revamp' })`
  list-style-type: disc;
  margin-left: ${({ revamp }) => (revamp ? '5rem' : '1.75rem')};
  margin-right: ${({ revamp }) => (revamp ? '3rem' : '1.75rem')};
  ${({ revamp }) => (revamp && css`
    margin-top: 0.5rem;
  `)}

  b {
    font-weight: bold;
  }

  ul > li {
    list-style-type: disc;
  }

  @media screen and (min-width: ${({ theme }) => theme.breakpoint.medium}) {
    margin-left: ${({ revamp }) => (revamp ? '3.75rem' : '1.75rem')};
    margin-right: 1.75rem;
  }
`;

class ProductDetailAccordion extends Component {
  constructor(props) {
    super(props);

    const descriptionOpen = !!this.props.isDescription;

    this.state = {
      active: descriptionOpen
    };

    this.accordionRef = createRef();

    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.getHeight = this.getHeight.bind(this);
  }

  getHeight() {
    return this.accordionRef.scrollHeight;
  }

  toggleAccordion() {
    if (!this.state.active && Object.keys(this.props.product).length && !this.props.isBNPL) {
      logAmplitude('PDP Interaction', {
        product: this.props.product,
        interactionType: 'Opened Product Property Accordion',
        position: this.props.title
      });
    }

    this.setState((prevState) => ({ active: !prevState.active }));
  }

  render() {
    return (
      <AccordionTab
        ref={(node) => { this.accordionRef = node; }}
        active={this.state.active ? 'true' : undefined}
        contentHeight={this.getHeight}
        revamp={this.props.revamp}
        isBNPL={this.props.isBNPL}
      >
        <AccordionTitle
          element="dt"
          like={this.props.isBNPL ? 'dec-5' : 'dec-4'}
          active={this.state.active ? 'true' : undefined}
          onClick={this.toggleAccordion}
          revamp={this.props.revamp}
          isDescription={this.props.isDescription}
          isBNPL={this.props.isBNPL}
        >
          {this.props.title}
          {
            this.props.subtitle && (
              <AccordionSubTitle element="span" like="dec-1">
                {this.props.subtitle}
              </AccordionSubTitle>
            )
          }
          {
            this.props.revamp && (
              <AccordionPlusMinusWrapper>
                <AccordionMinus />
                <AccordionPlus active={this.state.active ? 'true' : undefined} />
              </AccordionPlusMinusWrapper>
            )
          }

        </AccordionTitle>
        <AccordionContent
          isBNPL={this.props.isBNPL}
          active={this.state.active ? 'true' : undefined}
        >
          {this.props.children}
        </AccordionContent>
      </AccordionTab>
    );
  }
}

ProductDetailAccordion.defaultProps = {
  subtitle: '',
  revamp: false,
  isDescription: false,
  isBNPL: false
};

ProductDetailAccordion.propTypes = {
  product: PropTypes.object.isRequired,
  children: PropTypes.any.isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  title: PropTypes.string.isRequired,
  revamp: PropTypes.bool,
  isDescription: PropTypes.bool,
  isBNPL: PropTypes.bool
};

export default ProductDetailAccordion;
