import React from 'react';
import { render } from '../../utils/tests/testTheming';
import StyledLink from '.';

let wrapper;

describe('a link', () => {
  beforeEach(() => {
    wrapper = render(<StyledLink href="/tests">Link</StyledLink>);
  });

  it('renders correctly', () => {
    expect(
      wrapper.container.querySelector('a')
        .nodeType === 1
    ).toEqual(true);

    expect(wrapper).toMatchSnapshot();
  });

  it('has prop href', () => {
    expect(
      wrapper.container.querySelector('a').href
    ).toContain('/tests');
  });
});

describe('a hed link', () => {
  beforeEach(() => {
    wrapper = render(<StyledLink hed href="/">Link</StyledLink>);
  });

  it('has hed styles', () => {
    const styles = global.window.getComputedStyle(wrapper.container.firstChild);
    expect(styles['font-family']).toEqual('GT Pressura Web,Arial Narrow,Arial,sans-serif');
    expect(styles['border-bottom']).toEqual('0.2rem solid #3150A2');
    expect(wrapper.container.firstChild).toHaveStyle('font-size: 1.2rem');
    expect(wrapper.container.firstChild).toHaveStyle('letter-spacing: 0.25em');
    expect(wrapper.container.firstChild).toHaveStyle('line-height: 1.4rem');
    expect(wrapper.container.firstChild).toHaveStyle('text-decoration: none');
    expect(wrapper.container.firstChild).toHaveStyle('text-transform: uppercase');
    expect(wrapper.container.firstChild).toHaveStyle('padding-bottom: 0.8rem');
  });
});

describe('a underline link', () => {
  beforeEach(() => {
    wrapper = render(<StyledLink underline href="/">Link</StyledLink>);
  });

  it('has underline styles', () => {
    expect(wrapper.container.firstChild).toHaveStyle('text-decoration: underline');
  });
});
