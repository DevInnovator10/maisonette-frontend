const options = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
};

const dateToString = (date, format = null) => {
  if (format === 'YYYY-MM-DD') {
    return new Date(date).toISOString()?.split('T')?.[0];
  }

  if (format === 'short-m-d-y') {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  }
  return new Date(date).toLocaleDateString('en-US', options);
};

export default dateToString;
