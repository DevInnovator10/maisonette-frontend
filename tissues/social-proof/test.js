import React from 'react';
import SocialProof from './index';
import { render } from '../../utils/tests/testTheming';

test('render correctly', () => {
  const wrapper = render(<SocialProof />);

  expect(wrapper).toMatchSnapshot();
});
