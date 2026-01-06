import { standardError } from '../../../utils/standardizedFetch';
import API from '../../../utils/api';
import SCOPE_TYPES from '../../../utils/sentryScopeTypes';
import withLogs from '../../../utils/withLogs';
import { reduceNavigation } from '../../../navigation';

const handler = async (req, res) => {
  res.setHeader('X-Cache-Control', ['true']);

  const {
    cookies,
    headers,
    method
  } = req;

  const api = new API({
    fingerprint: __filename.replace('pages', '').split('.')[0],
    base: process.env.SOLIDUS_HOST_SEO,
    host: SCOPE_TYPES.SERVICES.SOLIDUS,
    request: req,
    scopes: [
      SCOPE_TYPES.API,
      SCOPE_TYPES.SERVICES.SOLIDUS
    ],
    headers,
    auth: false,
    ...cookies
  });

  let response;
  let navigation;

  switch (method) {
    case 'GET':
      response = await api.setPath('/api/taxons/nav').get();
      navigation = response && response.data
        ? reduceNavigation(response.data.sort((a, b) => b.lft - a.lft))
        : response.data;
      res.status(response?.status ?? 500).json(navigation);
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
    uri: '/api/navigation',
    filename: __filename
  };
};

export default withLogs(handler);
