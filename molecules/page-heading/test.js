import React from 'react';
import { render } from '../../utils/tests/testTheming';
import PageHeader from '.';

let componentWrapper;
let componentElement;

describe('an account section', () => {
  beforeEach(() => {
    componentWrapper = render(
      <PageHeader title="Hi, Eric!" />
    );
    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('displays title', () => {
    const title = componentElement.textContent;
    expect(title).toEqual('Hi, Eric!');
  });
});
