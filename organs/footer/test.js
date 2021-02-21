import React from 'react';
import { act } from '@testing-library/react';
import { render } from '../../utils/tests/testTheming';
import Footer from '.';

let componentWrapper;

describe('the footer', () => {
  beforeEach(async () => {
    await act(async () => {
      componentWrapper = await render(<Footer />);
    });
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('renders "Customer Care" link', () => {
    const elem = componentWrapper.getAllByText('Customer Care')[0];
    const href = elem.getAttribute('href');
    expect(elem).toBeDefined();
    expect(href).toEqual('/faq');
  });

  it('renders "Shipping & Delivery" link', () => {
    const elem = componentWrapper.getByText('Shipping & Delivery');
    const href = elem.getAttribute('href');
    expect(elem).toBeDefined();
    expect(href).toEqual('/delivery');
  });

  it('renders "F.A.Q.s" link', () => {
    const elem = componentWrapper.getByText('F.A.Q.s');
    const href = elem.getAttribute('href');
    expect(elem).toBeDefined();
    expect(href).toEqual('/faq');
  });

  it('renders "Privacy Policy" link', () => {
    const elem = componentWrapper.getByText('Privacy Policy');
    const href = elem.getAttribute('href');
    expect(elem).toBeDefined();
    expect(href).toEqual('/privacy');
  });

  it('renders "Terms & Conditions" link', () => {
    const elem = componentWrapper.getByText('Terms & Conditions');
    const href = elem.getAttribute('href');
    expect(elem).toBeDefined();
    expect(href).toEqual('/terms');
  });

  it('renders "Contact Us" link', () => {
    const elem = componentWrapper.getAllByText('Contact Us')[0];
    const href = elem.getAttribute('href');
    expect(elem).toBeDefined();
    expect(href).toEqual('/contact');
  });

  it('renders "Company" link', () => {
    const elem = componentWrapper.getByText('Company');
    const href = elem.getAttribute('href');
    expect(elem).toBeDefined();
    expect(href).toEqual('/about');
  });

  it('renders "About" link', () => {
    const elem = componentWrapper.getByText('About');
    const href = elem.getAttribute('href');
    expect(elem).toBeDefined();
    expect(href).toEqual('/about');
  });

  it('renders "Careers" link', () => {
    const elem = componentWrapper.getByText('Careers');
    const href = elem.getAttribute('href');
    expect(elem).toBeDefined();
    expect(href).toEqual('/careers');
  });

  it('renders "Partner With Us" link', () => {
    const elem = componentWrapper.getByText('Partner With Us');
    const href = elem.getAttribute('href');
    expect(elem).toBeDefined();
    expect(href).toEqual('/partner');
  });

  it('renders "Press', () => {
    const elem = componentWrapper.getByText('Press');
    const href = elem.getAttribute('href');
    expect(elem).toBeDefined();
    expect(href).toEqual('/press');
  });

  it('renders "Accessibility', () => {
    const elem = componentWrapper.getByText('Accessibility');
    const href = elem.getAttribute('href');
    expect(elem).toBeDefined();
    expect(href).toEqual('/accessibility');
  });

  it('renders "Returns Guide', () => {
    const elem = componentWrapper.getByText('Returns Guide');
    const href = elem.getAttribute('href');
    expect(elem).toBeDefined();
    expect(href).toEqual('/returns-guide');
  });
});
