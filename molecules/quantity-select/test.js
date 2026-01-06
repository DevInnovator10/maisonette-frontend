import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from '../../utils/tests/testTheming';
import QuantitySelect from '.';

let wrapper;
let select;

describe('a quantity select', () => {
  beforeEach(() => {
    wrapper = render(<QuantitySelect stock={10} selected={1} />).container;
    select = wrapper.querySelector('select');
  });

  it('renders correctly', () => {
    expect(
      wrapper.nodeType === 1
    ).toEqual(true);

    expect(wrapper).toMatchSnapshot();
  });

  it('has proper number of options', () => {
    expect(select.options.length).toEqual(10);
  });

  it('properly selects new quantity', () => {
    fireEvent.change(select, {
      target: { value: '2' }
    });

    expect(select.value).toEqual('2');
  });

  it('has styles', () => {
    expect(select).toHaveStyle('position: relative');

    expect(select).toHaveStyle('background-color: transparent');
    expect(select).toHaveStyle('border: 0');
    expect(select).toHaveStyle('color: #3150A2');
    expect(select).toHaveStyle('cursor: pointer');
    expect(select).toHaveStyle('height: 100%');
    expect(select).toHaveStyle('padding-right: 1.5rem');
    expect(select).toHaveStyle('position: relative');
  });
});
