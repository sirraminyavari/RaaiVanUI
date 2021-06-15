import { useEffect, useRef } from 'react';

export const useOutsideClick = (ref, callback, when) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  });

  const handler = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      savedCallback.current();
    }
  };

  useEffect(() => {
    if (when) {
      document.addEventListener('click', handler);

      return () => document.removeEventListener('click', handler);
    }
  }, [when]);
};
