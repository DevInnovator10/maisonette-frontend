import * as Sentry from '@sentry/node';
import logger from '../../utils/logger';

export default function handler(req, res) {
  const { method, body } = req;
  const { fetch } = global;
  const url = 'http://localhost:8126/v0.3/traces';

  switch (method) {
    case 'POST':
      fetch(url, {
        body,
        headers: { 'X-Datadog-Trace-Count': '1' },
        keepalive: true,
        method: 'PUT'
      }).catch((error) => {
        Sentry.captureException(new Error(error));
        logger('error', error);
      });

      res.status(201).end();
      break;

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).json({
        status: 405,
        statusText: 'Method Not Allowed',
        data: {
          errors: [{
            message: `Method ${method} Not Allowed`,
            code: 405
          }]
        }
      });
  }
}
