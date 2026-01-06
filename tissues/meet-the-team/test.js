import React from 'react';
import MeetTheTeam from './index';
import { render } from '../../utils/tests/testTheming';

test('renders correctly', () => {
  const wrapper = render(
    <MeetTheTeam />
  );

  expect(wrapper).toMatchSnapshot();
});
