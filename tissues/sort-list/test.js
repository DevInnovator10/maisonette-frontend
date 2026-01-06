import React from 'react';
import { render } from '../../utils/tests/testTheming';
import SortList from '.';

const sort = {
  name: 'Best Match',
  id: 'best-match',
  value: 'score'
};

describe('a sort action', () => {
  let componentWrapper;
  let componentElement;

  beforeEach(() => {
    componentWrapper = render(<SortList isOpened setOpened={() => {}} activeSort={sort} />);
    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('should render 5 radios', () => {
    const checkboxes = componentElement.querySelectorAll('input');
    expect(checkboxes.length).toEqual(5);
  });

  it('should render "best-match" checked by default', () => {
    const sorts = componentElement.querySelectorAll('label');

    sorts.forEach((s) => {
      const radio = s.querySelector('input');

      if (s.textContent === 'Best Match') {
        expect(radio.checked).toEqual(true);
      } else {
        expect(radio.checked).toEqual(false);
      }
    });
  });
});
