import React from 'react';
import { render } from '../../utils/tests/testTheming';
import ProductWaitlist from '.';
import { ProductProvider } from '../../utils/context/product-provider';

let componentWrapper;
let componentElement;

describe('a product waitlist form', () => {
  beforeEach(() => {
    componentWrapper = render(
      <ProductProvider value={{}}>
        <ProductWaitlist active={false} onSubmit={() => {}} />
      </ProductProvider>
    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('renders inactive by default', () => {
    expect(componentElement.querySelector('form')).toHaveStyle('max-height: 0');
  });

  it('is visible when active', () => {
    const component = render(
      <ProductProvider value={{}}>
        <ProductWaitlist onSubmit={() => {}} active />
      </ProductProvider>
    );

    expect(component.container.firstChild.querySelector('form')).toHaveStyle('max-height: 0px');
  });

  it('has submit button', () => {
    const button = componentWrapper.getByText('Email when Available');
    expect(button).toBeDefined();
  });

  it('has submit email input', () => {
    const input = componentElement.querySelector('input[type="email"]');
    expect(input).toBeDefined();
  });
});
