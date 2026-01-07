import React from 'react';
import { Formik } from 'formik';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render } from '../../utils/tests/testTheming';
import GlobalSearch from '.';

let componentWrapper;
let componentElement;

const mockStore = configureMockStore([]);

const store = mockStore({
  user: {},
  interfaces: {}
});

describe('a global search component', () => {
  beforeEach(() => {
    componentWrapper = render(
      <Provider store={store}>
        <Formik>
          {() => (
            <GlobalSearch required />
          )}
        </Formik>
      </Provider>
    );
    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has styles', () => {
    const input = componentElement.querySelector('input');
    const styles = global.window.getComputedStyle(input);
    expect(styles['font-family']).toEqual('Canela Web,Big Caslon,Times New Roman,Times,serif');
    expect(styles['border-bottom']).toEqual('1px solid #FFFFFF');
    expect(input).toHaveStyle('background: transparent');
    expect(input).toHaveStyle('box-sizing: border-box');
    expect(input).toHaveStyle('color: #FFFFFF');
    expect(input).toHaveStyle('font-size: 3.5rem');
    expect(input).toHaveStyle('height: 5.5rem');
    expect(input).toHaveStyle('padding: 0');
    expect(input).toHaveStyle('width: 100%');

    const button = componentElement.querySelector('button');
    expect(button).toHaveStyle('height: 3.2rem');
    expect(button).toHaveStyle('overflow: visible');
    expect(button).toHaveStyle('position: absolute');
    expect(button).toHaveStyle('right: 0.2rem');
    expect(button).toHaveStyle('top: 1.2rem');
    expect(button).toHaveStyle('width: 3.2rem');

    const svg = componentElement.querySelector('svg');
    expect(svg).toHaveStyle('fill: transparent');
    expect(svg).toHaveStyle('height: 2.8rem');
    expect(svg).toHaveStyle('stroke-width: 3');
    expect(svg).toHaveStyle('stroke: #fff');
    expect(svg).toHaveStyle('width: 2.8rem');
  });
});
