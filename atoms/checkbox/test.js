import React from 'react';
import { render } from '../../utils/tests/testTheming';
import Checkbox from '.';

let wrapper;

describe('an input type of checkbox', () => {
  beforeEach(() => {
    wrapper = render(<Checkbox id="checkbox" name="checkbox" value="checkbox">checkbox</Checkbox>);
  });

  it('renders correctly', () => {
    expect(
      wrapper.container.querySelector('input')
        .nodeType === 1
    ).toEqual(true);

    expect(wrapper).toMatchSnapshot();
  });

  it('renders with id', () => {
    expect(
      wrapper.container.querySelector('#checkbox')
        .nodeType === 1
    ).toEqual(true);
  });

  it('renders with name', () => {
    expect(
      wrapper.container.querySelector('[name="checkbox"]')
        .nodeType === 1
    ).toEqual(true);
  });

  it('renders with type', () => {
    expect(
      wrapper.container.querySelector('input')
        .getAttribute('type')
    ).toEqual('checkbox');
  });

  it('has style properties', () => {
    const styles = global.window.getComputedStyle(wrapper.container.firstChild);
    expect(styles['font-family']).toEqual('GT Walsheim Web,Helvetica,Trebuchet MS,sans-serif');
    expect(wrapper.container.firstChild).toHaveStyle('color: #3150A2');
    expect(wrapper.container.firstChild).toHaveStyle('cursor: pointer');
    expect(wrapper.container.firstChild).toHaveStyle('display: block');
    expect(wrapper.container.firstChild).toHaveStyle('font-size: 1.2rem');
    expect(wrapper.container.firstChild).toHaveStyle('line-height: 18px');
    expect(wrapper.container.firstChild).toHaveStyle('padding-left: 2em');
    expect(wrapper.container.firstChild).toHaveStyle('position: relative');
  });
});
