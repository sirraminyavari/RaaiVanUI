import { useState, useEffect } from 'react';

/**
 * This hook makes it easy to detect when the user is pressing a specific key on their keyboard.
 * @hook
 * @param {string} targetKey -The key name that user has pressed.
 * @returns {boolean} The result as boolean which indicates if key has been pressed or not.
 */
const useKeyPress = (targetKey) => {
  //! State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  //! If pressed key is our target key then set to true
  const downHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  };

  //! If released key is our target key then set to false
  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  //! Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    //! Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return keyPressed;
};

export default useKeyPress;
