import { useState, useEffect } from 'react';

/**
 * This hook allows you to debounce any fast changing value.
 * @param {string} value - The value for debouncing.
 * @param {number} delay - The dealy of debounce.
 * @returns {string} The debounced value
 */
const useDebounce = (value, delay) => {
  //! State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      //! Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      //! Cancel the timeout if value changes (also on delay change or unmount)
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] //! Only re-call effect if value or delay changes
  );

  return debouncedValue;
};

export default useDebounce;
