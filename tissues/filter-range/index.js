import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { formatMoney } from 'accounting-js';
import Router from 'next/router';

import Typography from '../../atoms/typography';
import InputRange from '../../atoms/input-range';
import Button from '../../atoms/button';
import { logAmplitude } from '../../utils/amplitude';
import slugToSli from '../../utils/slugToSLI';

const Filters = styled.div`
    display: flex;
  flex-direction: column;
  max-height: 14rem;
  margin: 2rem 0;
  position: relative;
  overflow: visible;
  padding: 0 0.8rem;
`;

const FiltersWrapper = styled.div`
  overflow: hidden;
  padding: 0 10%;
  max-height: ${(props) => (props.isOpened ? '18rem' : '0')};
  transition: ${(props) => props.theme.animation.default} max-height ${(props) => props.theme.animation.easeOutQuart};

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    padding: 0;
  }

  ${Filters} {
    visibility: ${(props) => (props.isOpened ? 'visible' : 'hidden')};
  }
`;

const RangeMin = styled(Typography)`
  color: ${(props) => props.theme.color.white};

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    color: ${(props) => props.theme.color.brand};
  }
`;

const RangeMax = styled(Typography)`
  color: ${(props) => props.theme.color.white};

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    color: ${(props) => props.theme.color.brand};
  }
`;

const RangeValues = styled.div`
  display: flex;
  flex-direction: row;

  ${RangeMin} {
    margin-left: -0.8rem;
  }

  ${RangeMax} {
    margin-left: auto;
    margin-right: -0.8rem;
  }
`;

const ApplyFilterButton = styled(Button)`
  margin-top: 1rem;
  border-color: ${(props) => props.theme.color.white};
`;

const FilterRange = (props) => {
  const [min, setMin] = useState(
    props.slider.values.selected
      ? props.slider.values.selected_range.start / 100
      : props.slider.values.range_starts / 100
  );

  const [max, setMax] = useState(
    props.slider.values.selected
      ? props.slider.values.selected_range.end / 100
      : props.slider.values.range_ends / 100
  );

  const [loading, setLoading] = useState(false);

  const handleOnChange = (values) => {
    setMin(values.min);
    setMax(values.max);
  };

  const handleApplyFilter = () => {
    setLoading(true);
    const {
      af: activeFilters = '',
      brand = null,
      cat1 = null,
      cat2 = null,
      cat3 = null,
      edit = null,
      trend = null,
      ...otherQueries
    } = Router.query;

    let filters = activeFilters.trim();
    const otherFilters = activeFilters.split(' ').filter((f) => !['cat1', 'cat2', 'cat3', 'trend', 'edit', 'sprice'].includes(f.split(':')[0]));

    if (trend) filters += `${filters ? ' ' : ''}trends:${slugToSli(trend)}`;
    if (brand) filters += `${filters ? ' ' : ''}brand:${slugToSli(brand, true)}`;
    if (edit) filters += `${filters ? ' ' : ''}edits:${slugToSli(edit)}`;

    if (cat1) filters += `${filters ? ' ' : ''}cat1:${slugToSli(cat1)}`;
    if (cat2) filters += `${filters ? ' ' : ''}cat2:${slugToSli(cat1)}_${slugToSli(cat2)}`;
    if (cat3) filters += `${filters ? ' ' : ''}cat3:${slugToSli(cat1)}_${slugToSli(cat2)}_${slugToSli(cat3)}`;

    filters = filters ?? null;

    filters = filters.split(' ').filter((f) => !f.split(':')[0] === 'sprice').join(' ');
    filters += `${filters ? ' ' : ''}${props.slider.id}:[${min * 100},${max * 100}]`;

    const href = {
      pathname: Router.pathname,
      query: { ...Router.query, af: [filters, ...otherFilters ?? null].join(' ') }
    };

    const as = {
      pathname: global.window.location.pathname,
      query: {
        ...otherQueries,
        af: [filters, ...otherFilters ?? null].join(' ')
      }
    };

    logAmplitude('Clicked Facet', {
      navigationItem: filters,
      selected: true,
      facets: [filters, ...otherFilters ?? null]?.filter((x) => !['cat1', 'cat2', 'cat3'].includes(x.split(':')[0]))?.join(';')
    });

    Router.push(href, as).then(() => {
      props.setOpened(false);
      setLoading(false);
    });
  };

  useEffect(() => {
    setMin(
      props.slider.values.selected
        ? props.slider.values.selected_range.start / 100
        : props.slider.values.range_starts / 100
    );

    setMax(
      props.slider.values.selected
        ? props.slider.values.selected_range.end / 100
        : props.slider.values.range_ends / 100
    );
  }, [props.slider]);

  return (
    <FiltersWrapper isOpened={props.isOpened}>
      <Filters aria-hidden={!props.isOpened}>
        <RangeValues>
          <RangeMin element="span" like="label-1">
            {formatMoney(min, { precision: 0 })}
          </RangeMin>

          <RangeMax element="span" like="label-1">
            {formatMoney(max, { precision: 0 })}
          </RangeMax>
        </RangeValues>

        <InputRange
          disabled={!props.isOpened || loading}
          min={props.slider.values.range_starts / 100}
          max={props.slider.values.range_ends / 100}
          step={1}
          onChange={handleOnChange}
          value={{ min, max }}
        />

        <ApplyFilterButton
          disabled={!props.isOpened || loading}
          onClick={handleApplyFilter}
        >
          Apply Price Filter
        </ApplyFilterButton>
      </Filters>
    </FiltersWrapper>
  );
};

FilterRange.defaultProps = {};

FilterRange.propTypes = {
  slider: PropTypes.object.isRequired,
  isOpened: PropTypes.bool.isRequired,
  setOpened: PropTypes.func.isRequired
};

export default FilterRange;
