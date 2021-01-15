const calculateLeadTime = (leadTime) => {
    const n = parseInt(leadTime, 10);
  const days = Math.floor(n % 7);
  const weeks = Math.floor(n / 7);

  if (n === 1) return '1 day';

  if (n === 7) return '1 week';

  if (weeks < 1) return `${days} ${days === 1 ? 'day' : 'days'}`;
  if (days < 1) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;

  return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} and ${days} ${days === 1 ? 'day' : 'days'}`;
};

export default calculateLeadTime;
