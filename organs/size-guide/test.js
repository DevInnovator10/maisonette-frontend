import React from 'react';
import { render } from '../../utils/tests/testTheming';
import SizeGuide from '.';

describe('the size guide component', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <SizeGuide />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });
});
