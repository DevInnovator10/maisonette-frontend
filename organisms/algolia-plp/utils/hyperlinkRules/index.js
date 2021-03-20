import rules from './hyperlinkRules.json';

const hyperlinkRules = ({ searchState, isBrandRefined, isShop }) => {
  const activeCategories = searchState?.hierarchicalMenu?.['categories_slug.lvl0']?.length
    ? searchState?.hierarchicalMenu?.['categories_slug.lvl0']?.split(' > ')
    : [];

  const [cat1, cat2, cat3] = activeCategories;

  const activeFilters = Object.keys(searchState?.refinementList ?? {});
  const activeRanges = Object.keys(searchState?.range ?? {});

  /*
    This logic deals with rendering filter selectors as hyperlinks for SEO value.
    The rules are linked in ticket TEC-5152 and are hardcoded conditions and urls
    given to us by the SEO consultants as rules, which will likely be updated in the
    future.

    At a high level, most rules are dependant on pages and active categories. At a low
    level, some rules are dependant on the attribute values and some on specific values for
    the individual filter items. The logic is separated into those two areas and should
    be used to either supply a global 'true' value for the attribute or an object of item
    values to be checked against.

    The rules live in './hyperlinkRules.json' and are broken down into objects according to
    categories supplied in the rules and the values are returned to be passed into the proper
    RefinementList components, which are separated by attribute.
  */

  // Global rule: do not use hyperlinks when a filter is active.
  const activeFilterCheck = activeFilters.length === 0 && activeRanges.length === 0;

  /*
    Brand pages: isBrandRefined
      Only the 'category' filters (now product_type) should be hyperlinks,
      and only for brand pages without hierarchical menus.
      example: /brands/maison-me
  */
  const brandPageHyperlinkCheck = () => activeFilterCheck && isBrandRefined
    && !activeCategories.length;

  /*
    Shop pages: isShop
      Only filters under certain attributes should use hyperlinks.
      The below values are only passed into the RefinementList components with the
      proper attribute values.
  */

  // handles attribute rules for 'baby' and 'kids' for 3rd level taxonomy.
  const categoryPageHyperlinkCheck = ({ attribute }) => activeFilterCheck
  && isShop && cat3 && rules.categoryRules[cat1]?.[attribute];

  // some checks need to be specific to filter item values.
  // this returns an object of filter items that should be hyperlinks
  // which are passed to the RefinementList if they exist.
  const itemsForHyperlinkCheck = () => {
    //! EDGE CASE. please see TEC-6317
    if (!activeFilterCheck && activeFilters.length === 1 && activeRanges.length === 0) {
      if (activeFilters[0] === 'product_type') {
        return rules.exposedAppliedFilter[cat1]?.[cat2]?.[cat3];
      }
    }

    return activeFilterCheck && isShop && (
      // handles specific rules for 2nd level taxonomy. see ticket TEC-5152
      (!cat3 && rules.secondLvlTaxonomyRules[cat1]?.[cat2])
      // handles specific rules related to 'gear'
      || (cat1 === 'gear' && rules.secondLvlTaxonomyRules[cat1])
      // handles rules for 'home' for specific 'gender' values for 3rd level taxonomy
      || (cat3 && cat1 === 'home' && rules.homeRules)
      // handles rules for 3rd level taxonomy. see TEC-6317
      || (cat3 && rules.thirdLvlTaxonomyRules[cat1]?.[cat2]?.[cat3]));
  };

  return {
    categoryPageHyperlinkCheck,
    brandPageHyperlinkCheck: brandPageHyperlinkCheck(),
    itemsForHyperlinkCheck: itemsForHyperlinkCheck()
  };
};

export default hyperlinkRules;
