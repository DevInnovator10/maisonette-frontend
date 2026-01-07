import React from 'react';
import { Formik } from 'formik';
import { render } from '../../utils/tests/testTheming';
import GiftWrapMessage from '.';

describe('the checkout gift wrap option', () => {
  let componentWrapper;

  beforeEach(() => {
    componentWrapper = render(
      <Formik>
        <GiftWrapMessage email="email@gmail.com" message="hi" shipment={1} id={2} />
      </Formik>
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });
});
