import { useState, useEffect } from 'react';

const { jQuery } = window;

const getScrollTop = () => {
  return jQuery('html, body').scrollTop();
};

function useWindowScroll({ timeOut } = {}) {
  let [scrollTop, setScrollTop] = useState(getScrollTop());

  // in this case useEffect will execute only once because
  // it does not have any dependencies.
  useEffect(() => {
    // timeoutId for debounce mechanism
    let timeoutId = null;
    const scrollListener = () => {
      if (!timeOut) setScrollTop(getScrollTop());
      else {
        // prevent execution of previous setTimeout
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => setScrollTop(getScrollTop()), 0);
      }
    };

    window.addEventListener('scroll', scrollListener);

    // clean up function
    return () => {
      window.removeEventListener('scroll', scrollListener);
      clearTimeout(timeoutId);
    };
  }, []);

  return scrollTop;
}

export default useWindowScroll;
