const getIpAddressFromRequest = (request) => {
  let ipAddr = request.connection.remoteAddress;

  if (request.headers && request.headers['x-forwarded-for']) {
    [ipAddr] = request.headers['x-forwarded-for'].split(',');
  }

  return ipAddr;
};

export default getIpAddressFromRequest;
