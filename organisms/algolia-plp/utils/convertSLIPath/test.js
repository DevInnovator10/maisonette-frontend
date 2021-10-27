import { convertSLIPath } from '.';

describe('convertSLIPath() correctly formats applied filters to the Algolia URL structure', () => {
  let sliQueries;
  let expectedQueries;
  const pages = ['/shop', '/brands/maison-me', '/edits/big-brother-sister', '/trends/just-in'];

  describe('Individual Filters', () => {
    beforeEach(() => {
      sliQueries = '';
      expectedQueries = '';
    });

    it('Age Range -> variants.age_range', () => {
      sliQueries = '?af=agerange%3A68y';
      expectedQueries = '?variants.age_range=6-8y';

      pages.forEach((path) => {
        expect(convertSLIPath(`${path}${sliQueries}`)).toBe(`${path}${expectedQueries}`);
      });
    });

    it('Brand', () => {
      sliQueries = '?af=brand%3Amaisonme';
      expectedQueries = '?brand=Maison%20Me';

      pages.forEach((path) => {
        expect(convertSLIPath(`${path}${sliQueries}`)).toBe(`${path}${expectedQueries}`);
      });
    });

    it('Category -> product_type', () => {
      sliQueries = '?af=category%3Adresses';
      expectedQueries = '?product_type=Dresses';

      pages.forEach((path) => {
        expect(convertSLIPath(`${path}${sliQueries}`)).toBe(`${path}${expectedQueries}`);
      });
    });

    it('Clothing Sizes -> variants.clothing_sizes', () => {
      sliQueries = '?af=clothingsizes%3A6years';
      expectedQueries = '?variants.clothing_sizes=6%20years';

      pages.forEach((path) => {
        expect(convertSLIPath(`${path}${sliQueries}`)).toBe(`${path}${expectedQueries}`);
      });
    });

    it('Color', () => {
      sliQueries = '?af=color%3Amulti';

      expectedQueries = '?color=Multi';

      pages.forEach((path) => {
        expect(convertSLIPath(`${path}${sliQueries}`)).toBe(`${path}${expectedQueries}`);
      });
    });

    it('Gender', () => {
      sliQueries = '?af=gender%3Agirl';
      expectedQueries = '?gender=Girl';

      pages.forEach((path) => {
        expect(convertSLIPath(`${path}${sliQueries}`)).toBe(`${path}${expectedQueries}`);
      });
    });

    describe('Price (aka sprice) -> variants.maisonette_sale', () => {
      it('Minimum price only', () => {
        sliQueries = '?af=sprice%3A%5B2312%2C%5D';
        expectedQueries = '?variants.maisonette_sale=min%3A2312';

        pages.forEach((path) => {
          expect(convertSLIPath(`${path}${sliQueries}`)).toBe(`${path}${expectedQueries}`);
        });
      });

      it('Maximum price only', () => {
        sliQueries = '?af=sprice%3A%5B%2C5856%5D';
        expectedQueries = '?variants.maisonette_sale=max%3A5856';

        pages.forEach((path) => {
          expect(convertSLIPath(`${path}${sliQueries}`)).toBe(`${path}${expectedQueries}`);
        });
      });

      it('Price Range', () => {
        sliQueries = '?af=sprice%3A%5B606%2C5856%5D';
        expectedQueries = '?variants.maisonette_sale=606-5856';

        pages.forEach((path) => {
          expect(convertSLIPath(`${path}${sliQueries}`)).toBe(`${path}${expectedQueries}`);
        });
      });
    });

    it('Shoe Sizes -> variants.shoe_sizes', () => {
      sliQueries = '?af=shoesizes%3Akidus12eu29';
      expectedQueries = '?variants.shoe_sizes=Kid%20US%2012%20%2F%20EU%2029';

      pages.forEach((path) => {
        expect(convertSLIPath(`${path}${sliQueries}`)).toBe(`${path}${expectedQueries}`);
      });
    });

    it('Trends', () => {
      sliQueries = '?af=trends%3Aonsale';
      expectedQueries = '?trends=On%20Sale';

      pages.forEach((path) => {
        expect(convertSLIPath(`${path}${sliQueries}`)).toBe(`${path}${expectedQueries}`);
      });
    });

    describe('Edge Cases', () => {
      beforeEach(() => {
        sliQueries = '?af=category%3Atableware+category%3Atabletopdecor';
        expectedQueries = '?product_type=Tableware';
      });

      it('Filters that don\'t exist in facets.json should be removed', () => {
        pages.forEach((path) => {
          expect(convertSLIPath(`${path}${sliQueries}`)).toBe(`${path}${expectedQueries}`);
        });
      });
    });
  });

  describe('URL still contains other parameters', () => {
    describe('Hierarchical Menu', () => {
      let hierarchicalMenu;

      beforeEach(() => {
        hierarchicalMenu = '';
        sliQueries = '?af=brand%3Aageofinnocence%2Bcolor%3Awhite%2Bcolor%3Abeige';
        expectedQueries = '?brand=Age%20of%20Innocence&color=Beige%2BWhite';
      });

      it('for /shop pages', () => {
        const path = '/shop';
        hierarchicalMenu = 'home/decor/lighting';
        expect(convertSLIPath(`${path}${hierarchicalMenu}${sliQueries}`)).toBe(`${path}${hierarchicalMenu}${expectedQueries}`);
      });

      it('for /brand pages', () => {
        const path = '/brands/maison-me';
        hierarchicalMenu = 'kids';
        expect(convertSLIPath(`${path}${hierarchicalMenu}${sliQueries}`)).toBe(`${path}${hierarchicalMenu}${expectedQueries}`);
      });

      it('for /edits pages', () => {
        const path = '/edits/big-brother-sister';
        hierarchicalMenu = 'baby/boy-accessories';
        expect(convertSLIPath(`${path}${hierarchicalMenu}${sliQueries}`)).toBe(`${path}${hierarchicalMenu}${expectedQueries}`);
      });

      it('for /trends pages', () => {
        const path = '/trends/just-in';
        hierarchicalMenu = 'play';
        expect(convertSLIPath(`${path}${hierarchicalMenu}${sliQueries}`)).toBe(`${path}${hierarchicalMenu}${expectedQueries}`);
      });
    });

    describe('Word Query', () => {
      let query;

      beforeEach(() => {
        query = '';
        sliQueries = '&af=clothingsizes%3A12months%2Bclothingsizes%3A03months%2Bclothingsizes%3A612months';
        expectedQueries = '&variants.clothing_sizes=0-3%20months%2B12%20months%2B6-12%20months';
      });

      it('for /shop pages', () => {
        const path = '/shop';
        query = '?w=horses';
        expect(convertSLIPath(`${path}${query}${sliQueries}`)).toBe(`${path}${query}${expectedQueries}`);
      });

      it('for /brand pages', () => {
        const path = '/brands/maison-me';
        query = '?w=pants';
        expect(convertSLIPath(`${path}${query}${sliQueries}`)).toBe(`${path}${query}${expectedQueries}`);
      });

      it('for /edits pages', () => {
        const path = '/edits/big-brother-sister';
        query = '?w=hats';
        expect(convertSLIPath(`${path}${query}${sliQueries}`)).toBe(`${path}${query}${expectedQueries}`);
      });

      it('for /trends pages', () => {
        const path = '/trends/just-in';
        query = '?w=phonecases';
        expect(convertSLIPath(`${path}${query}${sliQueries}`)).toBe(`${path}${query}${expectedQueries}`);
      });
    });

    describe('Sort By Filter', () => {
      let sortBy;

      beforeEach(() => {
        sortBy = '';
        sliQueries = '&af=agerange%3A24y%2Bsprice%3A%5B1549%2C%5D';
        expectedQueries = '&variants.age_range=2-4y&variants.maisonette_sale=min%3A1549';
      });

      it('for /shop pages', () => {
        const path = '/shop';
        sortBy = '?isort=price_asc';
        expect(convertSLIPath(`${path}${sortBy}${sliQueries}`)).toBe(`${path}${sortBy}${expectedQueries}`);
      });

      it('for /brand pages', () => {
        const path = '/brands/maison-me';
        sortBy = '?isort=price_desc';
        expect(convertSLIPath(`${path}${sortBy}${sliQueries}`)).toBe(`${path}${sortBy}${expectedQueries}`);
      });

      it('for /edits pages', () => {
        const path = '/edits/big-brother-sister';
        sortBy = '?isort=just_in';
        expect(convertSLIPath(`${path}${sortBy}${sliQueries}`)).toBe(`${path}${sortBy}${expectedQueries}`);
      });

      it('for /trends pages', () => {
        const path = '/trends/just-in';
        sortBy = '?isort=best_sellers';
        expect(convertSLIPath(`${path}${sortBy}${sliQueries}`)).toBe(`${path}${sortBy}${expectedQueries}`);
      });
    });

    describe('Page Number (if greater than 1)', () => {
      let page;

      beforeEach(() => {
        page = '';
        sliQueries = '?af=category%3Atees%2Bcategory%3Arompers%2Bbrand%3Alovelylittles';
        expectedQueries = '?brand=Lovely%20Littles&product_type=Rompers%2BTees';
      });

      it('for /shop pages', () => {
        const path = '/shop';
        page = '&page=2';
        expect(convertSLIPath(`${path}${sliQueries}${page}`)).toBe(`${path}${expectedQueries}${page}`);
      });

      it('for /brand pages', () => {
        const path = '/brands/maison-me';
        page = '&page=3';
        expect(convertSLIPath(`${path}${sliQueries}${page}`)).toBe(`${path}${expectedQueries}${page}`);
      });

      it('for /edits pages', () => {
        const path = '/edits/big-brother-sister';
        page = '&page=4';
        expect(convertSLIPath(`${path}${sliQueries}${page}`)).toBe(`${path}${expectedQueries}${page}`);
      });

      it('for /trends pages', () => {
        const path = '/trends/just-in';
        page = '&page=12';
        expect(convertSLIPath(`${path}${sliQueries}${page}`)).toBe(`${path}${expectedQueries}${page}`);
      });
    });
  });

  describe('Alphabetized Rules', () => {
    beforeEach(() => {
      sliQueries = '';
      expectedQueries = '';
    });

    it('new URL is alphabetized by facet types', () => {
      const path = '/shop/kids/boy-clothing';
      sliQueries = '?af=gender%3Aboy%2Bcolor%3Amulti%2Bclothingsizes%3A4years%2Bagerange%3A46y';
      expectedQueries = '?color=Multi&gender=Boy&variants.age_range=4-6y&variants.clothing_sizes=4%20years';

      expect(convertSLIPath(`${path}${sliQueries}`)).toBe(`${path}${expectedQueries}`);
    });

    it('new URL is alphabetized by facet values if there are multiple values for a facet type', () => {
      const path = '/brands/heidi-brand/gear';
      sliQueries = '?af=color%3Ablue%2Bcolor%3Anavy%2Bcolor%3Awhite';
      expectedQueries = '?color=Blue%2BNavy%2BWhite';

      expect(convertSLIPath(`${path}${sliQueries}`)).toBe(`${path}${expectedQueries}`);
    });
  });

  describe('Category Navigation URLs', () => {
    beforeEach(() => {
      sliQueries = '';
      expectedQueries = '';
    });

    it('URLs with blacklisted queries', () => {
      sliQueries = '?af=gender%3Aboy&td=top-nav';
      expectedQueries = '?gender=Boy&td=top-nav';

      expect(convertSLIPath(`/trends/just-in${sliQueries}`)).toBe(`/trends/just-in${expectedQueries}`);
    });

    it('Womens > Clothing > Bottoms', () => {
      sliQueries = '?af=gender%3Awomen+gender%3Aunisex+agerange%3Aadults+category%3Ashorts+category%3Asweatpants+category%3Apants+category%3Askirts+category%3Ajeans+category%3Aleggings';
      expectedQueries = '?gender=Unisex%2BWomen&product_type=Jeans%2BLeggings%2BPants%2BShorts%2BSkirts%2BSweatpants&variants.age_range=Adults';

      expect(convertSLIPath(`/shop${sliQueries}`)).toBe(`/shop${expectedQueries}`);
    });
  });
});
