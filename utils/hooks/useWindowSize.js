import { useEffect, useState } from 'react';

const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined
  });

  // Event that checks for window size change every 500ms

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: global.innerWidth,
        height: global.innerHeight
      });
    };

    // Add event listener
    global.window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => global.window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
};

export default useWindowSize;
