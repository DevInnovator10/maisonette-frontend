const isAccount = ({ pathname }) => [
    '/account',
  '/account/edit',
  '/address/edit',
  '/address/new',
  '/credits',
  '/lists/wishlist',
  '/login',
  '/orders',
  '/orders/[id]',
  '/password/recover',
  '/password/reset',
  '/petite-profiles',
  '/returns',
  '/returns/[id]',
  '/signup'
].some((p) => pathname === p);

const isBrand = ({ pathname }) => [
  '/brands',
  '/brands/[brand]',
  '/brands/[brand]/[...cats]'
].some((p) => pathname === p);

export const isBrandPLP = ({ pathname }) => [
  '/brands/[brand]',
  '/brands/[brand]/[...cats]'
].some((p) => pathname === p);

const isCheckout = ({ pathname }) => [
  '/checkout',
  '/checkout/registration',

  '/checkout/confirmation/[id]',
  '/checkout/gift-message',
  '/checkout/payment',
  '/checkout/delivery-address'
].some((p) => pathname === p);

export const isLeScoop = ({ pathname }) => [
  '/le_scoop',
  '/le_scoop/[category]',
  '/le_scoop/[category]/[subcategory]',
  '/le_scoop/[category]/[subcategory]/[story]'

].some((p) => pathname === p);

const isSearch = (searchTerm) => searchTerm && searchTerm !== '*';

export const isProductListing = ({ pathname }) => [
  '/edits/[edit]',
  '/edits/[edit]/[...cats]',
  '/products',
  '/products/[...cats]',
  '/shop',
  '/shop/[...cats]',
  '/trends/[trend]',
  '/trends/[trend]/[...cats]'
].some((p) => pathname === p);

export const isSharedWishlist = ({ pathname }) => pathname === '/lists/wishlist/shared';

const isReference = ({ asPath, pathname }) => [
  '/about',
  '/accessibility',
  '/careers',
  '/careers/[slug]',
  '/contact',
  '/delivery',
  '/faq',
  '/holiday-shipping',
  '/partner',
  '/press',
  '/privacy',
  '/returns-guide',
  '/size-guide',
  '/terms',
  '/q1-2021-diversity-equity-and-inclusion-report'
].some((p) => [asPath, pathname].includes(p));

const isProductDescription = ({ pathname }) => pathname === '/product/[slug]' || pathname === '/product-new/[slug]';

const isProductCategory = ({ pathname, query: { cms = false } }) => pathname === '/[cms]' && cms && cms.includes('-home');

const isCMS = ({ pathname }) => pathname === '/[cms]';

const contentGrouping = ({
  pageProps: {
    error = false,
    searchTerm = null,
    query = null
  } = {},
  router
}) => {
  let grouping = null;

  if (error === 404 || router.pathname === '/404') grouping = 'Page Not Found';
  else if (router.pathname === '/') grouping = 'Homepage';
  else if (isAccount(router)) grouping = 'Account Pages';
  else if (isBrand(router)) grouping = 'Brand Pages';
  else if (isCheckout(router)) grouping = 'Checkout Pages';
  else if (isProductListing(router) && isSearch(searchTerm || query)) grouping = 'Search Pages';
  else if (isProductListing(router)) grouping = 'Product Listing Pages';
  else if (isReference(router)) grouping = 'Reference Pages';
  else if (isLeScoop(router)) grouping = 'Le Scoop Pages';
  else if (isProductDescription(router)) grouping = 'Product Description Pages';
  else if (isProductCategory(router)) grouping = 'Product Category Pages';
  else if (isCMS(router) && !grouping) grouping = 'Merchandising Pages';

  return grouping;
};

export default contentGrouping;
