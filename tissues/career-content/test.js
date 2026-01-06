import React from 'react';
import { render } from '../../utils/tests/testTheming';
import CareerContent from '.';
import baseCareerContentHtml from './baseCareerContentHtml';

describe('a career content tissue', () => {
    let componentWrapper;
  let componentElement;

  beforeEach(() => {
    componentWrapper = render(
      <CareerContent content={baseCareerContentHtml} />
    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has correct section styles', () => {
    const sectionEls = componentElement.querySelectorAll('section');

    sectionEls.forEach((section) => {
      const styles = global.window.getComputedStyle(section);
      expect(styles.display).toBe('grid');
      expect(styles.padding).toBe('2.3438rem 0px');
      expect(styles['border-top']).toBe('1px solid #3150A2');
    });
  });

  it('has correct h2 styles', () => {
    const h2Els = componentElement.querySelectorAll('h2');

    h2Els.forEach((h2) => {

      const styles = global.window.getComputedStyle(h2);
      expect(styles['font-family']).toBe('Canela Web,Big Caslon,Times New Roman,Times,serif');
      expect(styles['font-size']).toBe('2.3438rem');
    });
  });

  it('has correct p styles', () => {
    const pEls = componentElement.querySelectorAll('p');

    pEls.forEach((p) => {
      const styles = global.window.getComputedStyle(p);
      expect(styles['font-size']).toBe('1.5rem');
    });
  });

  it('has correct ul styles', () => {
    const ulEls = componentElement.querySelectorAll('ul');

    ulEls.forEach((ul) => {
      const styles = global.window.getComputedStyle(ul);
      expect(styles['font-size']).toBe('1.5rem');
      if (ul.previousElementSibling && ul.previousElementSibling.tagName === 'P') {
        expect(styles['padding-left']).toBe('1.2rem');
      }
    });
  });

  it('has correct li styles', () => {
    const ulEl = componentElement.querySelector('ul');
    const liEls = ulEl.querySelectorAll('li');

    liEls.forEach((li) => {
      const styles = global.window.getComputedStyle(li);
      if (li.previousElementSibling && li.previousElementSibling.tagName === 'LI') {
        expect(styles['margin-top']).toBe('1.2rem');
      }
    });
  });
});
