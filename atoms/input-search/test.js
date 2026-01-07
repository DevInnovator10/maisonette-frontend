import React from 'react';
import { render } from '../../utils/tests/testTheming';
import InputSearch from '.';

let wrapper;
let elem;

describe('an input type of search', () => {
  beforeEach(() => {
    wrapper = render(<InputSearch id="search-1" type="search" placeholder="Search brands..." />);
    elem = wrapper.container;
  });
  it('renders correctly', () => {
    expect(
      elem.querySelector('input')
        .nodeType === 1
    ).toEqual(true);

    expect(wrapper).toMatchSnapshot();
  });
  it('renders with id', () => {
    expect(
      elem.querySelector('#search-1')
        .nodeType === 1
    ).toEqual(true);
  });
  it('renders with placeholder', () => {
    expect(
      elem.querySelector('input')
        .getAttribute('placeholder')
    ).toEqual('Search brands...');
  });
  it('renders with correct type', () => {
    expect(
      elem.querySelector('input')
        .getAttribute('type')
    ).toEqual('search');
  });
  it('has default styles', () => {
    const styles = global.window.getComputedStyle(elem.firstChild);
    expect(styles['font-family']).toEqual('GT Walsheim Web,Helvetica,Trebuchet MS,sans-serif');
    expect(elem.firstChild).toHaveStyle('font-size: 1.3rem');
    expect(elem.firstChild).toHaveStyle('padding: 6px 6px 6px 31px');
    expect(elem.firstChild).toHaveStyle('box-sizing: border-box');
    expect(elem.firstChild).toHaveStyle('height: 4rem');
    expect(elem.firstChild).toHaveStyle('width: 100%');
  });
});
