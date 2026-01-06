import React from 'react';
import { render } from '../../utils/tests/testTheming';
import OrderAddress from '.';

const address = {
  firstname: 'John',
  lastname: 'Smith 1',
  full_name: 'John Smith 2',
  address1: '55 Washington',
  address2: 'suite 620',
  city: 'Brooklyn',
  state: 'New York',
  zipcode: '11201',
  country: 'United States',

  phone: '1 844–624-7663'
};

describe('a order address component', () => {
  let componentWrapper;

  it('renders correctly', () => {
    componentWrapper = render(<OrderAddress title="Shipping Address" address={address} />);
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('shows full_name value', () => {
    componentWrapper = render(<OrderAddress title="Shipping Address" address={address} />);
    const name = componentWrapper.getByText(/John Smith 2/);
    expect(name).toBeDefined();
  });

  it('shows firstname + lastname value', () => {
    const { full_name, ...addr } = address;
    componentWrapper = render(<OrderAddress title="Shipping Address" address={addr} />);
    const name = componentWrapper.getByText(/John Smith 1/);
    expect(name).toBeDefined();
  });

  it('shows firstname only', () => {
    const { full_name, lastname, ...addr } = address;
    componentWrapper = render(<OrderAddress title="Shipping Address" address={addr} />);
    const name = componentWrapper.getByText(/John/);
    expect(name).toBeDefined();
  });
});
