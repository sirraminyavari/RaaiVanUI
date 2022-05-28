import { useContext } from 'react';
import { WindowContext } from 'context/WindowProvider';

const useWindowContext = () => {
  return useContext(WindowContext);
};

export default useWindowContext;
