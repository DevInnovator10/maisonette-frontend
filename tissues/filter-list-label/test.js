import React from 'react';
import { render } from '../../utils/tests/testTheming';
import FilterListLabel from '.';

describe('an filter list label', () => {
  let componentWrapper;
  let componentElement;

  beforeEach(() => {
    componentWrapper = render(
      <FilterListLabel
        category={{ name: 'Age Range', id: 'agerange' }}
        isOpened={false}
        setOpened={() => {}}
      />
    );
    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has styles', () => {
    expect(componentElement).toHaveStyle('cursor: pointer');

    const label = componentWrapper.getByText('Age Range');
    expect(label).toHaveStyle('line-height: 4rem');
    expect(label).toHaveStyle('position: relative');
  });
});
