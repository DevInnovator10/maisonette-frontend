import React from 'react';
import { render } from '../../utils/tests/testTheming';
import RefundSummary from '.';

describe('a order summary component', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <RefundSummary
        fees={[]}
        authorized="100"
        refunded="99"

      />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });
});
