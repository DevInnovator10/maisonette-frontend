import React from 'react';
import { render } from '../../utils/tests/testTheming';
import OrderDetails from '.';

describe('a order detail component', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(<OrderDetails placedAt="Jun, 21 2019" status="Ready" />);
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });
});
