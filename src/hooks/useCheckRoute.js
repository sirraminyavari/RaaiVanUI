import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useQuery from 'hooks/useQuery';
import API from 'apiHelper';

/**
 * This hook checks every route for permission.
 * @hook
 * @param {string} name -The name of the given route.
 * @returns {Object} The result object
 */
const useCheckRoute = (name) => {
  const [result, setResult] = useState({});
  const routeParams = useParams();
  const queryParams = useQuery();
  const params = { ...routeParams, ...queryParams };

  useEffect(() => {
    const prevURL = window.location.href;

    const check = async (name, params) => {
      const res = await API.RV.checkRoute({
        RouteName: name,
        Parameters: params,
      });

      if (prevURL === window.location.href) setResult(res);
    };

    check(name, params);

    return () => {
      setResult({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, routeParams, queryParams]);

  return result;
};

export default useCheckRoute;
