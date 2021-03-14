const formatString = (type, string) => {
  if (type === 'capitalize') {
    const unformattedString = string?.split?.('-')?.join?.(' ');
    const capitalizedFirstLetters = unformattedString?.replace?.(/\w\S*/g, (w) => (w?.replace?.(/^\w/, (c) => c?.toUpperCase?.())));
    return capitalizedFirstLetters ?? string;

  }
  return string;
};

export default formatString;
