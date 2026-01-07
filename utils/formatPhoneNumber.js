const formatPhoneNumber = (phoneNumberString) => {
  const cleaned = (`${phoneNumberString}`).replace(/^(1|\+?\d+\s|)?/, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})(\d*)$/);

  return match
    ? ['(', match[1], ') ', match[2], '-', match[3], match[4]].join('')
    : phoneNumberString;
};

export default formatPhoneNumber;
