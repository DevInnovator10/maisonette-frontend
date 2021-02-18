import slugToSli from './slugToSLI';

const isAbsolute = (x) => (typeof x === 'object' ? false : new RegExp('^(?:[a-z]+:)?//', 'i').test(x));

const getHref = (item) => {
  if (isAbsolute(item.navigation_url)) return { pathname: item.navigation_url };

  const url = new URL(item.navigation_url, process.env.NEXT_PUBLIC_CLIENT_HOST);
  const params = new URLSearchParams(url.search);
  const queries = {};

  params.forEach((value, key) => {
    queries[key] = value;
  });

  const as = {};

  if (Object.keys(queries).length) as.query = queries;

  return {
    ...as,
    pathname: url.pathname
  };
};

export const getCategories = (p) => (p.length > 0 ? p.reduce((acc, curr, i) => {
  acc[`cat${i + 1}`] = slugToSli(curr);
  return acc;
}, {}) : {});

const getNavigationProps = ({ item, viewAll = false }) => {
  const props = {};

  const navigation_url = viewAll
    && item.view_all_url_override ? item.view_all_url_override : item.navigation_url;

  if (isAbsolute(navigation_url)) props.prefetch = false;
  else props.href = getHref({ navigation_url });

  return {
    ...props,
    href: getHref({ navigation_url })
  };
};

const getBasePath = (props) => {
  if (!props.page) return '/';
  const paths = props.page.split('/');
  if (props.trend || props.brand || props.edit) return `/${paths.slice(1, 3).join('/')}`;
  return `/${paths[1]}`;
};

const getNavigation = (navigation = null, pos) => {
  if (!navigation) return [];

  try {
    // https://immerjs.github.io/immer/docs/freezing
    const unfrozenNavigation = [...navigation[pos]];
    return unfrozenNavigation.sort((a, b) => a.lft - b.lft);
  } catch (error) {
    return [];
  }
};

export {
  isAbsolute,
  getHref,
  getNavigationProps,
  getNavigation,
  getBasePath
};
