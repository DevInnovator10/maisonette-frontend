import getPLPMetadata from '../index';
import editsMetaOverrides from '../utils/editsMetaOverrides.json';

describe('Edit Page Metadata Overrides', () => {
  const pageType = 'edit';
  let props = {
    edit: null,
    searchState: {
      hierarchicalMenu: {},
      refinementList: {},
      range: {}
    }
  };

  describe('Static Overrides provided by SEO team', () => {
    describe('Static overrides for no Hierarchical menu or facets', () => {
      beforeEach(() => {
        props = {
          edit: null,
          searchState: {
            hierarchicalMenu: {},
            refinementList: {},
            range: {}
          }
        };
      });

      it('is correct for stocking-stuffers edit', () => {
        props.edit = 'stocking-stuffers';
        expect(getPLPMetadata(pageType, props)).toEqual(editsMetaOverrides['stocking-stuffers']);
      });

      it('is correct for big-brother-sister edit', () => {
        props.edit = 'big-brother-sister';
        expect(getPLPMetadata(pageType, props)).toEqual(editsMetaOverrides['big-brother-sister']);
      });

      it('is correct for halloween-accessories edit', () => {
        props.edit = 'halloween-accessories';
        expect(getPLPMetadata(pageType, props)).toEqual(editsMetaOverrides['halloween-accessories']);
      });
    });

    describe('Static overrides for the Hierarchical Menu', () => {
      beforeEach(() => {
        props = {
          edit: null,

          searchState: {
            hierarchicalMenu: {},
            refinementList: {},
            range: {}
          }
        };
      });

      it('is correct for holiday-dressings/baby', () => {
        props.edit = 'holiday-dressing';
        props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby';
        expect(getPLPMetadata(pageType, props)).toEqual(editsMetaOverrides['holiday-dressing'].hierarchicalMenuValues.baby);
      });

      it('is correct for holiday-dressing/kids', () => {
        props.edit = 'holiday-dressing';
        props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids';
        expect(getPLPMetadata(pageType, props)).toEqual(editsMetaOverrides['holiday-dressing'].hierarchicalMenuValues.kids);
      });

      it('is correct for holiday-dressing/whats-new/shops/the-pet-shop', () => {
        props.edit = 'holiday-dressing';
        props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'whats-new > shops > the-pet-shop';
        expect(getPLPMetadata(pageType, props)).toEqual(editsMetaOverrides['holiday-dressing'].hierarchicalMenuValues['whats-new > shops > the-pet-shop']);
      });
    });

    describe('Static overrides for Filters Only', () => {
      beforeEach(() => {
        props = {
          edit: null,
          searchState: {
            hierarchicalMenu: {},
            refinementList: {},
            range: {}
          }
        };
      });

      it('is correct for holiday-dressing with the 8-12y Age Range filter active', () => {
        props.edit = 'holiday-dressing';
        props.searchState.refinementList = { 'variants.age_range': ['8-12y'] };
        expect(getPLPMetadata(pageType, props)).toEqual(editsMetaOverrides['holiday-dressing'].activeRefinementList['variants.age_range']['8-12y']);
      });

      it('is correct for holiday-dressing with the Adults Age Range filter active', () => {
        props.edit = 'holiday-dressing';
        props.searchState.refinementList = { 'variants.age_range': ['Adults'] };
        expect(getPLPMetadata(pageType, props)).toEqual(editsMetaOverrides['holiday-dressing'].activeRefinementList['variants.age_range'].Adults);
      });

      it('is correct for holiday-dressing with multiple age range active filters', () => {
        props.edit = 'holiday-dressing';
        props.searchState.refinementList = { 'variants.age_range': ['Adults', '8-12y'] };
        expect(getPLPMetadata(pageType, props)).toEqual(editsMetaOverrides['holiday-dressing'].default);
      });

      it('is correct for holiday-dressing with other active filters', () => {
        props.edit = 'holiday-dressing';
        props.searchState.refinementList = { 'variants.age_range': ['Adults'], color: ['Pink'] };
        expect(getPLPMetadata(pageType, props)).toEqual(editsMetaOverrides['holiday-dressing'].default);
      });

      it('is correct for holiday-dressing with one different/non-rule specific active filter', () => {
        props.edit = 'holiday-dressing';
        props.searchState.refinementList = { color: ['Pink'] };
        expect(getPLPMetadata(pageType, props)).toEqual(editsMetaOverrides['holiday-dressing'].default);
      });

      it('is correct for holiday-dressing when a price range is applied', () => {
        props.edit = 'holiday-dressing';
        props.searchState.range = {
          'variants.maisonette_sale': {
            min: 103, max: 1278
          }
        };
        expect(getPLPMetadata(pageType, props)).toEqual(editsMetaOverrides['holiday-dressing'].default);
      });

      it('is correct for for halloween-accessories when a filter is applied', () => {
        props.edit = 'halloween-accessories';
        props.searchState.refinementList = { 'variants.age_range': ['Adults'] };
        expect(getPLPMetadata(pageType, props)).toEqual(editsMetaOverrides['halloween-accessories']);
      });
    });
  });
});
