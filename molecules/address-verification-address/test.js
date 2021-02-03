import React from 'react';
import { render } from '../../utils/tests/testTheming';
import AddressVerificationAddress from '.';

describe('an address verification address suggested address', () => {
    let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <AddressVerificationAddress
        isRadio
        selectedAddress="suggested"
        heading="suggested"
        address={{
          street1: '495 GREENE AVE APT 2R',
          street2: '',
          city: 'BROOKLYN',

          country: 'US',
          state: 'NY',
          zip: '11216-6466'
        }}
        differences={['street1']}
      />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('renders as a radio input and is selected by default', () => {
    const input = componentWrapper.getByLabelText('SUGGESTED ADDRESS', { exact: false });
    expect(input).toBeDefined();
    expect(input.tagName).toBe('INPUT');
    expect(input.type).toBe('radio');
    expect(input.checked).toBe(true);
  });

  it('renders correct heading', () => {
    const heading = componentWrapper.getByText('SUGGESTED ADDRESS');
    expect(heading).toBeDefined();
    expect(heading.tagName).toBe('P');
  });

  it('highlights the difference in addresses', () => {
    const street1 = componentWrapper.getByText('495 GREENE AVE APT 2R');
    expect(street1).toBeDefined();
    expect(street1.tagName).toBe('STRONG');
    expect(street1).toHaveStyle('background: #F0E4E3');
    expect(street1).toHaveStyle('color: #C04318');
  });
});

describe('an address verification address original address', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <AddressVerificationAddress
        isRadio
        selectedAddress="suggested"
        heading="original"
        address={{
          street1: '495 Greene Ave',
          street2: '2R',
          city: 'Brooklyn',
          country: 'US',
          state: 'NY',
          zip: '11216'
        }}
        differences={[]}
      />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('renders as a radio input and is not selected by default', () => {
    const input = componentWrapper.getByLabelText('ORIGINAL ADDRESS', { exact: false });
    expect(input).toBeDefined();
    expect(input.tagName).toBe('INPUT');
    expect(input.type).toBe('radio');
    expect(input.checked).toBe(false);
  });

  it('renders correct heading', () => {
    const heading = componentWrapper.getByText('ORIGINAL ADDRESS');
    expect(heading).toBeDefined();
    expect(heading.tagName).toBe('P');
  });
});

describe('an address verification address provided address', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <AddressVerificationAddress
        heading="provided"
        address={{
          street1: '495 Greene Ave',
          street2: '2R',
          city: 'Brooklyn',
          country: 'US',
          state: 'NY',
          zip: '11216'
        }}
      />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('does not render as a radio input', () => {
    const div = componentWrapper.container.firstChild;
    const radio = div.querySelectorAll('input');
    expect(radio.length).toBe(0);
  });

  it('renders correct heading', () => {
    const heading = componentWrapper.getByText('PROVIDED ADDRESS');
    expect(heading).toBeDefined();
    expect(heading.tagName).toBe('P');
  });
});
