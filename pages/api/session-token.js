import generateJWT from '../../utils/generateJWT';

export default (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');

  const token = generateJWT();
  res.end(JSON.stringify({ token }));
};
