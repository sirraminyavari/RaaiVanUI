import { useLayoutEffect } from 'react';

/**
 * This hook prevents a given 'ref' from scrolling.
 * @hook
 */
const usePreventScroll = (ref) => {
  useLayoutEffect(() => {
    const containerNode = ref.current;
    const preventScroll = (e) => e.preventDefault();
    containerNode.addEventListener('mousewheel', preventScroll);

    //! Clean up
    return () => {
      containerNode.removeEventListener('mousewheel', preventScroll);
    };
  }, [ref]);
};

export default usePreventScroll;
