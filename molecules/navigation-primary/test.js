import React from 'react';
import { getNavigationMock, getErrNavMock, getErrNavMock2 } from '../../utils/tests/navigation.mock';
import { render } from '../../utils/tests/testTheming';
import NavigationPrimary from '.';

describe('navigation primary list', () => {
  let componentWrapper;
  let componentElement;
  let navigation;

  beforeEach(async () => {
    navigation = await getNavigationMock();
    componentWrapper = render(
      <NavigationPrimary
        isActive={false}
        isMobile={false}
        navigation={navigation}
        renderSecondary={() => {}}
        renderSecondaryNoChildren={() => {}}
        handleChange={() => {}}
      />
    );
    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has correct number of navigation items', () => {
    const numOfChildren = navigation['1'].length;
    expect(componentElement.querySelectorAll('li').length).toEqual(numOfChildren);
  });
});

describe('error navigation primary list', () => {
  let componentWrapper;
  let componentElement;
  let navigation;

  beforeEach(async () => {
    navigation = await getErrNavMock();

    componentWrapper = render(
      <NavigationPrimary
        isActive={false}
        isMobile={false}
        navigation={navigation}
        renderSecondary={() => {}}
        renderSecondaryNoChildren={() => {}}
        handleChange={() => {}}
      />
    );
    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has correct number of navigation items', () => {
    const numOfChildren = navigation['1'].length;
    expect(componentElement.querySelectorAll('li').length).toEqual(numOfChildren);
  });
});

describe('error navigation primary list 2', () => {
  let componentWrapper;
  let componentElement;
  let navigation;

  beforeEach(async () => {
    navigation = await getErrNavMock2();

    componentWrapper = render(
      <NavigationPrimary
        isActive={false}
        isMobile={false}
        navigation={navigation}
        renderSecondary={() => {}}
        renderSecondaryNoChildren={() => {}}
        handleChange={() => {}}
      />
    );
    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has correct number of navigation items', () => {
    const numOfChildren = navigation['1'].length;
    expect(componentElement.querySelectorAll('li').length).toEqual(numOfChildren);
  });
});
