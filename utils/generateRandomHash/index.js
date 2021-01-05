const generateRandomHash = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let hash = '';

  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      hash += '-';

      // eslint-disable-next-line no-continue
      continue;
    }

    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return hash;
};

export default generateRandomHash;
