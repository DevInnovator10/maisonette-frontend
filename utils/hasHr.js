const hasHr = (data) => {
  const keys = Object.keys(data);
  const hrKeys = keys.filter((key) => key.includes('_hr'));
  const trueKeys = hrKeys.filter((key) => data[key]);
  return trueKeys.length !== 0;
};

export default hasHr;
