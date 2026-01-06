import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { formatNumber } from 'accounting-js';

import FilterLabel from '../filter-list-label';
import FilterList from '../filter-list';
import FilterRange from '../filter-range';
import FilterRemove from '../filter-list-remove';
import Typography from '../../atoms/typography';

import { getVisibleFilters } from '../../organisms/products';

const Filters = styled.form``;

const FiltersHeader = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.color.white};

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    border-bottom: 1px solid ${(props) => props.theme.color.brand};
  }
`;

const FiltersActive = styled.div`
  padding-bottom: 1rem;
`;

const FilterWrapper = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.color.white};

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    border-bottom: 1px solid ${(props) => props.theme.color.brand};
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

const facetIDs = [
  'agerange',
  'brand',
  'category',
  'clothingsizes',
  'color',
  'gender',
  'shoesizes',
  'size',
  'pettype'
];

const FiltersTemplate = (props) => {
  const [activeFilter, setActiveFilter] = useState(null);

  const closeFiltersMenu = () => {
    props.toggleFiltersMenu(false);
  };

  return (
    <Filters
      tabIndex="0"
      onSubmit={(e) => e.preventDefault()}
    >
      <FiltersHeader>
        <FacetHeading role="heading" aria-level="2" element="label" like="label-1">
          {
            getVisibleFilters(props.activeFilters).length > 0
              ? `Filters (${getVisibleFilters(props.activeFilters).length})`
              : 'Filters'
          }
          <span>{`${formatNumber(props.meta.total, { precision: 0 })} items`}</span>
        </FacetHeading>

        <FiltersActive>
          <FilterRemove
            {...props}
            facets={props.facets}
            slider={props.slider}
            count={getVisibleFilters(props.activeFilters).length}
            onClear={closeFiltersMenu}
          />
        </FiltersActive>
      </FiltersHeader>

      {
        props.facets.filter((f) => facetIDs.includes(f.id)).map((facet) => (
          <FilterWrapper key={facet.id}>
            <FilterLabel
              category={{ name: facet.name, id: facet.id }}
              isOpened={activeFilter === facet.id}
              setOpened={setActiveFilter}
            />
            {
              activeFilter === facet.id && (
                <FilterList
                  {...props}
                  facets={props.facets}
                  filters={facet.values}
                  id={facet.id}
                  facet={facet}
                  setOpened={setActiveFilter}
                  isOpened
                />
              )
            }
          </FilterWrapper>
        ))
      }

      {
        props.slider && props.meta.total > 0 && (
          <FilterWrapper>
            <FilterLabel
              category={{ name: props.slider.name, id: props.slider.id }}
              isOpened={activeFilter === props.slider.id}
              setOpened={setActiveFilter}
            />
            <FilterRange
              slider={props.slider}
              isOpened={activeFilter === props.slider.id}
              setOpened={setActiveFilter}
            />
          </FilterWrapper>
        )
      }
    </Filters>
  );
};

FiltersTemplate.defaultProps = {
  toggleFiltersMenu: () => {}
};

FiltersTemplate.propTypes = {
  facets: PropTypes.array.isRequired,
  slider: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  meta: PropTypes.object.isRequired,
  activeFilters: PropTypes.array.isRequired,
  toggleFiltersMenu: PropTypes.func
};

export default memo(FiltersTemplate);
