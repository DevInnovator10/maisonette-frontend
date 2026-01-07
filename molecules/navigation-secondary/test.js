import React from 'react';
import { getNavigationMock, getErrNavMock, getErrNavMock2 } from '../../utils/tests/navigation.mock';
import { render } from '../../utils/tests/testTheming';
import NavigationSecondary from '.';

describe('navigation secondary list', () => {
  let componentWrapper;
  let componentElement;
  let parent;
  let navigation;

  beforeEach(async () => {
    navigation = await getNavigationMock();
    parent = navigation['1'].find((x) => x.name.toLowerCase() === 'what\'s new');

    componentWrapper = render(
      <NavigationSecondary
        isMobile={false}
        navigation={navigation}
        parent={parent}
        renderTertiary={() => {}}
        handleChange={() => {}}
      />
    );
    componentElement = componentWrapper.container.firstChild;
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has "view all" link that uses view_all_url_override if present', () => {
    const viewAll = componentWrapper.getByText('View All');
    expect(viewAll).toBeDefined();
    expect(viewAll.href).toContain('/shop?w=banana');
  });

  it('has correct number of navigation items', () => {
    const numOfChildren = navigation['2'].filter((x) => x.parent_id === parent.id).length;
    // + 1 for 'View All'
    expect(componentElement.querySelectorAll('li').length).toEqual(numOfChildren + 1);
  });
});

describe('incorrect navigation secondary list', () => {
  let componentWrapper;
  let parent;
  let navigation;

  beforeEach(async () => {
    navigation = await getErrNavMock();
    parent = navigation?.['1']?.find?.((x) => x.name.toLowerCase() === 'what\'s new') ?? null;

    componentWrapper = render(
      <NavigationSecondary
        isMobile={false}
        navigation={navigation}
        parent={parent}
        renderTertiary={() => {}}
        handleChange={() => {}}
      />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('doesn\'t have "view all" link', () => {
    const viewAll = componentWrapper.queryByText('View All');
    expect(viewAll).toBeNull();
  });

  it('has correct number of navigation items', () => {
    const children = navigation?.['2']?.filter?.((x) => x.parent_id === parent.id) ?? [];
    const numOfChildren = children.length;
    // + 1 for 'View All'
    expect(numOfChildren).toEqual(0);
  });
});

describe('incorrect navigation secondary list 2', () => {
  let componentWrapper;
  let parent;
  let navigation;

  beforeEach(async () => {
    navigation = await getErrNavMock2();
    parent = navigation?.['1']?.find?.((x) => x.name.toLowerCase() === 'what\'s new') ?? null;

    componentWrapper = render(
      <NavigationSecondary
        isMobile={false}
        navigation={navigation}
        parent={parent}
        renderTertiary={() => {}}
        handleChange={() => {}}
      />
    );
  });

  it('renders correctly', () => {
    expect(componentWrapper.container.nodeType === 1).toEqual(true);
    expect(componentWrapper).toMatchSnapshot();
  });

  it('has "view all" link', () => {
    const viewAll = componentWrapper.queryByText('View All');
    expect(viewAll).toBeDefined();
  });

  it('has correct number of navigation items', () => {
    const children = navigation?.['2']?.filter?.((x) => x.parent_id === parent.id) ?? [];
    const numOfChildren = children.length;
    // + 1 for 'View All'
    expect(numOfChildren).toEqual(2);
  });
});
