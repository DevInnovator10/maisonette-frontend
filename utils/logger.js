/* eslint-disable no-console */

import { performance } from 'perf_hooks';
import * as Sentry from '@sentry/node';
import tracer from 'dd-trace';

import randomNum from './randomNum';

tracer.init({ logInjection: true });

const logger = (level = 'info', data) => {
  const timestamp = Date.now();
  console.log(JSON.stringify({ ...data, level, timestamp }));
};

const report = async ({ body }) => {
  const url = `${process.env.NEXT_PUBLIC_CLIENT_HOST}/api/logs`;

  const {
    filename,
    timings,
    data,
    method,
    uri
  } = body;

  const traceBody = [[{
    trace_id: randomNum(1000000, 9999999),
    span_id: randomNum(1000000, 9999999),
    name: method,
    resource: filename ? filename.replace(/^(pages)/, '').replace(/(\/index\.js|\.js)$/, '') : uri,
    service: 'frontend',
    type: 'web',
    start: timings.start,
    duration: timings.end - timings.start,
    meta: { data: JSON.stringify(data) },
    ...(data?.errors && { error: 1 })
  }]];

  try {
    global.fetch(url, { body: JSON.stringify(traceBody), method: 'POST', keepalive: true })
      .catch((error) => {
        Sentry.captureException(new Error(error));
        logger('error', error);
      });
  } catch (error) {
    logger('error', error);
  }
};

const filterSensitiveData = ({ body = null }) => {
  const REDACTED = '********';

  let request = body;

  if (request) {
    try {
      request = JSON.parse(body);
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setExtra('request', request);
        Sentry.captureException(error);
      });
    }
  }

  if (request?.order_token) request.order_token = REDACTED;

  if (request?.user) {
    if (request?.user?.password) {
      request.user.password = REDACTED;
    }

    if (request?.user?.password_confirmation) {
      request.user.password_confirmation = REDACTED;
    }
  }

  return request;
};

const httpStatusToLevel = (status) => {
  if (status >= 500) return 'error';
  if (status >= 400) return 'warn';
  if (status >= 100) return 'info';
  return 'debug';
};

const log = (payload = {}) => {
  // If the payload is empty, report that:
  if (Object.keys(payload).length === 0) {
    logger('debug', 'Empty payload sent to utils/logger/log');
    return;
  }

  // Payload is a string, report directly:
  if (typeof payload === 'string') {
    logger('info', payload);
    return;
  }

  // Payload is a JSON object, process it first.
  // Grab the status code:
  const { status = 0 } = payload;
  // Convert it to a log level:
  const level = httpStatusToLevel(status);

  // Build the log message:
  const msg = {
    ...payload,
    body: filterSensitiveData(payload) ?? 'No body'
  };

  // Log it:
  logger(level, msg);
};

class Performance {
  constructor() {
    this.timings = {};
    this.unixStartNano = 0;
    this.startCalled = false;
  }

  start() {
    this.startCalled = true;

    try {
      const unixStart = performance.timeOrigin;
      this.unixStartNano = unixStart * 1000000;

      const start = performance.now();
      const startNano = Math.round(start * 1000000);
      const calculatedStart = this.unixStartNano + startNano;
      this.timings.start = calculatedStart;
    } catch (error) {
      throw new Error('error calculating performance start');
    }

    return this;
  }

  end() {
    if (!this.startCalled) throw new Error('call start first');

    try {
      const end = performance.now();
      const endNano = Math.round(end * 1000000);
      const calculatedEnd = this.unixStartNano + endNano;
      this.timings.end = calculatedEnd;
    } catch (error) {
      throw new Error('error calculating performance end');
    }

    return this;
  }

  report({
    response,
    method,
    body = undefined,
    uri,
    filename,
    query,
    headers
  }) {
    report({
      body: {
        data: response,
        timings: this.timings,
        method,
        uri,
        filename: `/${filename}`
      }
    });

    log({
      body,
      filename: `/${filename}`,
      method,
      status: response?.status ?? 100, // TODO: Definitely do NOT just send a 100 status code
      url: uri,
      headers,
      query
    });
  }
}

export { Performance };
export default logger;
