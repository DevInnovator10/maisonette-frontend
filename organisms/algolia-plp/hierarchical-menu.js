import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { connectHierarchicalMenu } from 'react-instantsearch-dom';

import Typography from '../../atoms/typography';
import { Heading } from './left-rail-shared';
import categoriesAnomaliesMap from './utils/categories.json';
import prettifySlug from '../../utils/prettifySlug';

const CategoryDetail = styled.details(() => ({
  outline: 0,
  ol: { marginLeft: '2rem' },
  summary: {
    outline: 'none',
    lineHeight: '3rem',
    '::-webkit-details-marker, ::before': {
      display: 'none !important'
    }
  }
}));

const CategorySummary = styled(Typography)(({ active, theme }) => ({
  cursor: 'pointer',
  display: 'flex',
  lineHeight: '3rem',
  textDecoration: 'none',
  transition: `${theme.animation.default} ${theme.animation.ease}`,
  span: { marginLeft: 'auto' },
  a: {
    color: active ? theme.color.brand : theme.color.brandLight,
    display: 'flex',
    textDecoration: 'none',
    width: '100%'
  },
  ':hover': {
    a: {
      color: theme.color.brand
    }
  }
}));

const HierarchicalMenu = ({
  items,
  refine,
  createURL
}) => {
  const getCategory = ({ value, isRefined, label }) => {
    // For refined category algolia provide value undefined or one level up category
    // which cause wrong urls
    let cat = value;
    if (isRefined && !value) {
      cat = label;
    } else if (isRefined) {
      cat = `${value} > ${label}`;
    }

    return cat;
  };

  const onCategoryClick = (e, item) => {
    e.preventDefault();
    refine(getCategory(item));
  };

  return (
    <ol>
      {
        items.map((item) => (
          <li key={item.label}>
            <CategoryDetail open={item.isRefined}>
              <CategorySummary
                element="summary"
                like="dec-1"
                active={item.isRefined}
                onClick={(event) => onCategoryClick(event, item)}
              >
                <a href={createURL(getCategory(item))}>
                  {categoriesAnomaliesMap[item.label] ?? prettifySlug(item.label)}
                  <span>{`(${item.count})`}</span>
                </a>
              </CategorySummary>
              {item.items && (
              <HierarchicalMenu
                items={item.items ?? []}
                refine={refine}
                createURL={createURL}
              />
              )}
            </CategoryDetail>
          </li>
        ))
      }
    </ol>
  );
};

HierarchicalMenu.propTypes = {
  createURL: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  refine: PropTypes.func.isRequired
};

const CategoryWrapper = styled.section``;

const Menu = styled(HierarchicalMenu)(() => ({ marginTop: '1rem ' }));

const Categories = ({
  createURL,
  items,
  refine,
  ...props
}) => (
  <CategoryWrapper {...props}>
    <Heading role="heading" aria-level="2" element="label" like="label-1">
      Categories
    </Heading>

    <Menu
      createURL={createURL}
      items={items}
      refine={refine}
    />
  </CategoryWrapper>
);

Categories.propTypes = {
  createURL: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  refine: PropTypes.func.isRequired
};

export default connectHierarchicalMenu(Categories);

export const attributes = [
  'categories_slug.lvl0',
  'categories_slug.lvl1',
  'categories_slug.lvl2'
];
