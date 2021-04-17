import prettifySlug from '../../../../utils/prettifySlug';
import retrieveFormattedCategories from '../retrieveFormattedCategories';
import categoriesMetaOverrides from './utils/categoriesMetaOverrides.json';
import filterMetaOverrides from './utils/filterMetaOverrides.json';
import trendsMetaOverrides from './utils/trendsMetaOverrides.json';
import editsMetaOverrides from './utils/editsMetaOverrides.json';
import brandsMetaOverrides from './utils/brandsMetaOverrides.json';
import womenSlugOverrides from './utils/womenPrettifiedSlugOverrides.json';

const babyAges = [
    '0-6m',
  '6-12m',
  '12-24m'
];

const toddlerAges = [
  '2-4y',
  '4-6y'
];

const childrenAges = [
  '2-4y',
  '4-6y',
  '6-8y',
  '8-12y'
];

const teenAges = [
  '8-12y',
  '12-16y'
];

const getPLPMetadata = (pageType, props) => {
  const hierarchicalMenu = props?.searchState?.hierarchicalMenu?.['categories_slug.lvl0'] ?? null;

  const {
    searchState: {
      refinementList = {},
      range = {}
    }
  } = props;

  let facetType = null;
  let facetValue = null;
  let onlyOneFacetApplied = false;

  const determineSoloFacet = () => {
    /**
       * we have a dynamic template for the case in which
       * we only have 1 facet applied. Therefore, this method
       * traverses through Algolia's refinementList to determine if there is
       * only 1 facet.
       */

    const activeRefinements = Object.keys(refinementList);
    facetType = activeRefinements.length === 1 ? activeRefinements[0] : null;

    // to short circuit the method, if there are more than 1 or no facets applied
    // then return false
    if (!facetType) return false;

    const validFacets = {
      shop: {
        color: true,
        gender: true,
        product_type: true,
        'variants.age_range': true
      },
      edit: {
        'variants.age_range': true
      },
      brand: {
        product_type: true
      }
    };

    if (!validFacets[pageType][facetType]) {
      facetType = null;
      return false;
    }

    const activeRefinementValues = refinementList[facetType];
    facetValue = activeRefinementValues.length === 1 ? activeRefinementValues[0] : null;
    if (!facetValue) facetType = null;

    return !!(facetType && facetValue);
  };

  if (pageType !== 'trend') {
    onlyOneFacetApplied = determineSoloFacet();
  }

  /* DEFINING THE RULES */
  const removeDuplicateWord = (word1, word2) => {
    if (!word2.includes(word1)) return word2;

    return word2.split(' ').reduce((acc, curr) => {
      if (curr !== word1) return acc + curr;
      return acc;
    }, '');
  };

  const formatDescription = (description) => {
    const filteredDescrip = description.replace?.(/&/g, 'and');

    return filteredDescrip.length > 170 ? `${filteredDescrip.slice(0, 167)}...` : filteredDescrip;
  };

  /* ******** /SHOP/ ********** */
  if (pageType === 'shop') {
    if (!props.searchState) return false;

    const categorySlugs = (() => {
      const slugs = hierarchicalMenu?.split?.(' > ') ?? [];
      if (slugs.length === 1 && slugs[0] === '') return [];
      return slugs;
    })();

    const formattedCategories = retrieveFormattedCategories(categorySlugs, props);

    /** DEFINING THE TOKENS
     * for more info on tokens & rules, please read
     * https://docs.google.com/spreadsheets/d/1LzGWbG9010WLxiLxhPVq2YWr-909hsgZ/edit?pli=1#gid=1099455499
    */
    const topNav = (() => {
      if (categorySlugs[0] === 'play') return 'Toys';
      return categorySlugs[0] ? (formattedCategories[0] ?? prettifySlug(categorySlugs[0])) : null;
    })();

    const gender = (() => {
      if (categorySlugs[1]?.includes('boy')) return 'Boy';
      if (categorySlugs[1]?.includes('girl')) return 'Girl';
      return null;
    })();

    const subCategory = (() => (categorySlugs[2]
      ? (formattedCategories[2] ?? prettifySlug(categorySlugs[2])) : null))();

    const category = (() => {
      const prettyCategory = categorySlugs[1]
        ? (formattedCategories[1] ?? prettifySlug(categorySlugs[1])) : null;

      if (gender && prettyCategory) {
        const formattedCat = prettyCategory.split(`${gender} `)[1];
        return (formattedCat === 'Clothing' && categorySlugs.length === 2)
          ? 'Clothes' : formattedCat;
      }

      return prettyCategory;
    })();

    /* DYNAMIC TEMPLATE FOR 1 APPLIED FACET */
    if (onlyOneFacetApplied) {
      if (categorySlugs[0] === 'baby') {
        const finalGender = (gender && facetType !== 'gender') ? ` ${gender}` : '';
        const finalSubcat = (facetType !== 'product_type') ? ` ${subCategory}` : '';
        const finalFacet = (() => {
          if (!gender && facetType === 'gender') return '';
          if (gender && facetType === 'gender' && facetValue.includes('Unisex')) return '';

          const previousWord = finalGender.length ? finalGender : topNav;
          return ` ${removeDuplicateWord(previousWord, facetValue)}`;
        })();

        const metadata = {
          heading: `${topNav}${finalGender}${finalFacet}${finalSubcat}`,
          title: `${topNav}${finalGender}${finalFacet}${finalSubcat} - Shop ${topNav} ${category} | Maisonette`,
          description: `Shop ${topNav}${finalGender}${finalFacet}${finalSubcat} from your favorite newborn, infant and baby brands at Maisonette. Your one-stop shop for ${topNav} ${category} and more.`
        };

        if (categorySlugs.length === 2 && facetType === 'product_type') {
          /** dynamic template for 2 cats & 1 product type.
          * this template only applies to product types that
          * are considered SEO keywords.
          */
          const clothingProducts = {
            Onesies: true,
            Leggings: true,
            Overalls: true,
            'Rash Guards': true,
            'Sweaters & Cardigans': true,
            'Polo Shirts': true,
            Vests: true,
            Snowsuits: true
          };

          const accessoriesProducts = {
            Boots: true,
            Bows: true,
            'Crib Shoes': true,
            'Slip Ons': true,
            Sneakers: true
          };

          const bathProducts = {
            'Body Moisturizers': true,
            Robes: true,
            'Body Cleansers': true,
            Supplements: true
          };

          if (
            (hierarchicalMenu === 'baby > boy-clothing' && clothingProducts[facetValue])
            || (hierarchicalMenu === 'baby > girl-clothing' && { ...clothingProducts, 'Cover-Ups': true }[facetValue])
            || (hierarchicalMenu === 'baby > boy-accessories' && accessoriesProducts[facetValue])
            || (hierarchicalMenu === 'baby > girl-accessories' && { ...accessoriesProducts, 'Dress Shoes': true, 'Mary Janes': true }[facetValue])
            || (hierarchicalMenu === 'baby > bath-body' && bathProducts[facetValue])
          ) {
            return {
              ...metadata,
              description: formatDescription(metadata.description)
            };
          }
        }

        if (categorySlugs.length === 3) {
          return {
            ...metadata,
            description: formatDescription(metadata.description)
          };
        }
      }

      if (categorySlugs[0] === 'kids') {
        const finalGender = (gender && facetType !== 'gender') ? `${gender}s'` : '';
        const finalFacet = (() => {
          if (!gender && facetType === 'gender') return '';
          if (facetType === 'variants.age_range') return '';
          if (!finalGender) {
            if (facetType === 'gender') {
              return facetValue.includes('Unisex') ? '' : `${facetValue}s'`;
            }
            return facetValue;
          }

          return ` ${facetValue}`;
        })();
        const finalSubcat = (facetType !== 'product_type') ? ` ${subCategory}` : '';
        const finalCat = (() => {
          if (category === 'Clothing') return 'Clothes';
          if (category === 'Bath Body') return 'Bath & Body';
          return category;
        })();

        const metadata = {
          heading: `${finalGender}${finalFacet}${finalSubcat}`,
          title: `${finalGender}${finalFacet}${finalSubcat} - Shop ${topNav} ${category === 'Bath Body' ? 'Bath & Body' : category} | Maisonette`,
          description: `Shop ${finalGender}${finalFacet}${finalSubcat} and ${finalCat} from your favorite kid and toddler brands at Maisonette. Your one-stop shop for ${topNav} ${category} and more.`
        };

        if (categorySlugs.length === 2 && facetType === 'product_type') {
          /** dynamic template for 2 cats & 1 product type.
          * this template only applies to product types that
          * are considered SEO keywords.
          */
          const clothingProducts = {
            Jeans: true,
            Overalls: true,
            Parkas: true,
            'Polo Shirts': true,
            'Rash Guards': true,
            'Snow Pants': true,
            Snowsuits: true,
            Sweatpants: true,
            Vests: true
          };

          const shoeProducts = {
            Boots: true,
            Loafers: true,
            'Rain Boots': true,
            Sandals: true,
            Sneakers: true
          };

          const bathProducts = {
            Robes: true,
            'Bath Salts & Soaks': true,
            Shampoos: true,
            Conditioners: true
          };

          if (hierarchicalMenu === 'kids > boy-clothing') {
            const singularProducts = {
              ...clothingProducts,
              Blazers: true,
              'Button Downs': true,
              Coats: true
            };

            const multipleProducts = {
              'Puffers & Down Jackets': true,
              'Sweaters & Cardigans': true,
              'Suits & Separates': true
            };

            if (singularProducts[facetValue]) {
              return {
                ...metadata,
                description: formatDescription(metadata.description)
              };
            }

            if (multipleProducts[facetValue]) {
              /** if the facet has 2+ products
               * in the value, then omit the Category token in the description
              */
              const multipleFacetMetaData = {
                ...metadata,
                description: `Shop ${finalGender}${finalFacet}${finalSubcat} from your favorite kid and toddler brands at Maisonette. Your one-stop shop for ${topNav} ${category} and more.`
              };

              return {
                ...multipleFacetMetaData,
                description: formatDescription(multipleFacetMetaData.description)
              };
            }
          }

          if (hierarchicalMenu === 'kids > girl-clothing') {
            const singularProducts = {
              ...clothingProducts,
              Boots: true,
              'Cover-Ups': true,
              'Crib Shoes': true,
              'Dress Shoes': true,
              'Mary Janes': true,
              'Play Dresses': true,
              'Slip Ons': true,
              Sneakers: true,
              Leggings: true,
              Underwear: true,
              'Wool Coats': true
            };

            const multipleProducts = {
              'Puffers & Down Jackets': true,
              'Sweaters & Cardigans': true
            };

            if (singularProducts[facetValue]) {
              return {
                ...metadata,
                description: formatDescription(metadata.description)
              };
            }

            if (multipleProducts[facetValue]) {
              /** if the facet has 2+ products
               * in the value, then omit the Category token in the description
              */
              const multipleFacetMetaData = {
                ...metadata,
                description: `Shop ${finalGender}${finalFacet}${finalSubcat} from your favorite kid and toddler brands at Maisonette. Your one-stop shop for ${topNav} ${category} and more.`
              };

              return {
                ...multipleFacetMetaData,
                description: formatDescription(multipleFacetMetaData.description)
              };
            }
          }

          if (hierarchicalMenu === 'kids > boy-accessories') {
            const kidsBoyShoeProducts = {
              ...shoeProducts,
              Oxfords: true
            };

            const otherProducts = {
              Lunchbags: true,
              'Ski Goggles': true
            };

            if (kidsBoyShoeProducts[facetValue]) {
              /** if the facet is a shoe
               * in the value, then add the Category token 'Shoe'
               * in the description
              */
              const shoeFacetMetaData = {
                title: `${finalGender}${finalFacet} - Shop ${topNav} ${category} | Maisonette`,
                description: `Shop ${finalGender}${finalFacet} and Shoes from your favorite kid and toddler brands at Maisonette. Your one-stop shop for ${topNav} Shoes and more.`,
                heading: `${finalGender}${finalFacet}`
              };

              return {
                ...shoeFacetMetaData,
                description: formatDescription(shoeFacetMetaData.description)
              };
            }

            if (otherProducts[facetValue]) {
              return {
                ...metadata,
                description: formatDescription(metadata.description)
              };
            }
          }

          if (hierarchicalMenu === 'kids > girl-accessories') {
            const kidsGirlShoeProducts = {
              ...shoeProducts,
              'Dress Shoes': true,
              Flats: true,
              'Mary Janes': true
            };

            const otherProducts = {
              Charms: true,
              Earrings: true,
              Lunchbags: true,
              Umbrellas: true
            };

            if (kidsGirlShoeProducts[facetValue]) {
              const shoeFacetMetaData = {
                title: `${finalGender}${finalFacet} - Shop ${topNav} ${category} | Maisonette`,
                description: `Shop ${finalGender}${finalFacet} and Shoes from your favorite kid and toddler brands at Maisonette. Your one-stop shop for ${topNav} Shoes and more.`,
                heading: `${finalGender}${finalFacet}`
              };

              return {
                ...shoeFacetMetaData,
                description: formatDescription(shoeFacetMetaData.description)
              };
            }

            if (otherProducts[facetValue]) {
              return {
                ...metadata,
                description: formatDescription(metadata.description)
              };
            }
          }

          if (hierarchicalMenu === 'kids > bath-body' && bathProducts[facetValue]) {
            const bathMetadata = {
              title: `${topNav} ${finalFacet} - Shop Home ${finalCat} | Maisonette`,
              description: `Shop Maisonette's curated selection of ${topNav} ${finalFacet}. Your one-stop shop for ${finalCat} from your favorite kids brands and more.`,
              heading: `${topNav} ${finalFacet}`
            };

            return {
              ...bathMetadata,
              description: formatDescription(bathMetadata.description)
            };
          }
        }

        if (categorySlugs.length === 3) {
          return {
            ...metadata,
            description: formatDescription(metadata.description)
          };
        }
      }

      if (categorySlugs[0] === 'play') {
        if (categorySlugs.length === 2 && facetType === 'product_type') {
          /** dynamic template for 2 cats & 1 product type.
          * this template only applies to product types that
          * are considered SEO keywords.
          */

          const metadata = (facet, subfacet, cat = 'Kids', topnav) => ({
            title: `${facet} - Shop${cat.length ? ` ${cat}` : cat} ${topnav} | Maisonette`,
            description: `Shop ${subfacet ?? facet} from your favorite baby, toddler and kid brands at Maisonette. Your one-stop shop for Kids ${topnav} and more.`,
            heading: `${subfacet ?? facet}`
          });

          if (hierarchicalMenu === 'play > kids') {
            const kidsOverrides = {
              Makeup: {
                facet: 'Play Make-up'
              },
              Woodens: {
                facet: 'Wooden Toys',
                cat: 'Kids & Baby'
              }
            };

            if (kidsOverrides[facetValue]) {
              const { facet, subfacet, cat } = kidsOverrides[facetValue];
              const playMeta = metadata(facet ?? facetValue, subfacet, cat, topNav);
              return {
                ...playMeta,
                description: formatDescription(playMeta.description)
              };
            }
          }

          if (hierarchicalMenu === 'play > outdoor') {
            const outdoorOverrides = {
              Goggles: {
                facet: 'Goggles for Swimming & More',
                subfacet: 'Swim Goggles',
                cat: ''
              },
              Helmets: {
                facet: 'Kids Bike Helmets & More',
                cat: ''
              },
              'Pool Floats': {
                cat: 'Kids & Baby Pool'
              }
            };

            if (outdoorOverrides[facetValue]) {
              const { facet, subfacet, cat } = outdoorOverrides[facetValue];
              const outdoorMeta = metadata(facet ?? facetValue, subfacet, cat, topNav);

              return {
                ...outdoorMeta,
                description: formatDescription(outdoorMeta.description)
              };
            }
          }
        }
      }

      if (categorySlugs[0] === 'home') {
        const finalSubcat = (facetType !== 'product_type') ? ` ${subCategory}` : '';
        const finalCat = (category === 'Bedding Bath') ? 'Bedding & Bath' : category;

        const metadata = {
          heading: `${facetValue}${finalSubcat}`,
          title: `${facetValue}${finalSubcat} - Shop ${topNav} ${finalCat} | Maisonette`,
          description: `Shop Maisonette's curated selection of ${facetValue}${finalSubcat}. Your one-stop shop for ${topNav} ${finalCat} from your favorite kids brands and more.`
        };

        if (categorySlugs.length === 2 && facetType === 'product_type') {
          /** dynamic template for 2 cats & 1 product type.
             * this template only applies to product types that
             * are considered SEO keywords.
             */
          const metaData = (facet = facetValue, topnav, titleTopNav, cat = finalCat, titleCat) => ({
            title: `${facet} - Shop${titleTopNav ?? topnav} ${titleCat ?? cat} | Maisonette`,
            description: `Shop Maisonette's curated selection of ${facet}. Your one-stop shop for${topnav} ${finalCat} from your favorite kids brands and more.`,
            heading: facet
          });

          const finalTopnav = (topnav) => {
            if (topnav === undefined) return ` ${topNav}`;
            if (topnav.length) return ` ${topnav}`;
            return topnav;
          };

          if (hierarchicalMenu === 'home > decor') {
            const decorOverrides = {
              Wallpaper: {
                topnav: 'Home & Nursery'
              },
              Decorations: {
                topnav: 'Home & Nursery'
              },
              Mobiles: {
                facet: 'Baby Mobiles',
                topnav: 'Nursery'
              },
              Drinkware: {
                facet: 'Glasses & Drinkware'
              }
            };

            if (decorOverrides[facetValue]) {
              const {
                facet,
                topnav,
                titleTopNav,
                cat,
                titleCat
              } = decorOverrides[facetValue];

              const homeMeta = metaData(facet, finalTopnav(topnav), titleTopNav ? ` ${titleTopNav}` : titleTopNav, cat, titleCat);

              return {
                ...homeMeta,
                description: formatDescription(homeMeta.description)
              };
            }
          }

          if (hierarchicalMenu === 'home > furniture') {
            const furnitureOverrides = {
              Teepees: {
                facet: 'Kids Teepees'
              },
              'Travel Cribs': {
                titleTopNav: 'Baby',
                titleCat: 'Furniture & Gear'
              }
            };

            if (furnitureOverrides[facetValue]) {
              const {
                facet,
                topnav,
                titleTopNav,
                cat,
                titleCat
              } = furnitureOverrides[facetValue];

              const furnitureMeta = metaData(facet, finalTopnav(topnav), titleTopNav ? ` ${titleTopNav}` : titleTopNav, cat, titleCat);

              return {
                ...furnitureMeta,
                description: formatDescription(furnitureMeta.description)
              };
            }
          }

          if (hierarchicalMenu === 'home > bedding-bath') {
            const beddingOverrides = {
              'Crib Sheets': {
                titleTopNav: 'Home',
                topnav: ''
              },
              'Crib Skirts': {
                titleTopNav: 'Home',
                topnav: ''
              },
              Tubs: {
                facet: 'Bath Tub Curtains, Mats, & Drapes',
                topnav: '',
                titleCat: 'Bath Tub Curtains, Mats, & Drapes'
              }
            };

            if (beddingOverrides[facetValue]) {
              const {
                facet,
                topnav,
                titleTopNav,
                cat,
                titleCat
              } = beddingOverrides[facetValue];

              const beddingMeta = metaData(facet, finalTopnav(topnav), titleTopNav ? ` ${titleTopNav}` : titleTopNav, cat, titleCat);

              return {
                ...beddingMeta,
                description: formatDescription(beddingMeta.description)
              };
            }
          }
        }

        if (categorySlugs.length === 3) {
          const halloweenProducts = {
            Garlands: true,
            'Paper Goods': true,
            Party: true
          };

          if (halloweenProducts[facetValue] && hierarchicalMenu === 'home > seasonal > halloween') {
            return categoriesMetaOverrides[hierarchicalMenu].default;
          }

          return {
            ...metadata,
            description: formatDescription(metadata.description)
          };
        }
      }

      if (categorySlugs[0] === 'gear') {
        /* Gear is the only top category that does not have 3 levels */

        const metaData = (facet) => ({
          title: `${facet} - Shop ${topNav} | Maisonette`,
          description: `Shop Maisonette's curated selection of ${facet}. Your one-stop shop for ${topNav} from your favorite kids brands and more.`,
          heading: facet
        });

        if (categorySlugs.length === 1 && facetType === 'product_type') {
          const gearProducts = {
            'Baby Monitors': true,
            'Booster Seats': true,
            Bottles: true,
            'Burp Cloths': true,
            'Double Strollers': true,
            'Food Storage': true,
            Headphones: true,
            'Nursing Pillows': true,
            Pacifiers: true,
            'Sippy Cups': true,
            'Stroller Accessories': true
          };

          if (gearProducts[facetValue]) {
            const gearMeta = metaData(facetValue);
            return {
              ...gearMeta,
              description: formatDescription(gearMeta.description)
            };
          }
        }

        if (categorySlugs.length === 2 && facetType === 'product_type') {
          const gearMeta = metaData(facetValue);
          return {
            ...gearMeta,
            description: formatDescription(gearMeta.description)
          };
        }
      }
    }

    /* STATIC OVERRIDES PROVIDED BY SEO TEAM */
    const filteredProducts = refinementList?.product_type
      ? refinementList?.product_type.reduce((acc, curr) => ({
        ...acc,
        [curr]: true
      }), {})
      : null;

    const filteredAgeRanges = refinementList?.['variants.age_range']
      ? refinementList?.['variants.age_range'].reduce((acc, curr) => ({
        ...acc,
        [curr]: true
      }), {})
      : null;

    const filteredPriceRange = range?.['variants.maisonette_sale'] ?? null;

    /** Static Overrides for Hierarchical Menu (can have facets)
     * please add new overrides to categoriesMetaOverrides
    */
    if (hierarchicalMenu === 'play') {
      if (filteredPriceRange?.min === 21300 && filteredPriceRange?.max === 73600) {
        const { min, max } = filteredPriceRange;
        return categoriesMetaOverrides[hierarchicalMenu][`price:${min}-${max}`];
      }

      if (refinementList.trends) {
        if (refinementList.trends.length === 1) {
          const [trend] = refinementList.trends;
          return categoriesMetaOverrides[hierarchicalMenu][trend];
        }
      }

      if (filteredAgeRanges) {
        if (toddlerAges.every((age) => filteredAgeRanges[age])) {
          return categoriesMetaOverrides[hierarchicalMenu]['Toddler Toys'];
        }

        if (teenAges.every((age) => filteredAgeRanges[age])) {
          return categoriesMetaOverrides[hierarchicalMenu]['Teen Toys'];
        }
      }

      return categoriesMetaOverrides[hierarchicalMenu].default;
    }

    if (hierarchicalMenu === 'home > seasonal > halloween') {
      const halloweenProducts = [
        'Garlands',
        'Paper Goods',
        'Party'
      ];

      if (halloweenProducts.every((cat) => filteredProducts?.[cat])) {
        return categoriesMetaOverrides[hierarchicalMenu]['party-decor'];
      }

      return categoriesMetaOverrides[hierarchicalMenu].default;
    }

    if (hierarchicalMenu === 'gifts > by-age > gifts-for-moms') {
      if (onlyOneFacetApplied && facetType === 'product_type') {
        return categoriesMetaOverrides[hierarchicalMenu][facetValue];
      }

      return categoriesMetaOverrides[hierarchicalMenu].default;
    }

    if (hierarchicalMenu === 'whats-new > shops > the-pet-shop') {
      if (onlyOneFacetApplied && facetType === 'product_type'
        && categoriesMetaOverrides[hierarchicalMenu][facetValue]) {
        return categoriesMetaOverrides[hierarchicalMenu][facetValue];
      }
    }

    if (categoriesMetaOverrides[hierarchicalMenu]) {
      if (onlyOneFacetApplied && facetType === 'variants.age_range') {
        if (hierarchicalMenu === 'play > baby' && filteredAgeRanges['0-6m']) return categoriesMetaOverrides[hierarchicalMenu].newborn;
      }

      if (onlyOneFacetApplied && facetType === 'product_type') {
        if (hierarchicalMenu === 'play > kids' && filteredProducts.Costumes) return categoriesMetaOverrides[hierarchicalMenu].Costumes;
      }

      return categoriesMetaOverrides[hierarchicalMenu].default
        ?? categoriesMetaOverrides[hierarchicalMenu];
    }

    /** Static Overrides for Facets only (no categories/hierarchical menu)
     * please add new overrides to filterMetaOverrides
    */
    if (categorySlugs.length === 0) {
      // if there is only 1 product type facet applied
      if (refinementList?.product_type?.length === 1) {
        // if there is also 1 age-range filter applied:
        if (refinementList?.['variants.age_range'] && refinementList['variants.age_range'].length === 1) {
          const appliedProductType = refinementList?.product_type?.[0] ?? '';
          const appliedAgeFilter = refinementList?.['variants.age_range'][0] ?? '';

          if (appliedProductType === 'Costumes' && appliedAgeFilter === 'Adults') {
            return filterMetaOverrides['halloween-costumes'].adults;
          }
        }

        // if the product type is the only filter applied:
        if (!filteredAgeRanges && !filteredPriceRange) {
          const appliedProductType = refinementList?.product_type?.[0] ?? '';
          // eslint-disable-next-line max-len
          if (filterMetaOverrides[appliedProductType]) return filterMetaOverrides[appliedProductType];
        }
      }

      const jewelryProducts = [
        'Necklaces',
        'Bracelets',
        'Earrings',
        'Rings'
      ];

      const backToSchoolShoes = [
        'Boots',
        'Flats',
        'Loafers',
        'Mary Janes',
        'Sneakers'
      ];

      if (jewelryProducts.every((jewelry) => filteredProducts?.[jewelry])
      && refinementList.product_type?.length === jewelryProducts.length) {
        return filterMetaOverrides.jewelry;
      }

      if (backToSchoolShoes.every((shoe) => filteredProducts?.[shoe])
      && refinementList.product_type?.length === backToSchoolShoes.length) {
        return filterMetaOverrides['back-to-school-shoes'];
      }

      if (filteredProducts?.['Costume Accessories']) {
        if (filteredProducts?.Costumes) {
          if (filteredAgeRanges) {
            if (babyAges.every((age) => filteredAgeRanges[age])) return filterMetaOverrides['halloween-costumes'].baby;

            if ([...childrenAges, '8y+'].every((age) => filteredAgeRanges[age])) return filterMetaOverrides['halloween-costumes'].children;
          }

          return filterMetaOverrides['halloween-costumes'].default;
        }

        return filterMetaOverrides['kids-halloween-costumes-accessories'];
      }
    }

    /* CATCH ALL DYNAMIC TEMPLATE
     * at this point, if the URL has not
     * matched with any conditionals above,
     * this is the catch-all template.
     * Typically this will be URLs:
     *    - with 1 category and no facets/static override
     *    - with 1 category and 2+ facets applied
     *      with 2 categories and no facets/static override
     *    - with 2 categories and 2+ facets applied
     *    - with 3 categories and no facets/static override
     *    - with 3 categories and 2+ facets applied
     *    - Other top nav does not have any specific rules for facets
    */

    if (categorySlugs[0] === 'baby') {
      /* 1 category 'baby' has a hard override */

      if (categorySlugs.length === 2) {
        const finalGender = (gender ? ` ${gender}` : '');
        const finalCat = category === 'Bath Body' ? 'Bath & Body' : category;

        const babyMeta = {
          title: `${topNav}${finalGender} ${finalCat} | Maisonette`,
          description: `Shop ${topNav}${finalGender} ${finalCat} from your favorite newborn, infant and baby brands at Maisonette. Your one-stop shop for ${topNav} ${finalCat} and more.`,
          heading: `${topNav}${finalGender} ${finalCat}`
        };

        return {
          ...babyMeta,
          description: formatDescription(babyMeta.description)
        };
      }

      if (categorySlugs.length === 3) {
        const finalGender = (gender ? ` ${gender}` : '');
        const finalCat = category === 'Bath Body' ? 'Bath & Body' : category;

        const babyMeta = {
          title: `${topNav}${finalGender} ${subCategory} - Shop ${topNav} ${finalCat} | Maisonette`,
          description: `Shop ${topNav}${finalGender} ${subCategory} from your favorite newborn, infant and baby brands at Maisonette. Your one-stop shop for ${topNav} ${finalCat} and more.`,
          heading: `${topNav}${finalGender} ${subCategory}`
        };

        return {
          ...babyMeta,
          description: formatDescription(babyMeta.description)
        };
      }
    }

    if (categorySlugs[0] === 'kids') {
      /* 1 category 'kids' has a hard override */
      /* 2 categories 'kids' have hard overrides */

      if (categorySlugs.length === 3) {
        const finalGender = gender ? `${gender}s'` : '';
        const finalCat = category === 'Bath Body' ? 'Bath & Body' : category;
        const finalSubCat = finalGender ? ` ${subCategory}` : subCategory;

        const kidsMeta = {
          title: `${finalGender}${finalSubCat} - Shop ${topNav} ${finalCat} | Maisonette`,
          description: `Shop ${finalGender}${finalSubCat} from your favorite kid and toddler brands at Maisonette. Your one-stop shop for ${topNav} ${finalCat} and more.`,
          heading: `${finalGender}${finalSubCat}`
        };

        return {
          ...kidsMeta,
          description: formatDescription(kidsMeta.description)
        };
      }
    }

    if (categorySlugs[0] === 'play') {
      /* 1 category 'play' has a hard override */
      /* 2 categories 'play' has a hard override */

      if (categorySlugs.length === 3) {
        const subCatOverrides = {
          'play > outdoor > bikes': { subCat: 'Ride-On, Bikes & Scooters' },
          'play > kids > plush': { subCat: 'Stuffed Animals & Plush Toys' }
        };

        const finalSubCat = subCatOverrides[hierarchicalMenu]?.subCat ?? subCategory;

        const playMeta = {
          title: `${category} ${finalSubCat} - Shop ${topNav} | Maisonette`,
          description: `Shop ${category} ${finalSubCat} from your favorite baby, toddler and kids brands at Maisonette. Your one-stop shop for ${category} ${topNav} and more.`,
          heading: finalSubCat
        };

        return {
          ...playMeta,
          description: formatDescription(playMeta.description)
        };
      }
    }

    if (categorySlugs[0] === 'home') {
      if (categorySlugs.length === 2) {
        const homeMeta = {
          title: `${topNav} ${category} | Maisonette`,
          description: `Shop Maisonette's curated selection of ${category}. Your one-stop shop for ${topNav} ${category} from your favorite kids brands and more.`,
          heading: `${category}`
        };

        return {
          ...homeMeta,
          description: formatDescription(homeMeta.description)
        };
      }

      if (categorySlugs.length === 3) {
        const homeMeta = {
          title: `${subCategory} - Shop ${topNav} ${category} | Maisonette`,
          description: `Shop Maisonette's curated selection of ${subCategory}. Your one-stop shop for ${topNav} ${category} from your favorite kids brands and more.`,
          heading: `${subCategory}`
        };

        return {
          ...homeMeta,
          description: formatDescription(homeMeta.description)
        };
      }
    }

    if (categorySlugs[0] === 'gear') {
      if (categorySlugs.length === 2) {
        const gearMeta = {
          title: `${category} - Shop ${topNav} | Maisonette`,
          description: `Shop Maisonette's curated selection of ${category}. Your one-stop shop for ${topNav} from your favorite kids brands and more.`,
          heading: category
        };

        return {
          ...gearMeta,
          description: formatDescription(gearMeta.description)
        };
      }
    }

    if (categorySlugs[0] === 'gifts') {
      if (categorySlugs.length === 2) {
        const giftsMeta = {
          title: `${topNav} ${category} | Maisonette`,
          description: `Shop Maisonette's curated selection of ${topNav} ${category}. Your one-stop shop for ${topNav} ${category} from your favorite kids brands and more.`,
          heading: `${topNav} ${category}`
        };

        return {
          ...giftsMeta,
          description: formatDescription(giftsMeta.description)
        };
      }

      if (categorySlugs.length === 3) {
        const giftsMeta = {
          title: `${subCategory} - Shop ${topNav} ${category} | Maisonette`,
          description: `Shop Maisonette's curated selection of ${subCategory}. Your one-stop shop for ${topNav} ${category} from your favorite kids brands and more.`,
          heading: `${subCategory}`
        };

        return {
          ...giftsMeta,
          description: formatDescription(giftsMeta.description)
        };
      }
    }

    if (categorySlugs[0] === 'womens') {
      const finalCategory = subCategory ?? category;
      const womenSlugOverride = categorySlugs.length === 1
        ? womenSlugOverrides.womens : womenSlugOverrides[categorySlugs[categorySlugs.length - 1]];
      const displayShop = womenSlugOverride?.shop ? 'Shop ' : '';
      const finalHeading = (() => {
        if (womenSlugOverride?.heading) return womenSlugOverride.heading;
        return womenSlugOverride?.diffHeading
          || (!womenSlugOverride?.diffHeading && !womenSlugOverride?.title)
          ? finalCategory : womenSlugOverride?.title;
      })();

      if (categorySlugs[1] === 'maternity') {
        const maternityMeta = {
          title: `${displayShop}Maternity ${womenSlugOverride?.title ?? finalCategory} | Maisonette`,
          description: `Shop Maternity ${womenSlugOverride?.description ?? finalCategory} from your favorite brands at Maisonette. Your one-stop shop for Baby, Kids, Adult Clothing, Accessories, and more.`,
          heading: `Maternity ${finalHeading}`
        };

        return {
          ...maternityMeta,
          description: formatDescription(maternityMeta.description)
        };
      }

      const womensMeta = {
        title: `${displayShop}Women's ${womenSlugOverride?.title ?? finalCategory} | Maisonette`,
        description: `Shop Women's ${womenSlugOverride?.description ?? finalCategory} from your favorite brands at Maisonette. Your one-stop shop for Baby, Kids, Adult Clothing, Accessories, and more.`,
        heading: `Women's ${finalHeading}`
      };

      return {
        ...womensMeta,
        description: formatDescription(womensMeta.description)
      };
    }
  }

  /* ******** /TREND/ ********** */
  if (pageType === 'trend') {
    if (trendsMetaOverrides[props.trend]?.[hierarchicalMenu]) {
      return trendsMetaOverrides[props.trend][hierarchicalMenu];
    }

    return trendsMetaOverrides[props.trend]?.default ?? false;
  }

  /* ******** /EDIT/ ********** */
  if (pageType === 'edit') {
    // Edits are a special case because they are built with tagged products via Solidus.
    // This means they are very intentional, so the rules are also intentional and can
    // be very specific.

    if (hierarchicalMenu) {
      // eslint-disable-next-line max-len
      const metaOverride = editsMetaOverrides[props.edit]?.hierarchicalMenuValues?.[hierarchicalMenu];
      if (metaOverride) return metaOverride;
    }

    if (onlyOneFacetApplied) {
      // eslint-disable-next-line max-len
      const metaOverride = editsMetaOverrides[props.edit]?.activeRefinementList?.[facetType]?.[facetValue];
      if (metaOverride) return metaOverride;
    }

    /* STATIC OVERRIDES PROVIDED BY SEO TEAM */
    const filteredAgeRanges = refinementList?.['variants.age_range']
      ? refinementList?.['variants.age_range'].reduce((acc, curr) => ({
        ...acc,
        [curr]: true
      }), {})
      : null;

    if (filteredAgeRanges) {
      if (editsMetaOverrides[props.edit]?.activeRefinementList?.['variants.age_range']) {
        const variantsMeta = editsMetaOverrides[props.edit].activeRefinementList['variants.age_range'];

        if (props.edit === 'holiday-dressing') {
          const holidayDressingKidsAges = [
            '3-7y',
            '4-6y',
            '6-8y',
            '8-12y',
            '8y+'
          ];

          if (babyAges.every((age) => filteredAgeRanges[age])) {
            return variantsMeta.Baby ?? variantsMeta.default;
          }

          if (toddlerAges.every((age) => filteredAgeRanges[age])) {
            return variantsMeta.Toddler ?? variantsMeta.default;
          }

          if (holidayDressingKidsAges.every((age) => filteredAgeRanges[age])) {
            return variantsMeta.Kids ?? variantsMeta.default;
          }
        }

        if (babyAges.every((age) => filteredAgeRanges[age])) {
          return variantsMeta.Baby ?? variantsMeta.default;
        }

        if ([...childrenAges, '12-16y'].every((age) => filteredAgeRanges[age])) {
          return variantsMeta.Kids ?? variantsMeta.default;
        }

        if (teenAges.every((age) => filteredAgeRanges[age])) {
          return variantsMeta.Teen ?? variantsMeta.default;
        }
      }
    }

    /*
      ! Please add a 'default' key for the edit when updating the editsMetaOverrides
      ! object with new hierarchicalMenu or refinementList values
    */

    const defaultMeta = editsMetaOverrides[props.edit]?.default;

    if (defaultMeta) return defaultMeta;
    return editsMetaOverrides[props.edit] ?? false;
  }

  /* ******** /BRAND/ ********** */
  if (pageType === 'brand') {
    if (!props.brand?.name) return false;

    const { name: brandName, brand_slug } = props.brand;

    const categorySlugs = hierarchicalMenu?.split?.(' > ') ?? [];
    const formattedCategories = retrieveFormattedCategories(categorySlugs, props);

    /* STATIC OVERRIDES */
    if (brandsMetaOverrides[brand_slug]) return brandsMetaOverrides[brand_slug];

    /* DYNAMIC TEMPLATE */

    /** DEFINING THE TOKENS
     * for more info on tokens & rules, please read
     * https://docs.google.com/spreadsheets/d/1LzGWbG9010WLxiLxhPVq2YWr-909hsgZ/edit?pli=1#gid=1099455499
    */

    const brand = brandName;

    // subCategory refers to what the SEO calls product type.The name was changed
    // to make it easier to differntiate between our facet type "product_type"
    const subCategory = (() => {
      const index = categorySlugs.length - 1;

      return (categorySlugs[index]
        ? (formattedCategories[index]
        ?? prettifySlug(categorySlugs[index]))
        : null);
    })();

    // The token Category is only used if there are 4 levels.
    // A brand page with a 3-category hierarchical menu is considered 4 Levels:
    // Top Level (Brand Value) > 2nd Level (Category 1) >
    // 3rd Level (Category 2) > 4th Level (Category 3)
    // Sub Category is 4th Level (Category 3) and Category is 3rd Level (Category 2) in this case
    const category = (() => (categorySlugs.length === 3
      ? (formattedCategories[1] ?? prettifySlug(categorySlugs[1]))
      : null))();

    /* DYNAMIC TEMPLATE FOR 1 APPLIED FACET */

    const finalCat = (category ? ` ${category}` : '');
    const finalFacet = (onlyOneFacetApplied ? ` ${facetValue}` : '');

    const finalSubcat = (() => {
      if (!subCategory || subCategory === 'Whats New' || subCategory === 'What\'s New') return '';

      // For the Play category, "toys" needs to be appended to
      // the title. The other categories aren't added to the title
      return ((subCategory === 'Play') ? ' Toys' : ` ${subCategory}`);
    })();

    const metadata = {
      heading: `${brand}${finalSubcat}${finalFacet}`,
      title: `${brand}${finalFacet}${finalSubcat} - Shop${finalCat} by Brand | Maisonette`,
      description: `Shop customer favorites from ${brand}. Maisonette features top brands like ${brand}${finalSubcat}${finalFacet} for kids' and baby clothing, toys, home decor and more.`
    };

    return {
      ...metadata,
      description: formatDescription(metadata.description)
    };
  }

  return false;
};

export default getPLPMetadata;
