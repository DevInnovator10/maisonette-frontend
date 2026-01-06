import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from '../../utils/tests/testTheming';
import Monogrammable from '.';
import { ProductProvider } from '../../utils/context/product-provider';

let componentWrapper;
let componentElement;

const options = {
  colors: [
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
  ],
  fonts: [
    {
      name: 'Monogram Font 1',
      value: 'Sweet San Light,Times New Roman,Times,"serif"'
    },
    {
      name: 'Monogram Font 1 Title',
      value: 'Embroidered Script (lowercase)'
    },
    {
      name: 'Monogram Font 2',
      value: 'Ballpoint, Times New Roman,Times,"serif"'
    },
    {
      name: 'Monogram Font 2 Title',
      value: 'Classic Block (Uppercase)'
    }
  ]
};

describe('the monogrammable component', () => {
  beforeEach(() => {
    componentWrapper = render(
      <ProductProvider value={{}}>
        <Monogrammable
          variant={1}
          maxTextLength={13}
          colors={
            options.colors
          }
          fonts={options.fonts}
          setColor={() => {}}
          setFont={() => {}}
          setText={() => {}}
        />
      </ProductProvider>
    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('changes active color', () => {
    const colorButton = componentElement.querySelector('input[type="radio"]');
    const color = colorButton.parentNode.textContent;
    fireEvent.click(colorButton);
    expect(componentWrapper.getByText(`Thread Color: ${color}`));
  });

  it('changes active style', () => {
    const styleSelect = componentElement.querySelector('select');
    fireEvent.change(styleSelect, { target: { value: 'Embroidered Script (lowercase)' } });
    expect(componentWrapper.getByText('Font Style: Embroidered Script (lowercase)'));
  });

  it('changes active text', () => {
    const textInput = componentElement.querySelector('input[type="text"]');
    fireEvent.change(textInput, { target: { value: 'E.L.G' } });
    expect(componentWrapper.getByText('8 characters left'));
  });

  it('should have styles', () => {
    const styles = global.window.getComputedStyle(componentElement);
    expect(styles['border-left']).toEqual('2px solid #9CB1DC');
    expect(componentElement).toHaveStyle('padding-left: 2rem');
  });

});
