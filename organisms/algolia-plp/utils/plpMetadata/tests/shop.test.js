import getPLPMetadata from '../index';
import categoriesMetaOverrides from '../utils/categoriesMetaOverrides.json';
import filterMetaOverrides from '../utils/filterMetaOverrides.json';

describe('Metadata Overrides for /shop pages', () => {
  const pageType = 'shop';
  const props = {};

  describe('Dynamic Templates Rules', () => {
    describe('For pages with only 1 applied facet', () => {
      describe('3 category levels and only 1 applied facet', () => {
        describe('Top Nav = Baby', () => {
          beforeEach(() => {
            props.searchState = {
              hierarchicalMenu: {},
              refinementList: {},
              range: {}
            };

            props.searchResults = {
              hits: []
            };
          });

          describe('Meta Title', () => {
            beforeEach(() => {
              props.searchState = {
                hierarchicalMenu: {},
                refinementList: {},
                range: {}
              };

              props.searchResults = {
                hits: []
              };
            });

            it('should include both Facet & Category if the Facet is a color', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-accessories > tights-socks';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Girl Accessories'],
                  lvl2: ['Baby > Girl Accessories > Tights & Socks']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > girl-accessories'],
                  lvl2: ['baby > girl-accessories > tights-socks']
                }
              });

              props.searchState.refinementList = { color: ['Pink'] };

              const expectedMetaTitle = 'Baby Girl Pink Tights & Socks - Shop Baby Accessories | Maisonette';
              expect(getPLPMetadata(pageType, props).title).toBe(expectedMetaTitle);
            });

            it('should include both Facet & Category if the Facet is a age range', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-accessories > tights-socks';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Girl Accessories'],
                  lvl2: ['Baby > Girl Accessories > Tights & Socks']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > girl-accessories'],
                  lvl2: ['baby > girl-accessories > tights-socks']
                }
              });

              props.searchState.refinementList = { 'variants.age_range': ['0-6m'] };

              const expectedMetaTitle = 'Baby Girl 0-6m Tights & Socks - Shop Baby Accessories | Maisonette';
              expect(getPLPMetadata(pageType, props).title).toBe(expectedMetaTitle);
            });

            it('should omit the Gender token if the Facet is a gender', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-accessories > bibs';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Girl Accessories'],
                  lvl2: ['Baby > Girl Accessories > Bibs']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > girl-accessories'],
                  lvl2: ['baby > girl-accessories > bibs']
                }
              });

              props.searchState.refinementList = { gender: ['Boy'] };

              const expectedMetaTitle = 'Baby Boy Bibs - Shop Baby Accessories | Maisonette';
              expect(getPLPMetadata(pageType, props).title).toBe(expectedMetaTitle);
            });

            it('should omit the Gender facet if the Facet is "Unisex"', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-accessories > bibs';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Girl Accessories'],
                  lvl2: ['Baby > Girl Accessories > Bibs']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > girl-accessories'],
                  lvl2: ['baby > girl-accessories > bibs']
                }
              });

              props.searchState.refinementList = { gender: ['Baby Unisex'] };

              const expectedMetaTitle = 'Baby Bibs - Shop Baby Accessories | Maisonette';
              expect(getPLPMetadata(pageType, props).title).toBe(expectedMetaTitle);
            });

            it('should omit the Category token if the Facet is a product type', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > boy-clothing > pants';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Boy Clothing'],
                  lvl2: ['Baby > Boy Clothing > Pants']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > boy-clothing'],
                  lvl2: ['baby > boy-clothing > pants']
                }
              });

              props.searchState.refinementList = { product_type: ['Jeans'] };

              const expectedMetaTitle = 'Baby Boy Jeans - Shop Baby Clothing | Maisonette';
              expect(getPLPMetadata(pageType, props).title).toBe(expectedMetaTitle);
            });

            it('should omit Gender if the Category does not have a gender', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > bath-body > towelsrobes';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Bath & Body'],
                  lvl2: ['Baby > Bath & Body > Towels & Robes']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > bath-body'],
                  lvl2: ['baby > bath-body > towelsrobes']
                }
              });

              props.searchState.refinementList = { color: ['Pink'] };

              const expectedMetaTitle = 'Baby Pink Towels & Robes - Shop Baby Bath & Body | Maisonette';
              expect(getPLPMetadata(pageType, props).title).toBe(expectedMetaTitle);
            });

            it('should omit any duplicate words', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-accessories > bibs';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Girl Accessories'],
                  lvl2: ['Baby > Girl Accessories > Bibs']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > girl-accessories'],
                  lvl2: ['baby > girl-accessories > bibs']
                }
              });

              props.searchState.refinementList = { gender: ['Baby Boy'] };

              const incorrectMetaTitle = 'Baby Baby Boy Bibs - Shop Baby Accessories | Maisonette';
              expect(getPLPMetadata(pageType, props).title).not.toBe(incorrectMetaTitle);
            });
          });

          describe('Meta Description', () => {
            beforeEach(() => {
              props.searchState = {
                hierarchicalMenu: {},
                refinementList: {},
                range: {}
              };

              props.searchResults = {
                hits: []
              };
            });

            it('should include both Facet & Category if the Facet is a color', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-clothing > dresses';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Girl Clothing'],
                  lvl2: ['Baby > Girl Clothing > Dresses']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > girl-clothing'],
                  lvl2: ['baby > girl-clothing > dresses']
                }
              });

              props.searchState.refinementList = { color: ['Pink'] };

              const expectedMetaDescription = 'Shop Baby Girl Pink Dresses from your favorite newborn, infant and baby brands at Maisonette. Your one-stop shop for Baby Clothing and more.';
              expect(getPLPMetadata(pageType, props).description).toBe(expectedMetaDescription);
            });

            it('should include both Facet & Category if the Facet is a age range', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > boy-clothing > tops';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Boy Clothing'],
                  lvl2: ['Baby > Boy Clothing > Tops']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > boy-clothing'],
                  lvl2: ['baby > boy-clothing > tops']
                }
              });

              props.searchState.refinementList = { 'variants.age_range': ['0-6m'] };

              const expectedMetaDescription = 'Shop Baby Boy 0-6m Tops from your favorite newborn, infant and baby brands at Maisonette. Your one-stop shop for Baby Clothing and more.';
              expect(getPLPMetadata(pageType, props).description).toBe(expectedMetaDescription);
            });

            it('should omit the Gender token if the Facet is a gender', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-accessories > bibs';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Girl Accessories'],
                  lvl2: ['Baby > Girl Accessories > Bibs']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > girl-accessories'],
                  lvl2: ['baby > girl-accessories > bibs']
                }
              });

              props.searchState.refinementList = { gender: ['Baby Boy'] };

              const expectedMetaDescription = 'Shop Baby Boy Bibs from your favorite newborn, infant and baby brands at Maisonette. Your one-stop shop for Baby Accessories and more.';
              expect(getPLPMetadata(pageType, props).description).toBe(expectedMetaDescription);
            });

            it('should omit the Gender facet if the Facet is "Unisex"', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-accessories > bibs';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Girl Accessories'],
                  lvl2: ['Baby > Girl Accessories > Bibs']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > girl-accessories'],
                  lvl2: ['baby > girl-accessories > bibs']
                }
              });

              props.searchState.refinementList = { gender: ['Baby Unisex'] };

              const expectedMetaDescription = 'Shop Baby Bibs from your favorite newborn, infant and baby brands at Maisonette. Your one-stop shop for Baby Accessories and more.';
              expect(getPLPMetadata(pageType, props).description).toBe(expectedMetaDescription);
            });

            it('should omit the Category token if the Facet is a product type', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-clothing > pants';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Girl Clothing'],
                  lvl2: ['Baby > Girl Clothing > Pants']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > girl-clothing'],
                  lvl2: ['baby > girl-clothing > pants']
                }
              });

              props.searchState.refinementList = { product_type: ['Leggings'] };

              const expectedMetaDescription = 'Shop Baby Girl Leggings from your favorite newborn, infant and baby brands at Maisonette. Your one-stop shop for Baby Clothing and more.';
              expect(getPLPMetadata(pageType, props).description).toBe(expectedMetaDescription);
            });

            it('should omit Gender if the Category does not have a gender', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > bath-body > towelsrobes';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Bath & Body'],
                  lvl2: ['Baby > Bath & Body > Towels & Robes']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > bath-body'],
                  lvl2: ['baby > bath-body > towelsrobes']
                }
              });

              props.searchState.refinementList = { color: ['Pink'] };

              const expectedMetaDescription = 'Shop Baby Pink Towels and Robes from your favorite newborn, infant and baby brands at Maisonette. Your one-stop shop for Baby Bath and Body and more.';
              expect(getPLPMetadata(pageType, props).description).toBe(expectedMetaDescription);
            });

            it('should omit any duplicate words', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-accessories > bibs';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Girl Accessories'],
                  lvl2: ['Baby > Girl Accessories > Bibs']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > girl-accessories'],
                  lvl2: ['baby > girl-accessories > bibs']
                }
              });

              props.searchState.refinementList = { gender: ['Baby Boy'] };

              const incorrectMetaDescription = 'Shop Baby Baby Boy Bibs from your favorite newborn, infant and baby brands at Maisonette. Your one-stop shop for Baby Accessories and more.';

              // eslint-disable-next-line max-len
              expect(getPLPMetadata(pageType, props).description).not.toBe(incorrectMetaDescription);
            });

            it('should have been corrected to not exceed character limit', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > bath-body > towelsrobes';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Bath & Body'],
                  lvl2: ['Baby > Bath & Body > Towels & Robes and everything else you desire. blahblahblah trying to exceed 170 characters here... are we there yet? Im sure are now']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > bath-body'],
                  lvl2: ['baby > bath-body > towelsrobes']
                }
              });

              props.searchState.refinementList = { color: ['Pink'] };

              const expectedMetaDescription = 'Shop Baby Pink Towels and Robes and everything else you desire. blahblahblah trying to exceed 170 characters here... are we there yet? Im sure are now from your favori...';

              const receivedDescription = getPLPMetadata(pageType, props).description;
              expect(receivedDescription).toBe(expectedMetaDescription);
              expect(receivedDescription.length).toBe(170);
            });

            it('should end with ... if exceeds the character limit', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > bath-body > towelsrobes';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Bath & Body'],
                  lvl2: ['Baby > Bath & Body > Towels & Robes and everything else you desire. blahblahblah trying to exceed 170 characters here... are we there yet? Im sure are now']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > bath-body'],
                  lvl2: ['baby > bath-body > towelsrobes']
                }
              });

              props.searchState.refinementList = { color: ['Pink'] };

              const receivedDescription = getPLPMetadata(pageType, props).description;
              expect(receivedDescription.slice(167)).toBe('...');
            });
          });

          describe('Header', () => {
            beforeEach(() => {
              props.searchState = {
                hierarchicalMenu: {},
                refinementList: {},
                range: {}
              };

              props.searchResults = {
                hits: []
              };
            });

            it('should include both Facet & Category if the Facet is a color', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-clothing > dresses';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Girl Clothing'],
                  lvl2: ['Baby > Girl Clothing > Dresses']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > girl-clothing'],
                  lvl2: ['baby > girl-clothing > dresses']
                }
              });

              props.searchState.refinementList = { color: ['Pink'] };

              const expectedHeader = 'Baby Girl Pink Dresses';
              expect(getPLPMetadata(pageType, props).heading).toBe(expectedHeader);
            });

            it('should include both Facet & Category if the Facet is a age range', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-accessories > tights-socks';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Girl Accessories'],
                  lvl2: ['Baby > Girl Accessories > Tights & Socks']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > girl-accessories'],
                  lvl2: ['baby > girl-accessories > tights-socks']
                }
              });

              props.searchState.refinementList = { 'variants.age_range': ['0-6m'] };

              const expectedHeader = 'Baby Girl 0-6m Tights & Socks';
              expect(getPLPMetadata(pageType, props).heading).toBe(expectedHeader);
            });

            it('should omit the Gender token if the Facet is a gender', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-accessories > bibs';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Girl Accessories'],
                  lvl2: ['Baby > Girl Accessories > Bibs']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > girl-accessories'],
                  lvl2: ['baby > girl-accessories > bibs']
                }
              });

              props.searchState.refinementList = { gender: ['Baby Boy'] };

              const expectedHeader = 'Baby Boy Bibs';
              expect(getPLPMetadata(pageType, props).heading).toBe(expectedHeader);
            });

            it('should omit the Gender facet if the Facet is "Unisex"', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-accessories > bibs';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Girl Accessories'],
                  lvl2: ['Baby > Girl Accessories > Bibs']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > girl-accessories'],
                  lvl2: ['baby > girl-accessories > bibs']
                }
              });

              props.searchState.refinementList = { gender: ['Baby Unisex'] };

              const expectedHeader = 'Baby Bibs';
              expect(getPLPMetadata(pageType, props).heading).toBe(expectedHeader);
            });

            it('should omit the Category token if the Facet is a product type', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-clothing > pants';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Girl Clothing'],
                  lvl2: ['Baby > Girl Clothing > Pants']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > girl-clothing'],
                  lvl2: ['baby > girl-clothing > pants']
                }
              });

              props.searchState.refinementList = { product_type: ['Leggings'] };

              const expectedHeader = 'Baby Girl Leggings';
              expect(getPLPMetadata(pageType, props).heading).toBe(expectedHeader);
            });

            it('should omit Gender if the Category does not have a gender', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > bath-body > skincare';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Bath & Body'],
                  lvl2: ['Baby > Bath & Body > Skincare']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > bath-body'],
                  lvl2: ['baby > bath-body > skincare']
                }
              });

              props.searchState.refinementList = { gender: ['Baby Girl'] };

              const expectedHeader = 'Baby Skincare';
              expect(getPLPMetadata(pageType, props).heading).toBe(expectedHeader);
            });

            it('should omit any duplicate words', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-accessories > bibs';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Baby'],
                  lvl1: ['Baby > Girl Accessories'],
                  lvl2: ['Baby > Girl Accessories > Bibs']
                },
                categories_slug: {
                  lvl0: ['baby'],
                  lvl1: ['baby > girl-accessories'],
                  lvl2: ['baby > girl-accessories > bibs']
                }
              });

              props.searchState.refinementList = { gender: ['Baby Boy'] };

              const incorrectHeader = 'Baby Baby Boy Bibs';
              expect(getPLPMetadata(pageType, props).heading).not.toBe(incorrectHeader);
            });
          });
        });

        describe('Top Nav = Kids', () => {
          beforeEach(() => {
            props.searchState = {
              hierarchicalMenu: {},
              refinementList: {},
              range: {}
            };

            props.searchResults = {
              hits: []
            };
          });

          describe('Meta Title', () => {
            beforeEach(() => {
              props.searchState = {
                hierarchicalMenu: {},
                refinementList: {},
                range: {}
              };

              props.searchResults = {
                hits: []
              };
            });

            it('should include both Facet & Category if the Facet is a color', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > boy-clothing > shorts';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Kids'],
                  lvl1: ['Kids > Boy Clothing'],
                  lvl2: ['Kids > Boy Clothing > Pants']
                },
                categories_slug: {
                  lvl0: ['kids'],
                  lvl1: ['kids > boy-clothing'],
                  lvl2: ['kids > boy-clothing > pants']
                }
              });

              props.searchState.refinementList = { color: ['Green'] };

              const expectedMetaTitle = 'Boys\' Green Shorts - Shop Kids Clothing | Maisonette';
              expect(getPLPMetadata(pageType, props).title).toBe(expectedMetaTitle);
            });

            it('should omit the Gender token if the Facet is a gender', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > girl-clothing > outerwear';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Kids'],
                  lvl1: ['Kids > Girl Clothing'],
                  lvl2: ['Kids > Girl Clothing > Outerwear']
                },
                categories_slug: {
                  lvl0: ['kids'],
                  lvl1: ['kids > girl-clothing'],
                  lvl2: ['kids > girl-clothing > outerwear']
                }
              });

              props.searchState.refinementList = { gender: ['Baby Girl'] };

              const expectedMetaTitle = 'Baby Girls\' Outerwear - Shop Kids Clothing | Maisonette';
              expect(getPLPMetadata(pageType, props).title).toBe(expectedMetaTitle);
            });

            it('should omit the Gender token if the Facet is "Unisex"', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > girl-clothing > outerwear';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Kids'],
                  lvl1: ['Kids > Girl Clothing'],
                  lvl2: ['Kids > Girl Clothing > Outerwear']
                },
                categories_slug: {
                  lvl0: ['kids'],
                  lvl1: ['kids > girl-clothing'],
                  lvl2: ['kids > girl-clothing > outerwear']
                }
              });

              props.searchState.refinementList = { gender: ['Unisex'] };

              const incorrectMetaTitle = 'Unisex Girls\' Outerwear - Shop Kids Clothing | Maisonette';
              expect(getPLPMetadata(pageType, props).title).not.toBe(incorrectMetaTitle);
            });

            it('should omit the Category token if the Facet is a product type', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > girl-accessories > shoes';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Kids'],
                  lvl1: ['Kids > Girl Accessories'],
                  lvl2: ['Kids > Girl Accessories > Shoes']
                },
                categories_slug: {
                  lvl0: ['kids'],
                  lvl1: ['kids > girl-accessories'],
                  lvl2: ['kids > girl-accessories > shoes']
                }
              });

              props.searchState.refinementList = { product_type: ['Flats'] };

              const expectedMetaTitle = 'Girls\' Flats - Shop Kids Accessories | Maisonette';
              expect(getPLPMetadata(pageType, props).title).toBe(expectedMetaTitle);
            });

            it('should omit Gender if the Category does not have a gender', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > bath-body > wellness';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Kids'],
                  lvl1: ['Kids > Bath & Body'],
                  lvl2: ['Kids > Bath & Body > Wellness']
                },
                categories_slug: {
                  lvl0: ['kids'],
                  lvl1: ['kids > bath-body'],
                  lvl2: ['kids > bath-body > wellness']
                }
              });

              props.searchState.refinementList = { color: ['Pink'] };

              const expectedMetaTitle = 'Pink Wellness - Shop Kids Bath & Body | Maisonette';
              expect(getPLPMetadata(pageType, props).title).toBe(expectedMetaTitle);
            });
          });

          describe('Meta Description', () => {
            beforeEach(() => {
              props.searchState = {
                hierarchicalMenu: {},
                refinementList: {},
                range: {}
              };

              props.searchResults = {
                hits: []
              };
            });

            it('should include both Facet & Category if the Facet is a color', () => {
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

              props.searchState.refinementList = { color: ['Purple'] };

              const expectedMetaDescription = 'Shop Girls\' Purple Dresses and Clothes from your favorite kid and toddler brands at Maisonette. Your one-stop shop for Kids Clothing and more.';
              expect(getPLPMetadata(pageType, props).description).toBe(expectedMetaDescription);
            });

            it('should omit the Gender token if the Facet is a gender', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > girl-accessories > hats-scarves-gloves';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Kids'],
                  lvl1: ['Kids > Girl Accessories'],
                  lvl2: ['Kids > Girl Accessories > Hats, Scarves & Gloves']
                },
                categories_slug: {
                  lvl0: ['kids'],
                  lvl1: ['kids > girl-accessories'],
                  lvl2: ['kids > girl-accessories > hats-scarves-gloves']
                }
              });

              props.searchState.refinementList = { gender: ['Baby Girl'] };

              const expectedMetaDescription = 'Shop Baby Girls\' Hats, Scarves and Gloves and Accessories from your favorite kid and toddler brands at Maisonette. Your one-stop shop for Kids Accessories and more.';
              expect(getPLPMetadata(pageType, props).description).toBe(expectedMetaDescription);
            });

            it('should omit the Gender token if the Facet is "Unisex"', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > girl-accessories > hats-scarves-gloves';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Kids'],
                  lvl1: ['Kids > Girl Accessories'],
                  lvl2: ['Kids > Girl Accessories > Hats, Scarves & Gloves']
                },
                categories_slug: {
                  lvl0: ['kids'],
                  lvl1: ['kids > girl-accessories'],
                  lvl2: ['kids > girl-accessories > hats-scarves-gloves']
                }
              });

              props.searchState.refinementList = { gender: ['Unisex'] };

              const incorrectMetaDescription = 'Shop Unisex Girls\' Hats, Scarves and Gloves and Accessories from your favorite kid and toddler brands at Maisonette. Your one-stop shop for Kids Accessories and more.';

              // eslint-disable-next-line max-len
              expect(getPLPMetadata(pageType, props).description).not.toBe(incorrectMetaDescription);
            });

            it('should omit the Category token if the Facet is a product type', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > boy-accessories > shoes';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Kids'],
                  lvl1: ['Kids > Boy Accessories'],
                  lvl2: ['Kids > Boy Accessories > Shoes']
                },
                categories_slug: {
                  lvl0: ['kids'],
                  lvl1: ['kids > boy-accessories'],
                  lvl2: ['kids > boy-accessories > shoes']
                }
              });

              props.searchState.refinementList = { product_type: ['Sneakers'] };

              const expectedMetaDescription = 'Shop Boys\' Sneakers and Accessories from your favorite kid and toddler brands at Maisonette. Your one-stop shop for Kids Accessories and more.';
              expect(getPLPMetadata(pageType, props).description).toBe(expectedMetaDescription);
            });

            it('should omit Gender if the Category does not have a gender', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > bath-body > bath-bubbles';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Kids'],
                  lvl1: ['Kids > Bath & Body'],
                  lvl2: ['Kids > Bath & Body > Bath & Bubbles']
                },
                categories_slug: {
                  lvl0: ['kids'],
                  lvl1: ['kids > bath-body'],
                  lvl2: ['kids > bath-body > bath-bubbles']
                }
              });

              props.searchState.refinementList = { color: ['Blue'] };

              const expectedMetaDescription = 'Shop Blue Bath and Bubbles and Bath and Body from your favorite kid and toddler brands at Maisonette. Your one-stop shop for Kids Bath and Body and more.';
              expect(getPLPMetadata(pageType, props).description).toBe(expectedMetaDescription);
            });

            it('should have been corrected to not exceed character limit', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > bath-body > towelsrobes';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Kids'],
                  lvl1: ['Kids > Bath & Body'],
                  lvl2: ['Kids > Bath & Body > Towels & Robes and everything else you desire. blahblahblahblah helloworld helloworld helllo0o0o world. Do you think hot dogs are sandwiches? are we there yet?']
                },
                categories_slug: {
                  lvl0: ['kids'],
                  lvl1: ['kids > bath-body'],
                  lvl2: ['kids > bath-body > towelsrobes']
                }
              });

              props.searchState.refinementList = { color: ['Pink'] };

              const expectedMetaDescription = 'Shop Pink Towels and Robes and everything else you desire. blahblahblahblah helloworld helloworld helllo0o0o world. Do you think hot dogs are sandwiches? are we there ...';

              const receivedDescription = getPLPMetadata(pageType, props).description;
              expect(receivedDescription).toBe(expectedMetaDescription);
              expect(receivedDescription.length).toBe(170);
            });

            it('should end with ... if exceeds the character limit', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > bath-body > towelsrobes';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Kids'],
                  lvl1: ['Kids > Bath & Body'],
                  lvl2: ['Kids > Bath & Body > Towels & Robes and everything else you desire. blahblahblahblah helloworld helloworld helllo0o0o world. Do you think hot dogs are sandwiches? are we there yet?']
                },
                categories_slug: {
                  lvl0: ['kids'],
                  lvl1: ['kids > bath-body'],
                  lvl2: ['kids > bath-body > towelsrobes']
                }
              });

              props.searchState.refinementList = { color: ['Pink'] };

              const receivedDescription = getPLPMetadata(pageType, props).description;
              expect(receivedDescription.slice(167)).toBe('...');
            });
          });

          describe('Header', () => {
            beforeEach(() => {
              props.searchState = {
                hierarchicalMenu: {},
                refinementList: {},
                range: {}
              };

              props.searchResults = {
                hits: []
              };
            });

            it('should include both Facet & Category if the Facet is a color', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > boy-clothing > shorts';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Kids'],
                  lvl1: ['Kids > Boy Clothing'],
                  lvl2: ['Kids > Boy Clothing > Shorts']
                },
                categories_slug: {
                  lvl0: ['kids'],
                  lvl1: ['kids > boy-clothing'],
                  lvl2: ['kids > boy-clothing > shorts']
                }
              });

              props.searchState.refinementList = { color: ['Green'] };

              const expectedHeader = 'Boys\' Green Shorts';
              expect(getPLPMetadata(pageType, props).heading).toBe(expectedHeader);
            });

            it('should omit the Gender token if the Facet is a gender', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > girl-clothing > hats-scarves-gloves';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Kids'],
                  lvl1: ['Kids > Girl Clothing'],
                  lvl2: ['Kids > Girl Clothing > Hats, Scarves & Gloves']
                },
                categories_slug: {
                  lvl0: ['kids'],
                  lvl1: ['kids > girl-clothing'],
                  lvl2: ['kids > girl-clothing > hats-scarves-gloves']
                }
              });

              props.searchState.refinementList = { gender: ['Baby Girl'] };

              const expectedHeader = 'Baby Girls\' Hats, Scarves & Gloves';
              expect(getPLPMetadata(pageType, props).heading).toBe(expectedHeader);
            });

            it('should omit the Gender facet if the value is "Unisex"', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > girl-clothing > hats-scarves-gloves';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Kids'],
                  lvl1: ['Kids > Girl Clothing'],
                  lvl2: ['Kids > Girl Clothing > Hats, Scarves & Gloves']
                },
                categories_slug: {
                  lvl0: ['kids'],
                  lvl1: ['kids > girl-clothing'],
                  lvl2: ['kids > girl-clothing > hats-scarves-gloves']
                }
              });

              props.searchState.refinementList = { gender: ['Unisex'] };

              const incorrectHeader = 'Unisex Girls\' Hats, Scarves & Gloves';
              expect(getPLPMetadata(pageType, props).heading).not.toBe(incorrectHeader);
            });

            it('should omit the Category token if the Facet is a product type', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > girl-clothing > outerwear';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Kids'],
                  lvl1: ['Kids > Girl Clothing'],
                  lvl2: ['Kids > Girl Clothing > Outerwear']
                },
                categories_slug: {
                  lvl0: ['kids'],
                  lvl1: ['kids > girl-clothing'],
                  lvl2: ['kids > girl-clothing > outerwear']
                }
              });

              props.searchState.refinementList = { product_type: ['Raincoats'] };

              const expectedMetaTitle = 'Girls\' Raincoats';
              expect(getPLPMetadata(pageType, props).heading).toBe(expectedMetaTitle);
            });

            it('should omit Gender if the Category does not have a gender', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > bath-body > wellness';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Kids'],
                  lvl1: ['Kids > Bath & Body'],
                  lvl2: ['Kids > Bath & Body > Wellness']
                },
                categories_slug: {
                  lvl0: ['kids'],
                  lvl1: ['kids > bath-body'],
                  lvl2: ['kids > bath-body > wellness']
                }
              });

              props.searchState.refinementList = { color: ['Pink'] };

              const expectedHeader = 'Pink Wellness';
              expect(getPLPMetadata(pageType, props).heading).toBe(expectedHeader);
            });
          });
        });

        describe('Top Nav = Home', () => {
          beforeEach(() => {
            props.searchState = {
              hierarchicalMenu: {},
              refinementList: {},
              range: {}
            };

            props.searchResults = {
              hits: []
            };
          });

          describe('Meta Title', () => {
            beforeEach(() => {
              props.searchState = {
                hierarchicalMenu: {},
                refinementList: {},
                range: {}
              };

              props.searchResults = {
                hits: []
              };
            });

            it('should include both Facet & Category if the Facet is a color', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > furniture > dressers-changing-tables';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Home'],
                  lvl1: ['Home > Furniture'],
                  lvl2: ['Home > Furniture > Dressers & Changing Tables']
                },
                categories_slug: {
                  lvl0: ['home'],
                  lvl1: ['home > furniture'],
                  lvl2: ['home > furniture > dressers-changing-tables']
                }
              });

              props.searchState.refinementList = { color: ['Green'] };

              const expectedMetaTitle = 'Green Dressers & Changing Tables - Shop Home Furniture | Maisonette';
              expect(getPLPMetadata(pageType, props).title).toBe(expectedMetaTitle);
            });

            it('should include both Facet & Category if the Facet is a age range', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > furniture > dressers-changing-tables';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Home'],
                  lvl1: ['Home > Furniture'],
                  lvl2: ['Home > Furniture > Dressers & Changing Tables']
                },
                categories_slug: {
                  lvl0: ['home'],
                  lvl1: ['home > furniture'],
                  lvl2: ['home > furniture > dressers-changing-tables']
                }
              });

              props.searchState.refinementList = { 'variants.age_range': ['6-8y'] };

              const expectedMetaTitle = '6-8y Dressers & Changing Tables - Shop Home Furniture | Maisonette';
              expect(getPLPMetadata(pageType, props).title).toBe(expectedMetaTitle);
            });

            it('should include both Facet & Category if the Facet is a gender', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > furniture > dressers-changing-tables';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Home'],
                  lvl1: ['Home > Furniture'],
                  lvl2: ['Home > Furniture > Dressers & Changing Tables']
                },
                categories_slug: {
                  lvl0: ['home'],
                  lvl1: ['home > furniture'],
                  lvl2: ['home > furniture > dressers-changing-tables']
                }
              });

              props.searchState.refinementList = { gender: ['Girl'] };

              const expectedMetaTitle = 'Girl Dressers & Changing Tables - Shop Home Furniture | Maisonette';
              expect(getPLPMetadata(pageType, props).title).toBe(expectedMetaTitle);
            });

            it('should omit the Category token if the Facet is a product type', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > bedding-bath > sheets';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Home'],
                  lvl1: ['Home > Bedding & Bath'],
                  lvl2: ['Home > Bedding & Bath > Sheets']
                },
                categories_slug: {
                  lvl0: ['home'],
                  lvl1: ['home > bedding-bath'],
                  lvl2: ['home > bedding-bath > sheets']
                }
              });

              props.searchState.refinementList = { product_type: ['Crib Sheets'] };

              const expectedMetaTitle = 'Crib Sheets - Shop Home Bedding & Bath | Maisonette';
              expect(getPLPMetadata(pageType, props).title).toBe(expectedMetaTitle);
            });
          });

          describe('Meta Description', () => {
            beforeEach(() => {
              props.searchState = {
                hierarchicalMenu: {},
                refinementList: {},
                range: {}
              };

              props.searchResults = {
                hits: []
              };
            });

            it('should include both Facet & Category if the Facet is a color', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > decor > mirrors-wall-decor';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Home'],
                  lvl1: ['Home > Decor'],
                  lvl2: ['Home > Decor > Mirrors & Wall Decor']
                },
                categories_slug: {
                  lvl0: ['home'],
                  lvl1: ['home > decor'],
                  lvl2: ['home > decor > mirrors-wall-decor']
                }
              });

              props.searchState.refinementList = { color: ['Multi'] };

              const expectedMetaDescription = 'Shop Maisonette\'s curated selection of Multi Mirrors and Wall Decor. Your one-stop shop for Home Decor from your favorite kids brands and more.';
              expect(getPLPMetadata(pageType, props).description).toBe(expectedMetaDescription);
            });

            it('should include both Facet & Category if the Facet is a age range', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > bedding-bath > mattresses-changing-pads';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Home'],
                  lvl1: ['Home > Bedding & Bath'],
                  lvl2: ['Home > Bedding & Bath > Mattresses & Changing Pads']
                },
                categories_slug: {
                  lvl0: ['home'],
                  lvl1: ['home > bedding-bath'],
                  lvl2: ['home > bedding-bath > mattresses-changing-pads']
                }
              });

              props.searchState.refinementList = { 'variants.age_range': ['2-4y'] };

              const expectedMetaDescription = 'Shop Maisonette\'s curated selection of 2-4y Mattresses and Changing Pads. Your one-stop shop for Home Bedding and Bath from your favorite kids brands and more.';
              expect(getPLPMetadata(pageType, props).description).toBe(expectedMetaDescription);
            });

            it('should include both Facet & Category if the Facet is a gender', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > furniture > play-tables-desks';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Home'],
                  lvl1: ['Home > Furniture'],
                  lvl2: ['Home > Furniture > Play Tables & Desks']
                },
                categories_slug: {
                  lvl0: ['home'],
                  lvl1: ['home > furniture'],
                  lvl2: ['home > furniture > play-tables-desks']
                }
              });

              props.searchState.refinementList = { gender: ['Girl'] };

              const expectedMetaDescription = 'Shop Maisonette\'s curated selection of Girl Play Tables and Desks. Your one-stop shop for Home Furniture from your favorite kids brands and more.';
              expect(getPLPMetadata(pageType, props).description).toBe(expectedMetaDescription);
            });

            it('should omit the Category token if the Facet is a product type', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > furniture > nightstands-accent-tables';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Home'],
                  lvl1: ['Home > Furniture'],
                  lvl2: ['Home > Furniture > Nightstands & Accent Tables']
                },
                categories_slug: {
                  lvl0: ['home'],
                  lvl1: ['home > furniture'],
                  lvl2: ['home > furniture > nightstands-accent-tables']
                }
              });

              props.searchState.refinementList = { product_type: ['Accent Tables'] };

              const expectedMetaDescription = 'Shop Maisonette\'s curated selection of Accent Tables. Your one-stop shop for Home Furniture from your favorite kids brands and more.';
              expect(getPLPMetadata(pageType, props).description).toBe(expectedMetaDescription);
            });

            it('should have been corrected to not exceed character limit', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > furniture > nightstands-accent-tables';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Home'],
                  lvl1: ['Home > Furniture'],
                  lvl2: ['Home > Furniture > Nightstands and Accent Tables Never gonna give you up. Never gonna let you down. Never gonna run around and desert you. Never gonna make you cry']
                },
                categories_slug: {
                  lvl0: ['home'],
                  lvl1: ['home > furniture'],
                  lvl2: ['home > furniture > nightstands-accent-tables']
                }
              });

              props.searchState.refinementList = { color: ['Teal'] };

              const expectedMetaDescription = 'Shop Maisonette\'s curated selection of Teal Nightstands and Accent Tables Never gonna give you up. Never gonna let you down. Never gonna run around and desert you. Nev...';

              const receivedDescription = getPLPMetadata(pageType, props).description;
              expect(receivedDescription).toBe(expectedMetaDescription);
              expect(receivedDescription.length).toBe(170);
            });

            it('should end with ... if exceeds the character limit', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > furniture > nightstands-accent-tables';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Home'],
                  lvl1: ['Home > Furniture'],
                  lvl2: ['Home > Furniture > Nightstands & Accent Tables Never gonna give you up. Never gonna let you down. Never gonna run around and desert you. Never gonna make you cry']
                },
                categories_slug: {
                  lvl0: ['home'],
                  lvl1: ['home > furniture'],
                  lvl2: ['home > furniture > nightstands-accent-tables']
                }
              });

              props.searchState.refinementList = { color: ['Teal'] };

              const receivedDescription = getPLPMetadata(pageType, props).description;
              expect(receivedDescription.slice(167)).toBe('...');
            });
          });

          describe('Header', () => {
            beforeEach(() => {
              props.searchState = {
                hierarchicalMenu: {},
                refinementList: {},
                range: {}
              };

              props.searchResults = {
                hits: []
              };
            });

            it('should include both Facet & Category if the Facet is a color', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > furniture > dressers-changing-tables';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Home'],
                  lvl1: ['Home > Furniture'],
                  lvl2: ['Home > Furniture > Dressers & Changing Tables']
                },
                categories_slug: {
                  lvl0: ['home'],
                  lvl1: ['home > furniture'],
                  lvl2: ['home > furniture > dressers-changing-tables']
                }
              });

              props.searchState.refinementList = { color: ['Green'] };

              const expectedHeader = 'Green Dressers & Changing Tables';
              expect(getPLPMetadata(pageType, props).heading).toBe(expectedHeader);
            });

            it('should include both Facet & Category if the Facet is a age range', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > furniture > dressers-changing-tables';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Home'],
                  lvl1: ['Home > Furniture'],
                  lvl2: ['Home > Furniture > Dressers & Changing Tables']
                },
                categories_slug: {
                  lvl0: ['home'],
                  lvl1: ['home > furniture'],
                  lvl2: ['home > furniture > dressers-changing-tables']
                }
              });

              props.searchState.refinementList = { 'variants.age_range': ['6-8y'] };

              const expectedHeader = '6-8y Dressers & Changing Tables';
              expect(getPLPMetadata(pageType, props).heading).toBe(expectedHeader);
            });

            it('should include both Facet & Category if the Facet is a gender', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > furniture > dressers-changing-tables';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Home'],
                  lvl1: ['Home > Furniture'],
                  lvl2: ['Home > Furniture > Dressers & Changing Tables']
                },
                categories_slug: {
                  lvl0: ['home'],
                  lvl1: ['home > furniture'],
                  lvl2: ['home > furniture > dressers-changing-tables']
                }
              });

              props.searchState.refinementList = { gender: ['Girl'] };

              const expectedHeader = 'Girl Dressers & Changing Tables';
              expect(getPLPMetadata(pageType, props).heading).toBe(expectedHeader);
            });

            it('should omit the Category token if the Facet is a product type', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > bedding-bath > sheets';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Home'],
                  lvl1: ['Home > Bedding & Bath'],
                  lvl2: ['Home > Bedding & Bath > Sheets']
                },
                categories_slug: {
                  lvl0: ['home'],
                  lvl1: ['home > bedding-bath'],
                  lvl2: ['home > bedding-bath > sheets']
                }
              });

              props.searchState.refinementList = { product_type: ['Crib Sheets'] };

              const expectedHeader = 'Crib Sheets';
              expect(getPLPMetadata(pageType, props).heading).toBe(expectedHeader);
            });
          });
        });
      });

      describe('2 category levels and 1 faceted product type that is considered a SEO keyword', () => {
        describe('Top Nav = Baby', () => {
          beforeEach(() => {
            props.searchState = {
              hierarchicalMenu: {},
              refinementList: {},
              range: {}
            };

            props.searchResults = {
              hits: []
            };
          });

          it('/baby/boy-clothing metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > boy-clothing';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Baby'],
                lvl1: ['Baby > Boy Clothing']
              },
              categories_slug: {
                lvl0: ['baby'],
                lvl1: ['baby > boy-clothing']
              }
            });

            props.searchState.refinementList = { product_type: ['Onesies'] };

            const expectedMetadata = {
              title: 'Baby Boy Onesies - Shop Baby Clothes | Maisonette',
              description: 'Shop Baby Boy Onesies from your favorite newborn, infant and baby brands at Maisonette. Your one-stop shop for Baby Clothes and more.',
              heading: 'Baby Boy Onesies'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/baby/girl-clothing metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-clothing';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Baby'],
                lvl1: ['Baby > Girl Clothing']
              },
              categories_slug: {
                lvl0: ['baby'],
                lvl1: ['baby > girl-clothing']
              }
            });

            props.searchState.refinementList = { product_type: ['Cover-Ups'] };

            const expectedMetadata = {
              title: 'Baby Girl Cover-Ups - Shop Baby Clothes | Maisonette',
              description: 'Shop Baby Girl Cover-Ups from your favorite newborn, infant and baby brands at Maisonette. Your one-stop shop for Baby Clothes and more.',
              heading: 'Baby Girl Cover-Ups'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/baby/boy-accessories metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > boy-accessories';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Baby'],
                lvl1: ['Baby > Boy Accessories']
              },
              categories_slug: {
                lvl0: ['baby'],
                lvl1: ['baby > boy-accessories']
              }
            });

            props.searchState.refinementList = { product_type: ['Boots'] };

            const expectedMetadata = {
              title: 'Baby Boy Boots - Shop Baby Accessories | Maisonette',
              description: 'Shop Baby Boy Boots from your favorite newborn, infant and baby brands at Maisonette. Your one-stop shop for Baby Accessories and more.',
              heading: 'Baby Boy Boots'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/baby/girl-accessories metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-accessories';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Baby'],
                lvl1: ['Baby > Girl Accessories']
              },
              categories_slug: {
                lvl0: ['baby'],
                lvl1: ['baby > girl-accessories']
              }
            });

            props.searchState.refinementList = { product_type: ['Dress Shoes'] };

            const expectedMetadata = {
              title: 'Baby Girl Dress Shoes - Shop Baby Accessories | Maisonette',
              description: 'Shop Baby Girl Dress Shoes from your favorite newborn, infant and baby brands at Maisonette. Your one-stop shop for Baby Accessories and more.',
              heading: 'Baby Girl Dress Shoes'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/baby/bath-body metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > bath-body';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Baby'],
                lvl1: ['Baby > Bath & Body']
              },
              categories_slug: {
                lvl0: ['baby'],
                lvl1: ['baby > bath-body']
              }
            });

            props.searchState.refinementList = { product_type: ['Body Cleansers'] };

            const expectedMetadata = {
              title: 'Baby Body Cleansers - Shop Baby Bath & Body | Maisonette',
              description: 'Shop Baby Body Cleansers from your favorite newborn, infant and baby brands at Maisonette. Your one-stop shop for Baby Bath and Body and more.',
              heading: 'Baby Body Cleansers'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });
        });

        describe('Top Nav = Kids', () => {
          beforeEach(() => {
            props.searchState = {
              hierarchicalMenu: {},
              refinementList: {},
              range: {}
            };

            props.searchResults = {
              hits: []
            };
          });

          it('/kids/boy-clothing + singular facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > boy-clothing';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Kids'],
                lvl1: ['Kids > Boy Clothing']
              },
              categories_slug: {
                lvl0: ['kids'],
                lvl1: ['kids > boy-accessories']
              }
            });

            props.searchState.refinementList = { product_type: ['Parkas'] };

            const expectedMetadata = {
              title: 'Boys\' Parkas - Shop Kids Clothes | Maisonette',
              description: 'Shop Boys\' Parkas and Clothes from your favorite kid and toddler brands at Maisonette. Your one-stop shop for Kids Clothes and more.',
              heading: 'Boys\' Parkas'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/kids/boy-clothing + plural facet metadata is correct', () => {
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

            props.searchState.refinementList = { product_type: ['Puffers & Down Jackets'] };

            const expectedMetadata = {
              title: 'Boys\' Puffers & Down Jackets - Shop Kids Clothes | Maisonette',
              description: 'Shop Boys\' Puffers and Down Jackets from your favorite kid and toddler brands at Maisonette. Your one-stop shop for Kids Clothes and more.',
              heading: 'Boys\' Puffers & Down Jackets'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/kids/girl-clothing + singular facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > girl-clothing';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Kids'],
                lvl1: ['Kids > Girl Clothing']
              },
              categories_slug: {
                lvl0: ['kids'],
                lvl1: ['kids > girl-clothing']
              }
            });

            props.searchState.refinementList = { product_type: ['Wool Coats'] };

            const expectedMetadata = {
              title: 'Girls\' Wool Coats - Shop Kids Clothes | Maisonette',
              description: 'Shop Girls\' Wool Coats and Clothes from your favorite kid and toddler brands at Maisonette. Your one-stop shop for Kids Clothes and more.',
              heading: 'Girls\' Wool Coats'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/kids/girl-clothing + plural facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > girl-clothing';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Kids'],
                lvl1: ['Kids > Girl Clothing']
              },
              categories_slug: {
                lvl0: ['kids'],
                lvl1: ['kids > girl-clothing']
              }
            });

            props.searchState.refinementList = { product_type: ['Sweaters & Cardigans'] };

            const expectedMetadata = {
              title: 'Girls\' Sweaters & Cardigans - Shop Kids Clothes | Maisonette',
              description: 'Shop Girls\' Sweaters and Cardigans from your favorite kid and toddler brands at Maisonette. Your one-stop shop for Kids Clothes and more.',
              heading: 'Girls\' Sweaters & Cardigans'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/kids/boy-accessories + Shoe facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > boy-accessories';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Kids'],
                lvl1: ['Kids > Boy Accessories']
              },
              categories_slug: {
                lvl0: ['kids'],
                lvl1: ['kids > boy-accessories']
              }
            });

            props.searchState.refinementList = { product_type: ['Oxfords'] };

            const expectedMetadata = {
              title: 'Boys\' Oxfords - Shop Kids Accessories | Maisonette',
              description: 'Shop Boys\' Oxfords and Shoes from your favorite kid and toddler brands at Maisonette. Your one-stop shop for Kids Shoes and more.',
              heading: 'Boys\' Oxfords'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/kids/boy-accessories + facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > boy-accessories';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Kids'],
                lvl1: ['Kids > Boy Accessories']
              },
              categories_slug: {
                lvl0: ['kids'],
                lvl1: ['kids > boy-accessories']
              }
            });

            props.searchState.refinementList = { product_type: ['Ski Goggles'] };

            const expectedMetadata = {
              title: 'Boys\' Ski Goggles - Shop Kids Accessories | Maisonette',
              description: 'Shop Boys\' Ski Goggles and Accessories from your favorite kid and toddler brands at Maisonette. Your one-stop shop for Kids Accessories and more.',
              heading: 'Boys\' Ski Goggles'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/kids/girl-accessories + Shoe facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > girl-accessories';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Kids'],
                lvl1: ['Kids > Girl Accessories']
              },
              categories_slug: {
                lvl0: ['kids'],
                lvl1: ['kids > girl-accessories']
              }
            });

            props.searchState.refinementList = { product_type: ['Mary Janes'] };

            const expectedMetadata = {
              title: 'Girls\' Mary Janes - Shop Kids Accessories | Maisonette',
              description: 'Shop Girls\' Mary Janes and Shoes from your favorite kid and toddler brands at Maisonette. Your one-stop shop for Kids Shoes and more.',
              heading: 'Girls\' Mary Janes'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/kids/girl-accessories + facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > girl-accessories';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Kids'],
                lvl1: ['Kids > Girl Accessories']
              },
              categories_slug: {
                lvl0: ['kids'],
                lvl1: ['kids > girl-accessories']
              }
            });

            props.searchState.refinementList = { product_type: ['Umbrellas'] };

            const expectedMetadata = {
              title: 'Girls\' Umbrellas - Shop Kids Accessories | Maisonette',
              description: 'Shop Girls\' Umbrellas and Accessories from your favorite kid and toddler brands at Maisonette. Your one-stop shop for Kids Accessories and more.',
              heading: 'Girls\' Umbrellas'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/kids/bath-body + facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > bath-body';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Kids'],
                lvl1: ['Kids > Bath & Body']
              },
              categories_slug: {
                lvl0: ['kids'],
                lvl1: ['kids > bath-body']
              }
            });

            props.searchState.refinementList = { product_type: ['Bath Salts & Soaks'] };

            const expectedMetadata = {
              title: 'Kids Bath Salts & Soaks - Shop Home Bath & Body | Maisonette',
              description: 'Shop Maisonette\'s curated selection of Kids Bath Salts and Soaks. Your one-stop shop for Bath and Body from your favorite kids brands and more.',
              heading: 'Kids Bath Salts & Soaks'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });
        });

        describe('Top Nav = Play', () => {
          beforeEach(() => {
            props.searchState = {
              hierarchicalMenu: {},
              refinementList: {},
              range: {}
            };

            props.searchResults = {
              hits: []
            };
          });

          it('/play/kids + Costume Facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'play > kids';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Play'],
                lvl1: ['Play > Kids']
              },
              categories_slug: {
                lvl0: ['play'],
                lvl1: ['play > kids']
              }
            });

            props.searchState.refinementList = { product_type: ['Costumes'] };

            const expectedMetadata = {
              title: 'Kids Costumes & Dress Up Clothes | Maisonette',
              description: "Spark creativity and imagination with Maisonette's full selection of kids costumes and dress up clothes. Shop all costumes for kids in our one-stop shop.",
              heading: 'Kids Costumes & Dress Up Clothes'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/play/kids + Makeup Facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'play > kids';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Play'],
                lvl1: ['Play > Kids']
              },
              categories_slug: {
                lvl0: ['play'],
                lvl1: ['play > kids']
              }
            });

            props.searchState.refinementList = { product_type: ['Makeup'] };

            const expectedMetadata = {
              title: 'Play Make-up - Shop Kids Toys | Maisonette',
              description: 'Shop Play Make-up from your favorite baby, toddler and kid brands at Maisonette. Your one-stop shop for Kids Toys and more.',
              heading: 'Play Make-up'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/play/kids + Woodens Facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'play > kids';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Play'],
                lvl1: ['Play > Kids']
              },
              categories_slug: {
                lvl0: ['play'],
                lvl1: ['play > kids']
              }
            });

            props.searchState.refinementList = { product_type: ['Woodens'] };

            const expectedMetadata = {
              title: 'Wooden Toys - Shop Kids & Baby Toys | Maisonette',
              description: 'Shop Wooden Toys from your favorite baby, toddler and kid brands at Maisonette. Your one-stop shop for Kids Toys and more.',
              heading: 'Wooden Toys'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/play/outdoor + Goggles Facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'play > outdoor';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Play'],
                lvl1: ['Play > Outdoor']
              },
              categories_slug: {
                lvl0: ['play'],
                lvl1: ['play > outdoor']
              }
            });

            props.searchState.refinementList = { product_type: ['Goggles'] };

            const expectedMetadata = {
              title: 'Goggles for Swimming & More - Shop Toys | Maisonette',
              description: 'Shop Swim Goggles from your favorite baby, toddler and kid brands at Maisonette. Your one-stop shop for Kids Toys and more.',
              heading: 'Swim Goggles'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/play/outdoor + Helmets Facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'play > outdoor';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Play'],
                lvl1: ['Play > Outdoor']
              },
              categories_slug: {
                lvl0: ['play'],
                lvl1: ['play > outdoor']
              }
            });

            props.searchState.refinementList = { product_type: ['Helmets'] };

            const expectedMetadata = {
              title: 'Kids Bike Helmets & More - Shop Toys | Maisonette',
              description: 'Shop Kids Bike Helmets and More from your favorite baby, toddler and kid brands at Maisonette. Your one-stop shop for Kids Toys and more.',
              heading: 'Kids Bike Helmets & More'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/play/outdoor + Pool Floats Facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'play > outdoor';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Play'],
                lvl1: ['Play > Outdoor']
              },
              categories_slug: {
                lvl0: ['play'],
                lvl1: ['play > outdoor']
              }
            });

            props.searchState.refinementList = { product_type: ['Pool Floats'] };

            const expectedMetadata = {
              title: 'Pool Floats - Shop Kids & Baby Pool Toys | Maisonette',
              description: 'Shop Pool Floats from your favorite baby, toddler and kid brands at Maisonette. Your one-stop shop for Kids Toys and more.',
              heading: 'Pool Floats'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });
        });

        describe('Top Nav = Home', () => {
          beforeEach(() => {
            props.searchState = {
              hierarchicalMenu: {},
              refinementList: {},
              range: {}
            };

            props.searchResults = {
              hits: []
            };
          });

          it('/home/decor + Wallpaper Facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > decor';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Home'],
                lvl1: ['Home > Decor']
              },
              categories_slug: {
                lvl0: ['home'],
                lvl1: ['home > decor']
              }
            });

            props.searchState.refinementList = { product_type: ['Wallpaper'] };

            const expectedMetadata = {
              title: 'Wallpaper - Shop Home & Nursery Decor | Maisonette',
              description: 'Shop Maisonette\'s curated selection of Wallpaper. Your one-stop shop for Home and Nursery Decor from your favorite kids brands and more.',
              heading: 'Wallpaper'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/home/decor + Decorations Facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > decor';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Home'],
                lvl1: ['Home > Decor']
              },
              categories_slug: {
                lvl0: ['home'],
                lvl1: ['home > decor']
              }
            });

            props.searchState.refinementList = { product_type: ['Decorations'] };

            const expectedMetadata = {
              title: 'Decorations - Shop Home & Nursery Decor | Maisonette',
              description: 'Shop Maisonette\'s curated selection of Decorations. Your one-stop shop for Home and Nursery Decor from your favorite kids brands and more.',
              heading: 'Decorations'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/home/decor + Mobiles Facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > decor';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Home'],
                lvl1: ['Home > Decor']
              },
              categories_slug: {
                lvl0: ['home'],
                lvl1: ['home > decor']
              }
            });

            props.searchState.refinementList = { product_type: ['Mobiles'] };

            const expectedMetadata = {
              title: 'Baby Mobiles - Shop Nursery Decor | Maisonette',
              description: 'Shop Maisonette\'s curated selection of Baby Mobiles. Your one-stop shop for Nursery Decor from your favorite kids brands and more.',
              heading: 'Baby Mobiles'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/home/decor + Drinkware Facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > decor';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Home'],
                lvl1: ['Home > Decor']
              },
              categories_slug: {
                lvl0: ['home'],
                lvl1: ['home > decor']
              }
            });

            props.searchState.refinementList = { product_type: ['Drinkware'] };

            const expectedMetadata = {
              title: 'Glasses & Drinkware - Shop Home Decor | Maisonette',
              description: 'Shop Maisonette\'s curated selection of Glasses and Drinkware. Your one-stop shop for Home Decor from your favorite kids brands and more.',
              heading: 'Glasses & Drinkware'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/home/furniture + Teepees Facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > furniture';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Home'],
                lvl1: ['Home > Furniture']
              },
              categories_slug: {
                lvl0: ['home'],
                lvl1: ['home > furniture']
              }
            });

            props.searchState.refinementList = { product_type: ['Teepees'] };

            const expectedMetadata = {
              title: 'Kids Teepees - Shop Home Furniture | Maisonette',
              description: 'Shop Maisonette\'s curated selection of Kids Teepees. Your one-stop shop for Home Furniture from your favorite kids brands and more.',
              heading: 'Kids Teepees'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/home/furniture + Travel Cribs Facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > furniture';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Home'],
                lvl1: ['Home > Furniture']
              },
              categories_slug: {
                lvl0: ['home'],
                lvl1: ['home > furniture']
              }
            });

            props.searchState.refinementList = { product_type: ['Travel Cribs'] };

            const expectedMetadata = {
              title: 'Travel Cribs - Shop Baby Furniture & Gear | Maisonette',
              description: 'Shop Maisonette\'s curated selection of Travel Cribs. Your one-stop shop for Home Furniture from your favorite kids brands and more.',
              heading: 'Travel Cribs'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/home/bedding-bath + Crib Sheets Facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > bedding-bath';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Home'],
                lvl1: ['Home > Bath & Beauty']
              },
              categories_slug: {
                lvl0: ['home'],
                lvl1: ['home > bedding-bath']
              }
            });

            props.searchState.refinementList = { product_type: ['Crib Sheets'] };

            const expectedMetadata = {
              title: 'Crib Sheets - Shop Home Bath & Beauty | Maisonette',
              description: 'Shop Maisonette\'s curated selection of Crib Sheets. Your one-stop shop for Bath and Beauty from your favorite kids brands and more.',
              heading: 'Crib Sheets'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/home/bedding-bath + Crib Skirts Facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > bedding-bath';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Home'],
                lvl1: ['Home > Bath & Beauty']
              },
              categories_slug: {
                lvl0: ['home'],
                lvl1: ['home > bedding-bath']
              }
            });

            props.searchState.refinementList = { product_type: ['Crib Skirts'] };

            const expectedMetadata = {
              title: 'Crib Skirts - Shop Home Bath & Beauty | Maisonette',
              description: 'Shop Maisonette\'s curated selection of Crib Skirts. Your one-stop shop for Bath and Beauty from your favorite kids brands and more.',
              heading: 'Crib Skirts'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('/home/bedding-bath + Tubs Facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > bedding-bath';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Home'],
                lvl1: ['Home > Bath & Beauty']
              },
              categories_slug: {
                lvl0: ['home'],
                lvl1: ['home > bedding-bath']
              }
            });

            props.searchState.refinementList = { product_type: ['Tubs'] };

            const expectedMetadata = {
              title: 'Bath Tub Curtains, Mats, & Drapes - Shop Bath Tub Curtains, Mats, & Drapes | Maisonette',
              description: 'Shop Maisonette\'s curated selection of Bath Tub Curtains, Mats, and Drapes. Your one-stop shop for Bath and Beauty from your favorite kids brands and more.',
              heading: 'Bath Tub Curtains, Mats, & Drapes'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });
        });

        describe('Top Nav = Gear', () => {
          beforeEach(() => {
            props.searchState = {
              hierarchicalMenu: {},
              refinementList: {},
              range: {}
            };

            props.searchResults = {
              hits: []
            };
          });

          it('/gear + Nursing Pillows Facet metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'gear';
            props.searchResults.hits.push({
              categories: { lvl0: ['Gear'] },
              categories_slug: { lvl0: ['gear'] }
            });

            props.searchState.refinementList = { product_type: ['Nursing Pillows'] };

            const expectedMetadata = {
              title: 'Nursing Pillows - Shop Gear | Maisonette',
              description: 'Shop Maisonette\'s curated selection of Nursing Pillows. Your one-stop shop for Gear from your favorite kids brands and more.',
              heading: 'Nursing Pillows'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });

          it('2 categories + 1 faceted product', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'gear > strollers';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Gear'],
                lvl1: ['Gear > Strollers']
              },
              categories_slug: {
                lvl0: ['gear'],
                lvl1: ['gear > strollers']
              }
            });

            props.searchState.refinementList = { product_type: ['Car Seat Accessories'] };

            const expectedMetadata = {
              title: 'Car Seat Accessories - Shop Gear | Maisonette',
              description: 'Shop Maisonette\'s curated selection of Car Seat Accessories. Your one-stop shop for Gear from your favorite kids brands and more.',
              heading: 'Car Seat Accessories'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });
        });
      });
    });

    describe('Catch-All Dynamic Template', () => {
      describe('2 categories and no facets/static override', () => {
        describe('Top Nav = Home', () => {
          beforeEach(() => {
            props.searchState = {
              hierarchicalMenu: {},
              refinementList: {},
              range: {}
            };

            props.searchResults = {
              hits: []
            };
          });

          it('metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > furniture';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Home'],
                lvl1: ['Home > Furniture']
              },
              categories_slug: {
                lvl0: ['home'],
                lvl1: ['home > furniture']
              }
            });

            const expectedMetadata = {
              title: 'Home Furniture | Maisonette',
              description: 'Shop Maisonette\'s curated selection of Furniture. Your one-stop shop for Home Furniture from your favorite kids brands and more.',
              heading: 'Furniture'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });
        });

        describe('Top Nav = Gear', () => {
          beforeEach(() => {
            props.searchState = {
              hierarchicalMenu: {},
              refinementList: {},
              range: {}
            };

            props.searchResults = {
              hits: []
            };
          });

          it('metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'gear > carriers';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Gear'],
                lvl1: ['Gear > Carriers']
              },
              categories_slug: {
                lvl0: ['gear'],
                lvl1: ['gear > carriers']
              }
            });

            const expectedMetadata = {
              title: 'Carriers - Shop Gear | Maisonette',
              description: 'Shop Maisonette\'s curated selection of Carriers. Your one-stop shop for Gear from your favorite kids brands and more.',
              heading: 'Carriers'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });
        });
      });

      describe('2 categories and 2+ facets applied', () => {
        describe('Top Nav = Home', () => {
          beforeEach(() => {
            props.searchState = {
              hierarchicalMenu: {},
              refinementList: {},
              range: {}
            };

            props.searchResults = {
              hits: []
            };
          });

          it('metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > furniture';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Home'],
                lvl1: ['Home > Furniture']
              },
              categories_slug: {
                lvl0: ['home'],
                lvl1: ['home > furniture']
              }
            });

            props.searchState.refinementList = { color: ['Pink', 'Red'] };

            const expectedMetadata = {
              title: 'Home Furniture | Maisonette',
              description: 'Shop Maisonette\'s curated selection of Furniture. Your one-stop shop for Home Furniture from your favorite kids brands and more.',
              heading: 'Furniture'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMetadata);
          });
        });
      });

      describe('3 category levels and no facets/static overrides', () => {
        describe('Top Nav = Baby', () => {
          beforeEach(() => {
            props.searchState = {
              hierarchicalMenu: {},
              refinementList: {},
              range: {}
            };

            props.searchResults = {
              hits: []
            };
          });

          it('Gender Category Metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-clothing > basics';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Baby'],
                lvl1: ['Baby > Girl Clothing'],
                lvl2: ['Baby > Girl Clothing > Basics']
              },
              categories_slug: {
                lvl0: ['baby'],
                lvl1: ['baby > girl-clothing'],
                lvl2: ['baby > girl-clothing > basics']
              }
            });

            const expectedMeta = {
              title: 'Baby Girl Basics - Shop Baby Clothing | Maisonette',
              description: 'Shop Baby Girl Basics from your favorite newborn, infant and baby brands at Maisonette. Your one-stop shop for Baby Clothing and more.',
              heading: 'Baby Girl Basics'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMeta);
          });

          it('Non-gender Category Metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > bath-body > skincare';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Baby'],
                lvl1: ['Baby > Bath & Body'],
                lvl2: ['Baby > Bath & Body > Skincare']
              },
              categories_slug: {
                lvl0: ['baby'],
                lvl1: ['baby > bath-body'],
                lvl2: ['baby > bath-body > skincare']
              }
            });

            const expectedMeta = {
              title: 'Baby Skincare - Shop Baby Bath & Body | Maisonette',
              description: 'Shop Baby Skincare from your favorite newborn, infant and baby brands at Maisonette. Your one-stop shop for Baby Bath and Body and more.',
              heading: 'Baby Skincare'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMeta);
          });
        });

        describe('Top Nav = Kids', () => {
          beforeEach(() => {
            props.searchState = {
              hierarchicalMenu: {},
              refinementList: {},
              range: {}
            };

            props.searchResults = {
              hits: []
            };
          });

          it('Gender Category Metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > girl-accessories > sunglasses';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Kids'],
                lvl1: ['Kids > Girl Accessories'],
                lvl2: ['Kids > Girl Accessories > Sunglasses']
              },
              categories_slug: {
                lvl0: ['kids'],
                lvl1: ['kids > girl-accessories'],
                lvl2: ['kids > girl-accessories > sunglasses']
              }
            });

            const expectedMeta = {
              title: 'Girls\' Sunglasses - Shop Kids Accessories | Maisonette',
              description: 'Shop Girls\' Sunglasses from your favorite kid and toddler brands at Maisonette. Your one-stop shop for Kids Accessories and more.',
              heading: 'Girls\' Sunglasses'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMeta);
          });

          it('Non-gender Category Metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > bath-body > towelsrobes';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Kids'],
                lvl1: ['Kids > Bath & Body'],
                lvl2: ['Kids > Bath & Body > Towels & Robes']
              },
              categories_slug: {
                lvl0: ['kids'],
                lvl1: ['kids > bath-body'],
                lvl2: ['kids > bath-body > towelsrobes']
              }
            });

            const expectedMeta = {
              title: 'Towels & Robes - Shop Kids Bath & Body | Maisonette',
              description: 'Shop Towels and Robes from your favorite kid and toddler brands at Maisonette. Your one-stop shop for Kids Bath and Body and more.',
              heading: 'Towels & Robes'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMeta);
          });
        });

        describe('Top Nav = Home', () => {
          beforeEach(() => {
            props.searchState = {
              hierarchicalMenu: {},
              refinementList: {},
              range: {}
            };

            props.searchResults = {
              hits: []
            };
          });

          it('metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > decor > art';

            props.searchResults.hits.push({
              categories: {
                lvl0: ['Home'],
                lvl1: ['Home > Decor'],
                lvl2: ['Home > Decor > Art']
              },
              categories_slug: {
                lvl0: ['home'],
                lvl1: ['home > decor'],
                lvl2: ['home > decor > art']
              }
            });

            const expectedMeta = {
              title: 'Art - Shop Home Decor | Maisonette',
              description: 'Shop Maisonette\'s curated selection of Art. Your one-stop shop for Home Decor from your favorite kids brands and more.',
              heading: 'Art'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMeta);
          });
        });
      });

      describe('3 categories and 2+ facets applied', () => {
        describe('Top Nav = Baby', () => {
          beforeEach(() => {
            props.searchState = {
              hierarchicalMenu: {},
              refinementList: {},
              range: {}
            };

            props.searchResults = {
              hits: []
            };
          });

          it('Gender Category Metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > girl-clothing > basics';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Baby'],
                lvl1: ['Baby > Girl Clothing'],
                lvl2: ['Baby > Girl Clothing > Basics']
              },
              categories_slug: {
                lvl0: ['baby'],
                lvl1: ['baby > girl-clothing'],
                lvl2: ['baby > girl-clothing > basics']
              }
            });

            props.searchState.refinementList = { color: ['Yellow', 'Purple'] };

            const expectedMeta = {
              title: 'Baby Girl Basics - Shop Baby Clothing | Maisonette',
              description: 'Shop Baby Girl Basics from your favorite newborn, infant and baby brands at Maisonette. Your one-stop shop for Baby Clothing and more.',
              heading: 'Baby Girl Basics'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMeta);
          });

          it('Non-gender Category Metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > bath-body > skincare';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Baby'],
                lvl1: ['Baby > Bath & Body'],
                lvl2: ['Baby > Bath & Body > Skincare']
              },
              categories_slug: {
                lvl0: ['baby'],
                lvl1: ['baby > bath-body'],
                lvl2: ['baby > bath-body > skincare']
              }
            });

            props.searchState.refinementList = { color: ['Yellow', 'Purple'] };

            const expectedMeta = {
              title: 'Baby Skincare - Shop Baby Bath & Body | Maisonette',
              description: 'Shop Baby Skincare from your favorite newborn, infant and baby brands at Maisonette. Your one-stop shop for Baby Bath and Body and more.',
              heading: 'Baby Skincare'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMeta);
          });
        });

        describe('Top Nav = Kids', () => {
          beforeEach(() => {
            props.searchState = {
              hierarchicalMenu: {},
              refinementList: {},
              range: {}
            };

            props.searchResults = {
              hits: []
            };
          });

          it('Gender Category Metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > girl-accessories > sunglasses';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Kids'],
                lvl1: ['Kids > Girl Accessories'],
                lvl2: ['Kids > Girl Accessories > Sunglasses']
              },
              categories_slug: {
                lvl0: ['kids'],
                lvl1: ['kids > girl-accessories'],
                lvl2: ['kids > girl-accessories > sunglasses']
              }
            });

            props.searchState.refinementList = { color: ['Yellow', 'Purple'] };

            const expectedMeta = {
              title: 'Girls\' Sunglasses - Shop Kids Accessories | Maisonette',
              description: 'Shop Girls\' Sunglasses from your favorite kid and toddler brands at Maisonette. Your one-stop shop for Kids Accessories and more.',
              heading: 'Girls\' Sunglasses'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMeta);
          });

          it('Non-gender Category Metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids > bath-body > towelsrobes';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Kids'],
                lvl1: ['Kids > Bath & Body'],
                lvl2: ['Kids > Bath & Body > Towels & Robes']
              },
              categories_slug: {
                lvl0: ['kids'],
                lvl1: ['kids > bath-body'],
                lvl2: ['kids > bath-body > towelsrobes']
              }
            });

            props.searchState.refinementList = { color: ['Yellow', 'Purple'] };

            const expectedMeta = {
              title: 'Towels & Robes - Shop Kids Bath & Body | Maisonette',
              description: 'Shop Towels and Robes from your favorite kid and toddler brands at Maisonette. Your one-stop shop for Kids Bath and Body and more.',
              heading: 'Towels & Robes'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMeta);
          });
        });

        describe('Top Nav = Home', () => {
          beforeEach(() => {
            props.searchState = {
              hierarchicalMenu: {},
              refinementList: {},
              range: {}
            };

            props.searchResults = {
              hits: []
            };
          });

          it('metadata is correct', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > decor > art';

            props.searchResults.hits.push({
              categories: {
                lvl0: ['Home'],
                lvl1: ['Home > Decor'],
                lvl2: ['Home > Decor > Art']
              },
              categories_slug: {
                lvl0: ['home'],
                lvl1: ['home > decor'],
                lvl2: ['home > decor > art']
              }
            });

            props.searchState.refinementList = { color: ['Yellow', 'Purple'] };

            const expectedMeta = {
              title: 'Art - Shop Home Decor | Maisonette',
              description: 'Shop Maisonette\'s curated selection of Art. Your one-stop shop for Home Decor from your favorite kids brands and more.',
              heading: 'Art'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMeta);
          });
        });
      });

      describe('Other Top Navs', () => {
        describe('Top Nav = Play', () => {
          beforeEach(() => {
            props.searchState = {
              hierarchicalMenu: {},
              refinementList: {},
              range: {}
            };

            props.searchResults = {
              hits: []
            };
          });

          describe('3 categories', () => {
            it('No faceted metadata is correct', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'play > learning > blockssortersstackers';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Play'],
                  lvl1: ['Play > Learning'],
                  lvl2: ['Play > Learning > Blocks Sorters & Stackers']
                },
                categories_slug: {
                  lvl0: ['play'],
                  lvl1: ['play > learning'],
                  lvl2: ['play > learning > blockssortersstackers']
                }
              });

              const expectedMeta = {
                title: 'Learning Blocks Sorters & Stackers - Shop Toys | Maisonette',
                description: 'Shop Learning Blocks Sorters and Stackers from your favorite baby, toddler and kids brands at Maisonette. Your one-stop shop for Learning Toys and more.',
                heading: 'Blocks Sorters & Stackers'
              };
              expect(getPLPMetadata(pageType, props)).toEqual(expectedMeta);
            });

            it('1 facet metadata is correct', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'play > baby > infant-development';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Play'],
                  lvl1: ['Play > Baby'],
                  lvl2: ['Play > Baby > Infant Development']
                },
                categories_slug: {
                  lvl0: ['play'],
                  lvl1: ['play > baby'],
                  lvl2: ['play > baby > infant-development']
                }
              });

              props.searchState.refinementList = { gender: ['Girl'] };

              const expectedMeta = {
                title: 'Baby Infant Development - Shop Toys | Maisonette',
                description: 'Shop Baby Infant Development from your favorite baby, toddler and kids brands at Maisonette. Your one-stop shop for Baby Toys and more.',
                heading: 'Infant Development'
              };
              expect(getPLPMetadata(pageType, props)).toEqual(expectedMeta);
            });

            it('2+ facet metadata is correct', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'play > outdoor > sports';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Play'],
                  lvl1: ['Play > Outdoor'],
                  lvl2: ['Play > Outdoor > Sports']
                },
                categories_slug: {
                  lvl0: ['play'],
                  lvl1: ['play > outdoor'],
                  lvl2: ['play > outdoor > sports']
                }
              });

              props.searchState.refinementList = { color: ['Green', 'Pink'] };

              const expectedMeta = {
                title: 'Outdoor Sports - Shop Toys | Maisonette',
                description: 'Shop Outdoor Sports from your favorite baby, toddler and kids brands at Maisonette. Your one-stop shop for Outdoor Toys and more.',
                heading: 'Sports'
              };
              expect(getPLPMetadata(pageType, props)).toEqual(expectedMeta);
            });

            it('Subcategory Override Metadata is correct', () => {
              props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'play > kids > plush';
              props.searchResults.hits.push({
                categories: {
                  lvl0: ['Play'],
                  lvl1: ['Play > Kids'],
                  lvl2: ['Play > Kids > Plush']
                },
                categories_slug: {
                  lvl0: ['play'],
                  lvl1: ['play > kids'],
                  lvl2: ['play > kids > plush']
                }
              });

              const expectedMeta = {
                title: 'Kids Stuffed Animals & Plush Toys - Shop Toys | Maisonette',
                description: 'Shop Kids Stuffed Animals and Plush Toys from your favorite baby, toddler and kids brands at Maisonette. Your one-stop shop for Kids Toys and more.',
                heading: 'Stuffed Animals & Plush Toys'
              };
              expect(getPLPMetadata(pageType, props)).toEqual(expectedMeta);
            });
          });
        });

        describe('Top Nav = Womens', () => {
          beforeEach(() => {
            props.searchState = {
              hierarchicalMenu: {},
              refinementList: {},
              range: {}
            };

            props.searchResults = {
              hits: []
            };
          });

          it('Metadata displays different category terminology for Title & Description', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'womens > maternity > bottoms';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Womens'],
                lvl1: ['Womens > Maternity'],
                lvl2: ['Womens > Maternity > Bottoms']
              },
              categories_slug: {
                lvl0: ['womens'],
                lvl1: ['womens > maternity'],
                lvl2: ['womens > maternity > bottoms']
              }
            });

            const expectedMeta = {
              title: 'Maternity Jeans, Pants, Shorts & Bottoms | Maisonette',
              description: 'Shop Maternity Bottoms from your favorite brands at Maisonette. Your one-stop shop for Baby, Kids, Adult Clothing, Accessories, and more.',
              heading: 'Maternity Bottoms'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMeta);
          });

          it('Metadata displays correct metadata if terminology is the same as the slug', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'womens > clothing > dresses';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Womens'],
                lvl1: ['Womens > Clothing'],
                lvl2: ['Womens > Clothing > Dresses']
              },
              categories_slug: {
                lvl0: ['womens'],
                lvl1: ['womens > clothing'],
                lvl2: ['womens > clothing > dresses']
              }
            });

            const expectedMeta = {
              title: 'Shop Women\'s Dresses | Maisonette',
              description: 'Shop Women\'s Dresses from your favorite brands at Maisonette. Your one-stop shop for Baby, Kids, Adult Clothing, Accessories, and more.',
              heading: 'Women\'s Dresses'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMeta);
          });

          it('Title includes "Shop" if override json specifies it', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'womens';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Womens']
              },
              categories_slug: {
                lvl0: ['womens']
              }
            });

            const expectedMeta = {
              title: 'Shop Women\'s Clothing & Accessories | Maisonette',
              description: 'Shop Women\'s Clothing and Accessories from your favorite brands at Maisonette. Your one-stop shop for Baby, Kids, Adult Clothing, Accessories, and more.',
              heading: 'Women\'s Clothing & Accessories'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMeta);
          });

          it('Womens > Bath-Body', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'womens > bath-body';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Womens'],
                lvl1: ['Womens > Bath & Body']
              },
              categories_slug: {
                lvl0: ['womens'],
                lvl1: ['womens > bath-body']
              }
            });

            const expectedMeta = {
              title: 'Women\'s Bath & Body Products | Maisonette',
              description: 'Shop Women\'s Bath and Body products from your favorite brands at Maisonette. Your one-stop shop for Baby, Kids, Adult Clothing, Accessories, and more.',
              heading: 'Women\'s Bath & Body Products'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMeta);
          });

          it('Womens > Bath-Body > Body-Care', () => {
            props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'womens > bath-body > body-care';
            props.searchResults.hits.push({
              categories: {
                lvl0: ['Womens'],
                lvl1: ['Womens > Bath & Body'],
                lvl2: ['Womens > Bath & Body > Body Care']
              },
              categories_slug: {
                lvl0: ['womens'],
                lvl1: ['womens > bath-body'],
                lvl2: ['womens > bath-body > body-care']
              }
            });

            const expectedMeta = {
              title: 'Women\'s Shampoo, Body Lotion & Body Products | Maisonette',
              description: 'Shop Women\'s shampoo, body lotion, and body products from your favorite brands at Maisonette. Your one-stop shop for Baby, Kids, Adult Clothing, Accessories, and more.',
              heading: 'Women\'s Body Care Products'
            };
            expect(getPLPMetadata(pageType, props)).toEqual(expectedMeta);
          });
        });
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
    });

    describe('Static overrides for the Hierarchical Menu', () => {
      beforeEach(() => {
        props.searchState = {
          hierarchicalMenu: {},
          refinementList: {},
          range: {}
        };
      });

      describe('Specific Filtered Hierarchical Menu', () => {
        beforeEach(() => {
          props.searchState = {
            hierarchicalMenu: {},
            refinementList: {},
            range: {
              'variants.maisonette_sale': {}
            }
          };
        });

        it('is correct for /play and price range between $21,300 to $73,600', () => {
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'play';
          props.searchState.range['variants.maisonette_sale'] = {
            max: 73600,
            min: 21300
          };

          expect(getPLPMetadata(pageType, props)).toEqual(categoriesMetaOverrides.play['price:21300-73600']);
        });

        it('is correct for /play and other price range override', () => {
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'play';
          props.searchState.range['variants.maisonette_sale'] = {
            min: 21300
          };

          expect(getPLPMetadata(pageType, props)).toEqual(categoriesMetaOverrides.play.default);
        });

        it('is correct for /home/seasonal/halloween and all defined halloween products', () => {
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > seasonal > halloween';
          props.searchState.refinementList.product_type = [
            'Garlands',
            'Paper Goods',
            'Party'
          ];

          expect(getPLPMetadata(pageType, props)).toEqual(categoriesMetaOverrides['home > seasonal > halloween']['party-decor']);
        });

        it('is correct for /home/seasonal/halloween and no defined halloween products', () => {
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > seasonal > halloween';
          props.searchState.refinementList.product_type = ['Garlands'];

          expect(getPLPMetadata(pageType, props)).toEqual(categoriesMetaOverrides['home > seasonal > halloween'].default);
        });

        it('is correct for /gifts/by-age/gifts-for-mom and defined product', () => {
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'gifts > by-age > gifts-for-moms';
          props.searchState.refinementList = { product_type: ['Earrings'] };

          expect(getPLPMetadata(pageType, props)).toEqual(categoriesMetaOverrides['gifts > by-age > gifts-for-moms'].Earrings);
        });

        it('is correct for /gifts/by-age/gifts-for-mom and no defined product', () => {
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'gifts > by-age > gifts-for-moms';

          expect(getPLPMetadata(pageType, props)).toEqual(categoriesMetaOverrides['gifts > by-age > gifts-for-moms'].default);
        });
      });

      describe('For Hierarchical Menu that have overrides, regardless of facets', () => {
        beforeEach(() => {
          props.searchState = {
            hierarchicalMenu: {},
            refinementList: {},
            range: {}
          };
        });

        it('is correct for 1 category level', () => {
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby';
          expect(getPLPMetadata(pageType, props)).toEqual(categoriesMetaOverrides.baby);
        });

        it('is correct for 2 category levels', () => {
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'home > seasonal';
          expect(getPLPMetadata(pageType, props)).toEqual(categoriesMetaOverrides['home > seasonal']);
        });

        it('is correct for 3 category levels', () => {
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'whats-new > shops > basics';
          expect(getPLPMetadata(pageType, props)).toEqual(categoriesMetaOverrides['whats-new > shops > basics']);
        });

        it('is correct for 1 category level and multiple facets applied', () => {
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'kids';
          props.searchState.refinementList = { color: ['Green'] };

          expect(getPLPMetadata(pageType, props)).toEqual(categoriesMetaOverrides.kids);
        });

        it('is correct for 2 category levels and multiple facets applied', () => {
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'play > outdoor';
          props.searchState.refinementList = { color: ['Green'], gender: ['Boy'] };

          expect(getPLPMetadata(pageType, props)).toEqual(categoriesMetaOverrides['play > outdoor']);
        });

        it('is correct for 3 category levels and multiple facets applied', () => {
          props.searchState.hierarchicalMenu['categories_slug.lvl0'] = 'baby > boy-clothing > tops';
          props.searchState.refinementList = { color: ['Green'], gender: ['Boy'] };

          expect(getPLPMetadata(pageType, props)).toEqual(categoriesMetaOverrides['baby > boy-clothing > tops']);
        });
      });
    });

    describe('Static overrides for Facets Only', () => {
      describe('for solo facet applied', () => {
        beforeEach(() => {
          props.searchState = {
            hierarchicalMenu: {},
            refinementList: {},
            range: {}
          };
        });

        it('is correct for 1 jewelry facet applied', () => {
          props.searchState.refinementList.product_type = ['Necklaces'];
          expect(getPLPMetadata(pageType, props)).toEqual(filterMetaOverrides.Necklaces);
        });
      });

      describe('for multiple facets applied', () => {
        beforeEach(() => {
          props.searchState = {
            hierarchicalMenu: {},
            refinementList: {},
            range: {}
          };
        });

        it('is correct for only costume accessories facet', () => {
          props.searchState.refinementList.product_type = ['Costume Accessories'];

          expect(getPLPMetadata(pageType, props)).toEqual(filterMetaOverrides['Costume Accessories']);
        });

        it('is correct for costume accessories & costumes facets with no age range', () => {
          props.searchState.refinementList.product_type = [
            'Costume Accessories',
            'Costumes'
          ];

          expect(getPLPMetadata(pageType, props)).toEqual(filterMetaOverrides['halloween-costumes'].default);
        });

        it('is correct for baby costume accessories & costumes facets', () => {
          props.searchState.refinementList = {
            product_type: [
              'Costume Accessories',
              'Costumes'
            ],
            'variants.age_range': [
              '0-6m',
              '6-12m',
              '12-24m'
            ]
          };

          expect(getPLPMetadata(pageType, props)).toEqual(filterMetaOverrides['halloween-costumes'].baby);
        });

        it('is correct for children costume accessories & costumes facets', () => {
          props.searchState.refinementList = {
            product_type: [
              'Costume Accessories',
              'Costumes'
            ],
            'variants.age_range': [
              '2-4y',
              '4-6y',
              '6-8y',
              '8-12y',
              '8y+'
            ]
          };

          expect(getPLPMetadata(pageType, props)).toEqual(filterMetaOverrides['halloween-costumes'].children);
        });
      });
    });
  });
});
