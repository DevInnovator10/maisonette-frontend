import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Typography from '../../atoms/typography';

import theme from '../../theme/theme';
import FormField from '../../molecules/formik-input';
import FormSelect from '../../molecules/formik-select';

import ALL_COUNTRIES from '../../utils/countries/countries.json';
import CA_STATES from '../../utils/states/ca_states.json';
import US_STATES from '../../utils/states/us_states.json';
import PHONE_DATA from '../../utils/countries/phone_codes';

import { useScript } from '../../utils/hooks/index';
import removeSearchRecursive from '../../utils/removeSearchRecursive';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${(props) => props.theme.modularScale.twenty};
  
  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InnerWrapper = styled.div`
  display: grid;
  grid-gap: ${(props) => props.theme.modularScale.twenty};

  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    grid-column 1 / span 2;
    grid-template-columns: repeat(4, 1fr);
  }
`;

const LocationSelect = styled(FormSelect)`
  &>label {
    letter-spacing: inherit;
  }
`;

const PhoneWrapper = styled.span`
  position: relative;
`;

const CountrySelect = styled.select`
  height: 100%;
  width: 100%;
`;

const CountryLabel = styled.label`
  height: 3.4rem;
  left: 0;
  margin-left: 1rem;
  transform: translateY(-50%);
  position: absolute;
  top: calc(50% + 1.6rem);
  width: 7rem;
  z-index: 1;
  > span {
    align-items: center;
    ${(props) => props.theme.arrow('down', props.theme.color.brand, 'right calc(1.5rem - 5px) center')}
    background-color: ${((props) => props.theme.color.backgroundLightBlue)};
    box-sizing: border-box;
    border-radius: 0;
    border: 0;
    color: ${(props) => props.theme.color.brand};
    display: flex;
    font-family: ${(props) => props.theme.font.sans};
    font-size: ${(props) => props.theme.modularScale.small};
    height: 100%;
    left: 0;
    letter-spacing: 0.04em;
    outline: 0;
    outline-color: ${(props) => props.theme.color.brandLight};
    padding-right: 3rem;
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 100%;
    white-space: nowrap;
  }
`;

const ShippingCountry = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  font-size: ${(props) => props.theme.modularScale.eighteen};
  white-space: nowrap;
  padding-top: 1rem;
  line-height: 3rem;
`;

const getValues = (values, name) => {
  const returnValues = name ? name.split('.').reduce((o, i) => o[i], values) : values;
  return removeSearchRecursive({ ...returnValues });
};

const Form = (props) => {
  const phoneNumber = typeof props.values.phone === 'object' ? props.values.phone.search : props.values.phone;
  const countryPrefix = phoneNumber ? phoneNumber.trim().split(' ')[0]?.replace('+', '') : null;
  const currentPhone = (
    countryPrefix
      ? PHONE_DATA.find((c) => c.Dial.replace('+', '') === countryPrefix && c.Iso2 !== 'CA')
      : PHONE_DATA.find((c) => c.Iso3 === 'USA')
  );
  const currentPhoneCountry = currentPhone ? currentPhone.Iso3 : 'USA';
  const currentPhoneIcon = currentPhone ? currentPhone.Unicode : '🇺🇸';
  const currentPhoneMask = currentPhone ? ['+', ...currentPhone.Dial, ' ', ...currentPhone.Mask] : '+1 (999) 999-9999';

  const [loaded, error] = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GMAPS_KEY}&libraries=places`
  );
  const [isMobile] = useState(global.window
    ? global.window.matchMedia(`(max-width: ${theme.breakpoint.max('medium')})`).matches
    : true);
  const [type] = useState(props.name ? `${props.name.split('.')[0]} ` : '');
  const [phoneCountry, setPhoneCountry] = useState(currentPhoneCountry);
  const [phoneIcon, setPhoneIcon] = useState(currentPhoneIcon);
  const [phoneMask, setPhoneMask] = useState(currentPhoneMask);
  const [phonePermanents, setPhonePermanents] = useState([0, 1]);

  const getName = (key) => (props.name ? `${props.name}.${key}.search` : `${key}.search`);

  const addressRef = useRef();

  const fillInAddress = (autocomplete) => {
    const place = autocomplete.getPlace();
    const addressTypes = place.address_components
      .map((a) => a.types)
      .reduce((a, b) => a.concat(b), []);

    const hasLocality = addressTypes.includes('locality');

    props.setFieldValue(getName('address1'), place.name);

    for (let i = 0; i < place.address_components.length; i++) {
      const addressComponent = place.address_components[i];
      const addressType = place.address_components[i].types[0];

      if (addressType === 'locality') props.setFieldValue(getName('city'), addressComponent.long_name);
      if (addressType === 'sublocality_level_1' && !hasLocality) props.setFieldValue(getName('city'), addressComponent.long_name);
      if (addressType === 'administrative_area_level_1') props.setFieldValue(getName('state_name'), addressComponent.short_name);
      if (addressType === 'postal_code') props.setFieldValue(getName('zipcode'), addressComponent.short_name);
      if (addressType === 'country') props.setFieldValue(getName('country_iso'), addressComponent.short_name);
    }
  };

  const isAddressValid = () => (value) => {
    let errorMessage;

    if (!/(^(?!(?:p\W?b?o.*\d)|(?:bin)|(?:post office)).*$)/igm.test(value)) {
      errorMessage = (
        <>
          Sorry, we cannot ship to p.o. boxes.
          If you believe this to be an error,
          please contact
          {' '}
          <a href="tel:18446247663">customer service</a>
          .
        </>
      );
    }

    return errorMessage;
  };

  const getMask = (countryIso) => {
    if (!countryIso || PHONE_DATA.length <= 0) {
      return false;
    }
    const { Mask, Dial, Unicode } = PHONE_DATA.find((c) => c.Iso3 === countryIso);
    props.setFieldValue('phone', '');
    setPhoneCountry(countryIso);
    setPhoneIcon(Unicode);
    const mask = ['+', ...Dial, ' ', ...Mask];
    setPhoneMask(mask);
    setPhonePermanents(mask.map((x, i) => (typeof x === 'string' ? i : null)).filter((x) => x !== null));
    return true;
  };

  const renderStateOptions = () => {
    const { country_iso } = getValues(props.values, props.name);
    const STATES = country_iso === 'CA' ? CA_STATES : US_STATES;
    return (
      Object.entries(STATES)
        .map((state) => <option key={state[0]} value={state[0]}>{state[1]}</option>)
    );
  };

  const renderCountryOptions = () => (
    ALL_COUNTRIES.countries
      .map((country) => <option key={country.iso} value={country.iso}>{country.name}</option>)
  );

  useEffect(() => {
    if (props.setFieldValue && loaded && !error && global.google && addressRef.current) {
      const elem = global.document.getElementById(addressRef.current.id);
      const autocomplete = new global.google.maps.places.Autocomplete(elem, { types: ['geocode'] });

      if (!props.isBilling) autocomplete.setComponentRestrictions({ country: 'US' });

      setTimeout(() => {
        // using time out to ensure this happens (google places autocomplete sets this to "off")
        // this gives the autocomplete some time to happen, then sets the proper value
        if (elem) elem.setAttribute('autocomplete', `${type}address-line1`);
      }, 250);

      autocomplete.addListener('place_changed', () => fillInAddress(autocomplete));
    }
  }, [loaded]);

  // In the future, it may be beneficial to split up shipping and billing
  return (
    <>
      {
        !props.isBilling && (
          <Wrapper data-test-id={`${type.trim()}-address-form`}>
            <FormField name={getName('first_name')} label="First name" required autoComplete={`${type}given-name`} newCheckout />

            <FormField name={getName('last_name')} label="Last name" required autoComplete={`${type}family-name`} newCheckout />

            <FormField ref={addressRef} name={getName('address1')} label="Street address" validate={isAddressValid} required autoComplete={`${type}address-line1`} newCheckout />

            <FormField name={getName('address2')} label="Apt, Suite, Floor, etc." autoComplete={`${type}address-line2`} newCheckout />

            <InnerWrapper>
              <FormField name={getName('city')} label="City" required autoComplete={`${type}address-level2`} newCheckout />

              <LocationSelect name={getName('state_name')} label="State" defaultValue="" required autoComplete={`${type}address-level1`} newCheckout>
                <option value="" disabled> </option>
                { renderStateOptions() }
              </LocationSelect>

              <FormField name={getName('zipcode')} label="Zipcode" max={10} required autoComplete={`${type}postal-code`} newCheckout />

              <ShippingCountry element="p" like="paragraph-4">
                Country
                <br />
                🇺🇸 United States
              </ShippingCountry>
            </InnerWrapper>

              {/* Put the country code here, and then based on the country code, set the mask. */}
            <PhoneWrapper>
              <CountryLabel newCheckout>
                <span>{`${phoneCountry} ${phoneIcon}`}</span>
                <CountrySelect
                  name={getName('country_phone')}
                  label="Country Phone"
                  value={phoneCountry}
                  onChange={(e) => getMask(e.target.value)}
                  // fake autoComplete value to trick Chrome autofill into ignoring input
                  autoComplete="no-autocomplete"
                >
                  {PHONE_DATA.map((d) => (
                    <option key={d.Iso3} value={d.Iso3}>{`${d.Name} ${d.Unicode}`}</option>
                  ))}
                </CountrySelect>
              </CountryLabel>

              <FormField
                mask={phoneMask}
                permanent={phonePermanents}
                mobileView={isMobile}
                setFieldValue={props.setFieldValue}
                name={getName('phone')}
                type="tel"
                label="Phone number"
                required
                autoComplete={`${type}tel`}
                newCheckout
              />
            </PhoneWrapper>
          </Wrapper>
        )
      }

      {
        props.isBilling && (
          <Wrapper data-test-id={`${type.trim()}-address-form`}>
            <FormField name={getName('first_name')} label="First Name" required autoComplete={`${type}given-name`} newCheckout />

            <FormField name={getName('last_name')} label="Last Name" required autoComplete={`${type}family-name`} newCheckout />

            <FormField ref={addressRef} name={getName('address1')} label="Street address" validate={isAddressValid} required autoComplete={`${type}address-line1`} newCheckout />

            <FormField name={getName('address2')} label="Apt, Suite, Floor, etc." autoComplete={`${type}address-line2`} newCheckout />

            <InnerWrapper>
              <FormField name={getName('city')} label="City" required autoComplete={`${type}address-level2`} newCheckout />

              <FormField name={getName('state_name')} label="State" autoComplete={`${type}address-level1`} newCheckout />

              <FormField name={getName('zipcode')} label="Zipcode" max={10} required autoComplete={`${type}postal-code`} newCheckout />

              <LocationSelect name={getName('country_iso')} label="Country" defaultValue="" required autoComplete={`${type}country`} newCheckout>
                <option value="" disabled> </option>
                {renderCountryOptions()}
              </LocationSelect>
            </InnerWrapper>
              {/* Put the country code here, and then based on the country code, set the mask. */}
            <PhoneWrapper>
              <CountryLabel newCheckout>
                <span>{`${phoneCountry} ${phoneIcon}`}</span>
                <CountrySelect
                  name={getName('country_phone')}
                  label="Country Phone"
                  value={phoneCountry}
                  onChange={(e) => getMask(e.target.value)}
                    // fake autoComplete value to trick Chrome autofill into ignoring input
                  autoComplete="no-autocomplete"
                >
                  {PHONE_DATA.map((d) => (
                    <option key={d.Iso3} value={d.Iso3}>{`${d.Name} ${d.Unicode}`}</option>
                  ))}
                </CountrySelect>
              </CountryLabel>

              <FormField
                mask={phoneMask}
                permanent={phonePermanents}
                mobileView={isMobile}
                setFieldValue={props.setFieldValue}
                name={getName('phone')}
                type="tel"
                label="Phone number"
                required
                autoComplete={`${type}tel`}
                newCheckout
              />
            </PhoneWrapper>
          </Wrapper>
        )
      }
    </>
  );
};

Form.defaultProps = {
  name: '',
  setFieldValue: false,
  isBilling: false
};

Form.propTypes = {
  name: PropTypes.string,
  values: PropTypes.object.isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  isBilling: PropTypes.bool
};

export default Form;
