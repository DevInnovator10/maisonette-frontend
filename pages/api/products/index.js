import ip from 'public-ip';
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
    query
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
  let cip;
  const { SLIBeacon } = cookies;

  try {
    cip = await ip.v4({ timeout: 1000 });
  } catch (error) { /* */ }

  const { alphabetical, ...queries } = query;

  const queryParams = {
    ...queries,
    cip,
    ...(
      /**
       * Alphabetical Filter Sort Test
       * https://maisonette.atlassian.net/browse/TEC-4157
       */
      alphabetical
        ? { facetControl: '*(show-all-selected=true),*(order=alpha),agerange(order=sortfield),shoesizes(order=sortfield),clothingsizes(order=sortfield)' }
        : { facetControl: '*(show-all-selected=true),agerange(order=sortfield),shoesizes(order=sortfield),clothingsizes(order=sortfield)' }
    ),
    ts: 'json-full',
    ...(SLIBeacon && { SLIBeacon }),
    SLIPid: new Date().getTime()
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
    uri: '/api/products',
    filename: __filename
  };
};

export default withLogs(handler);
