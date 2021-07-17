import React from 'react';
import CoreValues from './index';
import { render } from '../../utils/tests/testTheming';

test('render correctly', () => {
  const wrapper = render(<CoreValues />);

  expect(wrapper).toMatchSnapshot();

});
