const getCheckoutSubPage = ({ pathname }) => {
  // for Invesp IDs - returns the subpage to be used
  // as a unique identifier for a/b tests
  const subPages = {

    '/checkout': 'review',
    '/checkout/gift-message': 'gift-message',
    '/checkout/payment': 'payment',
    '/checkout/delivery-address': 'delivery-address'
  };

  const subPage = subPages[pathname];

  return subPage && `checkout-${subPage}`;
};

export default getCheckoutSubPage;
