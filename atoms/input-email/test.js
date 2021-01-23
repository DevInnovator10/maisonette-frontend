import React from 'react';
import { render } from '../../utils/tests/testTheming';
import InputEmail from '.';

let wrapper;
let elem;

describe('an input type of email', () => {
  beforeEach(() => {
    wrapper = render(<InputEmail id="email-1" type="email" placeholder="Input email placeholder" />);
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
      elem.querySelector('#email-1')
        .nodeType === 1
    ).toEqual(true);
  });
  it('renders with placeholder', () => {
    expect(
      elem.querySelector('input')
        .getAttribute('placeholder')
    ).toEqual('Input email placeholder');
  });
  it('renders with type', () => {

    expect(
      elem.querySelector('input')
        .getAttribute('type')
    ).toEqual('email');
  });
  it('has style properties', () => {
    const styles = global.window.getComputedStyle(elem.firstChild);
    expect(styles['font-family']).toEqual('GT Walsheim Web,Helvetica,Trebuchet MS,sans-serif');
    expect(elem.firstChild).toHaveStyle('background: #FAEFD9');
    expect(elem.firstChild).toHaveStyle('box-sizing: border-box');
    expect(elem.firstChild).toHaveStyle('color: #3150A2');
    expect(elem.firstChild).toHaveStyle('font-size: 1.2rem');
    expect(elem.firstChild).toHaveStyle('height: 4rem');
    expect(elem.firstChild).toHaveStyle('letter-spacing: 0.04em');
    expect(elem.firstChild).toHaveStyle('padding: 0 15px');
    expect(elem.firstChild).toHaveStyle('width: 100%');
  });
});

describe('a transparent underlined input of email', () => {
  beforeEach(() => {
    wrapper = render(<InputEmail underline id="email-2" type="email" placeholder="Email Login" />);
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
      elem.querySelector('#email-2')
        .nodeType === 1
    ).toEqual(true);
  });
  it('renders with placeholder', () => {
    expect(
      elem.querySelector('input')
        .getAttribute('placeholder')
    ).toEqual('Email Login');
  });
  it('renders with type', () => {
    expect(
      elem.querySelector('input')
        .getAttribute('type')
    ).toEqual('email');
  });
  it('has underline style properties', () => {
    const styles = global.window.getComputedStyle(elem.firstChild);
    expect(styles['font-family']).toEqual('GT Walsheim Web,Helvetica,Trebuchet MS,sans-serif');
    expect(styles['border-bottom']).toEqual('2px solid #3150A2');
    expect(elem.firstChild).toHaveStyle('background: transparent');
    expect(elem.firstChild).toHaveStyle('box-sizing: border-box');
    expect(elem.firstChild).toHaveStyle('color: #3150A2');
    expect(elem.firstChild).toHaveStyle('font-size: 1.2rem');
    expect(elem.firstChild).toHaveStyle('height: 4rem');
    expect(elem.firstChild).toHaveStyle('letter-spacing: 0.04em');
    expect(elem.firstChild).toHaveStyle('padding: 0');
    expect(elem.firstChild).toHaveStyle('width: 100%');
  });
});

describe('an inverted outline input of email', () => {
  beforeEach(() => {
    wrapper = render(<InputEmail inverted outline id="email-3" type="email" placeholder="your email" />);
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
      elem.querySelector('#email-3')
        .nodeType === 1
    ).toEqual(true);
  });
  it('renders with placeholder', () => {
    expect(
      elem.querySelector('input')
        .getAttribute('placeholder')
    ).toEqual('your email');
  });
  it('renders with type', () => {
    expect(
      elem.querySelector('input')
        .getAttribute('type')
    ).toEqual('email');
  });
  it('has inverted outline style properties', () => {
    const styles = global.window.getComputedStyle(elem.firstChild);
    expect(styles['font-family']).toEqual('GT Pressura Web,Arial Narrow,Arial,sans-serif');
    expect(styles.border).toEqual('1px solid #ffffff');
    expect(elem.firstChild).toHaveStyle('background: #3150A2');
    expect(elem.firstChild).toHaveStyle('box-sizing: border-box');
    expect(elem.firstChild).toHaveStyle('color: #FFFFFF');
    expect(elem.firstChild).toHaveStyle('font-size: 1.2rem');
    expect(elem.firstChild).toHaveStyle('height: 4.7rem');
    expect(elem.firstChild).toHaveStyle('letter-spacing: 0.24em');
    expect(elem.firstChild).toHaveStyle('padding-left: 3.6rem');
    expect(elem.firstChild).toHaveStyle('text-transform: uppercase');
    expect(elem.firstChild).toHaveStyle('width: 100%');
  });
});

describe('an inverted underlined input of email', () => {
  beforeEach(() => {
    wrapper = render(<InputEmail inverted underline id="email-4" type="email" placeholder="Join our mailing list" />);
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
      elem.querySelector('#email-4')
        .nodeType === 1
    ).toEqual(true);
  });
  it('renders with placeholder', () => {
    expect(
      elem.querySelector('input')
        .getAttribute('placeholder')
    ).toEqual('Join our mailing list');
  });
  it('renders with type', () => {
    expect(
      elem.querySelector('input')
        .getAttribute('type')
    ).toEqual('email');
  });
  it('has inverted underline style properties', () => {
    const styles = global.window.getComputedStyle(elem.firstChild);
    expect(styles['font-family']).toEqual('GT Pressura Web,Arial Narrow,Arial,sans-serif');
    expect(styles['border-bottom']).toEqual('1px solid #FAEFD9');
    expect(elem.firstChild).toHaveStyle('background: transparent');
    expect(elem.firstChild).toHaveStyle('box-sizing: border-box');
    expect(elem.firstChild).toHaveStyle('color: #FFFFFF');
    expect(elem.firstChild).toHaveStyle('font-size: 1.2rem');
    expect(elem.firstChild).toHaveStyle('height: 4.4rem');
    expect(elem.firstChild).toHaveStyle('letter-spacing: 0.24em');
    expect(elem.firstChild).toHaveStyle('width: 100%');
  });
});
