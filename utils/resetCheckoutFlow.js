import { toast, TOAST } from './toastify';
import { updateOrder } from '../pages/api';

// return user to beginning of checkout

const resetCheckoutFlow = (cartNumber, cartToken, updateCart) =>
  updateOrder({ order_number: cartNumber, body: { order: { reset: true } } })
  // order object has to be present and not empty.
    .then((order) => {
      if (!order.error) {
        // reset checkout flow
        updateCart(order);
      } else {
        // if all else fails, return to homepage?
        global.location.href = '/';
      }
    })
    .finally(() => {
      toast('There was a problem progressing your order.', { type: TOAST.TYPE.ERROR });
    });

export default resetCheckoutFlow;
