import React from 'react';
import { render } from '../../utils/tests/testTheming';
import AccountSection from '.';

describe('an account section', () => {
  let componentWrapper;
  let componentElement;

  beforeEach(() => {
    componentWrapper = render(
      <AccountSection title="Profile" body={[]} />
    );
    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('should have title', () => {
    const title = componentWrapper.getByText('Profile');
    expect(title).toBeDefined();
  });

  it('should have styles', () => {
    expect(componentElement).toHaveStyle('color: #3150A2');

    const title = componentWrapper.getByText('Profile');
    expect(title).toHaveStyle('border-bottom: 1px solid #3150A2');
    expect(title).toHaveStyle('cursor: pointer');
    expect(title).toHaveStyle('position: relative');
  });
});
