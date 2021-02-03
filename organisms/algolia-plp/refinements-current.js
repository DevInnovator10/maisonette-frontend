import React from 'react';
import { connectCurrentRefinements } from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { formatMoney } from 'accounting-js';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { getActiveMini } from '../../tissues/filter-list-remove';

import { updateActiveMini } from '../../store/modules/petites/actions';
import Button from '../../atoms/button';
import refinementMap from './utils/refinement-map.json';
import slugToSLI from '../../utils/slugToSLI';
import Typography from '../../atoms/typography';
import { logAmplitude } from '../../utils/amplitude';

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

const Category = styled(Typography)(({ theme }) => ({
  color: theme.color.brandLight,
  lineHeight: '3rem',
  paddingRight: '1rem'
}));

const Facet = styled(Typography)(({ theme }) => ({
  color: theme.color.white,
  lineHeight: '3rem',
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    color: theme.color.brand
  }
}));

const RemoveFilter = styled(Button)(({ theme }) => ({
  background: 'transparent',
  borderColor: theme.color.white,
  borderWidth: 1,
  color: theme.color.white,
  lineHeight: 'calc(3rem - 2px)',
  margin: '1rem 0',
  outline: 0,
  whiteSpace: 'nowrap',
  width: '100%',
  [`@media screen and (min-width: ${theme.breakpoint.medium})`]: {
    background: theme.color.brand,
    borderColor: theme.color.brand,
    color: theme.color.white
  }
}));

const List = styled.ul(({ facets, total }) => ({
  paddingBottom: facets.length > 0 ? '1rem' : undefined,
  borderBottom: total ? '1px solid #3150A2' : undefined
}));

const CurrentRefinements = ({
  isBrandRefined,
  items,
  refine
}) => {
  const router = useRouter();
  const petites = useSelector((state) => state.petites);
  const dispatch = useDispatch();

  const onRefinementClick = (e, item, category) => {
    e.preventDefault();
    const facets = router.query?.af?.replaceAll('+', ';');
    const navigationItem = `${category.id}:${slugToSLI(item.label.toLowerCase())}`;

    logAmplitude('Clicked Facet', {
      navigationItem,
      filterAction: 'Filter Removed',
      selected: false,
      facets
    });
    refine(item.value);
  };

  const facets = [
    ...new Map(
      items
        .filter((item) => {
          const flags = item.attribute !== 'edits'
            && item.attribute !== 'trends_slug'
            && item.attribute !== 'trends'
            && item.items;
          return isBrandRefined ? item.attribute !== 'brand' && flags : flags;
        })
        .map((item) => [item.id, item])
    ).values()
  ];

  const price = items.find((item) => item.id === 'variants.maisonette_sale');

  const total = facets.reduce((sum, curr) => sum + curr.items.length, price ? 1 : 0);

  const handleOnClick = (e, nested, category) => {
    const finalFilterApplied = facets[0].currentRefinement.length === 1;

    if (finalFilterApplied) {
      const mini = petites.active_mini ? getActiveMini(petites.active_mini, petites.minis) : false;

      if (mini) {
        const filterToRemove = nested.label;
        const isTheLastFilterAppliedToMini = mini.taxons.some((f) => (category.id === f.category)
          && (filterToRemove === f.value));

        if (isTheLastFilterAppliedToMini) {
          dispatch(updateActiveMini(0));
          global.document.cookie = 'maisonette_active_mini=0; path=/';
        }
      }
    }

    onRefinementClick(e, nested, category);
  };

  const handleOnClearAll = () => {
    dispatch(updateActiveMini(0));
    global.document.cookie = 'maisonette_active_mini=0; path=/';
    refine([...facets, ...(price ? [price] : [])]);
  };

  return (
    <List facets={facets} total={total}>
      {
        facets.filter((x) => !x.attribute !== 'edits').map((item) => item.items.map((nested) => (
          <li key={`${item.label}-${nested.label}`}>
            <LabelWrapper
              styledLikeLink
              aria-label={`remove filter, ${refinementMap[item.id].label} ${nested.label}`}
              onClick={(e) => handleOnClick(e, nested, refinementMap[item.id])}
            >
              <Category element="p" like="dec-1">{refinementMap[item.id].label}</Category>
              <Facet element="p" like="dec-1">{nested.label}</Facet>
            </LabelWrapper>
          </li>
        )))
      }

      {
        price && (
          <LabelWrapper
            styledLikeLink
            aria-label={'remove filter, Price'}
            onClick={(e) => onRefinementClick(e, price, refinementMap[price.id])}
          >
            <Category element="p" like="dec-1">Price</Category>
            <Facet element="p" like="dec-1">
              {`${formatMoney(price.currentRefinement.min, { precision: 0 })} - ${formatMoney(price.currentRefinement.max, { precision: 0 })}`}
            </Facet>
          </LabelWrapper>
        )
      }

      {
        total > 1 && (
          <RemoveFilter onClick={handleOnClearAll}>Clear All Filters</RemoveFilter>
        )
      }
    </List>
  );
};

CurrentRefinements.defaultProps = {
  isBrandRefined: false,
  items: []
};

CurrentRefinements.propTypes = {
  isBrandRefined: PropTypes.bool,
  items: PropTypes.array,
  refine: PropTypes.func.isRequired
};

export default connectCurrentRefinements(CurrentRefinements);
