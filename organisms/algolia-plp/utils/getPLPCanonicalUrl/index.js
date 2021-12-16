import buildUrl from 'build-url';
import deconstructURL from '../deconstructPath';
import rules from '../hyperlinkRules/hyperlinkRules.json';

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

const getPLPCanonicalUrl = (router) => {
  const { asPath } = router;

  const {
    pageType,
    pageValue,
    pathString,
    hierarchicalMenu,
    queries
  } = deconstructURL(asPath);

  const cleanURL = pageType === 'shop'
    ? `${process.env.NEXT_PUBLIC_CLIENT_HOST}${pathString}`
    : `${process.env.NEXT_PUBLIC_CLIENT_HOST}/${pageType}/${pageValue}`;

  let facetType;
  let facetValue;

  let hasPagination = false;
  let pageNum;

  // remove blacklist queries
  if (queries) {
    if (queries.page) {
      hasPagination = true;
      pageNum = queries.page;
      delete queries.page;
    }

    blacklist.forEach((b) => {
      if (queries[b]) delete queries[b];
    });
  }

  const addPagination = ((global = false) => {
    if (hasPagination) {
      if (!global) {
        queries.page = pageNum;
      } else {
        return `?page=${pageNum}`;
      }
    }

    return '';
  });

  const finalQueryString = () => {
    if (hasPagination) {
      addPagination();
    }

    return buildUrl(null, { queryParams: queries });
  };

  // check if the URL is an ad-hoc SEO agency request
  const adhocUrlCheck = hasPagination
    ? `${pathString}${buildUrl(null, { queryParams: queries })}`
    : asPath;

  if (rules.adHocCanonicals[adhocUrlCheck]) {
    const hierMenu = pageType !== 'shop' && hierarchicalMenu
      ? `/${hierarchicalMenu.join('/')}`
      : '';
    return `${cleanURL}${hierMenu}${finalQueryString()}`;
  }

  const onlyOneFilterAndValue = (() => {
    if (queries) {
      const filters = Object.keys(queries);

      if (filters.length === 1) {
        const type = filters[0];
        const value = queries[type];

        if (!value.includes('+')) {
          // eslint-disable-next-line prefer-destructuring
          facetType = type;
          facetValue = value;
          return true;
        }
      }
    }
    return false;
  })();

  if (pageType === 'edits') {
    return `${cleanURL}${addPagination(true)}`;
  }

  if (pageType === 'brands') {
    if (!hierarchicalMenu && onlyOneFilterAndValue && facetType === 'product_type') return `${cleanURL}${finalQueryString()}`;
    return `${cleanURL}${addPagination(true)}`;
  }

  if (pageType === 'trends') {
    if (hierarchicalMenu && hierarchicalMenu.length === 1) {
      return `${cleanURL}/${hierarchicalMenu[0]}${addPagination(true)}`;
    }

    return `${cleanURL}${addPagination(true)}`;
  }

  // FOR SHOP PAGES
  if (hierarchicalMenu) {
    if ((hierarchicalMenu.length === 1 && hierarchicalMenu[0] !== 'gear')
      || !queries || !onlyOneFilterAndValue) return `${cleanURL}${addPagination(true)}`;

    const cat1 = hierarchicalMenu[0];
    const cat2 = hierarchicalMenu[1];

    const passesSpecificRules = () => {
      if (facetType === 'product_type') {
        if (hierarchicalMenu.length === 1) return cat1 === 'gear' && rules.secondLvlTaxonomyRules[cat1]?.[facetValue];
        return hierarchicalMenu.length === 2
          && rules.secondLvlTaxonomyRules[cat1]?.[cat2]?.[facetValue];
      }

      return false;
    };
    const passesCategoryRules = () => hierarchicalMenu.length === 3
      && rules.categoryRules[cat1]?.[facetType];
    const passesHomeCategoryRules = () => hierarchicalMenu.length === 3
      && cat1 === 'home' && facetType === 'gender' && rules.homeRules[facetValue];

    if (passesSpecificRules() || passesCategoryRules() || passesHomeCategoryRules()) {
      return `${cleanURL}${finalQueryString()}`;
    }

    return `${cleanURL}${addPagination(true)}`;
  }

  // GLOBAL/DEFAULT RULES:
  return `${cleanURL}${addPagination(true)}`;
};

export default getPLPCanonicalUrl;
