import React from 'react';
import { act } from '@testing-library/react';
import { render } from '../../utils/tests/testTheming';
import FooterContact from '.';

describe('the footer contact', () => {
  let componentWrapper;

  beforeEach(async () => {
    await act(async () => {
      componentWrapper = await render(
        <FooterContact />
      );
    });
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('should have styles', () => {
    const title = componentWrapper.getByText('Contact Us');
    expect(title).toHaveStyle('color: #FFFFFF');
    expect(title).toHaveStyle('letter-spacing: .24em');
    expect(title).toHaveStyle('margin-bottom: 5rem');
    expect(title).toHaveStyle('padding: 0');
    expect(title).toHaveStyle('text-align: center');
    expect(title).toHaveStyle('text-transform: uppercase');
  });
});
