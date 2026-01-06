import buildUrl from 'build-url';
import {
  catchError,
  standardizedResponse
} from './standardizedFetch';
import SCOPE_TYPES from './sentryScopeTypes';
import getIp from './getIp';

const hasJsonStructure = (str) => {
  if (typeof str !== 'string') return false;

  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    return type === '[object Object]' || type === '[object Array]';
  } catch (err) {
    return false;
  }
};

const getBody = (body = null) => {
  if (!body) return {};
  return { body: hasJsonStructure(body) ? body : JSON.stringify(body) };
};

class API {
  constructor({
    /**
     * "auth" is used to bypass sending solidus auth headers
     * FIXME: should be removed once backend team fixes issue
     * with sending auth headers returning 401
     * // https://maisonette.atlassian.net/browse/TEC-1902
     */
    auth = true,
    base = '/',
    cookies,
    fingerprint,
    headers,
    host,
    maisonette_order_token,
    maisonette_user_token,
    path = '/',
    queryParams,
    request,
    scopes
  }) {
    this.fingerprint = fingerprint;
    this.cookies = cookies;
    this.host = host;
    this.scopes = scopes;
    this.path = path;
    this.base = base;
    this.queryParams = queryParams;
    this.url = buildUrl(base, { path, queryParams });
    this.headers = {};
    this.response = {};

    if (this.host === SCOPE_TYPES.SERVICES.SOLIDUS) {
      try {
        const ip = getIp(request);
        this.headers = { 'X-Forwarded-For': ip };
      } catch (e) { /* failed to fetch IP address */ }

      if (auth === true) {
        this.headers = {
          /**
           * We should only be sending 'Authorization' OR 'X-Spree-Order-Token'
           * 'Authorization' if user logged in
           * 'X-Spree-Order-Token' if user not logged in
           */
          ...this.headers,
          ...(headers.authorization && { Authorization: headers.authorization }),
          ...(headers['X-Spree-Order-Token'] && { 'X-Spree-Order-Token': headers['X-Spree-Order-Token'] }),
          ...(headers['x-spree-order-token'] && { 'X-Spree-Order-Token': headers['x-spree-order-token'] }),
          ...(maisonette_user_token && { Authorization: `Bearer ${maisonette_user_token}` }),
          ...((!maisonette_user_token && maisonette_order_token) && { 'X-Spree-Order-Token': maisonette_order_token })
        };
      }

      if (headers['x-variation']) this.headers['x-variation'] = headers['x-variation'];
      if (headers['client-ip']) this.headers['client-ip'] = headers['client-ip'];
    }

    if (this.host === SCOPE_TYPES.SERVICES.KUSTOMER) {
      this.headers = {
        Authorization: `Bearer ${process.env.KUSTOMER_API_KEY}`
      };
    }
  }

  setPath(path, queryParams) {
    this.path = path;
    this.queryParams = queryParams;
    this.url = buildUrl(this.base, { path, queryParams });
    return this;
  }

  getResponse() {
    return this.response;
  }

  get() {
    const options = {
      method: 'GET',
      ...(Object.keys(this.headers).length > 0 && { headers: this.headers })
    };

    return global.fetch(this.url, options)
      .then((response) => {
        this.response = response;
        return standardizedResponse(response);
      })
      .catch((error) => catchError(error, {
        fingerprint: this.fingerprint,
        scopes: this.scopes,
        method: 'GET',
        uri: this.path,
        host: this.host,
        cookies: this.cookies
      }));
  }

  post(body = null) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.headers
      },
      ...(getBody(body))
    };

    return global.fetch(this.url, options)
      .then((response) => {
        this.response = response;
        return standardizedResponse(response);
      })
      .catch((error) => catchError(error, {
        fingerprint: this.fingerprint,
        scopes: this.scopes,
        method: 'POST',
        uri: this.path,
        host: this.host,
        cookies: this.cookies
      }));
  }

  patch(body = null) {
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.headers
      },
      ...(getBody(body))
    };

    return global.fetch(this.url, options)
      .then((response) => {
        this.response = response;
        return standardizedResponse(response);
      })
      .catch((error) => catchError(error, {
        fingerprint: this.fingerprint,
        scopes: this.scopes,
        method: 'PATCH',
        uri: this.path,
        host: this.host,
        cookies: this.cookies
      }));
  }

  put(body = null) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.headers
      },
      ...(getBody(body))
    };

    return global.fetch(this.url, options)
      .then((response) => {
        this.response = response;
        return standardizedResponse(response);
      })
      .catch((error) => catchError(error, {
        fingerprint: this.fingerprint,
        scopes: this.scopes,
        method: 'PUT',
        uri: this.path,
        host: this.host,
        cookies: this.cookies
      }));
  }

  delete() {
    const options = {
      method: 'DELETE',
      ...(Object.keys(this.headers).length > 0 && { headers: this.headers })
    };

    return global.fetch(this.url, options)

      .then((response) => {
        this.response = response;
        return standardizedResponse(response);
      })
      .catch((error) => catchError(error, {
        fingerprint: this.fingerprint,
        scopes: this.scopes,
        method: 'DELETE',
        uri: this.path,
        host: this.host,
        cookies: this.cookies
      }));
  }
}

export default API;
