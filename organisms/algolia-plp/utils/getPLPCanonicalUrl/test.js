import getPLPCanonicalUrl from '.';

describe('getPLPCanonicalUrl returns the correct URL', () => {
  let router = {};
  let expectedUrl;

  describe('Ad Hoc Canonical Requests', () => {
    describe('Self Referencing URL rules', () => {
      beforeEach(() => {
        router = { asPath: '' };
        expectedUrl = '';
      });

      it('/shop/play/baby?variants.age_range=0-6m', () => {
        const hierarchicalMenu = '/play/baby';
        const query = '?variants.age_range=0-6m';
        const page = '/shop';

        router.asPath = `${page}${hierarchicalMenu}${query}`;
        expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}${query}`;
        expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
      });

      it('/shop/play/baby?variants.age_range=0-6m&page=4 + pagination', () => {
        const hierarchicalMenu = '/play/baby';
        const query = '?variants.age_range=0-6m';
        const pagination = '&page=4';
        const page = '/shop';

        router.asPath = `${page}${hierarchicalMenu}${query}${pagination}`;
        expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}${query}${pagination}`;
        expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
      });

      it('/edits/holiday-dressing?variants.age_range=Adults + pagination', () => {
        const page = '/edits/holiday-dressing';
        const query = '?variants.age_range=Adults';
        const pagination = '&page=4';

        router.asPath = `${page}${query}${pagination}`;
        expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${query}${pagination}`;
        expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
      });

      it('/trends/best-sellers-this-season/gifts + pagination', () => {
        const page = '/trends/best-sellers-this-season';
        const hierarchicalMenu = '/gifts';
        const pagination = '&page=2';

        router.asPath = `${page}${hierarchicalMenu}${pagination}`;
        expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}${pagination}`;
        expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
      });
    });
  });

  describe('Shop Pages', () => {
    const page = '/shop';
    describe('Global Rules', () => {
      beforeEach(() => {
        router = { asPath: '' };
        expectedUrl = '';
      });

      it('URL path is returned if there are no queries', () => {
        const hierarchicalMenu = '/baby/boy-clothing/tops';

        router.asPath = `${page}${hierarchicalMenu}`;
        expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}`;
        expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
      });

      it('only URL path is returned if there are multiple queries', () => {
        const hierarchicalMenu = '/baby/girl-clothing/dresses';
        const queries = '?color=Pink&variants.age_range=2-4y';

        router.asPath = `${page}${hierarchicalMenu}${queries}`;
        expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}`;
        expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
      });

      it('only URL path is returned if there are multiple values to a query', () => {
        const hierarchicalMenu = '/baby/boy-clothing/tops';
        const queries = '?product_type=Mixed%20Apparel%20Set%2BShirts';

        router.asPath = `${page}${hierarchicalMenu}${queries}`;
        expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}`;
        expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
      });

      it('URL should not include a blacklist query', () => {
        const query = '?page=2';
        const blacklist = '&td=top-nav';

        router.asPath = `${page}${query}${blacklist}`;
        expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${query}`;
        expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
      });

      it('URL should always include pagination', () => {
        const query = '?page=3';

        router.asPath = `${page}${query}`;
        expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${query}`;
        expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
      });
    });

    describe('Special Rules', () => {
      describe('Baby Category Pages', () => {
        describe('Self Referencing URL rules', () => {
          beforeEach(() => {
            router = { asPath: '' };
            expectedUrl = '';
          });

          it('3 Hierarchical Levels + the applied filter is Age Range with only 1 value', () => {
            const hierarchicalMenu = '/baby/boy-accessories/shoes-booties';
            const queries = '?variants.age_range=0-6m';

            router.asPath = `${page}${hierarchicalMenu}${queries}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}${queries}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('3 Hierarchical Levels + the applied filter is Color with only 1 value', () => {
            const hierarchicalMenu = '/baby/girl-clothing/shoes';
            const queries = '?color=Purple';

            router.asPath = `${page}${hierarchicalMenu}${queries}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}${queries}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('3 Hierarchical Levels + valid filter + blacklist query param', () => {
            const hierarchicalMenu = '/baby/girl-clothing/shoes';
            const query = '?color=Purple';
            const blacklist = '&td=top-nav';

            router.asPath = `${page}${hierarchicalMenu}${query}${blacklist}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}${query}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('3 Hierarchical Levels + valid filter + pagination', () => {
            const hierarchicalMenu = '/baby/girl-clothing/shoes';
            const query = '?color=Purple';
            const pagination = '&page=4';

            router.asPath = `${page}${hierarchicalMenu}${query}${pagination}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}${query}${pagination}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });
        });

        describe('Clean URL Rules', () => {
          beforeEach(() => {
            router = { asPath: '' };
            expectedUrl = '';
          });

          it('Clean URL is returned if there is only 1 hierarchical level despite filters', () => {
            const hierarchicalMenu = '/baby';
            const queries = '?brand=Sticky%20Be%20Socks';

            router.asPath = `${page}${hierarchicalMenu}${queries}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('Clean URL is returned if there are 2 hierarchical levels despite filters', () => {
            const hierarchicalMenu = '/baby/girl-clothing';
            const queries = '?variants.age_range=0-6m';

            router.asPath = `${page}${hierarchicalMenu}${queries}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('Clean URL is returned if there are 3 hierarchical level and invalid filters', () => {
            const hierarchicalMenu = '/baby/bath-body/skincare';
            const queries = '?brand=Sticky%20Be%20Socks';

            router.asPath = `${page}${hierarchicalMenu}${queries}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('Clean URL is returned if there are 3 hierarchical level and multiple values to the correct filters', () => {
            const hierarchicalMenu = '/baby/bath-body/skincare';
            const queries = '?color=Blue%2BPink';

            router.asPath = `${page}${hierarchicalMenu}${queries}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('Clean URL should have pagination', () => {
            const hierarchicalMenu = '/baby/bath-body/skincare';
            const queries = '?color=Blue%2BPink';
            const pagination = 'page=5';

            router.asPath = `${page}${hierarchicalMenu}${queries}&${pagination}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}?${pagination}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });
        });
      });

      describe('Kid Category Pages', () => {
        describe('Self Referencing URL rules', () => {
          beforeEach(() => {
            router = { asPath: '' };
            expectedUrl = '';
          });

          it('3 Hierarchical Levels + the applied filter is Color with only 1 value', () => {
            const hierarchicalMenu = '/kids/girl-clothing/shoes';
            const queries = '?color=Purple';

            router.asPath = `${page}${hierarchicalMenu}${queries}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}${queries}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('3 Hierarchical Levels + valid filter + blacklist query param', () => {
            const hierarchicalMenu = '/kids/girl-clothing/shoes';
            const query = '?color=Purple';
            const blacklist = '&td=top-nav';

            router.asPath = `${page}${hierarchicalMenu}${query}${blacklist}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}${query}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('3 Hierarchical Levels + valid filter + pagination', () => {
            const hierarchicalMenu = '/kids/girl-clothing/shoes';
            const query = '?color=Purple';
            const pagination = '&page=2';

            router.asPath = `${page}${hierarchicalMenu}${query}${pagination}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}${query}${pagination}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });
        });

        describe('Clean URL Rules', () => {
          beforeEach(() => {
            router = { asPath: '' };
            expectedUrl = '';
          });

          it('Clean URL is returned if there is only 1 hierarchical level despite filters', () => {
            const hierarchicalMenu = '/kids';
            const queries = '?brand=Sticky%20Be%20Socks';

            router.asPath = `${page}${hierarchicalMenu}${queries}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('Clean URL is returned if there are 2 hierarchical levels despite filters', () => {
            const hierarchicalMenu = '/kids/girl-clothing';
            const queries = '?variants.age_range=0-6m';

            router.asPath = `${page}${hierarchicalMenu}${queries}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('Clean URL is returned if there are 3 hierarchical level and invalid filters', () => {
            const hierarchicalMenu = '/kids/bath-body/skincare';
            const queries = '?brand=Sticky%20Be%20Socks';

            router.asPath = `${page}${hierarchicalMenu}${queries}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('Clean URL is returned if there are 3 hierarchical level and multiple values to the correct filters', () => {
            const hierarchicalMenu = '/kids/bath-body/skincare';
            const queries = '?color=Blue%2BPink';

            router.asPath = `${page}${hierarchicalMenu}${queries}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('Clean URL should have pagination', () => {
            const hierarchicalMenu = '/kids/bath-body/skincare';
            const queries = '?color=Blue%2BPink';
            const pagination = 'page=6';

            router.asPath = `${page}${hierarchicalMenu}${queries}&${pagination}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}?${pagination}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });
        });
      });

      describe('Home Category Pages', () => {
        describe('Self Referencing URL rules', () => {
          beforeEach(() => {
            router = { asPath: '' };
            expectedUrl = '';
          });

          it('3 Hierarchical Levels + the applied filter is Gender with 1 valid value', () => {
            const hierarchicalMenu = '/home/furniture/beds';
            const queries = '?gender=Women';

            router.asPath = `${page}${hierarchicalMenu}${queries}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}${queries}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('3 Hierarchical Levels + valid filter + blacklist query param', () => {
            const hierarchicalMenu = '/home/decor/rugs';
            const query = '?gender=Women';
            const blacklist = '&td=top-nav';

            router.asPath = `${page}${hierarchicalMenu}${query}${blacklist}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}${query}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('3 Hierarchical Levels + valid filter + pagination', () => {
            const hierarchicalMenu = '/home/decor/rugs';
            const query = '?gender=Women';
            const pagination = '&page=25';

            router.asPath = `${page}${hierarchicalMenu}${query}${pagination}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}${query}${pagination}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });
        });

        describe('Clean URL Rules', () => {
          beforeEach(() => {
            router = { asPath: '' };
            expectedUrl = '';
          });

          it('Clean URL is returned if there is only 1 hierarchical level despite filters', () => {
            const hierarchicalMenu = '/home';
            const queries = '?brand=Sticky%20Be%20Socks';

            router.asPath = `${page}${hierarchicalMenu}${queries}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('Clean URL is returned if there are 2 hierarchical levels despite filters', () => {
            const hierarchicalMenu = '/home/decor';
            const queries = '?variants.age_range=0-6m';

            router.asPath = `${page}${hierarchicalMenu}${queries}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('Clean URL is returned if there are 3 hierarchical level and invalid filters', () => {
            const hierarchicalMenu = '/home/furniture/outdoor';
            const queries = '?brand=Sticky%20Be%20Socks';

            router.asPath = `${page}${hierarchicalMenu}${queries}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('Clean URL is returned if there are 3 hierarchical level and multiple values to the correct filters', () => {
            const hierarchicalMenu = '/home/bedding-bath/towels';
            const queries = '?color=Blue%2BPink';

            router.asPath = `${page}${hierarchicalMenu}${queries}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('Clean URL should include pagination', () => {
            const hierarchicalMenu = '/home/bedding-bath/towels';
            const queries = '?color=Blue%2BPink';
            const pagination = 'page=12';

            router.asPath = `${page}${hierarchicalMenu}${queries}&${pagination}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}?${pagination}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });
        });
      });

      describe('Specific Category Pages', () => {
        describe('Self Referencing URL rules for Lower Hierarchical Level with 1 Product Filter', () => {
          beforeEach(() => {
            router = { asPath: '' };
            expectedUrl = '';
          });

          it('Baby Category', () => {
            const hierarchicalMenu = '/baby/boy-clothing';
            const query = '?product_type=Polo%20Shirts';

            router.asPath = `${page}${hierarchicalMenu}${query}`;

            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}${query}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);

            const pagination = '&page=7';
            router.asPath += pagination;
            expectedUrl += pagination;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('Play Category', () => {
            const hierarchicalMenu = '/play/kids';
            const query = '?product_type=Costumes';
            const blacklist = '&td=top-nav';

            router.asPath = `${page}${hierarchicalMenu}${query}${blacklist}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}${query}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });

          it('Gear Category', () => {
            const hierarchicalMenu = '/gear';
            const queries = '?product_type=Bottles';
            const pagination = '&page=10';

            router.asPath = `${page}${hierarchicalMenu}${queries}${pagination}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}${queries}${pagination}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });
        });

        describe('Clean URL', () => {
          beforeEach(() => {
            router = { asPath: '' };
            expectedUrl = '';
          });

          it('Gear Category with invalid filter', () => {
            const url = '/shop/gear';
            const query = '?product_type=Teethers';
            const blacklist = '&td=top-nav';
            router.asPath = `${url}${query}${blacklist}`;
            expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${url}`;
            expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
          });
        });
      });
    });
  });

  describe('Brand Pages', () => {
    describe('Self Referencing', () => {
      beforeEach(() => {
        router = { asPath: '' };
        expectedUrl = '';
      });

      it('No Hierarchical Menu with only 1 Product_type filter applied', () => {
        const page = '/brands/maison-me';
        const queries = '?product_type=Onsies';
        const pagination = '&page=5';

        router.asPath = `${page}${queries}${pagination}`;
        expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${queries}${pagination}`;
        expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
      });
    });

    describe('Clean URL', () => {
      beforeEach(() => {
        router = { asPath: '' };
        expectedUrl = '';
      });

      it('Clean URL (no HM or filters) should be returned if there is a hierarchical menu with filters applied', () => {
        const page = '/brands/maison-me';
        const hierarchicalMenu = '/baby';
        const queries = '?product_type=Dresses';

        router.asPath = `${page}${hierarchicalMenu}${queries}`;
        expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}`;
        expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
      });

      it('Clean URL (no HM) should have pagination', () => {
        const page = '/brands/maison-me';
        const hierarchicalMenu = '/baby';
        const queries = '?color=Pink';
        const pagination = 'page=6';

        router.asPath = `${page}${hierarchicalMenu}${queries}&${pagination}`;
        expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}?${pagination}`;
        expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
      });
    });
  });

  describe('Edits Pages', () => {
    describe('Clean URLs', () => {
      let page;
      beforeEach(() => {
        page = '/edits/pride';
        router = { asPath: '' };
        expectedUrl = '';
      });

      it('Hierarchical Menu', () => {
        const hierarchicalMenu = '/baby/girl-clothing';

        router.asPath = `${page}${hierarchicalMenu}`;
        expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}`;
        expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
      });

      it('Applied filters', () => {
        const query = '?color=Pink';

        router.asPath = `${page}${query}`;
        expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}`;
        expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
      });

      it('Hierarchical Menu + applied filters', () => {
        const hierarchicalMenu = '/home/decor';
        const queries = '?color=Pink&variants.age_range=0-6m';

        router.asPath = `${page}${hierarchicalMenu}${queries}`;
        expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}`;
        expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
      });

      it('Should always include pagination', () => {
        const hierarchicalMenu = '/baby';
        const query = '?color=Pink';
        const pagination = '&page=25';

        router.asPath = `${page}${hierarchicalMenu}${query}${pagination}`;
        expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${pagination.replace('&', '?')}`;
        expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
      });
    });
  });

  describe('Trends Pages', () => {
    describe('Self Referencing', () => {
      beforeEach(() => {
        router = { asPath: '' };
        expectedUrl = '';
      });

      it('Hierarchical Menu with only 1 category', () => {
        const page = '/trends/on-sale';
        const hierarchicalMenu = '/kids';
        const pagination = '&page=5';

        router.asPath = `${page}${hierarchicalMenu}${pagination}`;
        expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}${hierarchicalMenu}${pagination}`;
        expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
      });
    });

    describe('Clean URL', () => {
      beforeEach(() => {
        router = { asPath: '' };
        expectedUrl = '';
      });

      it('Clean URL WITHOUT a hierarchical menu should be returned if there is a hierarchical menu with 2 or more categories', () => {
        const page = '/trends/on-sale';
        const hierarchicalMenu = ['/kids/girl-clothing', '/baby/boy-clothing/pants'];

        hierarchicalMenu.forEach((hm) => {
          router.asPath = `${page}${hm}`;
          expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}`;
          expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
        });
      });

      it('Clean URL without queries should be returned if there are any queries', () => {
        const page = '/trends/just-in';
        const hierarchicalMenu = ['/kids/girl-clothing', '', '/baby/boy-clothing/pants'];
        const queries = '?product_type=Robes';

        hierarchicalMenu.forEach((hm) => {
          router.asPath = `${page}${hm}${queries}`;
          expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}`;
          expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
        });
      });

      it('Clean URL should have pagination', () => {
        const page = '/trends/just-in';
        const hierarchicalMenu = ['/kids/girl-clothing', '', '/baby/boy-clothing/pants'];
        const queries = '?td=hello';
        const pagination = 'page=6';

        hierarchicalMenu.forEach((hm) => {
          router.asPath = `${page}${hm}${queries}&${pagination}`;
          expectedUrl = `${process.env.NEXT_PUBLIC_CLIENT_HOST}${page}?${pagination}`;
          expect(getPLPCanonicalUrl(router)).toBe(expectedUrl);
        });
      });
    });
  });
});
