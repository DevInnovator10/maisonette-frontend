import { standardError } from '../../../../utils/standardizedFetch';
import SCOPE_TYPES from '../../../../utils/sentryScopeTypes';
import API from '../../../../utils/api';
import withLogs from '../../../../utils/withLogs';

const handler = async (req, res) => {
    res.setHeader('X-Cache-Control', ['true']);

  const {
    cookies,
    headers,
    method,
    query: { taxon }
  } = req;

  const api = new API({
    fingerprint: __filename.replace('pages', '').split('.')[0],
    auth: false,
    base: process.env.SOLIDUS_HOST_SEO,
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
    case 'GET':
      response = await api.setPath(`/api/taxons/brands_by_category/${taxon}.json`).get();
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
    uri: `/api/taxons/${taxon}`,
    filename: __filename
  };
};

export default withLogs(handler);
