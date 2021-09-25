import { useHistory } from 'react-router-dom';

/**
 * This hook listens to any route change and will fire a callback.
 * @hook
 */
const useRouteListener = (callback) => {
  const history = useHistory();

  history.listen((location) => {
    callback();
    return location;
  });
};

export default useRouteListener;
