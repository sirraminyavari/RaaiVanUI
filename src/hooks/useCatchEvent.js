import { useState, useEffect } from 'react';

const useCatchEvent = (checkFunc, { timeout = 100 }) => {
  const [caught, setCaught] = useState(checkFunc());

  let to = null;

  if (!caught)
    to = setTimeout(() => {
      setCaught(checkFunc());
    }, timeout);

  useEffect(() => {
    return () => clearTimeout(to);
  }, []);

  return caught;
};

export default useCatchEvent;
