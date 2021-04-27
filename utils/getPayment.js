import { formatMoney } from 'accounting-js';

const getPaymentAmount = (payment) => `${payment.amount !== undefined && +payment.amount > 0 ? `(${formatMoney(payment.amount)})` : ''}`;

const getPayment = (payment, summary = false) => {
  const method = payment.payment_method.name;
  let str = `${method} ${summary ? '' : getPaymentAmount(payment)}`;

  if (method === 'Credit Card') {
    str = `${method} ${payment.source.cc_type && payment.source.cc_type.toUpperCase()}, Ending in ${payment.source.last_digits} ${summary ? '' : getPaymentAmount(payment)}`;
  }

  if (method === 'Store Credit') {
    str = `${method} ${getPaymentAmount(payment)}`;
  }

  if (method === 'Braintree') {
    const paymentType = payment.source.payment_type;

    switch (paymentType) {
      case 'CreditCard':
        str = summary
          ? `CC ending in ${payment.source.last_digits}`
          : `Credit Card ${payment.source.cc_type && payment.source.cc_type.toUpperCase()}, Ending in ${payment.source.last_digits} ${getPaymentAmount(payment)}`;
        break;

      case 'PayPalAccount':
        str = `PayPal ${payment.source.email ?? ''} ${summary ? '' : getPaymentAmount(payment)}`;
        break;

      case 'ApplePayCard':
        str = summary
          ? `Apple Pay ${payment.source.cc_type && payment.source.cc_type.split(' - ')[1].toUpperCase()} ending in ${payment.source.last_digits}`
          : `Apple Pay ${payment.source.cc_type && payment.source.cc_type.split(' - ')[1].toUpperCase()}, Ending in ${payment.source.last_digits} ${payment.amount !== undefined ? `(${formatMoney(payment.amount)})` : ''}`;
        break;

      default:
        break;
    }
  }

  return str;
};

export default getPayment;
