import React from 'react';
import { act } from 'react-dom/test-utils';

import { fireEvent, render } from '../../utils/tests/testTheming';
import Carousel from '.';

let component;
let node;
let flkty;

describe('a carousel', () => {
  beforeEach(async () => {
    let wrapper;

    await act(async () => {
      wrapper = render(
        <Carousel
          flickityRef={(c) => { flkty = c; }}
          disableImagesLoaded
        >
          {
            Array.from(Array(10).keys()).map((i) => (
              <div key={i}>{i}</div>
            ))
          }
        </Carousel>
      );
    });

    component = wrapper.container;
    node = component.firstChild;
  });

  it('renders correctly', () => {
    expect(component.nodeType === 1).toEqual(true);
    expect(component).toMatchSnapshot();
  });

  it('have 10 slides', () => {
    const { childNodes: slides } = node.querySelector('.flickity-slider');
    expect(slides.length).toEqual(10);
  });

  it('have next/previous arrows', () => {
    const next = node.querySelector('.next');
    const previous = node.querySelector('.previous');
    expect(next).toBeTruthy();
    expect(previous).toBeTruthy();
  });

  it('have dots', () => {
    const dots = node.querySelector('.flickity-page-dots');
    expect(dots).toBeTruthy();
  });

  it('changes active slide when arrows are clicked', async () => {
    const next = component.querySelector('.flickity-prev-next-button.next');
    const prev = component.querySelector('.flickity-prev-next-button.previous');
    expect(flkty.selectedIndex).toBe(0);
    fireEvent.click(next);
    expect(flkty.selectedIndex).toBe(1);
    fireEvent.click(prev);
    expect(flkty.selectedIndex).toBe(0);
  });

  it('changes active slide when dots are clicked', async () => {
    const { childNodes: dots } = component.querySelector('.flickity-page-dots');
    expect(flkty.selectedIndex).toBe(0);

    dots.forEach((dot, i) => {
      fireEvent.click(dot);
      expect(flkty.selectedIndex).toBe(i);
    });
  });
});

describe('a hero carousel with no heading', () => {
  beforeEach(async () => {
    let wrapper;
    const arrowShape = {
      x0: 10,
      x1: 60,
      y1: 50,
      x2: 70,
      y2: 40,
      x3: 30
    };

    await act(async () => {
      wrapper = render(
        <Carousel
          flickityRef={(c) => { flkty = c; }}
          disableImagesLoaded
          type="hero"
          options={{
            arrowShape
          }}
        >
          {
            Array.from(Array(10).keys()).map((i) => (
              <div key={i}>{i}</div>
            ))
          }
        </Carousel>
      );
    });

    component = wrapper.container;
    node = component.firstChild;
  });

  it('renders correctly', () => {
    expect(component.nodeType === 1).toEqual(true);
    expect(component).toMatchSnapshot();
  });
});

describe('a hero carousel with a heading', () => {
  beforeEach(async () => {
    let wrapper;
    const arrowShape = {
      x0: 10,
      x1: 60,
      y1: 50,
      x2: 70,
      y2: 40,
      x3: 30
    };

    await act(async () => {
      wrapper = render(
        <Carousel
          flickityRef={(c) => { flkty = c; }}
          disableImagesLoaded
          type="hero"
          adjustArrows
          options={{
            arrowShape
          }}
        >
          {
            Array.from(Array(10).keys()).map((i) => (
              <div key={i}>{i}</div>
            ))
          }
        </Carousel>
      );
    });

    component = wrapper.container;
    node = component.firstChild;
  });

  it('renders correctly', () => {
    expect(component.nodeType === 1).toEqual(true);
    expect(component).toMatchSnapshot();
  });
});
