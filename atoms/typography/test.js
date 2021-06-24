import React, { createRef } from 'react';
import { render } from '../../utils/tests/testTheming';
import Typography from '.';

let wrapper;
let elem;

const ref = createRef();

describe('typography heading 1', () => {
  beforeEach(() => {
    wrapper = render(<Typography ref={ref} element="h1" like="heading-1">This is a heading</Typography>);
    elem = wrapper.container;
  });
  it('it should render the correct element', () => {
    expect(elem.querySelector('h1').nodeType === 1).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });
  it('should have correct copy', () => {
    expect(elem.textContent).toEqual('This is a heading');
  });
  it('has style properties', () => {
    const styles = global.window.getComputedStyle(elem.firstChild);
    expect(styles['font-family']).toEqual('Canela Web,Big Caslon,Times New Roman,Times,serif');
    expect(elem.firstChild).toHaveStyle('font-size: 5.722rem');
  });
});

describe('typography heading 2', () => {
  beforeEach(() => {
    wrapper = render(<Typography element="h2" like="heading-2">This is a sub heading</Typography>);
    elem = wrapper.container;
  });
  it('it should render the correct element', () => {
    expect(elem.querySelector('h2').nodeType === 1).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });
  it('should have correct copy', () => {
    expect(elem.textContent).toEqual('This is a sub heading');
  });
  it('has style properties', () => {
    const styles = global.window.getComputedStyle(elem.firstChild);
    expect(styles['font-family']).toEqual('Canela Web,Big Caslon,Times New Roman,Times,serif');
    expect(elem.firstChild).toHaveStyle('font-size: 4.5776rem');
  });
});

describe('typography heading 3', () => {
  beforeEach(() => {
    wrapper = render(<Typography element="h3" like="heading-3">This is a third heading</Typography>);
    elem = wrapper.container;
  });
  it('it should render the correct element', () => {
    expect(elem.querySelector('h3').nodeType === 1).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });
  it('should have correct copy', () => {
    expect(elem.textContent).toEqual('This is a third heading');
  });
  it('has style properties', () => {
    const styles = global.window.getComputedStyle(elem.firstChild);
    expect(styles['font-family']).toEqual('Canela Web,Big Caslon,Times New Roman,Times,serif');
    expect(elem.firstChild).toHaveStyle('font-size: 3.6621rem');
  });
});

describe('typography heading 4', () => {
  beforeEach(() => {
    wrapper = render(<Typography element="h4" like="heading-4">This is a fourth heading</Typography>);
    elem = wrapper.container;
  });
  it('it should render the correct element', () => {
    expect(elem.querySelector('h4').nodeType === 1).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });
  it('should have correct copy', () => {
    expect(elem.textContent).toEqual('This is a fourth heading');
  });
  it('has style properties', () => {
    const styles = global.window.getComputedStyle(elem.firstChild);
    expect(styles['font-family']).toEqual('Canela Web,Big Caslon,Times New Roman,Times,serif');
    expect(elem.firstChild).toHaveStyle('font-size: 2.9297rem');
  });
});

describe('typography heading 5', () => {
  beforeEach(() => {
    wrapper = render(<Typography element="h5" like="heading-5">This is a fifth heading</Typography>);
    elem = wrapper.container;
  });
  it('it should render the correct element', () => {
    expect(elem.querySelector('h5').nodeType === 1).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });
  it('should have correct copy', () => {
    expect(elem.textContent).toEqual('This is a fifth heading');
  });
  it('has style properties', () => {
    const styles = global.window.getComputedStyle(elem.firstChild);
    expect(styles['font-family']).toEqual('Canela Web,Big Caslon,Times New Roman,Times,serif');
    expect(elem.firstChild).toHaveStyle('font-size: 2.3438rem');
  });
});

describe('typography heading 6', () => {
  beforeEach(() => {
    wrapper = render(<Typography element="h6" like="heading-6">This is a sixth heading</Typography>);
    elem = wrapper.container;
  });
  it('it should render the correct element', () => {
    expect(elem.querySelector('h6').nodeType === 1).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });
  it('should have correct copy', () => {
    expect(elem.textContent).toEqual('This is a sixth heading');
  });
  it('has style properties', () => {
    const styles = global.window.getComputedStyle(elem.firstChild);
    expect(styles['font-family']).toEqual('Canela Web,Big Caslon,Times New Roman,Times,serif');
    expect(elem.firstChild).toHaveStyle('font-size: 1.875rem');
  });
});

describe('typography paragraph', () => {
  beforeEach(() => {
    wrapper = render(<Typography element="p" like="paragraph-1">This is a medium paragraph</Typography>);
    elem = wrapper.container;
  });
  it('it should render the correct element', () => {
    expect(elem.querySelector('p').nodeType === 1).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });
  it('should have correct copy', () => {
    expect(elem.textContent).toEqual('This is a medium paragraph');
  });
  it('has style properties', () => {
    const styles = global.window.getComputedStyle(elem.firstChild);
    expect(styles['font-family']).toEqual('GT Walsheim Web,Helvetica,Trebuchet MS,sans-serif');
    expect(elem.firstChild).toHaveStyle('font-size: 1.875rem');
  });
});

describe('typography paragraph base', () => {
  beforeEach(() => {
    wrapper = render(<Typography element="p" like="paragraph-2">This is a paragraph</Typography>);
    elem = wrapper.container;
  });
  it('it should render the correct element', () => {
    expect(elem.querySelector('p').nodeType === 1).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });
  it('should have correct copy', () => {
    expect(elem.textContent).toEqual('This is a paragraph');
  });
  it('has style properties', () => {
    const styles = global.window.getComputedStyle(elem.firstChild);
    expect(styles['font-family']).toEqual('GT Walsheim Web,Helvetica,Trebuchet MS,sans-serif');
    expect(elem.firstChild).toHaveStyle('font-size: 1.5rem');
  });
});

describe('typography paragraph small', () => {
  beforeEach(() => {
    wrapper = render(<Typography element="p" like="paragraph-3">This is a small paragraph</Typography>);
    elem = wrapper.container;
  });
  it('it should render the correct element', () => {
    expect(elem.querySelector('p').nodeType === 1).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });
  it('should have correct copy', () => {
    expect(elem.textContent).toEqual('This is a small paragraph');
  });
  it('has style properties', () => {
    const styles = global.window.getComputedStyle(elem.firstChild);
    expect(styles['font-family']).toEqual('GT Walsheim Web,Helvetica,Trebuchet MS,sans-serif');
    expect(elem.firstChild).toHaveStyle('font-size: 1.2rem');
  });
});

describe('dec style type', () => {
  beforeEach(() => {
    wrapper = render(<Typography element="p" like="dec-1">Dec label</Typography>);
    elem = wrapper.container;
  });
  it('it should render the correct element', () => {
    expect(elem.querySelector('p').nodeType === 1).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });
  it('should have correct copy', () => {
    expect(elem.textContent).toEqual('Dec label');
  });
  it('has style properties', () => {
    const styles = global.window.getComputedStyle(elem.firstChild);
    expect(styles['font-family']).toEqual('GT Walsheim Web,Helvetica,Trebuchet MS,sans-serif');
    expect(elem.firstChild).toHaveStyle('font-size: 1.2rem');
  });
});

describe('label style type', () => {
  beforeEach(() => {
    wrapper = render(<Typography element="p" like="label-1">Label</Typography>);
    elem = wrapper.container;
  });
  it('it should render the correct element', () => {
    expect(elem.querySelector('p').nodeType === 1).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });
  it('should have correct copy', () => {
    expect(elem.textContent).toEqual('Label');
  });
  it('has style properties', () => {
    const styles = global.window.getComputedStyle(elem.firstChild);
    expect(styles['font-family']).toEqual('GT Pressura Web,Arial Narrow,Arial,sans-serif');
    expect(elem.firstChild).toHaveStyle('font-size: 1.2rem');
  });
});

describe('typography with HTML in dangerouslySetInnerHTML', () => {
  beforeEach(() => {
    wrapper = render(
      <Typography
        element="p"
        like="label-1"
        dangerouslySetInnerHTML={{ __html: '<h1>HTML, BABY!</h1>' }}
      />
    );
    elem = wrapper.container;
  });

  it('should render correctly', () => {
    expect(elem.nodeType === 1).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders a div instead of given element', () => {
    const [typography] = elem.children;
    expect(typography.tagName).toBe('DIV');
  });

  it('renders the HTML properly', () => {
    const html = wrapper.getByText('HTML, BABY!');
    expect(html.tagName).toBe('H1');
  });
});

describe('typography without HTML in dangerouslySetInnerHTML', () => {
  beforeEach(() => {
    wrapper = render(
      <Typography
        element="p"
        like="label-1"
        dangerouslySetInnerHTML={{ __html: 'No HTML Here' }}
      />
    );
    elem = wrapper.container;
  });

  it('should render correctly', () => {
    expect(elem.nodeType === 1).toEqual(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders given element', () => {
    const [typography] = elem.children;
    expect(typography.tagName).toBe('P');
  });
});
