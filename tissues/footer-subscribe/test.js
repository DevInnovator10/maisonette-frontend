import React from 'react';
import { render } from '../../utils/tests/testTheming';
import FooterSubscribe from '.';

describe('the footer subscribe', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <FooterSubscribe />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });
});
