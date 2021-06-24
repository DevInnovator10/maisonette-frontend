const blacklist = {
  utm_medium: true,
  utm_source: true,
  utm_campaign: true,
  utm_content: true,
  utm_term: true,
  td: true,
  _ke: true,
  variation: true,
  ranMID: true,
  gclid: true,
  msclkid: true,
  fbclid: true,
  pp: true,
  epik: true,
  irclickid: true,
  irgwc: true,
  quantity: true
};

export const removeURLParameter = (url, parameter) => {
  const params = new URLSearchParams(url);
  params.delete(parameter);
  return params.toString();
};

const getCanonicalUrl = (router) => {
  const { asPath } = router;
  const [url, queries] = asPath.split('?');

  if (!queries) return `${process.env.NEXT_PUBLIC_CLIENT_HOST}${asPath}`;

  const queryParams = new URLSearchParams(queries);
  queryParams.sort();

  const queriesObj = [...queryParams]
    .reduce((o, i) => ({ ...o, [i[0]]: i[1] }), {});

  const params = Object.keys(queriesObj).reduce((a, q) => {
    let temp = a;
    if (blacklist[q]) temp = removeURLParameter(a, q);
    return temp;
  }, queryParams.toString());

  return `${process.env.NEXT_PUBLIC_CLIENT_HOST}${url}${params ? `?${params}` : ''}`;
};

export default getCanonicalUrl;
