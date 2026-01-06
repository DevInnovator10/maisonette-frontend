/* eslint-disable no-param-reassign */
import qs from 'qs';
import buildUrl from 'build-url';
import facetsJson from '../facets.json';
// TODO: delete facets.json file & this file once we no longer need to redirect

const blacklist = [
  'utm_medium',
  'utm_source',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'td',
  '_ke',
  'variation',
  'ranMID',
  'gclid',
  'msclkid',
  'fbclid',
  'pp',
  'epik'
];

const facetTypeMap = {

  category: 'product_type',
  agerange: 'variants.age_range',
  clothingsizes: 'variants.clothing_sizes',
  sprice: 'variants.maisonette_sale',
  shoesizes: 'variants.shoe_sizes'
};

export const TRENDS_MAP_FROM_URL = {
  justin: 'Just In',
  onsale: 'On Sale',
  exclusives: 'Exclusives',
  alltimebestsellers: 'All Time Best Sellers',
  monogrammable: 'Monogrammable',
  bestsellersthisseason: 'Best Sellers This Season',
  bestsellers: 'Best Sellers',
  sellingfast: 'Selling Fast',
  newthisweek: 'New This Week',
  sellingfastthisweek: 'Selling Fast This Week',
  sellingfasttoday: 'Selling Fast Today',
  mostwished: 'Most Wished',
  newtoday: 'New Today'
};

export const convertSLIPath = (urlPath) => {
  /* converts SLI structured URl to Algolia path */

  const [path, queries] = urlPath.split('?');

  const queryObject = qs.parse(queries);
  const {
    isort,
    af,
    w: query,
    page
  } = queryObject;

  let formattedFilters;

  if (af) {
    // af is 1 string with all filters appended. the filters are separated by a "+"
    // ex) af=color%3Apink%2Bgender%3Aboy%2Bgender%3Agirl
    // -> color:pink+gender:boy+gender:girl

    // need to split up the filters
    const filters = (() => {
      // there is an edge case for any category navigation links
      // under the "Women's" Top Nav.
      // these queries aren't separated by "+" but rather, spaces.
      // TODO: remove this edge case once category navigation links are updated
      if (af.includes(' ')) return af.split(' ');
      return af.split('+');
    })();

    const pairedFacetTypes = {};

    filters.forEach((filter) => {
      // each element is split by ":" to retrieve the facet type & value
      const [SLIFacetType, SLIfacetValue] = filter.split(':');

      // convert the type & value into Algolia form
      const facetType = facetTypeMap[SLIFacetType] ?? SLIFacetType;

      const facetValue = (() => {
        if (facetType === 'trends') return TRENDS_MAP_FROM_URL[SLIfacetValue];
        if (facetType === 'variants.maisonette_sale') {
          // eslint-disable-next-line no-useless-escape
          const removedBrackets = SLIfacetValue.replace(/[\[\]']+/g, '');
          const [min, max] = removedBrackets.split(',');

          if (!!min && !!max) return `${min}-${max}`;
          if (!!min && !max) return `min:${min}`;
          if (!min && !!max) return `max:${max}`;
        }

        return facetsJson[SLIFacetType]?.values?.find((v) => v.id === SLIfacetValue)?.name.replace('+', '%2B');
      })();

      if (facetValue) {
        // then place into an object via key value pairs.
        if (pairedFacetTypes[facetType]) {
          pairedFacetTypes[facetType].push(facetValue);

        } else {
          pairedFacetTypes[facetType] = [facetValue];
        }
      }
    });

    // alphabetize the facet types
    const alphabetizedFilters = Object.entries(pairedFacetTypes).sort((a, b) => {
      const facetType1 = a[0];
      const facetType2 = b[0];

      return facetType1 < facetType2 ? -1 : 1;
    });

    // alphabetize the facet values
    formattedFilters = alphabetizedFilters.reduce((obj, facet) => {
      const [facetType, facetValues] = facet;

      if (facetValues.length > 1) {
        const formattedValues = facetValues.sort().reduce((acc, curr) => {
          if (!acc.length) return acc + curr;
          return `${acc}+${curr}`;
        }, '');

        obj[facetType] = formattedValues;
      } else {
        // eslint-disable-next-line prefer-destructuring
        obj[facetType] = facetValues[0];
      }

      return obj;
    }, {});
  }

  const blacklistQueries = (() => {
    const blacklisted = {};

    blacklist.forEach((q) => {
      if (queryObject[q]) {
        blacklisted[q] = queryObject[q];
      }
    });

    return Object.keys(blacklisted).length ? blacklisted : null;
  })();

  const queryQualifications = !!(query
    || isort
    || formattedFilters
    || page
    || blacklistQueries
  );

  let finalUrl = buildUrl(
    path, {
      ...queryQualifications && {
        queryParams: {
          ...(query && { w: query }),
          ...(isort && { isort }),
          ...(formattedFilters && { ...formattedFilters }),
          ...(page && page !== '1' && { page }),
          ...(blacklistQueries && { ...blacklistQueries })
        }
      }
    }
  );

  if (finalUrl.includes('?')) {
    // remove '?' if there are no queries
    if (!finalUrl.split('?')[1]) finalUrl = finalUrl.slice(0, -1);
  }

  return finalUrl;
};
