import { getPageParams } from '../../../pages/api';

import SCOPE_TYPES from '../../../utils/sentryScopeTypes';
import cmsPageLogic from '../utils/cmsPageLogic';

const gssp = async ({ params }) => {
  const { story, category, subcategory } = params;
  let props = {};

  const URL = `/le_scoop/${category}/${subcategory}/${story}`;
  const pages = await getPageParams({
    base: process.env.CMS_HOST,
    uri: '/pages',
    queryParams: { URL },
    scopes: [SCOPE_TYPES.SERVICES.STRAPI]
  });

  // cmsPageLogic fetches the content/modules for the page
  const pageData = await cmsPageLogic({ pages });

  props = { ...pageData };

  return props;
};

export default gssp;
