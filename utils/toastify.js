export const TOAST = {
  TYPE: {
    DEFAULT: 'default',
    ERROR: 'error',
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning'
  }
};

const asyncToast = async (content, options) => {
  const { toast } = await import(/* webpackChunkName: "react_toastify" */ 'react-toastify');
  toast(content, options);
};

export { asyncToast as toast };
