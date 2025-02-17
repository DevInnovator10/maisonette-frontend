const getAbortController = (global) => {
  if (global?.window?.AbortController) {
    return new global.window.AbortController();
  }

  // eslint-disable-next-line global-require
  const AbortController = require('abort-controller');
  return new AbortController();
};

export default getAbortController;
