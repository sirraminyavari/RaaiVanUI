import { useEffect, useRef } from 'react';

const useInterval = (callback, delay) => {
  const savedCallback = useRef(callback);

  //! Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  //! Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    //! Don't schedule if no delay is specified.
    if (delay === null) return;

    const id = setInterval(tick, delay);

    //! Clear interval.
    return () => {
      clearInterval(id);
    };
  }, [callback, delay]);
};

export default useInterval;
