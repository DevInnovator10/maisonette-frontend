const defaultOptions = {
  isRequired: false,
  validations: []
};

const email = (o) => {
  const options = { ...defaultOptions, ...o };
  const v = [...options.validations, 'isEmail'];

  if (options.isRequired) {
    v.push('isExisty');
  }

  return {
    error: 'Please enter a valid Email Address',
    label: `Email Address ${options.isRequired ? '(required)' : ''}`,
    placeholder: 'email@website.com',
    validations: v.length > 0 ? v.join(',') : null
  };
};

const firstName = (o) => {
  const options = { ...defaultOptions, ...o };
  const v = [...options.validations];

  if (options.isRequired) {
    v.push('isExisty');
  }

  return {
    error: 'First name is required',
    label: `First Name ${options.isRequired ? '(required)' : ''}`,
    placeholder: 'John',
    validations: v.length > 0 ? v.join(',') : null
  };
};

const lastName = (o) => {
  const options = { ...defaultOptions, ...o };
  const v = [...options.validations];

  if (options.isRequired) {
    v.push('isExisty');
  }

  return {
    error: 'Last name is required',
    label: `Last Name ${options.isRequired ? '(required)' : ''}`,
    placeholder: 'Smith',
    validations: v.length > 0 ? v.join(',') : null
  };
};

const newPassword = (o) => {
  const options = { ...defaultOptions, ...o };
  const v = ['minLength:6', ...options.validations];

  if (options.isRequired) {
    v.push('isExisty');
  }

  return {
    error: {
      equalsField: 'Passwords must match',
      minLength: 'Password must contain at least 6 characters'
    },
    label: `Password ${options.isRequired ? '(required)' : ''}`,
    placeholder: '••••••••',
    validations: v.length > 0 ? v.join(',') : null
  };
};

const newPasswordConfirm = (o) => {
  const options = { ...defaultOptions, ...o };
  const v = [...options.validations];

  if (options.isRequired) {
    v.push('isExisty');
  }

  return {
    error: 'Passwords must match',
    label: `Password Confirmation ${options.isRequired ? '(required)' : ''}`,
    placeholder: '••••••••',
    validations: v.length > 0 ? v.join(',') : null
  };
};

const password = (o) => {
  const options = { ...defaultOptions, ...o };
  const v = [...options.validations];

  if (options.isRequired) {
    v.push('isExisty');
  }

  return {
    error: 'Password is required',
    label: `Password ${options.isRequired ? '(required)' : ''}`,
    placeholder: '••••••••',
    validations: v.length > 0 ? v.join(',') : null
  };
};

const address1 = (o) => {
  const options = { ...defaultOptions, ...o };
  const v = [...options.validations];

  if (options.isRequired) {
    v.push('isExisty');
  }

  return {
    error: 'Address is required',
    label: `Address ${options.isRequired ? '(required)' : ''}`,
    placeholder: '55 Washington Street',
    validations: v.length > 0 ? v.join(',') : null
  };
};

const address2 = (o) => {
  const options = { ...defaultOptions, ...o };
  const v = [...options.validations];

  if (options.isRequired) {
    v.push('isExisty');
  }

  return {
    error: 'Apartment, suite, or floor is required',
    label: `Apt / Suite / Floor ${options.isRequired ? '(required)' : ''}`,
    placeholder: 'suite # 620',
    validations: v.length > 0 ? v.join(',') : null
  };
};

const city = (o) => {
  const options = { ...defaultOptions, ...o };
  const v = [...options.validations];

  if (options.isRequired) {
    v.push('isExisty');
  }

  return {
    error: 'City is required',
    label: `City ${options.isRequired ? '(required)' : ''}`,
    placeholder: 'Brooklyn',
    validations: v.length > 0 ? v.join(',') : null
  };
};

const state = (o) => {
  const options = { ...defaultOptions, ...o };
  const v = [...options.validations];

  if (options.isRequired) {
    v.push('isExisty');
  }

  return {
    error: 'State is required',
    label: `State ${options.isRequired ? '(required)' : ''}`,
    placeholder: '',
    validations: v.length > 0 ? v.join(',') : null
  };
};

const country = (o) => {
  const options = { ...defaultOptions, ...o };
  const v = [...options.validations];

  if (options.isRequired) {
    v.push('isExisty');
  }

  return {
    error: 'Country is required',
    label: `Country ${options.isRequired ? '(required)' : ''}`,
    placeholder: '',
    validations: v.length > 0 ? v.join(',') : null
  };
};

const zipcode = (o) => {
  const options = { ...defaultOptions, ...o };
  const v = [...options.validations];

  if (options.isRequired) {
    v.push('isExisty');
  }

  return {
    error: 'Zipcode is required',
    label: `Zipcode ${options.isRequired ? '(required)' : ''}`,
    placeholder: '11201',
    validations: v.length > 0 ? v.join(',') : null
  };
};

const phone = (o) => {
  const options = { ...defaultOptions, ...o };
  const v = [...options.validations];

  if (options.isRequired) {
    v.push('isExisty');
  }

  return {
    error: 'Phone number is required',
    label: `Phone number ${options.isRequired ? '(required)' : ''}`,
    placeholder: '1 (844) 624-7663',
    validations: v.length > 0 ? v.join(',') : null
  };
};

export default {
  address1,
  address2,
  city,
  country,
  email,
  firstName,
  lastName,
  newPassword,
  newPasswordConfirm,
  password,
  phone,
  state,
  zipcode
};
