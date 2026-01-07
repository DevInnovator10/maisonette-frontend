const getCookie = (name, req) => {
  const cookie = {};

  const cookieLocation = req?.headers?.cookie ?? global.document.cookie;
  cookieLocation.split(';').forEach((x) => {
    const [k, v] = x.split('=');
    cookie[k.trim()] = v;
  });

  return name ? cookie[name] : cookie;

};

export default getCookie;
