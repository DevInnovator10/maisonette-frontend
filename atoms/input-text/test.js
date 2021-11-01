import React from 'react';
import { render } from '../../utils/tests/testTheming';
import InputText from '.';

let wrapper;

describe('an input type of text', () => {
    beforeEach(() => {
    wrapper = render(<InputText id="text-1" type="text" placeholder="Input text placeholder" />);
  });
  it('renders correctly', () => {
    expect(
      wrapper.container.querySelector('input')
        .nodeType === 1
    ).toEqual(true);

    expect(wrapper).toMatchSnapshot();
  });
  it('is targetable via ID', () => {
    expect(
      wrapper.container.querySelector('#text-1')
        .nodeType === 1
    ).toEqual(true);
  });
  it('renders with type', () => {
    expect(
      wrapper.container.querySelector('input')
        .getAttribute('type')
    ).toEqual('text');
  });
  it('renders with placeholder', () => {
    expect(
      wrapper.container.querySelector('input')
        .getAttribute('placeholder')
    ).toEqual('Input text placeholder');

  });
  it('has style properties', () => {
    const styles = global.window.getComputedStyle(wrapper.container.firstChild);
    expect(styles['font-family']).toEqual('GT Walsheim Web,Helvetica,Trebuchet MS,sans-serif');
    expect(wrapper.container.firstChild).toHaveStyle('background: #FAEFD9');
    expect(wrapper.container.firstChild).toHaveStyle('box-sizing: border-box');
    expect(wrapper.container.firstChild).toHaveStyle('color: #3150A2');
    expect(wrapper.container.firstChild).toHaveStyle('font-size: 1.2rem');
    expect(wrapper.container.firstChild).toHaveStyle('height: 4rem');
    expect(wrapper.container.firstChild).toHaveStyle('letter-spacing: 0.04em');
    expect(wrapper.container.firstChild).toHaveStyle('padding: 0 15px');
    expect(wrapper.container.firstChild).toHaveStyle('width: 100%');
  });
});
