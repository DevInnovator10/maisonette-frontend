import hyperlinkRules from './index';
import rules from './hyperlinkRules.json';

describe('hyperlinkRules', () => {
  let searchState = {};
  let isBrandRefined = false;
  let isShop = false;

  describe('categoryPageHyperlinkCheck', () => {
    beforeEach(() => {
      searchState = {
        hierarchicalMenu: {},
        refinementList: {},
        range: {}
      };
      isBrandRefined = false;
      isShop = false;
    });

    const approvedCategoryRulesAndAttributes = [
      { cat: 'baby', attributes: ['color', 'variants.age_range'] }, { cat: 'kids', attributes: ['color'] }];

    const unapprovedCategoryRulesAndAttributes = [
      { cat: 'play', attributes: ['color', 'product_type'] }, { cat: 'gifts', attributes: ['color', 'gender'] }];

    it('returns true for approved categories with 3 levels of hierarchicalMenu no filters applied', () => {
      approvedCategoryRulesAndAttributes.forEach((rule) => {
        // set up method to be called on each attribute
        const { cat, attributes } = rule;
        isShop = true;
        searchState.hierarchicalMenu['categories_slug.lvl0'] = `${cat} > boy-clothing > tops`;

        const { categoryPageHyperlinkCheck } = hyperlinkRules(
          { isBrandRefined, isShop, searchState }
        );

        // call method on each attribute
        attributes.forEach((attribute) => {
          expect(categoryPageHyperlinkCheck({ attribute })).toBe(true);
        });
      });
    });

    it('returns undefined for unapproved categories with 3 levels of hierarchicalMenu', () => {
      unapprovedCategoryRulesAndAttributes.forEach((rule) => {
        // set up method to be called on each attribute
        const { cat, attributes } = rule;
        isShop = true;
        // the top two levels of the hierarchicalMenu are not checked against.
        // Only the count matters for this method.
        searchState.hierarchicalMenu['categories_slug.lvl0'] = `${cat} > boy-clothing > tops`;

        const { categoryPageHyperlinkCheck } = hyperlinkRules(
          { isBrandRefined, isShop, searchState }
        );

        // call method on each attribute
        attributes.forEach((attribute) => {
          expect(categoryPageHyperlinkCheck({ attribute })).toBe(undefined);
        });
      });
    });

    it('returns undefined when approved categories do not have 3 levels of hierarchicalMenu', () => {
      approvedCategoryRulesAndAttributes.forEach((rule) => {
        // set up method to be called on each attribute
        const { cat, attributes } = rule;
        isShop = true;
        searchState.hierarchicalMenu['categories_slug.lvl0'] = `${cat} > boy-clothing`;

        const { categoryPageHyperlinkCheck } = hyperlinkRules(
          { isBrandRefined, isShop, searchState }
        );

        // call method on each attribute
        attributes.forEach((attribute) => {
          expect(categoryPageHyperlinkCheck({ attribute })).toBe(undefined);
        });
      });
    });

    it('returns false when approved categories have a filter applied', () => {
      approvedCategoryRulesAndAttributes.forEach((rule) => {
        // set up method to be called on each attribute
        const { cat, attributes } = rule;
        isShop = true;
        searchState.hierarchicalMenu['categories_slug.lvl0'] = `${cat} > boy-clothing`;
        searchState.refinementList = {
          color: ['Pink']
        };

        const { categoryPageHyperlinkCheck } = hyperlinkRules(
          { isBrandRefined, isShop, searchState }
        );

        // call method on each attribute
        attributes.forEach((attribute) => {
          expect(categoryPageHyperlinkCheck({ attribute })).toBe(false);
        });
      });
    });

    it('returns false when approved categories have a price range applied', () => {
      approvedCategoryRulesAndAttributes.forEach((rule) => {
        // set up method to be called on each attribute
        const { cat, attributes } = rule;
        isShop = true;
        searchState.hierarchicalMenu['categories_slug.lvl0'] = `${cat} > boy-clothing`;
        searchState.range = {
          'variants.maisonette_sale': {
            min: 51,
            max: 2814
          }
        };

        const { categoryPageHyperlinkCheck } = hyperlinkRules(
          { isBrandRefined, isShop, searchState }
        );

        // call method on each attribute
        attributes.forEach((attribute) => {
          expect(categoryPageHyperlinkCheck({ attribute })).toBe(false);
        });
      });
    });

    it('returns false when not a shop page', () => {
      approvedCategoryRulesAndAttributes.forEach((rule) => {
        // set up method to be called on each attribute
        const { cat, attributes } = rule;
        isShop = false;
        searchState.hierarchicalMenu['categories_slug.lvl0'] = `${cat} > boy-clothing > tops`;

        const { categoryPageHyperlinkCheck } = hyperlinkRules(
          { isBrandRefined, isShop, searchState }
        );

        // call method on each attribute
        attributes.forEach((attribute) => {
          expect(categoryPageHyperlinkCheck({ attribute })).toBe(false);
        });
      });
    });
  });

  describe('brandPageHyperlinkCheck', () => {
    beforeEach(() => {
      searchState = {
        hierarchicalMenu: {},
        refinementList: {},
        range: {}
      };
      isBrandRefined = false;
      isShop = false;
    });

    it('returns true for a brand page with no hierarchicalMenu and no filters/ranges applied', () => {
      isBrandRefined = true;

      const { brandPageHyperlinkCheck } = hyperlinkRules(
        { isBrandRefined, isShop, searchState }
      );

      expect(brandPageHyperlinkCheck).toBe(true);
    });

    it('returns false when not a brand page', () => {
      isBrandRefined = false;

      const { brandPageHyperlinkCheck } = hyperlinkRules(
        { isBrandRefined, isShop, searchState }
      );

      expect(brandPageHyperlinkCheck).toBe(false);
    });

    it('returns false for a brand page with a filter applied', () => {
      isBrandRefined = true;
      searchState.refinementList = {
        color: ['Pink']
      };
      const { brandPageHyperlinkCheck } = hyperlinkRules(
        { isBrandRefined, isShop, searchState }
      );

      expect(brandPageHyperlinkCheck).toBe(false);
    });

    it('returns false for a brand page with a price range applied', () => {
      isBrandRefined = true;
      searchState.range = {
        'variants.maisonette_sale': {
          min: 51,
          max: 2814
        }
      };

      const { brandPageHyperlinkCheck } = hyperlinkRules(
        { isBrandRefined, isShop, searchState }
      );

      expect(brandPageHyperlinkCheck).toBe(false);
    });

    it('returns false on a brand page with a hierarchicalMenu', () => {
      isBrandRefined = true;
      searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids';
    });

    const { brandPageHyperlinkCheck } = hyperlinkRules(
      { isBrandRefined, isShop, searchState }
    );

    expect(brandPageHyperlinkCheck).toBe(false);
  });

  describe('itemsForHyperlinkCheck', () => {
    beforeEach(() => {
      searchState = {
        hierarchicalMenu: {},
        refinementList: {},
        range: {}
      };
      isBrandRefined = false;
      isShop = false;
    });

    describe('2nd Level Taxonomies Rules', () => {
      const hmsInSpecificRules = (() => {
        // creates hierarchicalMenus based on the hardcoded specific rules in 'hyperlinkRules.json'
        const hierarchicalMenus = [];
        const cat1s = Object.keys(rules.secondLvlTaxonomyRules).filter((cat1) => cat1 !== 'gear');
        cat1s.forEach((cat1) => {
          const values = rules.secondLvlTaxonomyRules[cat1];
          const cat2s = Object.keys(values);
          // ewwww
          cat2s.forEach((cat2) => {
            const hm = `${cat1} > ${cat2}`;
            hierarchicalMenus.push(hm);
          });
        });
        return hierarchicalMenus;
      })();

      const hmsNotInSpecificRules = ['play > learning', 'play > baby', 'holiday > decor', 'holiday > gifts'];

      it('returns the proper items for the specific rules', () => {
        isShop = true;
        hmsInSpecificRules.forEach((hm) => {
          searchState.hierarchicalMenu['categories_slug.lvl0'] = hm;
          const [cat1, cat2] = hm.split(' > ');

          const { itemsForHyperlinkCheck } = hyperlinkRules(
            { isBrandRefined, isShop, searchState }
          );

          expect(itemsForHyperlinkCheck).toBe(rules.secondLvlTaxonomyRules[cat1][cat2]);
        });
      });

      it('returns undefined with hierarchicalMenu not in specific rules', () => {
        isShop = true;
        hmsNotInSpecificRules.forEach((hm) => {
          searchState.hierarchicalMenu['categories_slug.lvl0'] = hm;

          const { itemsForHyperlinkCheck } = hyperlinkRules(
            { isBrandRefined, isShop, searchState }
          );

          expect(itemsForHyperlinkCheck).toBe(undefined);
        });
      });

      it('returns the proper items for the "gear" category', () => {
        isShop = true;
        searchState.hierarchicalMenu['categories_slug.lvl0'] = 'gear';

        const { itemsForHyperlinkCheck } = hyperlinkRules(
          { isBrandRefined, isShop, searchState }
        );

        expect(itemsForHyperlinkCheck).toBe(rules.secondLvlTaxonomyRules.gear);
      });
    });

    describe('3rd Level Taxonomies Rules', () => {
      const exposedThirdLvlTaxonomies = (() => {
        // creates hierarchicalMenus based on the hardcoded specific rules in 'hyperlinkRules.json'
        const hierarchicalMenus = [];
        const cat1s = Object.keys(rules.thirdLvlTaxonomyRules);
        cat1s.forEach((cat1) => {
          const cat2s = Object.keys(rules.thirdLvlTaxonomyRules[cat1]);
          cat2s.forEach((cat2) => {
            const cat3s = Object.keys(rules.thirdLvlTaxonomyRules[cat1][cat2]);
            cat3s.forEach((cat3) => {
              const hm = `${cat1} > ${cat2} > ${cat3}`;
              hierarchicalMenus.push(hm);
            });
          });
        });
        return hierarchicalMenus;
      })();

      const invalidThirdLvlTaxonimes = ['play > learning > art', 'kids > girl-clothing > dresses'];

      it('returns the proper items for exposed 3rd lvl taxonomies', () => {
        isShop = true;
        exposedThirdLvlTaxonomies.forEach((hm) => {
          searchState.hierarchicalMenu['categories_slug.lvl0'] = hm;
          const [cat1, cat2, cat3] = hm.split(' > ');

          const { itemsForHyperlinkCheck } = hyperlinkRules(
            { isBrandRefined, isShop, searchState }
          );

          expect(itemsForHyperlinkCheck).toBe(rules.thirdLvlTaxonomyRules[cat1][cat2][cat3]);
        });
      });

      it('returns undefined with an invalid hierarchicalMenu', () => {
        isShop = true;
        invalidThirdLvlTaxonimes.forEach((hm) => {
          searchState.hierarchicalMenu['categories_slug.lvl0'] = hm;

          const { itemsForHyperlinkCheck } = hyperlinkRules(
            { isBrandRefined, isShop, searchState }
          );

          expect(itemsForHyperlinkCheck).toBe(undefined);
        });
      });
    });

    describe('Exposed Applied product_type Filter', () => {
      const exposedHMswithRefines = {};

      const exposedHM = (() => {
        // creates hierarchicalMenus based on the hardcoded specific rules in 'hyperlinkRules.json'
        const hierarchicalMenus = [];
        const cat1s = Object.keys(rules.exposedAppliedFilter);
        cat1s.forEach((cat1) => {
          const cat2s = Object.keys(rules.exposedAppliedFilter[cat1]);
          cat2s.forEach((cat2) => {
            const cat3s = Object.keys(rules.exposedAppliedFilter[cat1][cat2]);
            cat3s.forEach((cat3) => {
              const hm = `${cat1} > ${cat2} > ${cat3}`;
              hierarchicalMenus.push(hm);

              const refinements = Object.keys(rules.exposedAppliedFilter[cat1][cat2][cat3]);
              exposedHMswithRefines[hm] = refinements;
            });
          });
        });
        return hierarchicalMenus;
      })();

      const invalidThirdLvlTaxonimes = ['play > learning > art', 'kids > girl-clothing > dresses'];

      const invalidRefinements = [{ product_type: 'Baby Snakes' }];

      it('returns the proper items for HMs with an exposed applied product type filter', () => {
        isShop = true;
        exposedHM.forEach((hm) => {
          searchState.hierarchicalMenu['categories_slug.lvl0'] = hm;

          const exposedRefinements = exposedHMswithRefines[hm];
          exposedRefinements.forEach((refinement) => {
            searchState.refinementList.product_type = [refinement];
            const [cat1, cat2, cat3] = hm.split(' > ');

            const { itemsForHyperlinkCheck } = hyperlinkRules(
              { isBrandRefined, isShop, searchState }
            );

            expect(itemsForHyperlinkCheck).toBe(rules.exposedAppliedFilter[cat1][cat2][cat3]);
          });
        });
      });

      it('returns false with an invalid hierarchicalMenu and invalid product type filter', () => {
        isShop = true;
        invalidThirdLvlTaxonimes.forEach((hm) => {
          searchState.hierarchicalMenu['categories_slug.lvl0'] = hm;

          invalidRefinements.forEach((refinement) => {
            searchState.refinementList = refinement;

            const { itemsForHyperlinkCheck } = hyperlinkRules(
              { isBrandRefined, isShop, searchState }
            );

            expect(itemsForHyperlinkCheck).toBe(undefined);
          });
        });
      });
    });

    describe('Other Criteria', () => {
      it('returns the proper items for the "home" category with 3 levels of hierarchicalMenu', () => {
        isShop = true;
        searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > seasonal > easter';

        const { itemsForHyperlinkCheck } = hyperlinkRules(
          { isBrandRefined, isShop, searchState }
        );

        expect(itemsForHyperlinkCheck).toBe(rules.homeRules);
      });

      it('returns false with a filter applied', () => {
        isShop = true;
        searchState.refinementList = {
          color: ['Pink']
        };

        const { itemsForHyperlinkCheck } = hyperlinkRules(
          { isBrandRefined, isShop, searchState }
        );

        expect(itemsForHyperlinkCheck).toBe(false);
      });

      it('returns false when a price range is applied', () => {
        isShop = true;
        searchState.range = {
          'variants.maisonette_sale': {
            min: 51,
            max: 2814
          }
        };

        const { itemsForHyperlinkCheck } = hyperlinkRules(
          { isBrandRefined, isShop, searchState }
        );

        expect(itemsForHyperlinkCheck).toBe(false);
      });

      it('return false when not a shop page', () => {
        isShop = false;

        const { itemsForHyperlinkCheck } = hyperlinkRules(
          { isBrandRefined, isShop, searchState }
        );

        expect(itemsForHyperlinkCheck).toBe(false);
      });
    });
  });
});
