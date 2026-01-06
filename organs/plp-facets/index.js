import React, { useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import StickyBox from 'react-sticky-box';
import dynamic from 'next/dynamic';

import Button from '../../atoms/button';
import FacetBreadcrumbs from '../../tissues/facet-breadcrumbs';
import Filters from '../../tissues/plp-filters';
import MobileModal from '../../tissues/mobile-modal';
import PetiteShopFor from '../../tissues/petite-shop-for';
import SortLabel from '../../tissues/sort-list-label';
import SortList from '../../tissues/sort-list';
import Typography from '../../atoms/typography';

const ScrollToTop = dynamic(() => import('../../tissues/back-to-top'));

const Facets = styled(StickyBox)`
    display: none;

  @media screen and (min-width: 320px) {
    grid-gap: 2rem;
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: 'filters sorts';
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    margin-right: 5rem;
    min-width: 25%;

    > *:not(:last-child) :not(section) {
      margin-bottom: 5rem;
    }
  }
`;

const Sorts = styled.form`
  ${(props) => props.theme.arrow('down', props.theme.color.brand, 'right 1px center', 4)}
  align-self: stretch;
  background: none;
`;

const SortWrapper = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.color.brand};
  border-top: 1px solid ${(props) => props.theme.color.white};
  height: auto;
  padding-top: 1rem;
  position: initial;
  width: auto;

  > button {
    display: none;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    padding-top: 0;
    border-bottom: 1px solid ${(props) => props.theme.color.brand};
    border-top: 1px solid ${(props) => props.theme.color.brand};

    > button {
      display: block;
    }
  }
`;

const FacetHeading = styled(Typography)`
  color: ${(props) => props.theme.color.white};
  display: flex;
  letter-spacing: 0.2rem;
  line-height: 4rem;
  text-transform: uppercase;

  > span {
    color: ${(props) => props.theme.color.brandLight};
    letter-spacing: initial;
    margin-left: auto;
    text-transform: none;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    color: ${(props) => props.theme.color.brand};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 -1rem;
`;

const FilterButton = styled(Button)`
  flex: 1;
  margin: 2rem 1rem 0 1rem;
  outline: 0;
  padding: 0 1rem;
`;

const sorts = [
  {
    name: 'Best Match',
    id: 'best-match',
    value: 'score'
  },
  {
    name: 'Best Sellers',
    id: 'best-sellers',
    value: 'globalpop'
  },
  {
    name: 'Just In',
    id: 'just-in',
    value: 'date rev'
  },
  {
    name: 'Price: Low to High',
    id: 'price-asc',
    value: 'price'
  },
  {
    name: 'Price High to Low',
    id: 'price-desc',
    value: 'price rev'
  }
];

const ProductFilters = (props) => {
  const [activeSort, setActiveSort] = useState(sorts.find((s) => s.id === props.sort) || sorts[0]);
  const [isSortOpened, setIsSortOpened] = useState(false);

  useEffect(() => {
    setActiveSort(sorts.find((s) => s.value === props.sort) || sorts[0]);
  }, [props.sort]);

  return (
    <>
      <MobileModal
        isOpened={props.mobileFilterActive}
        onClose={() => props.setMobileFilterActive(false)}
      >
        <Filters
          {...props}
          facets={props.facets}
          slider={props.slider}
          meta={props.meta}
          toggleFiltersMenu={props.setMobileFilterActive}
          activeFilters={props.activeFilters}
        />

        <ButtonGroup>
          <FilterButton
            inverted
            outline

            onClick={() => props.setMobileFilterActive(false)}
            disabled={props.activeFilters.filter((f) => !['cat1', 'cat2', 'cat3'].includes(f.split(':')[0])).length === 0}
          >
            Apply Filters
          </FilterButton>
          <FilterButton
            inverted
            outline
            onClick={() => props.setMobileFilterActive(false)}
          >
            Close
          </FilterButton>
        </ButtonGroup>
      </MobileModal>

      <MobileModal
        isOpened={props.mobileSortActive}
        onClose={() => props.setMobileSortActive(false)}
      >
        <Sorts tabIndex="0">
          <FacetHeading role="heading" aria-level="2" element="label" like="label-1">Sort By</FacetHeading>
          <SortWrapper>
            <SortLabel
              activeSort={activeSort}
              isOpened={isSortOpened}
              setOpened={setIsSortOpened}
            />
            <SortList
              {...props}
              id="sort-mobile"
              activeSort={activeSort}
              isOpened={isSortOpened}
              setOpened={setIsSortOpened}
            />
          </SortWrapper>
        </Sorts>
      </MobileModal>

      <Facets offsetTop={157}>
        <PetiteShopFor />

        <Sorts tabIndex="0">
          <FacetHeading role="heading" aria-level="2" element="label" like="label-1">Sort By</FacetHeading>
          <SortWrapper>
            <SortLabel
              activeSort={activeSort}
              isOpened={isSortOpened}
              setOpened={setIsSortOpened}
            />
            <SortList
              {...props}
              activeSort={activeSort}
              isOpened={isSortOpened}
              setOpened={setIsSortOpened}
            />
          </SortWrapper>
        </Sorts>

        <Filters
          {...props}
          facets={props.facets}
          slider={props.slider}
          meta={props.meta}
          activeFilters={props.activeFilters}
        />

        <FacetBreadcrumbs {...props} />

        <ScrollToTop />

      </Facets>
    </>
  );
};

ProductFilters.propTypes = {
  activeFilters: PropTypes.array.isRequired,
  facets: PropTypes.array.isRequired,
  slider: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  meta: PropTypes.object.isRequired,
  sort: PropTypes.string.isRequired,
  mobileFilterActive: PropTypes.bool.isRequired,
  setMobileFilterActive: PropTypes.func.isRequired,
  mobileSortActive: PropTypes.bool.isRequired,
  setMobileSortActive: PropTypes.func.isRequired
};

export default memo(ProductFilters);
