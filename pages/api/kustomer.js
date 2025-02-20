import { standardError } from '../../utils/standardizedFetch';
import SCOPE_TYPES from '../../utils/sentryScopeTypes';
import API from '../../utils/api';
import generateJWT from '../../utils/generateJWT';
import withLogs from '../../utils/withLogs';

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
    base: 'https://maisonette.api.kustomerapp.com',
    host: SCOPE_TYPES.SERVICES.KUSTOMER,
    scopes: [
      SCOPE_TYPES.API,
      SCOPE_TYPES.SERVICES.KUSTOMER
    ],
    headers,
    ...cookies
  });

  let response;

  const getJWT = (r) => {
    const { attributes: { secret } } = r.data.data;
    return generateJWT(JSON.parse(body), secret);
  };

  switch (method) {
    case 'POST':
      response = await api.setPath('/v1/auth/customer/settings').get();
      res.status(response?.status ?? 500).json({ jwt: getJWT(response) });
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
    uri: '/api/kustomer',
    filename: __filename
  };
};

export default withLogs(handler);
