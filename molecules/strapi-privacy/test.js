import React from 'react';
import { render } from '../../utils/tests/testTheming';
import Privacy from '.';

describe('a strapi privacy component', () => {
  let componentWrapper;
  let componentElement;

  beforeEach(() => {
    componentWrapper = render(
      <Privacy
        privacy_heading="Information Collection"
        privacy_elements={{
          0: { privacy_text: '&ldquo;Personal Information&rdquo; means any information that can be used to identify you individually. We collect Personal Information you voluntarily provide us. including, without limitation, your name; your billing and shipping address(es); your email address; your phone number; and your credit card information. You may refuse to provide Personal Information, but some parts of the Site may not be fully available or functional without submitting such information. Even if you do not register with us, when you interact with our Site, we may collect the following: your IP address, device type, operating system, browser, and other Site usage details such as page views, clicks, and duration of page visits. ' },
          1: { privacy_text: 'In addition to Personal Information, our servers automatically collect certain anonymous, aggregate and/or technical information that does not identify you personally (&ldquo;Anonymous Data&rdquo;).' }
        }}
        privacy_hr={false}
      />
    );
    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {

    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('should render title', () => {
    const title = componentWrapper.getByText('Information Collection');
    expect(title).toBeDefined();
  });

  it('should render two paragraphs', () => {
    const paragraphs = componentElement.querySelectorAll('div');
    expect(paragraphs.length).toEqual(2);
  });
});
