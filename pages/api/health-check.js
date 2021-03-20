const handler = (req, res) => {
  res.setHeader('Allow', ['GET']);

  const {
    method
  } = req;

  switch (method) {
    case 'GET':
      res.status(200).end();
      break;
    default:
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
