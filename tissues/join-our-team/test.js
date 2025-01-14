import React from 'react';
import JoinOurTeam from './index';
import { render } from '../../utils/tests/testTheming';

test('renders correctly', () => {
    const wrapper = render(
    <JoinOurTeam />
  );

  expect(wrapper).toMatchSnapshot();
});
