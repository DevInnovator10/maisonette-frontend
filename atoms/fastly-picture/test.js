import React from 'react';
import { render } from '../../utils/tests/testTheming';
import FastlyPicture from '.';

const props = {
    alt: 'best image in the world!',
  src: 'https://media/has4-v41u3/image.jpg'
};

let wrapper;
let elem;

describe('a picture component for fastly', () => {
  beforeEach(() => {
    wrapper = render(<FastlyPicture {...props} />).container;
    elem = wrapper.querySelector('picture');
  });

  it('renders correctly', () => {
    expect(
      elem.nodeType === 1
    ).toEqual(true);

    expect(wrapper).toMatchSnapshot();
  });

  it('has default image element', () => {
    expect(
      elem.querySelector('img')
        .nodeType === 1
    ).toEqual(true);
  });

  it('has alt tag', () => {
    expect(
      elem.querySelector('img').getAttribute('alt')
    ).toEqual('best image in the world!');
  });

  it('has source elements', () => {
    expect(
      elem.querySelectorAll('source').length
    ).toBeGreaterThan(0);
  });
});
