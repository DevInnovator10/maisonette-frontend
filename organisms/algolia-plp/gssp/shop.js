const gssp = (context) => {
    const { query: { w = null } } = context;

  return { query: w };
};

export default gssp;
