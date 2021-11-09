import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { formatNumber } from 'accounting-js';
import { connectStats, connectCurrentRefinements } from 'react-instantsearch-dom';

import Button from '../../atoms/button';
import Refinements from './refinements';
import MobileModal from '../../tissues/mobile-modal';
import { SortByMobile, items as sortValues } from './sort-by';

const MobileRefinementWrapper = styled.div(({ theme }) => ({
  backgroundColor: theme.color.backgroundLight,
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    display: 'none'
  }
}));

const MobileRefinementInner = styled.div(() => ({
  display: 'flex',
  margin: '0 auto',
  maxWidth: 600,
  padding: '1rem 3rem'
}));

const MobileButton = styled(Button)`
  flex: 0 0 calc(50% - 1rem);
  ${(props) => props.theme.arrow('down', props.theme.color.brand, 'right center', 4)}
  background-color: ${(props) => props.theme.color.backgroundLight};
  border: 0 none;
  color: ${(props) => props.theme.color.brand};
  cursor: pointer;
  outline: 0;
  padding: 0;
  text-align: left;

  > span {
    font-family: ${(props) => props.theme.font.sans};
    color: ${(props) => props.theme.color.brandLight};
    float: right;
    letter-spacing: initial;
    padding-right: 1.5rem;
    text-transform: none;
  }
`;

const ButtonFilters = styled(MobileButton)(() => ({ marginRight: '1rem' }));
const ButtonSorts = styled(MobileButton)(() => ({ marginLeft: '1rem' }));

const findSortBy = (sortBy) => sortValues?.find(
  (sort) => sort.value === sortBy)?.label || 'Best Match';

const MobileTrigger = ({
  isBrandRefined, isShop, items, nbHits, sortBy, ...props
}) => {
  const [sortModalActive, setSortModalActive] = useState(false);
  const [refinementsModalActive, setRefinementsModalActive] = useState(false);

  const filterItems = [
    ...new Map(
      items
        .filter((item) => {
          const flags = item.attribute !== 'edits' && item.attribute !== 'trends' && item.items;
          return isBrandRefined ? item.attribute !== 'brand' && flags : flags;
        })
        .map((item) => [item.id, item])
    ).values()
  ];

  const price = items.find((item) => item.id === 'variants.maisonette_sale');

  const total = filterItems
    .filter((item) => item.items)
    .reduce((sum, curr) => sum + curr.items.length, price ? 1 : 0);

  return (
    <MobileRefinementWrapper {...props}>
      <MobileRefinementInner>
        <ButtonFilters type="button" onClick={() => setRefinementsModalActive(true)}>
          { total ? `Filters (${total})` : 'Filters' }
          { !total && <span>{`${formatNumber(nbHits, { precision: 0 })} items`}</span> }
        </ButtonFilters>

        <ButtonSorts type="button" onClick={() => setSortModalActive(true)}>
          Sort
          <span>{findSortBy(sortBy)}</span>
        </ButtonSorts>
      </MobileRefinementInner>

      <SortByMobile isOpened={sortModalActive} onClose={() => setSortModalActive(false)} />

      <MobileModal
        isOpened={refinementsModalActive}
        onClose={() => setRefinementsModalActive(false)}
      >
        <Refinements
          isBrandRefined={isBrandRefined}
          isShop={isShop}
        />
      </MobileModal>
    </MobileRefinementWrapper>
  );
};

MobileTrigger.defaultProps = {
  isBrandRefined: false,
  isShop: false,
  items: [],
  nbHits: 0,
  sortBy: 'products_production'
};

MobileTrigger.propTypes = {
  isBrandRefined: PropTypes.bool,
  isShop: PropTypes.bool,
  items: PropTypes.array,
  nbHits: PropTypes.number,
  sortBy: PropTypes.string
};

export default connectStats(connectCurrentRefinements(MobileTrigger));
