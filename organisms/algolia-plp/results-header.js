import React, { Fragment } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { connectStateResults } from 'react-instantsearch-dom';
import getPLPMetadata from './utils/plpMetadata';
import PageHeader from '../../tissues/page-header';
import PageFilterHeader from '../../tissues/page-filter-header';
import Typography from '../../atoms/typography';
import { TRENDS_MAP } from './utils/helpers';
import prettifySlug from '../../utils/prettifySlug';
import retrieveFormattedCategories from './utils/retrieveFormattedCategories';
import checkRunningPromotion from '../../tissues/page-filter-header/utils/checkRunningPromotion';
import editsExceptions from '../../tissues/page-filter-header/utils/editsExceptions.json';

const SubHeader = styled(Typography)`
    color: ${(props) => props.theme.color.brandLight};
  letter-spacing: inherit;
  text-decoration: none;
`;

const SubHeaderLink = styled(SubHeader)`
  color: ${(props) => props.theme.color.brand};
  transition: color ${(props) => props.theme.animation.default} ${(props) => props.theme.animation.easeOutQuad};

  &:hover {
    color: ${(props) => props.theme.color.brandLight};
  }
`;

const HeaderText = styled(Typography)`
  text-transform: capitalize;
`;

const HeaderLink = styled(HeaderText)`
  color: ${(props) => props.theme.color.brand};
  transition: color ${(props) => props.theme.animation.default} ${(props) => props.theme.animation.easeOutQuad};
  text-decoration: none;

  &:hover {
    color: ${(props) => props.theme.color.brandLight};
  }
`;

const ResultsHeader = ({
  brand,
  edit,
  trend,
  searchResults,
  searchState
}) => {
  const hasResults = searchResults && searchResults.nbHits !== 0;
  const query = searchState && searchState.query;
  const { hierarchicalMenu = {}, refinementList = {} } = searchState;

  const livePromotion = checkRunningPromotion(Date.now());

  // edit Pageheaders are usually handled in ./algolia.js in the QueryRuleCustomData component
  // UNLESS there is a filter header specified for a promotion.
  // the editsExceptions can be used to determine if the edits PLP has a filter header
  if (edit && editsExceptions[edit] && livePromotion && livePromotion.edits_slug[edit]) {
    return <PageFilterHeader currentPromotion={livePromotion.salePromotion} />;
  }

  // edit PageHeaders are handled in ./algolia.js in the QueryRuleCustomData component
  if (edit || !hasResults) return null;

  /* Brand Header */
  if (brand) {
    const { heading } = getPLPMetadata('brand', { brand, searchState, searchResults });

    return (
      <PageHeader
        isBrand
        heading={heading}
        subHeading="Brand"
        text={brand.description ?? ''}
        image={brand.icon ?? ''}
        meta_data={brand.meta_data}
        brandFilters={brand.permalink === 'brands/maison-me' ? [
          ['Baby', { cats: ['baby'] }],
          ['Kids', { cats: ['kids'] }],
          ['Adult', { refinements: ['variants.age_range=Adults'] }],
          ['Shop All', {}]
        ] : null}
      />
    );
  }

  /* Trend Header */
  if (TRENDS_MAP[trend]) {
    const { heading } = getPLPMetadata('trend', { trend, searchState, searchResults });

    return <PageHeader heading={heading || TRENDS_MAP[trend]} />;
  }

  /* Headers if there are categories */
  if (hierarchicalMenu && hierarchicalMenu['categories_slug.lvl0']) {
    const activeCategories = hierarchicalMenu['categories_slug.lvl0'].split(' > ');
    // eslint-disable-next-line max-len
    const formattedCategories = retrieveFormattedCategories(activeCategories, { searchState, searchResults });

    const SubHeading = () => {
      const cats = trend
        ? activeCategories
        : activeCategories.slice(0, activeCategories.length - 1);

      const formattedCats = trend
        ? formattedCategories
        : formattedCategories.slice(0, activeCategories.length - 1);

      const getHref = (idx) => {
        if (idx === 1) return `/${trend ? `trends/${trend}` : 'shop'}/${cats[0]}/${cats[1]}`;
        return `/${trend ? `trends/${trend}` : 'shop'}/${cats[0]}`;
      };

      if (trend) {
        return cats.map((cat, idx) => (idx + 1 !== cats.length
          ? (
            <Fragment key={cat}>
              <Link href={getHref(idx)} passHref>
                <SubHeaderLink element="a" like="label-1">{formattedCats[idx] ?? prettifySlug(cat)}</SubHeaderLink>
              </Link>

              {cats.length >= 2 && idx < cats.length - 1 && ' | '}
            </Fragment>
          ) : (
            <Fragment key={cat}>
              <SubHeader element="span" like="label-1">{formattedCats[idx] ?? prettifySlug(cat)}</SubHeader>

              {cats.length >= 2 && idx < cats.length - 1 && ' | '}
            </Fragment>
          )));
      }

      return (
        cats.map((cat, idx) => (
          <Fragment key={cat}>
            <Link href={getHref(idx)} passHref>
              <SubHeaderLink element="a" like="label-1">{formattedCats[idx] ?? prettifySlug(cat)}</SubHeaderLink>
            </Link>

            {cats.length === 2 && idx === 0 && ' | '}
          </Fragment>
        ))
      );
    };

    const Heading = () => {
      if (TRENDS_MAP[trend]) {
        return (
          <Link href={`/trends/${trend}`} passHref>
            <HeaderLink element="a" like="heading-2">{ TRENDS_MAP[trend]}</HeaderLink>
          </Link>
        );
      }

      const cat = activeCategories[activeCategories.length - 1];

      const { heading } = getPLPMetadata(trend ? 'trend' : 'shop', { trend, searchState, searchResults }) || false;

      return heading || prettifySlug(cat);
    };

    // if the page is a /trends page with categories
    if (TRENDS_MAP[trend]) {
      return <PageHeader subHeading={<SubHeading />} heading={<Heading />} />;
    }

    // if there is only 1 category, then omit the SubHeading
    if (activeCategories.length === 1) return <PageHeader heading={<Heading />} />;

    return <PageHeader subHeading={<SubHeading />} heading={<Heading />} />;
  }

  if (query) return <PageHeader subHeading="search" heading={query} />;

  /* if there is heading for a faceted only page */
  if (!hierarchicalMenu['categories_slug.lvl0'] && Object.keys(refinementList).length) {
    const { heading } = getPLPMetadata('shop', { searchState, searchResults }) || false;

    if (heading) {
      return <PageHeader heading={heading} />;
    }
  }

  return null;
};

ResultsHeader.defaultProps = {
  brand: null,
  edit: null,
  trend: null,
  searchResults: null,
  searchState: null
};

ResultsHeader.propTypes = {
  brand: PropTypes.object,
  edit: PropTypes.string,
  trend: PropTypes.string,
  searchResults: PropTypes.object,
  searchState: PropTypes.object
};

export default connectStateResults(ResultsHeader);
