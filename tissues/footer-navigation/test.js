import React from 'react';
import { render } from '../../utils/tests/testTheming';
import FooterNavigation from '.';

describe('the footer navigation', () => {
  let componentWrapper;
  let componentElement;

  beforeEach(() => {
    componentWrapper = render(
      <FooterNavigation />
    );
    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('should have styles', () => {
    const navigation = [...componentElement.querySelectorAll('nav')];
    navigation.forEach((nav) => {
      expect(nav).toHaveStyle('display: flex');
      expect(nav).toHaveStyle('flex-direction: column');
      expect(nav).toHaveStyle('flex: 0 50%');
      expect(nav).toHaveStyle('width: 50%');

      [...nav.children].forEach((navItem) => {
        expect(navItem).toHaveStyle('border-bottom: 1px solid #FFFFFF');
        expect(navItem).toHaveStyle('color: #FFFFFF');
        expect(navItem).toHaveStyle('display: flex');
        expect(navItem).toHaveStyle('flex-direction: column');
        expect(navItem).toHaveStyle('line-height: 4rem');
        expect(navItem).toHaveStyle('text-decoration: none');
        expect(navItem).toHaveStyle('text-align: center');
      });
    });
  });
});
