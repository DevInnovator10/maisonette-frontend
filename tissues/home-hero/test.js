import React from 'react';
import { render } from '../../utils/tests/testTheming';
import HomeHero from '.';

const image = {
  alt: 'best image in the world!',
  types: ['jpeg2000', 'webP', 'jpeg'],
  imageName: 'image.jpg',
  uri: 'media/has4-v41u3/'
};

describe('a home hero', () => {
  let componentWrapper;
  let componentElement;

  beforeEach(() => {
    componentWrapper = render(
      <HomeHero
        image={image}
        href="t/edits/kids-street-style"
        link="Shop Now"
        subtitle="Just In"
        title="Kid's Street Style"
      />
    );
    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has a link', () => {
    expect(componentWrapper.getByText('Shop Now')).toBeDefined();
  });

  it('has a subtitle', () => {
    expect(componentWrapper.getByText('Just In')).toBeDefined();
  });

  it('has a title', () => {
    expect(componentWrapper.getByText('Kid\'s Street Style')).toBeDefined();
  });

  it('has an image', () => {
    expect(componentWrapper.getByAltText('best image in the world!')).toBeDefined();
  });

  it('has styles', () => {
    expect(componentElement).toHaveStyle('position: relative');
    expect(componentElement).toHaveStyle('cursor: pointer');

    const link = componentElement.querySelector('a');
    expect(link).toHaveStyle('cursor: pointer');

    const subtitle = componentElement.querySelector('h2');
    expect(subtitle).toHaveStyle('color: #3150A2');

    const title = componentElement.querySelector('h1');
    expect(title).toHaveStyle('color: #3150A2');

    const wrapper = componentElement.querySelector('div');
    expect(wrapper).toHaveStyle('display: flex');
    expect(wrapper).toHaveStyle('flex-direction: column');
    expect(wrapper).toHaveStyle('align-items: center');
  });
});
