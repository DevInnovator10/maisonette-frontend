import { formatCmsResponse, latestCmsContent } from '../../../utils/cms';
import { getContents } from '../../../pages/api';
import getUpdatedProductModuleData from '../../../utils/getUpdatedProductModuleData';

const cmsPageLogic = async ({ pages }) => {
    let pageProps = {};

  const pageData = formatCmsResponse(pages);

  if (pageData.code === 'ok') {
    pageProps = { ...pageProps, page: pageData.data, code: pageData.code };
    const activeContents = pageData.data.content.filter((content) => content.active);
    const currentDateTime = Date.now();
    const pagePublishDateTime = Date.parse(pageData.data.publishDate);

    if (!pageData.data.active
      || activeContents.length === 0
      || pagePublishDateTime > currentDateTime) {
      return {
        notFound: true
      };
    }

    const activeContent = latestCmsContent(activeContents, currentDateTime);
    const contentsData = formatCmsResponse([activeContent]);
    const contentPublishDateTime = Date.parse(contentsData.data.publishDate);

    if (contentsData.code === 'error') {
      return {
        notFound: true
      };
    }

    if (contentsData.code === 'ok' && contentPublishDateTime < currentDateTime) {
      const { id } = contentsData.data;
      const contentRes = await getContents({
        base: process.env.CMS_HOST,
        uri: `/contents/${id}`
      });
      const modules = await getUpdatedProductModuleData(contentRes);
      const moduleData = formatCmsResponse([modules]);
      if (moduleData.code === 'error') return { notFound: true };
      if (moduleData.code === 'ok') {
        const [leScoopMod] = moduleData?.data.filter?.((mod) => mod.Title === 'le_scoop');
        const { le_scoop } = leScoopMod?.Content || {};
        const featuredStoriesIds = Object.values(le_scoop ?? {})
          .map((story) => story.le_scoop_story_id);

        pageProps = { ...pageProps, modules: moduleData.data, featuredStoriesIds };
      }
    } else {
      return {
        notFound: true
      };
    }
  }

  if (pageData.code === 'error') {
    pageProps = { ...pageData };
  }

  // this logic does not handle errors coming from the fetching/formatting of the page data.
  // this is handled later in the process in /organisms/algolia-cms after we check if the category
  // is an active, untagged article.
  return pageProps;
};

export default cmsPageLogic;
