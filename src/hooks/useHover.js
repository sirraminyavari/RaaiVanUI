import { useEffect, useRef, useState } from 'react';

/**
 * This hook makes it easy to detect whether the mouse is hovering an element.
 * @hook
 * @returns {array} -A ref and a boolean value indicating whether the element with that ref is currently being hovered.
 */
const useHover = () => {
  const [value, setValue] = useState(false);
  const ref = useRef(null);
  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);

  useEffect(
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener('mouseover', handleMouseOver);
        node.addEventListener('mouseout', handleMouseOut);
        return () => {
          node.removeEventListener('mouseover', handleMouseOver);
          node.removeEventListener('mouseout', handleMouseOut);
        };
      }
    },
    [ref.current] //! Recall only if ref changes.
  );
  return [ref, value];
};

export default useHover;
