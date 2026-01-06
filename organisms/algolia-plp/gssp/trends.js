const gssp = (context) => {
    const { query: { trend = '' } } = context;
  return { trend };
};

export default gssp;
