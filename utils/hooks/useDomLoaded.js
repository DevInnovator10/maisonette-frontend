import { useEffect, useState } from 'react';

const useDomLoaded = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (global.document.readyState !== 'loading') {
      setLoaded(true);
    }
  });

  return loaded;
};

export default useDomLoaded;
