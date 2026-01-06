import { formatMoney } from 'accounting-js';

const calculateInstallments = (amount = null) => {
    if (amount) {
    const split = +amount / 4;
    const rounded = Math.ceil(split * 100) / 100;
    const formatted = formatMoney(rounded, { precision: 2 });
    return formatted;
  }
  return false;
};

export default calculateInstallments;
