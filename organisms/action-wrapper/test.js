import React from 'react';
import { render } from '../../utils/tests/testTheming';
import { ActionWrapper } from '.';
import Button from '../../atoms/button';
import { addMiniToActivelyEditingList } from '../../store/modules/user/actions';

describe('an action wrapper', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <ActionWrapper handler="onClick" action={addMiniToActivelyEditingList} data={1}>
        <Button>Click me to dispatch an action!</Button>
      </ActionWrapper>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();

  });

});
