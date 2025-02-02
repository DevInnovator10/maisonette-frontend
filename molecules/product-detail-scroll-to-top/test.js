import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../utils/tests/testTheming';
import ProductDetailScrollToTop from '.';

describe('scroll to page top component', () => {
  beforeEach(() => {
    render(
      <ProductDetailScrollToTop />
    );
  });

  it('renders correctly', () => {
    expect(screen.getByText('To top')).toMatchInlineSnapshot(`
.emotion-0 {
  background: rgba(47,77,161,0.05);
  border-top: 1px solid #2F4DA1;
  color: #2F4DA1;
  font-size: 20px;
  font-family: GT Walsheim Web,Helvetica,Trebuchet MS,sans-serif;
  padding: 1.3rem 0.5rem;
  text-align: center;
  -webkit-transition: bottom 200ms cubic-bezier(0.550,0.085,0.68,0.530);

  transition: bottom 200ms cubic-bezier(0.550,0.085,0.68,0.530);
}

@media screen and (min-width:992px) {
  .emotion-0 {
    display: none;
  }
}

.emotion-2 {
  margin-right: 1.5rem;
  display: inline-block;
  width: 10.5px;
  height: 10.5px;
  border: solid #2F4DA1;
  border-width: 2px 0px 0px 2px;
  display: inline-block;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

<div
  class="emotion-0 emotion-1"
  data-test-id="ProductDetailScrollToTop"
>
  To top
   
  <div
    class="emotion-2 emotion-3"
  />
</div>

`);
  });

  it('scrolls to top when clicked', () => {
    fireEvent.scroll(global.window, { target: { scrollY: 350 } });
    fireEvent.click(screen.getByText('To top'));
    expect(global.window.scrollTo).toHaveBeenCalled();
    expect(global.window.scrollY).toBe(0);
  });
});
