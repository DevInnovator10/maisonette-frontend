import React from 'react';
import OurMission from './index';
import { render } from '../../utils/tests/testTheming';

test('renders correctly', () => {
  const wrapper = render(
    <OurMission />
  );

  expect(wrapper).toMatchSnapshot();
});
