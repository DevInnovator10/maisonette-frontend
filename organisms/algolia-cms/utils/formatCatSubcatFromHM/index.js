import prettifySlug from '../../../../utils/prettifySlug';
import categories from '../categories-by-slug.json';
import subcategoriesByHM from '../subcategories-by-hm.json';

const formatCatSubcatFromHM = ({ hierarchicalMenu }) => {
  if (!hierarchicalMenu) return {};
  // for instances where the hm is derived from a path, hierarchicalMenu will be
  // an array of [cat, subcat] otherwise it will be a string connected by >
  const [category, subcategory] = Array.isArray(hierarchicalMenu) ? hierarchicalMenu : hierarchicalMenu.split(' > ');

  const categoryData = category && {
    slug: category,
    displayName: categories[category] ?? prettifySlug(category)
  };

  const subcategoryData = subcategory
  && {
    slug: subcategory,
    displayName: subcategoriesByHM[`${category} > ${subcategory}`] ?? prettifySlug(subcategory)
  };

  return { categoryData, subcategoryData };
};

export default formatCatSubcatFromHM;
