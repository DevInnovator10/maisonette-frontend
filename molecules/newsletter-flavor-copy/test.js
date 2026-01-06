import React from 'react';
import { render } from '../../utils/tests/testTheming';
import NewsletterFlavor from '.';

const dummyData = require('./dummy-data.json');

let componentWrapper;
let componentElement;

describe('a footer copy component', () => {
  beforeEach(() => {
    componentWrapper = render(
      <NewsletterFlavor image={dummyData.image.data} title={dummyData.title} />
    );
    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has an image', () => {
    const image = componentElement.querySelector('img');
    expect(image.nodeType === 1).toEqual(true);
  });

  it('has label text', () => {
    const label = componentWrapper.getByText('CTA works now');
    expect(label.nodeType === 1).toEqual(true);
  });

  it('has styles', () => {
    expect(componentElement).toHaveStyle('align-items: center');
    expect(componentElement).toHaveStyle('display: flex');
    expect(componentElement).toHaveStyle('flex-direction: column');
    expect(componentElement).toHaveStyle('padding: 0 2rem');
    expect(componentElement).toHaveStyle('text-decoration: none');
    expect(componentElement).toHaveStyle('width: 33.33333%');

    const picture = componentElement.querySelector('picture');
    expect(picture).toHaveStyle('display: block');
    expect(picture).toHaveStyle('height: 7.5rem');
    expect(picture).toHaveStyle('margin: 0 auto 1.5rem');
    expect(picture).toHaveStyle('position: relative');
    expect(picture).toHaveStyle('width: 7.5rem');

    const img = componentElement.querySelector('img');
    expect(img).toHaveStyle('border-radius: 50%');

    const label = componentElement.querySelector('p');
    expect(label).toHaveStyle('font-size: 1.2rem');
    expect(label).toHaveStyle('text-align: center');
    expect(label).toHaveStyle('text-transform: uppercase');
    expect(label).toHaveStyle('letter-spacing: .25rem');
    expect(label).toHaveStyle('line-height: 1.5rem');
  });
});
