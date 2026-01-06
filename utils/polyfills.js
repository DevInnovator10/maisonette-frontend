/* eslint-disable no-undef, no-unused-expressions */

typeof window.URLSearchParams === 'undefined'
  ? import(/* webpackChunkName: "poly_fill" */ 'url-search-params-polyfill')
  : '';

typeof window.IntersectionObserver === 'undefined'
  ? import(/* webpackChunkName: "poly_fill" */ 'intersection-observer')
  : '';

typeof Promise === 'undefined' || Promise.prototype.finally === undefined
  ? import(/* webpackChunkName: "poly_fill" */ 'promise-polyfill/src/polyfill')
  : '';

typeof window.AbortController === 'undefined'
  ? import(/* webpackChunkName: "poly_fill" */ 'abortcontroller-polyfill')
  : '';

'options' in document.createElement('datalist')
  ? ''
  : import(/* webpackChunkName: "poly_fill" */ 'datalist-polyfill');

'open' in document.createElement('details')
  ? ''
  : import(/* webpackChunkName: "poly_fill" */ 'details-polyfill');

'flat' in Array.prototype
  ? ''
  : import(/* webpackChunkName: "poly_fill" */ 'array-flat-polyfill');

window.Element && !Element.prototype.closest
  ? import(/* webpackChunkName: "poly_fill" */ 'element-closest-polyfill')
  : '';
