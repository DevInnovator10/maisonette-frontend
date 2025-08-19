import qs from 'qs';

const deconstructURL = (url) => {
  /*
  * returns an object with the following keys:
  - pathString: string
  - queryString: string
  - pageType: string (shop, trends, edits, brands)
  - pageValue: string
  - hierarchicalMenu: array
  - queries: object
  */

  const [path, queryString] = url.split('?');

  // confirming if the page type has surrounding slashes,
  // which indicates hierarchical menu is present for shop pages
  // or the page value for the other 3 page types
  const match = path.match(/\/(shop|brands|trends|edits|le_scoop)\//);
  const pageType = match ? match[1] : path.replace('/', '');
  const hierarchicalMenu = match ? path.replace(match[0], '').split('/') : [];
  const pageValue = (pageType !== 'shop' && pageType !== 'le_scoop') && hierarchicalMenu.length ? hierarchicalMenu.shift() : null;

  const queryObj = queryString ? qs.parse(queryString) : null;

  return {
    pathString: path,
    ...(queryString && { queryString }),
    pageType,
    ...(pageValue && { pageValue }),
    ...(hierarchicalMenu.length && { hierarchicalMenu }),

    ...(queryObj && { queries: queryObj })
  };
};

export default deconstructURL;
