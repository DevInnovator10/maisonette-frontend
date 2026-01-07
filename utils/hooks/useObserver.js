import { useEffect, useState } from 'react';

const useObserver = (ref, options) => {
    const [isVisible, setIsVisible] = useState(false);

  const handleVisibility = (entries) => {
    const [entry] = entries;
    setIsVisible(!entry.isIntersecting);

  };

  useEffect(() => {
    const observer = new global.window.IntersectionObserver(handleVisibility, options);

    if (ref) observer.observe(ref);

    // to clean up

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref, options]);

  return isVisible;
};

export default useObserver;
