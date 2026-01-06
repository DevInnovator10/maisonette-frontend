import { standardError } from '../../../../../utils/standardizedFetch';
import SCOPE_TYPES from '../../../../../utils/sentryScopeTypes';
import API from '../../../../../utils/api';
import withLogs from '../../../../../utils/withLogs';

const handler = async (req, res) => {
    const {
    cookies,
    headers,
    method,
    query: { order_number, coupon }
  } = req;

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
    case 'DELETE':
      response = await api.setPath(`/api/orders/${order_number}/coupon_codes/${coupon}`).delete();
      res.status(response?.status ?? 500).json(response?.data ?? null);
      break;

    default:
      res.setHeader('Allow', ['DELETE']);
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
    uri: `/api/orders/${order_number}/coupon_codes/${coupon}`,
    filename: __filename
  };
};

export default withLogs(handler);
