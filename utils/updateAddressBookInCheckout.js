import { toast, TOAST } from './toastify';
import { createAddress, updateAddress } from '../pages/api';
import { logAmplitude } from './amplitude';
import { isSameAddress } from './formatAddressForValidation';
import removeDuplicates from './removeDuplicates';

const updateAddressBookInCheckout = (addresses, props, response) => {
  const promises = addresses.map((add) => {
    if (add && Object.prototype.hasOwnProperty.call(add, 'address1')) {
      const { country, state, ...rest } = add;
      return createAddress({ body: rest, id: props.user.id });
    }

    if (add && typeof add === 'string') {
      const userAddress = props.user?.addresses?.find?.(

          (address) => address.id === +add);

      if (userAddress && !isSameAddress(response.ship_address, userAddress)) {
        const {
          id, state, country, ...rest
        } = response.ship_address;

        return updateAddress({
          id: props.user.id,
          address_id: +add,
          body: {
            id: +add,
            default: userAddress.default,
            ...rest
          }
        });
      }
    }

    return false;
  }).filter(Boolean);

  Promise.all(promises)
    .then(async (addressResponses) => {
      addressResponses.forEach((addressResponse) => {
        const addressResponsesData = addressResponse?.data ?? addressResponse;
        const responseAddresses = [];

        addressResponsesData.forEach((addressRes) => {
          responseAddresses.push(addressRes?.data ?? addressRes);
        });

        const errors = responseAddresses
          .map((responseAddress) => responseAddress.errors);

        if (errors.some(Boolean)) {
          const errorMessage = 'There was a problem updating your address book.';
          toast(errorMessage, { type: TOAST.TYPE.ERROR });
          logAmplitude('Encountered Transaction Error', {
            message: errorMessage,
            step: 'address'
          });
          return;
        }

        const newAddresses = removeDuplicates(addressResponsesData, 'id');
        props.setUserProfile({ addresses: newAddresses });
        toast('Address book successfully updated.',
          { type: TOAST.TYPE.SUCCESS });
      });
    });
};

export default updateAddressBookInCheckout;
