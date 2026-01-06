import { getModule } from '../pages/api';
import SCOPE_TYPES from './sentryScopeTypes';

const getUpdatedProductModuleData = async (content, ctx) => {
  let { modules = [] } = content;

  const productModules = [];

  modules = modules.filter((m) => {
    const productModulesTitles = ['product', 'story_module', 'color_story'];
    if (!productModulesTitles.includes(m.Title)) return m;
    productModules.push(m.id);
    return null;
  });

  if (productModules.length > 0) {
    const getUpdatedProductModules = async (id) =>
      new Promise((resolve, reject) => {
        try {

          resolve(
            ctx ? getModule({ id, ctx }).then((r) => r)
              : getModule({
                base: process.env.CMS_HOST,
                uri: `/modules/${id}`,
                scopes: [SCOPE_TYPES.SERVICES.STRAPI]
              })
                .then((r) => r)
          );
        } catch (error) {
          reject(error);

        }
      });

    const updatedProductModules = await Promise.all(
      productModules.map(getUpdatedProductModules)
    );

    modules = [...modules, ...updatedProductModules];
  }

  return modules;
};

export default getUpdatedProductModuleData;
