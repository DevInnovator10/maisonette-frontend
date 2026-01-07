import React from 'react';
import { render } from '../../utils/tests/testTheming';
import AppleAppStoreDownload from '.';

describe('the AppleAppStoreDownload component', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <AppleAppStoreDownload />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has the correct text', () => {
    const title = componentWrapper.getByText('Download the app');
    const copy = componentWrapper.getByText('Download our official app from the app store');
    expect(title).toBeDefined();
    expect(copy).toBeDefined();

  });

  it('has the correct link with tracking parameters', () => {
    // find anchor tag check href
    const anchor = componentWrapper.container.querySelector('a');
    expect(anchor.href).toBe('https://apps.apple.com/app/apple-store/id1607354539?pt=118811622&ct=Website%20Footer&mt=8');
  });
});
