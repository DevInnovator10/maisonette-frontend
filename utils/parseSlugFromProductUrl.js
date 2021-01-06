const parseSlugFromProductUrl = (product) => {
  if (product.slug) return `/product/${product.slug}`;
  if (product.product_slug) return `/product/${product.product_slug}`;
  if (product.url) return `/product/${product.url.split('/')[product.url.split('/').length - 1]}`;

  return '/';
};

export default parseSlugFromProductUrl;
