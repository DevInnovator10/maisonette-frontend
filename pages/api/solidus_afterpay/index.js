import { standardError } from '../../../utils/standardizedFetch';
import SCOPE_TYPES from '../../../utils/sentryScopeTypes';
import API from '../../../utils/api';
import withLogs from '../../../utils/withLogs';

const handler = async (req, res) => {
  res.setHeader('X-Cache-Control', ['true']);

  const {
    body,
    cookies,
    headers,
    method,
    query: {
      order_number,
      payment_method_id
    }
  } = req;

  // The values below are required for the creating a checkout with Afterpay.
  // since we are using the popup method, these values are not used as redirects
  // but are used in a postMessage call in Afterpay.js
  // so they need to have the same host as the client
  const redirect_confirm_url = `${process.env.NEXT_PUBLIC_CLIENT_HOST}/confirm`;
  const redirect_cancel_url = `${process.env.NEXT_PUBLIC_CLIENT_HOST}/cancel`;

  const api = new API({
    fingerprint: __filename.replace('pages', '').split('.')[0],
    base: process.env.SOLIDUS_HOST,
    host: SCOPE_TYPES.SERVICES.SOLIDUS,
    request: req,
    scopes: [
      SCOPE_TYPES.API,
      SCOPE_TYPES.SERVICES.SOLIDUS
    ],
    headers,
    ...cookies
  });

  let response;

  switch (method) {
    case 'POST':
      response = await api.setPath('/solidus_afterpay/checkouts', {
        order_number, payment_method_id, redirect_confirm_url, redirect_cancel_url
      }).post(body);
      res.status(response?.status ?? 500).json(response?.data ?? null);
      break;

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).json({
        status: 405,
        statusText: 'Method Not Allowed',
        data: { errors: [standardError({ status: 405, error: `Method ${method} Not Allowed` })] }
      });
  }

  return {
    response,
    method,
    body: req?.body ?? null,
    query: req?.query ?? null,
    status: api?.response?.status ?? 500,
    headers,
    uri: '/api/solidus_afterpay',
    filename: __filename
  };
};

export default withLogs(handler);
