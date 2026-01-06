import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Router from 'next/router';
import { formatMoney } from 'accounting-js';
import { connect } from 'react-redux';

import { logAmplitude } from '../../utils/amplitude';
import Typography from '../../atoms/typography';
import Button from '../../atoms/button';
import { getBasePath } from '../../utils/navigation';
import { updateActiveMini } from '../../store/modules/petites/actions';

const LabelWrapper = styled(Button)`
  ${(props) => props.theme.close(props.theme.color.white, 'right 1px center', 8)}
  text-decoration: none;
  letter-spacing: normal;
  display: flex;
  flex-direction: row;
  max-height: 3rem;
  position: relative;
  text-overflow: ellipsis;
  width: 100%;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    ${(props) => props.theme.close(props.theme.color.brand, 'right 1px center', 8)}
  }
`;

const Category = styled(Typography)`
  color: ${(props) => props.theme.color.brandLight};
  line-height: 3rem;
  padding-right: 1rem;

`;

const Filter = styled(Typography)`
  color: ${(props) => props.theme.color.white};
  line-height: 3rem;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    color: ${(props) => props.theme.color.brand};
  }
`;

const FilterButton = styled(Button)`
  background: transparent;
  border-color: ${({ theme }) => theme.color.white};
  border-width: 1px;
  color: ${({ theme }) => theme.color.white};
  line-height: calc(3rem - 2px);
  margin: 1rem 0;
  outline: 0;
  width: 100%;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    background: ${({ theme }) => theme.color.brand};
    border-color: ${({ theme }) => theme.color.brand};
    color: ${({ theme }) => theme.color.white};
  }
`;

export const getActiveMini = (n, minis) => {
  if (minis.length <= 0) return null;
  const mini = minis.find((m) => m.id === n);
  if (!mini) return null;

  const { gender_taxons, age_range_taxons, ...rest } = mini;
  const facets = [...gender_taxons, ...age_range_taxons];

  return {
    ...rest,
    taxons: facets.map((f) => {
      const category = f.permalink.split('/')[0];
      const value = f.name;

      return { category, value };
    })
  };
};

const FilterListRemove = (props) => {
  const activeFilters = props.facets.reduce((acc, curr) => {
    const { values, id } = curr;
    const selected = values.filter((x) => x.selected);
    selected.forEach((x) => {
      acc.push(`${id}:${x.id}`);
    });
    return acc;
  }, []);

  const handleOnFilterRemoveClick = (category, filter) => {
    const {
      af,
      brand,
      cats = null,
      edit,
      trend,
      ...otherQueries
    } = Router.query;

    const query = otherQueries;

    const fltrs = activeFilters.length > 0 ? activeFilters : [];

    const base = getBasePath(props).split('?')[0];
    const as = cats ? `${base}/${cats.join('/')}` : base;

    const filters = fltrs.filter((f) => f !== `${category}:${filter}`);

    if (filters.length > 0) query.af = filters.join(' ');

    const tempQueryFilters = query.af ? query.af.split(' ').filter((f) => !['cat1', 'cat2', 'cat3'].includes(f.split(':')[0])) : [];

    if (tempQueryFilters.length > 0) query.af = query.af.split(' ').filter((f) => !['cat1', 'cat2', 'cat3'].includes(f.split(':')[0])).join(' ');
    else delete query.af;

    const mini = props.mini ? getActiveMini(props.mini, props.minis) : false;

    if (mini) {
      const miniFilter = mini.taxons.find((f) => (category === f.category) && (filter === f.value));
      if (miniFilter) {
        props.updateActiveMini(0);
        global.document.cookie = 'maisonette_active_mini=0; path=/';
      }
    }

    logAmplitude('Clicked Facet', {
      navigationItem: `${category}:${filter}`,
      selected: false,
      facets: filters?.filter((x) => !['cat1', 'cat2', 'cat3'].includes(x.split(':')[0]))?.join(';')
    });

    Router.push({
      pathname: Router.pathname,
      query: { ...Router.query, af: filters.join(' ') }
    },
    { pathname: as, query });
  };

  const handleOnResetFilterClick = () => {
    const { cats } = Router.query;

    const base = getBasePath(props).split('?')[0];
    const as = cats ? `${base}/${cats.join('/')}` : base;

    props.updateActiveMini(0);
    global.document.cookie = 'maisonette_active_mini=0; path=/';

    logAmplitude('Cleared All Filters', { facets: activeFilters?.filter((x) => !['cat1', 'cat2', 'cat3'].includes(x.split(':')[0]))?.join(';') ?? null });

    Router.push({
      pathname: Router.pathname,
      query: { ...Router.query, af: '' }
    }, { pathname: as, query: '' }).then(() => props.onClear());
  };

  return (
    <>
      {
        props.facets.map((facet) => {
          const { id, name, values } = facet;

          return !['cat1', 'cat2', 'cat3'].includes(id) && values.filter((f) => f.selected).map((filter) => (
            <LabelWrapper
              styledLikeLink
              aria-label={`remove filter, ${name} ${filter.name}`}
              key={`remove-${id}-${filter.id}`}
              onClick={() => handleOnFilterRemoveClick(id, filter.id)}
            >
              <Category element="p" like="dec-1">{name}</Category>
              <Filter element="p" like="dec-1">{filter.name}</Filter>
            </LabelWrapper>
          ));
        })
      }

      {
        props.slider && props.slider.values.selected && (
          <LabelWrapper
            styledLikeLink
            aria-label={
              `remove filter, price, ${formatMoney(props.slider.values.selected_range.start / 100, { precision: 0 })}
               to ${formatMoney(props.slider.values.selected_range.end / 100, { precision: 0 })}`
            }
            key={`remove-${props.slider.id}`}
            onClick={() => handleOnFilterRemoveClick(
              props.slider.id,
              `[${props.slider.values.selected_range.start},${props.slider.values.selected_range.end}]`
            )}
          >
            <Category element="p" like="dec-1">{props.slider.name}</Category>
            <Filter element="p" like="dec-1">
              {formatMoney(props.slider.values.selected_range.start / 100, { precision: 0 })}
              {' - '}
              {formatMoney(props.slider.values.selected_range.end / 100, { precision: 0 })}
            </Filter>
          </LabelWrapper>
        )
      }

      {
        props.count > 1 && (
          <FilterButton onClick={handleOnResetFilterClick}>Clear All Filters</FilterButton>
        )
      }
    </>
  );
};

FilterListRemove.defaultProps = {
  mini: 0,
  minis: []
};

FilterListRemove.propTypes = {
  mini: PropTypes.number,
  minis: PropTypes.array,
  count: PropTypes.number.isRequired,
  onClear: PropTypes.func.isRequired,
  facets: PropTypes.array.isRequired,
  updateActiveMini: PropTypes.func.isRequired,
  slider: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired
};

const mapStateToProps = (state) => ({
  mini: state.petites.active_mini,
  minis: state.petites.minis
});

const mapDispatchToProps = (dispatch) => ({
  updateActiveMini: (id) => dispatch(updateActiveMini(id))
});

const ConnectedFilterListRemove = connect(mapStateToProps, mapDispatchToProps)(FilterListRemove);

FilterListRemove.displayName = 'FilterListRemove';

export default memo(ConnectedFilterListRemove);
