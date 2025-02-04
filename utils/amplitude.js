import Router from 'next/router';
import * as Sentry from '@sentry/browser';

import contentGrouping from './contentGrouping';
import { getProduct, getOrders, getOrder } from '../pages/api';
import Queue from './queue';
import getCookie from './getCookie';
import { getVWOTests, combineSplitTests, formatSplitTests } from './amplitudeHelpers/splitTestHelpers/index';

// eslint-disable-next-line import/no-mutable-exports
let amplitudeActive = false;

const AMPLITUDE_QUEUE = new Queue();

const Amplitude = process.browser ? require('amplitude-js') : null;

const instance = Amplitude ? Amplitude.getInstance() : {
  init: () => {},
  logEvent: () => {},
  setUserId: () => {},
  setUserProperties: () => {}
};

const getFullProduct = (slug) => getProduct({ id: slug }).then((res) => res);

const getProductBadges = (product) => product?.trends?.map?.((t) => t.value);

const getProductCategory = (product) =>
  product?.breadcrumb_taxons?.[product?.breadcrumb_taxons?.length - 1]?.name;

const isSizeBroken = (product) => product?.variants?.reduce((sum, variant, idx, source) => {
  let temp = sum;
  if (variant?.total_on_hand === 0) temp += 1;
  if (source.length - 1 === idx) return temp > source.length / 2;
  return temp;
}, 0);

const getPageType = () => (Router.route === '/404'
  ? 'Page Not Found'
  : contentGrouping({ router: Router }));

const getOrderDiscounts = (cart) => {
  const lintItemPromotions = cart?.subtotals?.line_item_promotion_totals
      ?.reduce((a, b) => a + (+b.total || 0), 0) * -1;
  const miscPromotions = cart?.subtotals?.miscellaneous_adjustments
      ?.reduce((a, b) => a + (+b.amount || 0), 0) * -1;
  return lintItemPromotions + miscPromotions;
};

const getPaymentMethod = (type, method) => {
  switch (type) {
    case 'Spree::StoreCredit': return 'Store Credit';
    case 'CreditCard': return 'Credit Card';
    case 'PayPalAccount': return 'PayPal';
    case 'ApplePayCard': return 'Apple Pay';
    case 'SolidusAfterpay::PaymentSource': return 'Afterpay';
    default: return method;
  }
};

const getPrice = (product) => {
  let price = product?.variants?.[0]?.price ?? product?.master?.price;

  if (product?.variants && !price) {
    for (let i = 1; i < product.variants.length; i++) {
      const variant = product.variants[i];
      if (variant.price) {
        price = variant.price;
        break;
      }
    }
  }

  return price ?? 0;
};

const getPathNoQuery = () => {
  const { asPath } = Router;
  return asPath.split('?')[0];
};

const getQuery = () => {
  const { asPath } = Router;
  return asPath.split('?')[1];
};

export const setUserSplitTests = (splitTests) => {
  if (!splitTests) return;
  const splitTestsJSON = JSON.stringify(splitTests);
  const splitTestsArray = formatSplitTests(splitTests);
  // save splitTests to cookie for later comparison
  global.document.cookie = `maisonette_split_tests=${splitTestsJSON}; path=/;`;
  // set user property in Amplitude
  instance.setUserProperties({
    'split tests': splitTestsArray
  });
};

// takes the supplied split tests and runs checks against the saved tests
// to decide whether or not to call identify and save values as a cookie
export const handleSplitTests = ({ newSplitTests = null, userChanged = false }) => {
  if (!newSplitTests && !userChanged) return;

  const splitTestCookie = getCookie('maisonette_split_tests');
  // only run combineSplitTests if there are values in the cookie
  // which means there are existing, saved test values
  const combinedSplitTests = splitTestCookie?.length > 0 && !userChanged
    ? combineSplitTests(newSplitTests, splitTestCookie) : newSplitTests;

  if (combinedSplitTests) {
    setUserSplitTests(combinedSplitTests);
    return;
  }

  if (userChanged && splitTestCookie) {
    // we need to re-fire the identify event if a user logs in/out
    // to update the property for the specific user.
    // use the cookie values because they carry over per session
    const splitTestCookieObj = JSON.parse(splitTestCookie);
    setUserSplitTests(splitTestCookieObj);
  }
};

const resetUser = ({ reset_device_data = false }) => {
  const sessionToken = getCookie('maisonette_session_token');

  instance.setUserId(null);
  if (reset_device_data) instance.regenerateDeviceId();
  instance.setUserProperties({
    registered: false,
    purchases: null,
    'new customer': true,
    'last payment method': null,
    maisonette_session_token: sessionToken
  });
  // update split tests from cookie
  handleSplitTests({ userChanged: true });
};

const setUser = async ({ user }) => {
  // The 'split tests' user property is added to the handleSplitTests call below
  // to handle when a user logs in/out.
  // The Algolia abTests value will initially be undefined when this is called in app.js
  // because we do not have access to the value yet.
  // The Algolia abTests value is applied via handleSplitTests when they are available
  // in organisms/algolia-search-box.

  if (user?.id) {
    const { orders = [], total_count } = await getOrders({ page: 1 }).then((res) => res);

    const getLastPaymentUsed = async () => {
      if (total_count === undefined || total_count === 0) return null;
      const order = await getOrder({ id: orders?.[0]?.number }).then((res) => res);

      const paymentMethods = order?.payments
        ?.filter((payment) => payment?.state === 'completed' || payment?.state === 'pending')
        ?.map((payment) => {
          const method = payment?.payment_method?.name;
          if (method === 'Braintree') return payment?.source?.payment_type;
          return method;
        });

      return paymentMethods?.length > 0 ? paymentMethods[0] : null;
    };

    const newCustomer = () =>
      // new customer property for registered user should be true if total_count === 0.
      // if the getOrders call at the top of setUser fails, total_count
      // will be undefined, so we want to check that to return
      // a value that will stop the 'new customer' property from being included
      // if the call fails, which will help reduce misreporting of this property.
      (total_count === undefined ? null : total_count === 0);

    const sessionToken = getCookie('maisonette_session_token');

    instance.setUserId(user.id);
    instance.setUserProperties({
      maisonette_session_token: sessionToken,
      registered: true,
      purchases: total_count,
      'new customer': newCustomer(),
      'last payment method': await getLastPaymentUsed()
    });
    // update split tests from cookie
    handleSplitTests({ userChanged: true });
  } else {
    resetUser({ reset_device_data: false });
  }
};

export const setFirstPurchaseAmplitude = ({ first_order }) => {
  // the first_order property is taken from order data, not user data.
  // it is called after completed purchase and represents whether that
  // purchase was the email's first purchase or not
  instance.setUserProperties({
    'first purchase': first_order
  });
};

const customAttributeForTracking = () => {
  const unixTimestamp = Math.round((new Date()).getTime() / 1000);
  const sessionToken = getCookie('maisonette_session_token');
  const userData = getCookie('maisonette_user_data');
  const user = userData ? JSON.parse(userData) : null;

  return {
    amplitude_active: amplitudeActive,
    amplitude_user_id: user?.id || null,
    amplitude_session_id: sessionToken,
    maisonette_session_token: sessionToken,
    amplitude_hit_timestamp: unixTimestamp
  };
};

const properties = {
  'Viewed Product Category Page': () =>
    new Promise((resolve) => {
      const {
        query: { cms = false }
      } = Router;
      const category = cms && cms.replace('-home', '');
      resolve(category);
    }),
  'Viewed Product Description Page': ({ product }) =>
    new Promise((resolve) =>
      resolve({
        name: product?.name,
        inventory: product?.total_on_hand,
        productId: product?.id,
        price: getPrice(product),
        brand: product?.brand,
        category: getProductCategory(product),
        productSku: product?.master?.sku,
        badges: getProductBadges(product)
      })),
  'Viewed Checkout Page': ({ checkout }) =>
    new Promise((resolve) =>
      resolve({
        productSku: checkout?.line_items?.map((li) => li?.variant?.master_sku),
        ...customAttributeForTracking()
      })),
  'Viewed Product Listing Page': ({ nbHits }) =>
    new Promise((resolve) =>
      resolve({
        'number of results': nbHits
      })),
  'Viewed Brand Page': ({ nbHits }) =>
    new Promise((resolve) =>
      resolve({
        'number of results': nbHits
      })),
  'Viewed Search Page': ({ nbHits, query }) =>
    new Promise((resolve) =>
      resolve({
        'number of results': nbHits,
        'search term': query
      })),
  'Viewed Le Scoop Page': ({
    parentPage, query, category, subcategory
  }) =>
    new Promise((resolve) =>
      resolve({
        'parent page': parentPage,
        query,
        'category page': category,
        'subcategory page': subcategory
      })),
  'Removed From Cart': ({
    product, cart, parentPage, pageType
  }) =>
    new Promise((resolve, reject) =>
      getFullProduct(product?.variant?.slug)
        .then((fullProduct) => {
          resolve({
            name: product?.name,
            'size broken': isSizeBroken(fullProduct),
            position: product?.index,
            'parent page': parentPage,
            productId: fullProduct?.id,
            price: product?.variant?.price,
            brand: product?.variant?.brand,
            category: getProductCategory(fullProduct),
            variantSku: product?.variant?.sku,
            badges: getProductBadges(fullProduct),
            image: product?.variant?.images?.[0]?.product_url,
            $quantity: product?.quantity,
            productSku: fullProduct?.master?.sku,
            'page type': pageType,
            'total cart value': cart?.total,
            'total cart size': cart?.total_quantity,
            'cart id': cart?.number,
            ...customAttributeForTracking()
          });
        })
        .catch((err) => reject(err))),
  'Added To Cart': ({
    product,
    cart,
    variant,
    quantity,
    position,
    parentPage,
    pageType
  }) =>
    new Promise((resolve) =>
      resolve({
        name: product?.name,
        'size broken': isSizeBroken(product),
        position,
        'parent page': parentPage,
        productId: product?.id,
        price: variant?.price,
        brand: product?.brand,
        category: getProductCategory(product),
        variantSku: variant?.sku,
        badges: getProductBadges(product),
        image: variant?.images?.[0]?.product_url,
        $quantity: quantity,
        productSku: product?.master?.sku,
        'page type': pageType,
        'total cart value': cart?.total,
        'total cart size': cart?.total_quantity,
        'cart id': cart?.number,
        'vendor id': variant?.prices?.[0]?.vendor_id,
        ...customAttributeForTracking()
      })),
  'PDP Interaction': ({
    product,
    position,
    imagePosition,
    interactionType,
    image,
    parentPage,
    pageType,
    imageZoomPosition
  }) =>
    new Promise((resolve) =>
      resolve({
        name: product?.name,
        'interaction type': interactionType,
        position,
        'image position': imagePosition,
        'parent page': parentPage,
        productId: product?.id,
        brand: product?.brand,
        category: getProductCategory(product),
        productSku: product?.master?.sku,
        image,
        price: getPrice(product),
        badges: getProductBadges(product),
        inventory: product?.total_on_hand,
        'page type': pageType,
        'Image Zoom Position': imageZoomPosition

      })),
  'Viewed Carousel': ({
    positionType,
    parentPage,
    pageType
  }) =>
    new Promise((resolve) =>
      resolve({
        'position type': positionType,
        'page type': pageType,
        'parent page': parentPage
      })),
  'Add to Cart Confirmation': ({
    product, isViewed, isViewShop, isContinue
  }) =>
    new Promise((resolve) =>
      resolve({
        name: product?.name,
        Viewed: isViewed || false,
        'Click View Shopping Bag': isViewShop || false,
        'Click Continue Shopping': isContinue || false,
        productId: product?.id,
        brand: product?.brand,
        category: getProductCategory(product),
        productSku: product?.master?.sku,
        price: getPrice(product),
        badges: getProductBadges(product)
      })),
  'Clicked Button In Cart': ({ buttonName }) =>
    new Promise((resolve) =>
      resolve({
        'button clicked': buttonName
      })),
  'Clicked Product Card': ({
    product, module, index, parentPage, pageType
  }) =>
    new Promise((resolve, reject) =>
      getFullProduct(product?.product_slug ?? product?.slug)
        .then((fullProduct) => {
          resolve({
            name: product?.title,
            'size broken': product?.size_broken,
            'position type': module,
            position: index,
            'parent page': parentPage,
            productId: fullProduct?.id,
            brand: fullProduct?.brand,
            category: product?.main_category,
            productSku: fullProduct?.master?.sku,
            badges: getProductBadges(fullProduct),
            image: fullProduct?.master?.images?.[0]?.product_url,
            maisonetteSku: product?.maisonette_sku,
            'page type': pageType
          });
        })
        .catch((err) => reject(err))),
  'Clicked Product Quick View': ({
    product,
    index,
    module,
    parentPage,
    pageType
  }) =>
    new Promise((resolve, reject) =>
      getFullProduct(product?.product_slug ?? product?.slug)
        .then((fullProduct) => {
          resolve({
            name: product?.title,
            'size broken': product?.size_broken,
            'position type': module,
            position: index,
            'parent page': parentPage,
            productId: product?.maisonette_product_id,
            brand: product?.brand,
            category: product?.main_category,
            productSku: fullProduct?.master?.sku,
            badges: product?.badges_by_trends?.split('^')?.filter((x) => x),
            image: product?.image,
            maisonetteSku: product?.maisonette_sku,
            'page type': pageType
          });
        })
        .catch((err) => reject(err))),
  'Opened Search': ({ parentPage, pageType }) =>
    new Promise((resolve) =>
      resolve({
        'parent page': parentPage,
        'page type': pageType
      })),
  'Viewed Search Results': ({ totalChars, query, totalResults }) =>
    new Promise((resolve) =>
      resolve({
        'number of characters': totalChars,
        'search term': query,
        'number of results returned': totalResults
      })),
  'Clicked Search Results View All': ({ totalResults, elementClicked }) =>
    new Promise((resolve) =>
      resolve({
        'number of results returned': totalResults,
        'element clicked': elementClicked
      })),
  'Used Search Suggestion': ({ term }) =>
    new Promise((resolve) =>
      resolve({
        'suggested search term': term
      })),
  'Used Popular Search Suggestion': ({ term }) =>
    new Promise((resolve) =>
      resolve({
        'popular search term': term
      })),
  'Used Recent Search Suggestion': ({ term }) =>
    new Promise((resolve) =>
      resolve({
        'recent search term': term
      })),
  'Clicked Search Product Recommendation': ({ productSku }) =>
    new Promise((resolve) => resolve({ productSku })),
  'Clicked Search Content Recommendation': ({ url, title }) =>
    new Promise((resolve) => resolve({ url, title })),
  'Started Checkout': ({ cart, parentPage }) =>
    new Promise((resolve) =>
      resolve({
        'cart id': cart?.number,
        'total cart value': cart?.total,
        'total cart size': cart?.total_quantity,
        'parent page': parentPage,
        productSku: cart?.line_items?.map((li) => li?.variant?.master_sku)
      })),
  'Clicked Content Module': ({
    title,
    text,
    position,
    link,
    img,
    parentPage,
    pageType
  }) =>
    new Promise((resolve) =>
      resolve({
        'module name': title,
        'module text': text,
        img,
        link,
        'parent page': parentPage,
        position,
        'page type': pageType
      })),
  'Shown Address Verification Modal': ({ cartId, modalType, errorCode }) =>
    new Promise((resolve) =>
      resolve({
        'cart id': cartId,
        'modal type': modalType,
        'error type': errorCode
      })),
  'Submitted Address Verification Modal': ({ cartId, modalType, buttonType }) =>
    new Promise((resolve) =>
      resolve({
        'cart id': cartId,
        'modal type': modalType,
        'CTA used': buttonType
      })),
  'Clicked Checkout Edit': ({ cartId, fromStep, toStep }) =>
    new Promise((resolve) =>
      resolve({
        'cart id': cartId,
        'from step': fromStep,
        'to step': toStep
      })),
  'Clicked Checkout Cart Edit': ({ cartId, cartState }) =>
    new Promise((resolve) =>
      resolve({
        'cart id': cartId,
        'cart state': cartState
      })),
  'Submitted Checkout Address': ({ cart }) =>
    new Promise((resolve) =>
      resolve({
        'cart id': cart?.number,
        'total cart value': cart?.total,
        'total cart size': cart?.total_quantity,
        productSku: cart?.line_items?.map((li) => li?.variant?.master_sku)
      })),
  'Submitted Checkout Shipping': ({ cart }) =>
    new Promise((resolve) =>
      resolve({
        'cart id': cart?.number,
        'total cart value': cart?.total,
        'total cart size': cart?.total_quantity,
        'shipping method': cart?.shipments?.map(
          (s) => s?.selected_shipping_rate?.name
        ),
        productSku: cart?.line_items?.map((li) => li?.variant?.master_sku)
      })),
  'Submitted Checkout Payment': ({ cart, method = null, types = null }) =>
    new Promise((resolve) =>
      resolve({
        'cart id': cart?.number,
        'total cart value': cart?.total,
        'total cart size': cart?.total_quantity,
        'payment method': (() => {
          if (method) return [getPaymentMethod(null, method)];
          if (Array.isArray(types)) {
            return types.map((x) => getPaymentMethod(x));
          }
          return [getPaymentMethod(types)];
        })(),
        productSku: cart?.line_items?.map((li) => li?.variant?.master_sku)
      })),
  'Submitted Checkout Order': ({ cart }) =>
    new Promise((resolve) =>
      resolve({
        'cart id': cart?.number,
        'total cart value': cart?.total,
        'total cart size': cart?.total_quantity,
        'promo code applied':
          cart?.applied_promotion_codes.map((p) => p?.value) ?? null,
        'order total': cart?.total,
        'payment method': cart?.payments
          ?.filter((p) => p.state === 'checkout')
          ?.map((p) =>
            getPaymentMethod(p.source?.payment_type || p?.source_type)
          ),
        'shipping method': cart?.shipments?.map(
          (s) => s?.selected_shipping_rate?.name
        ),
        'total discounts': getOrderDiscounts(cart),
        'total shipping': cart?.subtotals?.shipments_total,
        'total tax': cart?.tax_total,
        variantSku: cart?.line_items?.map((li) => li?.variant?.sku),
        productSku: cart?.line_items?.map((li) => li?.variant?.master_sku)
      })),
  'Clicked Facet': ({
    navigationItem, filterAction, selected, facets
  }) =>
    new Promise((resolve) =>
      resolve({
        'navigation item': navigationItem,
        'filter action': filterAction,
        selected,
        facets
      })),
  'Clicked Header Button': ({ clickedButton }) =>
    new Promise((resolve) =>
      resolve({
        'button clicked': clickedButton
      })),
  'Navigated Site': ({
    navigationTerm,
    path,
    navigationType,
    navBreadcrumb,
    parentPage,
    pageType
  }) =>
    new Promise((resolve) =>
      resolve({
        'navigation term': navigationTerm,
        'category path': path,
        'navigation type': navigationType,
        'parent page': parentPage,
        'page type': pageType,
        breadcrumb: navBreadcrumb
      })),
  'Confirmed Purchase': ({
    cart, user, parentPage, pageType
  }) =>
    new Promise((resolve) => {
      // TODO: what to do with guest user?
      if (user) setUser({ user });

      return resolve({
        'first order': cart?.first_order,
        'transaction id': cart?.id,
        'transaction total': cart?.total,
        'transaction tax': cart?.tax_total,
        'transaction shipping': cart?.subtotals?.shipments_total,
        'transaction currency': cart?.currency,
        'cart id': cart?.number,
        discount: getOrderDiscounts(cart),
        coupon: cart?.applied_promotion_codes.map((p) => p?.value) ?? null,
        productId: cart?.line_items?.map((li) => li?.variant?.product_id),
        productSku: cart?.line_items?.map((li) => li?.variant?.master_sku),
        name: cart?.line_items?.map((li) => li?.variant?.name),
        'product data array': cart?.line_items?.map((li, i) => ({
          name: li?.variant?.name,
          'size broken': isSizeBroken(li),
          'position type': module,
          position: i + 1,
          'parent page': parentPage,
          productId: li?.variant?.product_id,
          brand: li?.variant?.brand,
          image: li?.images?.[0]?.product_url,
          variantSku: li?.variant?.sku,
          'page type': pageType
        })),
        ...customAttributeForTracking()
      });
    }),
  'Encountered Transaction Error': ({ message, step }) =>
    new Promise((resolve) =>
      resolve({
        'error type': message,
        'checkout step': step
      })),
  'Cleared All Filters': ({ facets }) =>
    new Promise((resolve) => resolve({ facets })),
  'Submitted Promo Code': ({ code, removed_promo }) =>
    new Promise((resolve) => resolve({ code, removed_promo })),
  'Submitted Gift Message': ({ removed_gift_message }) =>
    new Promise((resolve) => resolve({ removed_gift_message })),
  'Clicked Blog Category': ({ category, parentPage }) =>
    new Promise((resolve) =>
      resolve({ 'category page': category, 'parent page': parentPage })),
  'Clicked Blog Subcategory': ({ subcategory, parentPage }) =>
    new Promise((resolve) =>
      resolve({ 'subcategory page': subcategory, 'parent page': parentPage })),
  'Opened Kustomer Chatbot': ({ parentPage, pageType }) =>
    new Promise((resolve) =>
      resolve({
        'parent page': parentPage,
        'page type': pageType
      })),
  'Viewed Wishlist': ({
    totalWishlistSize, productId, productSku, name
  }) =>
    new Promise((resolve) =>
      resolve({
        'page type': 'Wishlist',
        'total wishlist size': totalWishlistSize,
        productId,
        productSku,
        name
      })),
  'Viewed Shared Wishlist': ({ totalWishlistSize, url }) =>
    new Promise((resolve) =>
      resolve({
        'copied link url': url,
        'total shared products in wishlist': totalWishlistSize,
        position: 'Wishlist Landing'
      })),
  'Share Wishlist': ({ position, totalWishlistSize, url }) =>
    new Promise((resolve) =>
      resolve({
        position,
        'copied link url': url,
        'total shared wishlist size': totalWishlistSize
      })),
  'Add to Wishlist': ({
    productId,
    productSku,
    brand,
    category,
    badges,
    name
  }) =>
    new Promise((resolve) =>
      resolve({
        position: getPageType(),
        productId,
        productSku,
        brand,
        category,
        badges,
        name
      })),
  'Removed from Wishlist': ({
    productId,
    productSku,
    brand,
    category,
    badges,
    name
  }) =>
    new Promise((resolve) =>
      resolve({
        position: getPageType(),
        productId,
        productSku,
        brand,
        category,
        badges,
        name
      }))
};

const onSuccess = () => {
  amplitudeActive = true;
};

const onError = () => {
  amplitudeActive = false;
};

const logAmplitude = async (eventName, payload = {}) => {
  try {
    const { router } = Router;
    // we must declare the below values here and supply them to the calls
    // to ensure the router is using the page the event occurred on
    // rather than the page when the AMPLITUDE_QUEUE resolves
    const parentPage = getPathNoQuery();
    const query = getQuery();
    const pageType = getPageType();

    let groupEventName;
    // if no event name given, use content grouping to set event name
    // for page view events that are grouped by page type
    if (!eventName) {
      const contentGroup = contentGrouping({ router, pageProps: payload });
      groupEventName = `Viewed ${contentGroup?.replace('Pages', 'Page')}`;
    }

    AMPLITUDE_QUEUE
      .enqueue(() => (properties[`${eventName || groupEventName}`]?.({
        parentPage, pageType, query, ...payload
      })))
      .then((props) => {
        // check VWO tests exist and run handleSplitTests with test data.
        // this handles cases of specific tests for urls, which means we
        // need to fire this on each page view event, which do not have an eventName passed in
        if (!eventName) {
          const VWOTests = getVWOTests();
          if (VWOTests) handleSplitTests({ newSplitTests: VWOTests });
        }

        instance.logEvent(
          (eventName || groupEventName),
          {
            ...(groupEventName && { 'parent page': parentPage, query }),
            ...(props && props)
          },
          onSuccess,
          onError
        );
      });
  } catch (error) {
    Sentry.withScope(() => {
      Sentry.captureException(error);
      // ... anything else ...
    });
  }
};

const logRevenueAmplitude = ({ lineItem, orderNumber }) => {
  try {
    const { variant } = lineItem;

    const eventProperties = {
      variantSku: variant?.sku,
      name: variant?.name,
      category: getProductCategory(lineItem),
      'transaction id': lineItem?.cart?.id,
      'cart id': orderNumber,
      productId: lineItem?.variant?.product_id,
      productSku: lineItem?.variant?.master_sku
    };

    const revenue = new instance.Revenue()
      .setProductId(`${variant?.product_id}`)
      .setQuantity(+lineItem?.quantity)
      .setPrice(+lineItem?.price)
      .setRevenueType('purchase')
      .setEventProperties(eventProperties);

    instance.logRevenueV2(revenue);
  } catch (error) {
    Sentry.withScope(() => {
      // handle errors for amplitude here.
      Sentry.captureException(error);
      // ... anything else ...
    });
  }
};

export {
  setUser, resetUser, logAmplitude, logRevenueAmplitude
};

export default instance;
export { amplitudeActive };
