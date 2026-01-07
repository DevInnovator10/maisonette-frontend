// https://immerjs.github.io/immer/installation/#pick-your-immer-version

import { enableAllPlugins, produce } from 'immer';

const produceImmer = (...args) => {
  enableAllPlugins();
  return produce(...args);
};

export default produceImmer;
