import React from 'react';
import { fireEvent, waitForElement } from '@testing-library/react';
import { render } from '../../utils/tests/testTheming';
import Button from '.';
import IconHeart from '../icon-heart';

let wrapper;

let promiseWillPass = true;

const dummyPromise = () => new Promise(
  (resolve, reject) => (
    // eslint-disable-next-line prefer-promise-reject-errors
    promiseWillPass ? resolve('Success') : reject('Failure')
  )
);

const promiseInProgress = (ref) => {
  const element = ref;
  element.textContent = 'Promised';
};

const promisePassed = (ref, res) => {
  const element = ref;
  element.textContent = res;
};

const promiseFailed = (ref, error) => {
  const element = ref;
  element.textContent = error;
};

const promiseComplete = (ref) => {
  const element = ref;

  setTimeout(() => {
    element.textContent = 'Complete';
  }, 100);
};

describe('a button with a promise', () => {
  it('renders correctly', () => {
    wrapper = render(
      <Button
        type="submit"
        promise={dummyPromise}
        handleOnSuccess={promisePassed}
        onError={promiseFailed}
      >
        Click Me!
      </Button>
    );

    expect(
      wrapper.container.querySelector('button')
        .nodeType === 1
    ).toEqual(true);

    expect(wrapper).toMatchSnapshot();
  });

  it('handles handleOnSuccess', async () => {
    wrapper = render(
      <Button
        type="submit"
        promise={dummyPromise}
        handleOnSuccess={promisePassed}
        onError={promiseFailed}
      >
        Click Me!
      </Button>
    );

    const button = wrapper.getByText('Click Me!');
    fireEvent.click(button);

    const sucessButton = await waitForElement(() => wrapper.getByText('Success'));
    expect(sucessButton).toBeDefined();
  });

  it('handles onError', async () => {
    promiseWillPass = false;

    wrapper = render(
      <Button
        type="submit"
        promise={dummyPromise}
        handleOnSuccess={promisePassed}
        onError={promiseFailed}
      >
        Click Me!
      </Button>
    );

    const button = wrapper.getByText('Click Me!');
    fireEvent.click(button);

    const failureButton = await waitForElement(() => wrapper.getByText('Failure'));
    expect(failureButton).toBeDefined();
  });

  it('handles handleonComplete', async () => {
    promiseWillPass = true;

    wrapper = render(
      <Button
        type="submit"
        promise={dummyPromise}
        handleOnSuccess={promisePassed}
        onError={promiseFailed}
        handleonComplete={promiseComplete}
      >
        Click Me!
      </Button>
    );

    const button = wrapper.getByText('Click Me!');
    fireEvent.click(button);

    const failureButton = await waitForElement(() => wrapper.getByText('Complete'));
    expect(failureButton).toBeDefined();
  });

  it('handles handleOnPromise', async () => {
    promiseWillPass = true;

    wrapper = render(
      <Button
        type="submit"
        promise={dummyPromise}
        handleOnSuccess={promisePassed}
        onError={promiseFailed}
        handleOnPromise={promiseInProgress}
      >
        Click Me!
      </Button>
    );

    const button = wrapper.getByText('Click Me!');
    fireEvent.click(button);

    const failureButton = await waitForElement(() => wrapper.getByText('Promised'));
    expect(failureButton).toBeDefined();
  });
});

describe('a button', () => {
  beforeEach(() => {
    wrapper = render(<Button type="button">Click Me!</Button>);
  });

  it('renders correctly', () => {
    expect(
      wrapper.container.querySelector('button')
        .nodeType === 1
    ).toEqual(true);

    expect(wrapper).toMatchSnapshot();
  });

  it('has correct type', () => {
    expect(
      wrapper.container.querySelector('button')
        .getAttribute('type')
    ).toEqual('button');
  });

  it('has default button styles', () => {
    expect(wrapper.container.firstChild).toHaveStyle('background: transparent');
    expect(wrapper.container.firstChild).toHaveStyle('background-color: #3150A2');
    expect(wrapper.container.firstChild).toHaveStyle('box-sizing: border-box');
    expect(wrapper.container.firstChild).toHaveStyle('cursor: pointer');
    expect(wrapper.container.firstChild).toHaveStyle('font: inherit');
    expect(wrapper.container.firstChild).toHaveStyle('font-size: 1.2rem');
    expect(wrapper.container.firstChild).toHaveStyle('letter-spacing: .24em');
    expect(wrapper.container.firstChild).toHaveStyle('line-height: 4rem');
    expect(wrapper.container.firstChild).toHaveStyle('margin: 0');
    expect(wrapper.container.firstChild).toHaveStyle('max-height: 4.4rem');
    expect(wrapper.container.firstChild).toHaveStyle('opacity: 1');
    expect(wrapper.container.firstChild).toHaveStyle('overflow: hidden');
    expect(wrapper.container.firstChild).toHaveStyle('padding: 0 3.5rem');
    expect(wrapper.container.firstChild).toHaveStyle('text-transform: uppercase');
    expect(wrapper.container.firstChild).toHaveStyle('transition-property: opacity');
    expect(wrapper.container.firstChild).toHaveStyle('width: auto');
  });
});

describe('an outline button', () => {
  beforeEach(() => {
    wrapper = render(<Button outline type="button">Click Me!</Button>);
  });

  it('renders correctly', () => {
    expect(
      wrapper.container.querySelector('button')
        .nodeType === 1
    ).toEqual(true);

    expect(wrapper).toMatchSnapshot();
  });

  it('has correct type', () => {
    expect(
      wrapper.container.querySelector('button')
        .getAttribute('type')
    ).toEqual('button');
  });

  it('has outline button styles', () => {
    expect(wrapper.container.firstChild).toHaveStyle('background: transparent');
    expect(wrapper.container.firstChild).toHaveStyle('color: #3150A2');
    expect(wrapper.container.firstChild).toHaveStyle('cursor: pointer');
    expect(wrapper.container.firstChild).toHaveStyle('font: inherit');
    expect(wrapper.container.firstChild).toHaveStyle('font-size: 1.2rem');
    expect(wrapper.container.firstChild).toHaveStyle('letter-spacing: .24em');
    expect(wrapper.container.firstChild).toHaveStyle('line-height: 4rem');
    expect(wrapper.container.firstChild).toHaveStyle('margin: 0');
    expect(wrapper.container.firstChild).toHaveStyle('max-height: 4.4rem');
    expect(wrapper.container.firstChild).toHaveStyle('opacity: 1');
    expect(wrapper.container.firstChild).toHaveStyle('overflow: hidden');
    expect(wrapper.container.firstChild).toHaveStyle('padding: 0 3.5rem');
    expect(wrapper.container.firstChild).toHaveStyle('text-transform: uppercase');
    expect(wrapper.container.firstChild).toHaveStyle('transition-property: opacity');
  });
});

describe('an inverted button', () => {
  beforeEach(() => {
    wrapper = render(<Button outline inverted type="button">Click Me!</Button>);
  });

  it('renders correctly', () => {
    expect(
      wrapper.container.querySelector('button')
        .nodeType === 1
    ).toEqual(true);

    expect(wrapper).toMatchSnapshot();
  });

  it('has correct type', () => {
    expect(
      wrapper.container.querySelector('button')
        .getAttribute('type')
    ).toEqual('button');
  });

  it('has inverted button styles', () => {
    expect(wrapper.container.firstChild).toHaveStyle('background: transparent');
    expect(wrapper.container.firstChild).toHaveStyle('border: 0.2rem solid #FFFFFF');
    expect(wrapper.container.firstChild).toHaveStyle('box-sizing: border-box');
    expect(wrapper.container.firstChild).toHaveStyle('color: #FFFFFF');
    expect(wrapper.container.firstChild).toHaveStyle('cursor: pointer');
    expect(wrapper.container.firstChild).toHaveStyle('font: inherit');
    expect(wrapper.container.firstChild).toHaveStyle('font-size: 1.2rem');
    expect(wrapper.container.firstChild).toHaveStyle('letter-spacing: .24em');
    expect(wrapper.container.firstChild).toHaveStyle('line-height: 4rem');
    expect(wrapper.container.firstChild).toHaveStyle('margin: 0');
    expect(wrapper.container.firstChild).toHaveStyle('max-height: 4.4rem');
    expect(wrapper.container.firstChild).toHaveStyle('opacity: 1');
    expect(wrapper.container.firstChild).toHaveStyle('overflow: hidden');
    expect(wrapper.container.firstChild).toHaveStyle('padding: 0 3.5rem');
    expect(wrapper.container.firstChild).toHaveStyle('text-transform: uppercase');
    expect(wrapper.container.firstChild).toHaveStyle('transition-property: opacity');
  });
});

describe('an icon button', () => {
  beforeEach(() => {
    wrapper = render(
      <Button isIcon type="button">
        <IconHeart />
      </Button>
    );
  });

  it('renders correctly', () => {
    expect(
      wrapper.container.querySelector('button')
        .nodeType === 1
    ).toEqual(true);

    expect(wrapper).toMatchSnapshot();
  });

  it('has correct type', () => {
    expect(
      wrapper.container.querySelector('button')
        .getAttribute('type')
    ).toEqual('button');
  });

  it('has icon button styles', () => {
    expect(wrapper.container.firstChild).toHaveStyle('background: transparent');
    expect(wrapper.container.firstChild).toHaveStyle('background-color: #3150A2');
    expect(wrapper.container.firstChild).toHaveStyle('cursor: pointer');
    expect(wrapper.container.firstChild).toHaveStyle('font-size: 1.2rem');
    expect(wrapper.container.firstChild).toHaveStyle('letter-spacing: .24em');
    expect(wrapper.container.firstChild).toHaveStyle('line-height: 4rem');
    expect(wrapper.container.firstChild).toHaveStyle('margin: 0');
    expect(wrapper.container.firstChild).toHaveStyle('max-height: 4.4rem');
    expect(wrapper.container.firstChild).toHaveStyle('opacity: 1');
    expect(wrapper.container.firstChild).toHaveStyle('overflow: hidden');
    expect(wrapper.container.firstChild).toHaveStyle('padding: 0');
    expect(wrapper.container.firstChild).toHaveStyle('text-transform: uppercase');
    expect(wrapper.container.firstChild).toHaveStyle('transition-property: opacity');
  });
});

describe('an text button', () => {
  beforeEach(() => {
    wrapper = render(
      <Button isText type="button">
        <IconHeart />
      </Button>
    );
  });

  it('renders correctly', () => {
    expect(
      wrapper.container.querySelector('button')
        .nodeType === 1
    ).toEqual(true);

    expect(wrapper).toMatchSnapshot();
  });

  it('has correct type', () => {
    expect(
      wrapper.container.querySelector('button')
        .getAttribute('type')
    ).toEqual('button');
  });

  it('has icon button styles', () => {
    expect(wrapper.container.firstChild).toHaveStyle('background: transparent');
    expect(wrapper.container.firstChild).toHaveStyle('background-color: #3150A2');
    expect(wrapper.container.firstChild).toHaveStyle('cursor: pointer');
    expect(wrapper.container.firstChild).toHaveStyle('font: inherit');
    expect(wrapper.container.firstChild).toHaveStyle('font-size: 1.2rem');
    expect(wrapper.container.firstChild).toHaveStyle('letter-spacing: .2em');
    expect(wrapper.container.firstChild).toHaveStyle('line-height: 4rem');
    expect(wrapper.container.firstChild).toHaveStyle('margin: 0');
    expect(wrapper.container.firstChild).toHaveStyle('max-height: 4.4rem');
    expect(wrapper.container.firstChild).toHaveStyle('opacity: 1');
    expect(wrapper.container.firstChild).toHaveStyle('overflow: hidden');
    expect(wrapper.container.firstChild).toHaveStyle('padding: 0');
    expect(wrapper.container.firstChild).toHaveStyle('text-transform: uppercase');
    expect(wrapper.container.firstChild).toHaveStyle('transition-property: opacity');
  });
});
