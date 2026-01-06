import getCookie from './getCookie';
import { getCart, getCurrentCart } from '../pages/api';

const getCartAfterError = async () => {
  // Re-fetches order data using cookies.
  // Useful if there is an error that causes issues with an order's state,
  // which is not handled on the FE.

  // checks for userToken to use different function
  // to get cart for user and guest
  const userToken = getCookie('maisonette_user_token');
  const orderToken = getCookie('maisonette_order_token');
  const orderNumber = getCookie('maisonette_order_number');
  if (userToken) {
    return getCurrentCart();
  } if (orderToken && orderNumber) {
    return getCart({ order_number: orderNumber });
  }
  return false;
};

export default getCartAfterError;
