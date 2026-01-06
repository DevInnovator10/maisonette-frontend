import React from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import Router from 'next/router';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Formik } from 'formik';
import { toast, TOAST } from '../../utils/toastify';

import Button from '../../atoms/button';
import AddressForm from '../form-address';
import NewAddressForm from '../form-address-new-checkout';
import { updateAddress, createAddress } from '../../pages/api';
import { setUserProfile } from '../../store/modules/profile/actions';
import removeSearchRecursive from '../../utils/removeSearchRecursive';

const Form = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 2rem;
`;

const StyledButton = styled(Button)`
  outline: 0;

  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    grid-column: -1 / 1;
  }
`;

const CancelButton = styled(Button)`
  grid-column: 1fr;
  outline: 0;
`;

const AddressControls = styled.div`
  display: flex;
  max-width: 350px;
  column-gap: 1rem;
  margin-top: ${(props) => props.theme.modularScale.thirty};

  ${StyledButton}:not([data-id="view-all"]) {
    flex-grow: 2;
  }
`;

const AddressCreateNew = (props) => (
  <Formik
    initialValues={{
      first_name: { search: props.address.firstname || '' },
      last_name: { search: props.address.lastname || '' },
      address1: { search: props.address.address1 || '' },
      address2: { search: props.address.address2 || '' },
      city: { search: props.address.city || '' },
      zipcode: { search: props.address.zipcode || '' },
      phone: { search: props.address.phone || '' },
      country_iso: { search: props.address.country_iso || 'US' },
      state_name: { search: props.address.state_text || '' }
    }}

    initialStatus={{ button: props.buttonText }}

    validationSchema={
        Yup.object().shape({
          first_name: Yup.string().required('First Name is required'),
          last_name: Yup.string().required('Last Name is required'),
          address1: Yup.string().required('Address is required'),
          address2: Yup.string(),
          city: Yup.string().required('City is required'),
          zipcode: Yup.string().required('Zipcode is required'),
          phone: Yup.string().required('Phone number is required'),
          country_iso: Yup.string().required('Country is required'),
          state_name: Yup.string().required('State is required')
        })
      }

    onSubmit={(model, actions) => {
      const isUpdatingAddress = Object.keys(props.address).length;
      const searchRemovedModel = removeSearchRecursive({ ...model });

      actions.setStatus({ button: isUpdatingAddress ? 'Updating Address...' : 'Adding Address...' });

      if (isUpdatingAddress) {
        updateAddress({
          id: props.profile.id,
          address_id: props.address.id,
          body: {
            id: props.address.id,
            default: props.address.default,
            ...searchRemovedModel
          }
        })
          .then((addressResponse) => {
            const addressResponseData = addressResponse?.data ?? addressResponse;
            const { errors } = addressResponseData;
            if (errors) {
              toast('There was a problem updating your address.', { type: TOAST.TYPE.ERROR });
              return;
            }

            /* update user addresses */
            props.setUserProfile({ addresses: addressResponseData });

            toast('Address successfully edited.', { type: TOAST.TYPE.SUCCESS });
            if (props.redirect) Router.push('/account');

            props.onComplete(searchRemovedModel, addressResponseData);
          })
          .finally(() => {
            actions.setSubmitting(false);
            actions.setStatus({ button: props.buttonText });
          });
      } else {
        createAddress({
          id: props.profile.id,
          body: searchRemovedModel
        })
          .then((addressResponse) => {
            const addressResponseData = addressResponse?.data ?? addressResponse;
            const { errors } = addressResponseData;
            if (errors) {
              toast('There was a problem creating the new address.', { type: TOAST.TYPE.ERROR });
              return;
            }

            /* update user addresses */
            props.setUserProfile({ addresses: addressResponseData });

            toast('Address successfully added to your address book.', { type: TOAST.TYPE.SUCCESS });
            Router.push('/account');
          })
          .finally(() => {
            actions.setSubmitting(false);
            actions.setStatus({ button: props.buttonText });
          });
      }
    }}

    validateOnChange
  >
    {({
      status,
      isSubmitting,
      values,
      handleSubmit,
      setFieldValue
    }) => (
      <Form role="form">
        {
          props.newCheckout ? (
            <>
              <NewAddressForm
                setFieldValue={setFieldValue}
                address={props.address}
                values={values}
              />
              <AddressControls>
                <StyledButton type="button" disabled={isSubmitting} onClick={handleSubmit}>
                  {status.button}
                </StyledButton>
                <CancelButton
                  data-test-id="ship-address-book-button"
                  type="button"
                  onClick={() => props.handleOnCancelClick()}
                  outline
                >
                  Cancel
                </CancelButton>
              </AddressControls>
            </>
          ) : (
            <>
              <AddressForm setFieldValue={setFieldValue} address={props.address} values={values} />
              <StyledButton type="button" disabled={isSubmitting} onClick={handleSubmit}>
                {status.button}
              </StyledButton>
            </>
          )
        }
      </Form>
    )}
  </Formik>
);

AddressCreateNew.defaultProps = {
  buttonText: 'Add Address',
  address: {},
  redirect: true,
  onComplete: () => {},
  newCheckout: false
};

AddressCreateNew.propTypes = {
  address: PropTypes.object,
  buttonText: PropTypes.string,
  profile: PropTypes.object.isRequired,
  setUserProfile: PropTypes.func.isRequired,
  redirect: PropTypes.bool,
  onComplete: PropTypes.func,
  newCheckout: PropTypes.bool,
  handleOnCancelClick: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.profile
});

const mapDispatchToProps = (dispatch) => ({
  setUserProfile: (user) => dispatch(setUserProfile(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddressCreateNew);
