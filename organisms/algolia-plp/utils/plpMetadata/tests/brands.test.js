import getPLPMetadata from '../index';
import brandsMetaOverrides from '../utils/brandsMetaOverrides.json';

describe('Brands Metadata Overrides', () => {
    const pageType = 'brand';
  const props = {};

  describe('Dynamic Templates Rules', () => {
    describe('For pages with only the Top Level', () => {
      beforeEach(() => {
        props.searchState = {
          hierarchicalMenu: {},
          refinementList: {},
          range: {}
        };

        props.brand = {
          name: ''
        };
      });

      it('Top Level with no facets is correct', () => {
        props.brand.name = 'Manhattan Toy';
        props.searchState.hierarchicalMenu['categories_slug.lvl0'] = '';

        const expectedMetadata = {
          title: 'Manhattan Toy - Shop by Brand | Maisonette',
          description: 'Shop customer favorites from Manhattan Toy. Maisonette features top brands like Manhattan Toy for kids\' and baby clothing, toys, home decor and more.',
          heading: 'Manhattan Toy'
        };
        expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
      });

      it('Top Level with 1 facet metadata is correct', () => {
        props.brand.name = 'Manhattan Toy';
        props.searchState.hierarchicalMenu['categories_slug.lvl0'] = '';

        props.searchState.refinementList = { product_type: ['Dolls'] };

        const expectedMetadata = {
          title: 'Manhattan Toy Dolls - Shop by Brand | Maisonette',
          description: 'Shop customer favorites from Manhattan Toy. Maisonette features top brands like Manhattan Toy Dolls for kids\' and baby clothing, toys, home decor and more.',
          heading: 'Manhattan Toy Dolls'
        };
        expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
      });

      it('Top Level with 2 or more facets metadata excludes the facet', () => {
        props.brand.name = 'Manhattan Toy';
        props.searchState.hierarchicalMenu['categories_slug.lvl0'] = '';

        props.searchState.refinementList = {
          gender: ['Girl'],
          product_type: ['Dolls']
        };

        const expectedMetadata = {
          title: 'Manhattan Toy - Shop by Brand | Maisonette',
          description: 'Shop customer favorites from Manhattan Toy. Maisonette features top brands like Manhattan Toy for kids\' and baby clothing, toys, home decor and more.',
          heading: 'Manhattan Toy'
        };
        expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
      });

      it('Top Level with non product_type facets metadata excludes the facet', () => {
        props.brand.name = 'Manhattan Toy';
        props.searchState.hierarchicalMenu['categories_slug.lvl0'] = '';

        props.searchState.refinementList = { gender: ['Girl'] };

        const expectedMetadata = {
          title: 'Manhattan Toy - Shop by Brand | Maisonette',
          description: 'Shop customer favorites from Manhattan Toy. Maisonette features top brands like Manhattan Toy for kids\' and baby clothing, toys, home decor and more.',
          heading: 'Manhattan Toy'
        };
        expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
      });
    });

    describe('For pages with Top Level > 2nd Level', () => {
      describe('2nd Level is neither What\'s new nor Play', () => {
        beforeEach(() => {
          props.searchState = {
            hierarchicalMenu: {},
            refinementList: {},
            range: {}
          };

          props.searchResults = {
            hits: []
          };

          props.brand = {
            name: ''
          };
        });

        it('2nd Level with no facets is correct', () => {
          props.brand.name = 'Cody Foster';
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home';

          props.searchResults.hits.push({
            categories: { lvl0: ['Home'] },
            categories_slug: { lvl0: ['home'] }
          });

          const expectedMetadata = {
            title: 'Cody Foster Home - Shop by Brand | Maisonette',
            description: 'Shop customer favorites from Cody Foster. Maisonette features top brands like Cody Foster Home for kids\' and baby clothing, toys, home decor and more.',
            heading: 'Cody Foster Home'
          };
          expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
        });

        it('2nd Level with 1 facet metadata is correct', () => {
          props.brand.name = 'Cody Foster';
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home';

          props.searchResults.hits.push({
            categories: { lvl0: ['Home'] },
            categories_slug: { lvl0: ['home'] }
          });

          props.searchState.refinementList = { product_type: ['Ornaments'] };

          const expectedMetadata = {
            title: 'Cody Foster Ornaments Home - Shop by Brand | Maisonette',
            description: 'Shop customer favorites from Cody Foster. Maisonette features top brands like Cody Foster Home Ornaments for kids\' and baby clothing, toys, home decor and more.',
            heading: 'Cody Foster Home Ornaments'
          };
          expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
        });

        it('2nd Level with 2 or more facets metadata excludes the facet', () => {
          props.brand.name = 'Cody Foster';
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home';

          props.searchResults.hits.push({
            categories: { lvl0: ['Home'] },
            categories_slug: { lvl0: ['home'] }
          });

          props.searchState.refinementList = {
            product_type: ['Ornaments'],
            color: ['Blue']
          };

          const expectedMetadata = {
            title: 'Cody Foster Home - Shop by Brand | Maisonette',
            description: 'Shop customer favorites from Cody Foster. Maisonette features top brands like Cody Foster Home for kids\' and baby clothing, toys, home decor and more.',
            heading: 'Cody Foster Home'
          };
          expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
        });

        it('2nd Level with non product_type facets metadata excludes the facet', () => {
          props.brand.name = 'Cody Foster';
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home';

          props.searchResults.hits.push({
            categories: { lvl0: ['Home'] },
            categories_slug: { lvl0: ['home'] }
          });

          props.searchState.refinementList = { color: ['Blue'] };

          const expectedMetadata = {
            title: 'Cody Foster Home - Shop by Brand | Maisonette',
            description: 'Shop customer favorites from Cody Foster. Maisonette features top brands like Cody Foster Home for kids\' and baby clothing, toys, home decor and more.',
            heading: 'Cody Foster Home'
          };
          expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
        });
      });

      describe('2nd Level is What\'s new', () => {
        beforeEach(() => {
          props.searchState = {
            hierarchicalMenu: {},
            refinementList: {},
            range: {}
          };

          props.searchResults = {
            hits: []
          };

          props.brand = {
            name: ''
          };
        });

        it('2nd Level with no facets is correct', () => {
          props.brand.name = 'Petite Plume';
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'whats-new';

          props.searchResults.hits.push({
            categories: { lvl0: ['What\'s New'] },
            categories_slug: { lvl0: ['whats-new'] }
          });

          const expectedMetadata = {
            title: 'Petite Plume - Shop by Brand | Maisonette',
            description: 'Shop customer favorites from Petite Plume. Maisonette features top brands like Petite Plume for kids\' and baby clothing, toys, home decor and more.',
            heading: 'Petite Plume'
          };
          expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
        });

        it('2nd Level with 1 facet metadata is correct', () => {
          props.brand.name = 'Petite Plume';
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'whats-new';

          props.searchResults.hits.push({
            categories: { lvl0: ['What\'s New'] },
            categories_slug: { lvl0: ['whats-new'] }
          });

          props.searchState.refinementList = { product_type: ['Robes'] };

          const expectedMetadata = {
            title: 'Petite Plume Robes - Shop by Brand | Maisonette',
            description: 'Shop customer favorites from Petite Plume. Maisonette features top brands like Petite Plume Robes for kids\' and baby clothing, toys, home decor and more.',
            heading: 'Petite Plume Robes'
          };
          expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
        });

        it('2nd Level with 2 or more facets metadata excludes the facet', () => {
          props.brand.name = 'Petite Plume';
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'whats-new';

          props.searchResults.hits.push({
            categories: { lvl0: ['What\'s New'] },
            categories_slug: { lvl0: ['whats-new'] }
          });

          props.searchState.refinementList = {
            product_type: ['Robes'],
            color: ['Blue']
          };

          const expectedMetadata = {
            title: 'Petite Plume - Shop by Brand | Maisonette',
            description: 'Shop customer favorites from Petite Plume. Maisonette features top brands like Petite Plume for kids\' and baby clothing, toys, home decor and more.',
            heading: 'Petite Plume'
          };
          expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
        });

        it('2nd Level with non product_type facets metadata excludes the facet', () => {
          props.brand.name = 'Petite Plume';
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'whats-new';

          props.searchResults.hits.push({
            categories: { lvl0: ['What\'s New'] },
            categories_slug: { lvl0: ['whats-new'] }
          });

          props.searchState.refinementList = { color: ['Blue'] };

          const expectedMetadata = {
            title: 'Petite Plume - Shop by Brand | Maisonette',
            description: 'Shop customer favorites from Petite Plume. Maisonette features top brands like Petite Plume for kids\' and baby clothing, toys, home decor and more.',
            heading: 'Petite Plume'
          };
          expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
        });
      });

      describe('2nd Level is Play', () => {
        beforeEach(() => {
          props.searchState = {
            hierarchicalMenu: {},
            refinementList: {},
            range: {}
          };

          props.searchResults = {
            hits: []
          };

          props.brand = {
            name: ''
          };
        });

        it('2nd Level with no facets is correct', () => {
          props.brand.name = 'Meri Meri';
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'play';

          props.searchResults.hits.push({
            categories: { lvl0: ['Play'] },
            categories_slug: { lvl0: ['play'] }
          });

          const expectedMetadata = {
            title: 'Meri Meri Toys - Shop by Brand | Maisonette',
            description: 'Shop customer favorites from Meri Meri. Maisonette features top brands like Meri Meri Toys for kids\' and baby clothing, toys, home decor and more.',
            heading: 'Meri Meri Toys'
          };
          expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
        });

        it('2nd Level with 1 facet metadata is correct', () => {
          props.brand.name = 'Meri Meri';
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'play';

          props.searchResults.hits.push({
            categories: { lvl0: ['Play'] },
            categories_slug: { lvl0: ['play'] }
          });

          props.searchState.refinementList = { product_type: ['Arts & Crafts'] };

          const expectedMetadata = {
            title: 'Meri Meri Arts & Crafts Toys - Shop by Brand | Maisonette',
            description: 'Shop customer favorites from Meri Meri. Maisonette features top brands like Meri Meri Toys Arts and Crafts for kids\' and baby clothing, toys, home decor and more.',
            heading: 'Meri Meri Toys Arts & Crafts'
          };
          expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
        });

        it('2nd Level with 2 or more facets metadata excludes the facet', () => {
          props.brand.name = 'Meri Meri';
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'play';

          props.searchResults.hits.push({
            categories: { lvl0: ['Play'] },
            categories_slug: { lvl0: ['play'] }
          });

          props.searchState.refinementList = { product_type: ['Arts & Crafts', 'Costumes'] };

          const expectedMetadata = {
            title: 'Meri Meri Toys - Shop by Brand | Maisonette',
            description: 'Shop customer favorites from Meri Meri. Maisonette features top brands like Meri Meri Toys for kids\' and baby clothing, toys, home decor and more.',
            heading: 'Meri Meri Toys'
          };
          expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
        });

        it('2nd Level with non product_type facets metadata excludes the facet', () => {
          props.brand.name = 'Meri Meri';
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'play';

          props.searchResults.hits.push({
            categories: { lvl0: ['Play'] },
            categories_slug: { lvl0: ['play'] }
          });

          props.searchState.refinementList = { age_range: ['2-4y'] };

          const expectedMetadata = {
            title: 'Meri Meri Toys - Shop by Brand | Maisonette',
            description: 'Shop customer favorites from Meri Meri. Maisonette features top brands like Meri Meri Toys for kids\' and baby clothing, toys, home decor and more.',
            heading: 'Meri Meri Toys'
          };
          expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
        });
      });
    });

    describe('For pages with Top Level > 2nd Level > 3rd Level', () => {
      beforeEach(() => {
        props.searchState = {
          hierarchicalMenu: {},
          refinementList: {},
          range: {}
        };

        props.searchResults = {
          hits: []
        };

        props.brand = {
          name: ''
        };
      });

      it('Top Level with no facets is correct', () => {
        props.brand.name = 'Maison Me';
        props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > boy-clothing';

        props.searchResults.hits.push({
          categories: {
            lvl0: ['Kids'],
            lvl1: ['Kids > Boy Clothing']
          },
          categories_slug: {
            lvl0: ['kids'],
            lvl1: ['kids > boy-clothing']
          }
        });

        const expectedMetadata = {
          title: 'Maison Me Boy Clothing - Shop by Brand | Maisonette',
          description: 'Shop customer favorites from Maison Me. Maisonette features top brands like Maison Me Boy Clothing for kids\' and baby clothing, toys, home decor and more.',
          heading: 'Maison Me Boy Clothing'
        };
        expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
      });

      it('Top Level with 1 facet metadata is correct', () => {
        props.brand.name = 'Maison Me';
        props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > boy-clothing';

        props.searchResults.hits.push({
          categories: {
            lvl0: ['Kids'],
            lvl1: ['Kids > Boy Clothing']
          },
          categories_slug: {
            lvl0: ['kids'],
            lvl1: ['kids > boy-clothing']
          }
        });

        props.searchState.refinementList = { product_type: ['Shirts'] };

        const expectedMetadata = {
          title: 'Maison Me Shirts Boy Clothing - Shop by Brand | Maisonette',
          description: 'Shop customer favorites from Maison Me. Maisonette features top brands like Maison Me Boy Clothing Shirts for kids\' and baby clothing, toys, home decor and more.',
          heading: 'Maison Me Boy Clothing Shirts'
        };
        expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
      });

      it('Top Level with 2 or more facets metadata excludes the facet', () => {
        props.brand.name = 'Maison Me';
        props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > boy-clothing';

        props.searchResults.hits.push({
          categories: {
            lvl0: ['Kids'],
            lvl1: ['Kids > Boy Clothing']
          },
          categories_slug: {
            lvl0: ['kids'],
            lvl1: ['kids > boy-clothing']
          }
        });

        props.searchState.refinementList = { product_type: ['Shirts', 'Shorts'] };

        const expectedMetadata = {
          title: 'Maison Me Boy Clothing - Shop by Brand | Maisonette',
          description: 'Shop customer favorites from Maison Me. Maisonette features top brands like Maison Me Boy Clothing for kids\' and baby clothing, toys, home decor and more.',
          heading: 'Maison Me Boy Clothing'
        };
        expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
      });

      it('Top Level with non product_type facets metadata excludes the facet', () => {
        props.brand.name = 'Maison Me';
        props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > boy-clothing';

        props.searchResults.hits.push({
          categories: {
            lvl0: ['Kids'],
            lvl1: ['Kids > Boy Clothing']
          },
          categories_slug: {
            lvl0: ['kids'],
            lvl1: ['kids > boy-clothing']
          }
        });

        props.searchState.refinementList = { clothing_sizes: ['12 years'] };

        const expectedMetadata = {
          title: 'Maison Me Boy Clothing - Shop by Brand | Maisonette',
          description: 'Shop customer favorites from Maison Me. Maisonette features top brands like Maison Me Boy Clothing for kids\' and baby clothing, toys, home decor and more.',
          heading: 'Maison Me Boy Clothing'
        };
        expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
      });
    });

    describe('For pages with Top Level > 2nd Level > 3rd Level > 4th Level', () => {
      beforeEach(() => {
        props.searchState = {
          hierarchicalMenu: {},
          refinementList: {},
          range: {}
        };

        props.searchResults = {
          hits: []
        };

        props.brand = {
          name: ''
        };
      });

      it('Top Level with no facets is correct', () => {
        props.brand.name = 'Neon Rebels';
        props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > girl-clothing > dresses';

        props.searchResults.hits.push({
          categories: {
            lvl0: ['Kids'],
            lvl1: ['Kids > Girl Clothing'],
            lvl2: ['Kids > Girl Clothing > Dresses']
          },
          categories_slug: {
            lvl0: ['kids'],
            lvl1: ['kids > girl-clothing'],
            lvl2: ['kids > girl-clothing > dresses']
          }
        });

        const expectedMetadata = {
          title: 'Neon Rebels Dresses - Shop Girl Clothing by Brand | Maisonette',
          description: 'Shop customer favorites from Neon Rebels. Maisonette features top brands like Neon Rebels Dresses for kids\' and baby clothing, toys, home decor and more.',
          heading: 'Neon Rebels Dresses'
        };
        expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
      });

      it('Top Level with 1 facet metadata is correct', () => {
        props.brand.name = 'Neon Rebels';
        props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > girl-clothing > pants';

        props.searchResults.hits.push({
          categories: {
            lvl0: ['Kids'],
            lvl1: ['Kids > Girl Clothing'],
            lvl2: ['Kids > Girl Clothing > Pants']
          },
          categories_slug: {
            lvl0: ['kids'],
            lvl1: ['kids > girl-clothing'],
            lvl2: ['kids > girl-clothing > pants']
          }
        });

        props.searchState.refinementList = { product_type: ['Leggings'] };

        const expectedMetadata = {
          title: 'Neon Rebels Leggings Pants - Shop Girl Clothing by Brand | Maisonette',
          description: 'Shop customer favorites from Neon Rebels. Maisonette features top brands like Neon Rebels Pants Leggings for kids\' and baby clothing, toys, home decor and more.',
          heading: 'Neon Rebels Pants Leggings'
        };
        expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
      });

      it('Top Level with 2 or more facets metadata excludes the facet', () => {
        props.brand.name = 'Neon Rebels';
        props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > girl-clothing > dresses';

        props.searchResults.hits.push({
          categories: {
            lvl0: ['Kids'],
            lvl1: ['Kids > Girl Clothing'],
            lvl2: ['Kids > Girl Clothing > Dresses']
          },
          categories_slug: {
            lvl0: ['kids'],
            lvl1: ['kids > girl-clothing'],
            lvl2: ['kids > girl-clothing > dresses']
          }
        });

        props.searchState.refinementList = {
          product_type: ['Dresses'],
          color: ['Prints']
        };

        const expectedMetadata = {
          title: 'Neon Rebels Dresses - Shop Girl Clothing by Brand | Maisonette',
          description: 'Shop customer favorites from Neon Rebels. Maisonette features top brands like Neon Rebels Dresses for kids\' and baby clothing, toys, home decor and more.',
          heading: 'Neon Rebels Dresses'
        };
        expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
      });

      it('Top Level with non product_type facets metadata excludes the facet', () => {
        props.brand.name = 'Neon Rebels';
        props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > girl-clothing > dresses';

        props.searchResults.hits.push({
          categories: {
            lvl0: ['Kids'],
            lvl1: ['Kids > Girl Clothing'],
            lvl2: ['Kids > Girl Clothing > Dresses']
          },
          categories_slug: {
            lvl0: ['kids'],
            lvl1: ['kids > girl-clothing'],
            lvl2: ['kids > girl-clothing > dresses']
          }
        });

        props.searchState.refinementList = { color: ['Prints'] };

        const expectedMetadata = {
          title: 'Neon Rebels Dresses - Shop Girl Clothing by Brand | Maisonette',
          description: 'Shop customer favorites from Neon Rebels. Maisonette features top brands like Neon Rebels Dresses for kids\' and baby clothing, toys, home decor and more.',
          heading: 'Neon Rebels Dresses'
        };
        expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
      });
    });
  });

  describe('Static Overrides provided by SEO team', () => {
    beforeEach(() => {
      props.searchState = {
        hierarchicalMenu: {},
        refinementList: {},
        range: {}
      };

      props.brand = {
        name: '',
        brand_slug: ''
      };
    });

    it('Static Overrides for Brand Pages with no hierarchical menu or filters', () => {
      props.brand.name = 'Neon Rebels';
      props.brand.brand_slug = 'neon-rebels';

      expect(getPLPMetadata(pageType, props)).toEqual(brandsMetaOverrides['neon-rebels']);
    });
  });
});
