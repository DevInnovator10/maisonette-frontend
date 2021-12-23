import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from '../../utils/tests/testTheming';
import ProductDetailAccordion from '.';

describe('a product detail accordion tab', () => {
  let componentWrapper;
  let componentElement;

  beforeEach(() => {
    componentWrapper = render(
      <ProductDetailAccordion title="Accordion Title" product={{}}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum laoreet justo risus,
        vitae convallis sem hendrerit a. Cras vitae enim diam. Donec ornare ex lectus, nec porta
        felis tincidunt eget. Vestibulum massa ex, mollis quis malesuada nec, pretium non neque.
        Sed vel pulvinar magna, vitae laoreet arcu. Curabitur convallis magna ut nunc pharetra
        aliquet. Mauris dignissim tincidunt nunc. Aenean eget erat mauris. Phasellus id fringilla
        nunc, dictum fermentum eros. Pellentesque vel augue vitae odio semper cursus pharetra et
        urna. Nulla fermentum, justo vitae viverra sodales, nisl tortor suscipit lectus, et mollis
        sapien leo vel ligula. Nullam dapibus nunc nec rhoncus pretium. Phasellus non placerat nunc.
        Curabitur vitae magna quis sem gravida auctor. Nullam id massa in ligula lobortis posuere.
        Sed eget accumsan velit, nec viverra dolor.
      </ProductDetailAccordion>
    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('renders closed by default', () => {
    expect(componentElement).toHaveStyle('max-height: 35px');
    expect(componentElement).toHaveStyle('overflow: hidden');
  });

  it('shows content when clicked', () => {
    const trigger = componentElement.firstChild;

    fireEvent(
      trigger,
      // eslint-disable-next-line no-undef
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );

    const style = global.getComputedStyle(componentElement);
    const maxHeight = parseInt(style['max-height'], 10);

    expect(maxHeight).toEqual(componentElement.scrollHeight);
  });
});
