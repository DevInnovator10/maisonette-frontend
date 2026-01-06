import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connectSortBy } from 'react-instantsearch-dom';

import {
  List,
  Accordion,
  AccordionPanel,
  AccordionTrigger,
  Heading
} from './left-rail-shared';
import MobileModal from '../../tissues/mobile-modal';
import InputRadio from '../../atoms/radio';

const SortByWrapper = styled.section(({ theme }) => ({
  display: 'none',
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    display: 'block'
  },

  [Heading]: {
    borderBottom: 'none',
    fontSize: theme.modularScale.twelve
  },
  [Accordion]: {
    borderBottom: 'none'
  }
}));

const SortByWrapperMobile = styled(MobileModal)(({ theme }) => ({
  [Heading]: {
    borderBottom: `1px solid ${theme.color.white}`
  }
}));

const Radio = styled(InputRadio)(({ theme }) => ({
  color: theme.color.white,
  '&::before': { borderColor: theme.color.white },
  '&::after': { background: theme.color.white },
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    color: theme.color.brand,
    '&::before': { borderColor: theme.color.brand },
    '&::after': { background: theme.color.brand }
  }
}));

const SortDesktop = ({
  items,
  refine,
  createURL,
  ...props
}) => {
  const [active, setActive] = useState(false);

  const onTriggerClick = () => setActive(!active);

  const sortClick = (e, item) => {
    e.preventDefault();

    refine(item.value);
    setActive(false);
  };

  return (
    <SortByWrapper {...props}>
      <Heading role="heading" aria-level="2" element="label" like="label-1">
        Sort By
      </Heading>

      <Accordion>
        <AccordionTrigger
          isOpened={active}
          aria-expanded={active}
          onClick={onTriggerClick}
        >
          { items.find((item) => item.isRefined).label }

        </AccordionTrigger>

        <AccordionPanel active={active}>
          <List component="ul">
            {
              items.map((item) => (
                <li key={item.value}>
                  <a
                    aria-label={`sort by ${item.value}`}
                    href={createURL(item.value)}
                    onClick={(event) => sortClick(event, item)}
                  >
                    <Radio
                      id={`sort.${item.value}`}
                      name={item.value}
                      active={item.isRefined}
                    >
                      {item.label}
                    </Radio>
                  </a>
                </li>
              ))
            }
          </List>
        </AccordionPanel>
      </Accordion>
    </SortByWrapper>
  );
};

SortDesktop.defaultProps = {
  items: []
};

SortDesktop.propTypes = {
  items: PropTypes.array,
  refine: PropTypes.func.isRequired,
  createURL: PropTypes.func.isRequired
};

export const SortByDesktop = connectSortBy(SortDesktop);

const SortMobile = ({
  items,
  refine,
  createURL
}) => {
  const sortClick = (e, item) => {
    e.preventDefault();
    refine(item.value);
  };

  return (
    <List component="ul">
      {
        items.map((item) => (
          <li key={item.value}>
            <a
              aria-label={`sort by ${item.value}`}
              href={createURL(item.value)}
              onClick={(event) => sortClick(event, item)}
            >
              <Radio
                id={`sort.${item.value}`}
                name={item.value}
                active={item.isRefined}
              >
                {item.label}
              </Radio>
            </a>
          </li>
        ))
      }
    </List>
  );

};

SortMobile.defaultProps = {
  items: []
};

SortMobile.propTypes = {
  items: PropTypes.array,
  refine: PropTypes.func.isRequired,
  createURL: PropTypes.func.isRequired
};

const SortMobileConnected = connectSortBy(SortMobile);

export const items = [
  { value: process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX, label: 'Best Match' },
  { value: `${process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX}_best_sellers`, label: 'Best Sellers' },
  { value: `${process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX}_just_in`, label: 'Just In' },
  { value: `${process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX}_price_asc`, label: 'Price: Low to High' },
  { value: `${process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX}_price_desc`, label: 'Price: High to Low' }
];

export const SortByMobile = (props) => (
  <SortByWrapperMobile {...props}>
    <Heading role="heading" aria-level="2" element="label" like="label-1">
      Sort By
    </Heading>

    <SortMobileConnected
      defaultRefinement={process.env.NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX}
      items={items}
    />
  </SortByWrapperMobile>
);
