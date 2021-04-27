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
    method
  } = req;

  const api = new API({
    fingerprint: __filename.replace('pages', '').split('.')[0],
    auth: false,
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
      response = await api.setPath('/api/stock_requests').post(body);
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
    uri: '/api/stock_requests',
    filename: __filename
  };
};

export default withLogs(handler);
