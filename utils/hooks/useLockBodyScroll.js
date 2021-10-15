/* eslint-disable no-return-assign */

import { useLayoutEffect } from 'react';

const { window, document } = global;

const useLockBodyScroll = () => {
  useLayoutEffect(() => {
    // Get original body overflow
    const originalStyle = window.getComputedStyle(document.body).overflowY;
    // Prevent scrolling on mount
    document.body.style.overflowY = 'hidden';
    // Re-enable scrolling when component unmounts
    return () => document.body.style.overflowY = originalStyle;
  }, []); // Empty array ensures effect is only run on mount and unmount
};

export default useLockBodyScroll;
