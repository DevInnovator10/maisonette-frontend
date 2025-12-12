import React from 'react';
import { render } from '../../utils/tests/testTheming';
import FooterCopy from '.';

let componentWrapper;

const email = 'customercare@maisonette.com';
const phoneUnformatted = '18446247663';
const phoneFormatted = '1 844-624-7663';
const phonePretty = '1 844-MAISONETTE';

describe('a footer copy component', () => {
  beforeEach(() => {
    componentWrapper = render(
      <FooterCopy
        email={email}
        phone={{ formatted: phoneFormatted, unformatted: phoneUnformatted, pretty: phonePretty }}
      />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('displays telephone (both pretty and formatted)', () => {
    const telephone = componentWrapper.getByText('1 844-624-7663', { exact: false });
    const telephonePretty = componentWrapper.getByText('1 844-MAISONETTE', { exact: false });

    expect(telephone === telephonePretty).toEqual(true);
    expect(telephone.href.slice(0, 4)).toEqual('tel:');
  });

  it('displays company hours', () => {
    const companyHours = componentWrapper.getByText('Mon—Fri:', { exact: false });
    expect(companyHours.nodeType === 1).toEqual(true);
  });

  it('displays company email', () => {
    const compayEmail = componentWrapper.getByText('@maisonette.com', { exact: false });
    expect(compayEmail.href.slice(0, 7)).toEqual('mailto:');
  });

  it('has styles', () => {
    const list = componentWrapper.container.querySelector('ul');

    expect(list).toHaveStyle('display: flex');
    expect(list).toHaveStyle('flex-direction: column');
    expect(list).toHaveStyle('text-align: center');

    list.querySelectorAll('li').forEach((listItem) => {
      expect(listItem).toHaveStyle('align-self: center');
      expect(listItem).toHaveStyle('color: #ffffff');
    });

    list.querySelectorAll('a').forEach((itemLink) => {
      expect(itemLink).toHaveStyle('color: #ffffff');
      expect(itemLink).toHaveStyle('display: block');
      expect(itemLink).toHaveStyle('text-decoration: none');
    });
  });
});
