import React from 'react';
import { render } from '../../utils/tests/testTheming';
import SizeGuideTab from '.';

describe('a size guide tab', () => {
    let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <SizeGuideTab activeNav="Baby" activeTab="Apparel" />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });
});
