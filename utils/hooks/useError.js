import { useEffect, useState } from 'react';

const useError = (handler, tag) => {
  const [error, setError] = useState(false);

  useEffect(() => {

    if (error) {
      throw error;
    }
  }, [error]);

  return async (...params) => {
    try {
      const res = await handler(...params);
      if (res && res.error) throw new Error(tag);
    } catch (e) {
      setError(e.message);
    }
  };
};

export default useError;
