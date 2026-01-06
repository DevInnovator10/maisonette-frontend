import { configure } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Router from 'next/router';

configure({ testIdAttribute: 'data-test-id' });

const originalError = console.error;

/*
 * https://github.com/vercel/next.js/issues?q=An+update+to+Link+inside+a+test+was+not+wrapped+in+act%28
 * next@10 has a bug with "next/link"
 * below mutes the error
*/

beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

const mockedRouter = {
  push: () => {},
  query: {},
  pathname: '',
  withRouter: () => {}
};

Router.router = mockedRouter;

process.env = Object.assign(
  process.env, {
    NEXT_PUBLIC_ALGOLIA_APP_ID: 'x',
    NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY: 'x',
    NEXT_PUBLIC_ASSET_HOST: 'https://assets.stg.env.maisonette.com',
    NEXT_PUBLIC_CLIENT_HOST: 'http://localhost:7777',
    NEXT_PUBLIC_ALGOLIA_PRODUCTS_INDEX: 'products_gotdoodle',
    NEXT_PUBLIC_ALGOLIA_PRODUCTS_QUERY_SUGGESTIONS_INDEX: 'products_gotdoodle_query_suggestions',
    NEXT_PUBLIC_ALGOLIA_CONTENTS_INDEX: 'contents_gotdoodle',
    NEXT_PUBLIC_ALGOLIA_PRODUCTS_FREQUENTLY_BOUGHT: 'products_gotdoodle_best_sellers',
    NEXT_PUBLIC_ALGOLIA_PRODUCTS_RECOMMENDED: 'products_gotdoodle_recommended'
  }
);

global.window.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn()
}));

// global.window.IntersectionObserver = jest.fn().mockImplementation(() => ({
//   observe: jest.fn(),
//   unobserve: jest.fn()
// }));

// eslint-disable-next-line no-underscore-dangle
global.window._vwo_campaignData = {};

global.window.requestAnimationFrame = jest.fn().mockImplementation((callback) => callback());

global.window.scroll = jest.fn();

global.PayPalSDK = {
  Buttons: { driver: jest.fn() },
  FUNDING: {
    PAYPAL: 'paypal',
    PAYLATER: 'paylater'
  },
  isFundingEligible: jest.fn()
};

function setScrollY(scrollObj) {
  global.window.scrollY = scrollObj.top;
}

global.window.scrollTo = jest.fn()
  .mockImplementation((scrollObj) => setScrollY(scrollObj));

global.Math.random = () => 1;

global.window.dataLayer = [];

global.window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => null;
  DynamicComponent.displayName = 'LoadableComponent';
  DynamicComponent.preload = jest.fn();
  return DynamicComponent;
});

jest.mock('algoliasearch', () => () => {
  const searchClient = {};
  const algoliasearch = jest.fn(() => searchClient);
  return algoliasearch;
});

jest.mock('next/router', () => ({
  withRouter() {},
  useRouter: jest.fn(() => ({
    route: '/',
    pathname: '',
    query: '',
    asPath: '',
    events: {
      on: () => {},
      off: () => {}
    }
  }))
}));

// eslint-disable-next-line func-names
global.window.IntersectionObserver = jest.fn(function () {
  this.observe = jest.fn();
  this.unobserve = jest.fn();
  this.disconnect = jest.fn();
});
