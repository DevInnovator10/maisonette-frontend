import fetchMock from 'fetch-mock';
import {
  response,
  incorrectRes,
  incorrectRes2
} from './navigation';

// duped from './navigation' file will only be available after build
// test don't go through the build process
const reduceNavigation = (navigation) => navigation.reduce((accumulator, current) => {
  const item = current;
  const key = item.depth;

  if (!accumulator[key]) {
    accumulator[key] = [];
  }

  const keys = Object.keys(accumulator);

  if (key < Math.max(...keys) && accumulator[key + 1]) {
    const parent = accumulator[key + 1].find((x) => x.parent_id === item.id);
    item.has_children = !!parent;
  } else {
    item.has_children = false;
  }

  accumulator[key].push(item);
  return accumulator;
}, {});

const mock = fetchMock.sandbox().get('mock/api/navigation', response);
const errMock = fetchMock.sandbox().get('mock/api/navigation', incorrectRes);
const errMock2 = fetchMock.sandbox().get('mock/api/navigation', incorrectRes2);

export const getNavigationMock = async () => {
  let navigation;

  await mock('mock/api/navigation')
    .then((r) => r.json())
    .then((d) => {
      navigation = { ...reduceNavigation(d.sort((a, b) => b.lft - a.lft)) };
    });

  return navigation;
};

export const getErrNavMock = async () => {
  let navigation;

  await errMock('mock/api/navigation')
    .then((r) => r.json())
    .then((d) => {
      navigation = { ...reduceNavigation(d.sort((a, b) => b.lft - a.lft)) };
    });

  return navigation;
};

export const getErrNavMock2 = async () => {
  let navigation;

  await errMock2('mock/api/navigation')
    .then((r) => r.json())
    .then((d) => {
      navigation = { ...reduceNavigation(d.sort((a, b) => b.lft - a.lft)) };
    });

  return navigation;
};
