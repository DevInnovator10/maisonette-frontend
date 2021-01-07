import { standardError } from '../../../utils/standardizedFetch';
import SCOPE_TYPES from '../../../utils/sentryScopeTypes';
import API from '../../../utils/api';
import withLogs from '../../../utils/withLogs';

const handler = async (req, res) => {
  res.setHeader('X-Cache-Control', ['true']);

  const {
    cookies,
    headers,
    method,
    query: { ids, ...params }
  } = req;

  const api = new API({
    fingerprint: __filename.replace('pages', '').split('.')[0],
    base: process.env.SLI_HOST,
    host: SCOPE_TYPES.SERVICES.SLI,
    scopes: [
      SCOPE_TYPES.API,
      SCOPE_TYPES.SERVICES.SLI
    ],
    headers,
    ...cookies

  });

  let response;

  const wishedSearch = ids.split(',').length > 0
    ? ids.split(',').map((id) => `product_id_wishlist:${id}`).join('|')
    : `product_id_wishlist:${ids}`;

  const queryParams = {
    cnt: 300,
    filter: wishedSearch,
    ts: 'json-full',
    w: '*',
    ...params
  };

  switch (method) {
    case 'GET':
      response = await api.setPath('/search', queryParams).get();
      res.status(response?.status ?? 500).json(response?.data ?? null);
      break;

    default:
      res.setHeader('Allow', ['GET']);
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
    uri: '/api/sli_wished_products',
    filename: __filename
  };
};

export default withLogs(handler);
