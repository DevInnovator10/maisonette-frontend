import React from 'react';
import { render } from '../../utils/tests/testTheming';
import BulletList from '.';
import Typography from '../../atoms/typography';

describe('a ttb bullet list', () => {
  let componentWrapper;
  let componentElement;

  beforeEach(() => {
    componentWrapper = render(
      <BulletList>
        <Typography element="li" like="dec-1">List Item 1</Typography>
        <Typography element="li" like="dec-1">List Item 2</Typography>
        <Typography element="li" like="dec-1">List Item 3</Typography>
        <Typography element="li" like="dec-1">List Item 4</Typography>
        <Typography element="li" like="dec-1">List Item 5</Typography>
        <Typography element="li" like="dec-1">List Item 6</Typography>
      </BulletList>
    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has 1 column', () => {
    const listItems = componentElement.querySelectorAll('li');
    listItems.forEach((item) => {
      expect(item).toHaveStyle('flex: 0 0 100%');
    });
  });

  it('has styles', () => {
    expect(componentElement).toHaveStyle('display: flex');
    expect(componentElement).toHaveStyle('flex-wrap: wrap');
    expect(componentElement).toHaveStyle('list-style: disc');
    expect(componentElement).toHaveStyle('color: #3150A2');
    expect(componentElement).toHaveStyle('margin-left: 1.5rem');

    expect(componentElement.querySelector('li')).toHaveStyle('flex: 0 0 100%');
  });
});

describe('a ltr bullet list', () => {
  let componentWrapper;
  let componentElement;

  beforeEach(() => {
    componentWrapper = render(
      <BulletList mode="ltr">
        <Typography element="li" like="dec-1">List Item 1</Typography>
        <Typography element="li" like="dec-1">List Item 2</Typography>
        <Typography element="li" like="dec-1">List Item 3</Typography>
        <Typography element="li" like="dec-1">List Item 4</Typography>
        <Typography element="li" like="dec-1">List Item 5</Typography>
        <Typography element="li" like="dec-1">List Item 6</Typography>
      </BulletList>
    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has 2 columns', () => {
    const listItems = componentElement.querySelectorAll('li');
    listItems.forEach((item) => {
      expect(item).toHaveStyle('flex: 0 0 50%');
    });
  });

  it('has styles', () => {
    expect(componentElement).toHaveStyle('display: flex');
    expect(componentElement).toHaveStyle('flex-wrap: wrap');
    expect(componentElement).toHaveStyle('list-style: disc');
    expect(componentElement).toHaveStyle('color: #3150A2');
    expect(componentElement).toHaveStyle('margin-left: 1.5rem');

    expect(componentElement.querySelector('li')).toHaveStyle('flex: 0 0 50%');
  });
});

describe('a rtl bullet list', () => {
  let componentWrapper;
  let componentElement;

  beforeEach(() => {
    componentWrapper = render(
      <BulletList mode="rtl">
        <Typography element="li" like="dec-1">List Item 1</Typography>
        <Typography element="li" like="dec-1">List Item 2</Typography>
        <Typography element="li" like="dec-1">List Item 3</Typography>
        <Typography element="li" like="dec-1">List Item 4</Typography>
        <Typography element="li" like="dec-1">List Item 5</Typography>
        <Typography element="li" like="dec-1">List Item 6</Typography>
      </BulletList>
    );

    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has 2 columns', () => {
    const listItems = componentElement.querySelectorAll('li');
    listItems.forEach((item) => {
      expect(item).toHaveStyle('flex: 0 0 50%');
    });
  });

  it('has direction rtl', () => {
    expect(componentElement).toHaveStyle('direction: rtl');
  });

  it('has styles', () => {
    expect(componentElement).toHaveStyle('display: flex');
    expect(componentElement).toHaveStyle('flex-wrap: wrap');
    expect(componentElement).toHaveStyle('list-style: disc');
    expect(componentElement).toHaveStyle('color: #3150A2');
    expect(componentElement).toHaveStyle('margin-right: 1.5rem');

    expect(componentElement.querySelector('li')).toHaveStyle('flex: 0 0 50%');
  });
});
