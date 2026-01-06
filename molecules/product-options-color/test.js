import React from 'react';
import { render } from '../../utils/tests/testTheming';
import ColorOptions from '.';

let componentWrapper;
let componentElement;

const colors = [
  {
    name: 'Monogram Color 1',
    value: '#FFFFFF'
  },
  {
    name: 'Monogram Color 1 Title',
    value: 'White'
  },
  {
    name: 'Monogram Color 2',
    value: '#051C48'
  },
  {
    name: 'Monogram Color 2 Title',
    value: 'Navy'
  },
  {
    name: 'Monogram Color 3',
    value: '#C4C6C9'
  },
  {
    name: 'Monogram Color 3 Title',
    value: 'Dove Grey'
  },
  {
    name: 'Monogram Color 4',
    value: '#c7ddee'
  },
  {
    name: 'Monogram Color 4 Title',
    value: 'Powder Blue'
  },
  {
    name: 'Monogram Color 5',
    value: '#eedbdd'
  },
  {
    name: 'Monogram Color 5 Title',
    value: 'Dusty Pink'
  },
  {
    name: 'Monogram Color 6',
    value: '#000000'
  },
  {
    name: 'Monogram Color 6 Title',
    value: 'Black'
  }
];

describe('a color options component', () => {
  beforeEach(() => {
    componentWrapper = render(
      <ColorOptions colors={colors} onChange={() => { }} />
    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('shows default label on load', () => {
    expect(componentWrapper.getByText('Select a Color')).toBeDefined();
  });

  it('renders 6 color options', () => {
    const colorButtons = componentElement.querySelectorAll('label');
    expect(colorButtons.length).toEqual(6);
  });

  it('show active color state', () => {
    colors.forEach((color) => {
      componentWrapper = render(
        <ColorOptions colors={colors} color={color} onChange={() => { }} />
      );

      componentElement = componentWrapper.container.firstChild;

      const label = componentWrapper.getByText(`Color: ${color.name}`, { exact: true });
      expect(label).toBeTruthy();
    });
  });
});
