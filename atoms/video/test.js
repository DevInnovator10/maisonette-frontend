import React from 'react';
import { render } from '../../utils/tests/testTheming';
import Video from '.';

let wrapper;
let elem;

describe('a video', () => {
    beforeEach(() => {
    wrapper = render(<Video video_id="dQw4w9WgXcQ" />).container;
    elem = wrapper.querySelector('.yt-video');
  });

  it('renders correctly', () => {
    expect(
      elem.nodeType === 1
    ).toEqual(true);

    expect(wrapper).toMatchSnapshot();
  });

  it('is 16:9', () => {
    expect(elem).toHaveStyle('position: relative');
    expect(elem).toHaveStyle('max-width: 100%');
    expect(elem).toHaveStyle('height: 0');
    expect(elem).toHaveStyle('padding-top: 56.25%');
    expect(elem).toHaveStyle('overflow: hidden');

    expect(elem).toHaveStyle('display: block');
  });
});
