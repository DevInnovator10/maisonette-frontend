import React from 'react';
import * as Sentry from '@sentry/node';
import buildUrl from 'build-url';
import nextCookies from 'next-cookies';
import flatten from 'lodash.flatten';
import Router from 'next/router';
import Link from 'next/link';
import { trackSLISearch } from './tracking';
import deleteCookies from './deleteCookies';
import { toast, TOAST } from './toastify';

class SentryError extends Error {

    constructor(host = '', method = '', service = '', ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SentryError);
    }

    this.name = `${service} ${host} ${method}`;
  }
}

export const standardError = ({ error, status }) => {
  switch (status) {
    case 401:
      return {
        message: 'You are not authorized to perform that action.',
        code: status
      };

    case 404:
      return {
        message: 'The resource you were looking for could not be found.',
        code: status
      };

    case 405:
      return {
        message: error,
        code: status
      };

    case 500:
      return {
        message: error || 'Internal server error.',
        code: status
      };

    case 501:
      return {
        message: error || 'Internal server error.',
        code: status
      };

    case 502:
      return {
        message: error || 'Internal server error.',
        code: status
      };

    case 503:
      return {
        message: error || 'Internal server error.',
        code: status
      };

    case 504:
      return {
        message: error || 'Internal server error.',
        code: status
      };

    default:
      return { code: status || -1, message: error };
  }
};

const checkError = (response, data) => {
  const { error, success, message } = data;

  let { errors = [] } = data;

  errors = Array.isArray(errors) ? errors : Object.values(errors);
  if (Array.isArray(errors) && errors.length > 0) errors = flatten(errors);

  // sometimes error doesn't contain 'error' in response,
  // instead, the error returns { success: false, message: '...' }
  if (Object.prototype.hasOwnProperty.call(data, 'success') && !success && message) {
    errors.push(message);
  }

  if (error || errors.length > 0) {
    return {
      errors: [...errors, error]
        .filter((e) => e)
        .map((e) => standardError(({ status: response.status, error: e })))
    };
  }

  if (response.status === 404) {
    return { errors: [standardError({ status: response.status })] };
  }

  return data;
};

export const catchError = (error, {
  cookies,
  data,
  fingerprint,
  host = 'API',
  method,
  options,
  scopes,
  uri
}) => {
  // ignore error if request is aborted
  if (error.name === 'AbortError') {
    return data;
  }

  Sentry.withScope((scope) => {
    scope.setLevel(Sentry.Severity.Fatal);

    try {
      if (cookies && cookies.maisonette_user_data) {
        scope.setUser(JSON.parse(cookies.maisonette_user_data));
      }
    } catch (e) { /* */ }

    try {
      // group errors together based on their request and response
      const status = data?.status ?? 0;

      // set tags in Sentry to be able to
      // filter by common traits
      scope.setTags({
        'response.code': status,
        host,
        method,
        endpoint: fingerprint || uri,
        maisonette_session_token: cookies.maisonette_session_token
      });

      scope.setFingerprint([...scopes, method, fingerprint || uri, status]);
    } catch (e) { /* */ }

    try {
      scope.setContext('request options', options);
    } catch (e) { /* */ }

    Sentry.captureException(new SentryError(host, method, uri, error.message));
  });

  return data;
};

// https://github.com/github/fetch/issues/268#issuecomment-176544728
export const getContentType = (r) => r.text().then((text) => (text ? JSON.parse(text) : {}));

export const standardizedResponse = async (response) => {
  const data = await getContentType(response);

  return {
    status: response.status,
    statusText: response.statusText,
    data: checkError(response, data)
  };
};

export const standardizedFetch = ({
  body = null,
  ctx = null,
  fingerprint,
  method,
  queryParams = {},
  scopes,
  signal,
  headers = {},
  uri,
  base = global.document ? '/' : process.env.NEXT_PUBLIC_CLIENT_HOST
}) => {
  const data = {};
  let cookies = {};

  try {
    if (ctx) cookies = nextCookies(ctx);
    else if (global?.document?.cookie) {
      cookies = global.document.cookie.split('; ').reduce((prev, current) => {
        const [name, value] = current.split('=');
        const temp = prev;
        temp[name] = value;
        return temp;
      }, {});
    }
  } catch (error) {
    Sentry.captureException(error);
  }

  const options = {
    method,
    ...(signal && { signal }),
    ...(body && { body: JSON.stringify(body) })
  };

  if (ctx && ctx.req) {
    options.headers = {
      /**
         * We should only be sending 'Authorization' OR 'X-Spree-Order-Token'
         * 'Authorization' if user logged in
         * 'X-Spree-Order-Token' if user not logged in
         */
      ...(cookies.maisonette_user_token && { Authorization: `Bearer ${cookies.maisonette_user_token}` }),
      ...((!cookies.maisonette_user_token && cookies.maisonette_order_token) && { 'X-Spree-Order-Token': cookies.maisonette_order_token })
    };
  }

  if (headers['X-Variation']) {
    if (options.headers) {
      options.headers['X-Variation'] = headers['X-Variation'];
    } else {
      options.headers = { ...headers };
    }
  }
  const url = buildUrl(base, { path: uri, queryParams });
  const response = global.fetch(url, options)
    .then(async (r) => {
      data.status = r.status ?? 500;
      data.statusText = r.statusText ?? 'Internal Server Error';
      return getContentType(r);
    })
    .then((d) => {
      if (d.tracking?.code) {
        try {
          trackSLISearch(d.tracking.code);
        } catch (error) { /* */ }
      }

      if (data.status === 401) {
        if (url.includes('/api/login') || url.includes('/api/wished_products')) return d;

        try {
          toast(
            <>
                There has been a problem and you have been logged out. Please
              <Link href="/login" passHref><a>log back in</a></Link>
                to retrieve your bag.
            </>, {
              toastId: '401-error',
              type: TOAST.TYPE.ERROR,
              autoClose: 6000,
              pauseOnHover: true
            }
          );

          // if user gets a 401 response
          // redirect to back to current page or homepage
          deleteCookies();
          Sentry.captureMessage('Unauthorized Request - Cookies Reset');

          const { pathname } = global?.location;
          Router.push(pathname || '/');
        } catch (error) { /* */ }
      }

      return d;
    })
    .catch((error) => catchError(error, {
      cookies,
      data,
      fingerprint,
      method,
      scopes,
      uri,
      options
    }));

  return response;
};
