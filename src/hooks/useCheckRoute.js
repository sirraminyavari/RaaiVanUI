import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useQuery from 'hooks/useQuery';
import APIHandler from 'apiHelper/APIHandler';

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
  const apiHandler = new APIHandler('RVAPI', 'CheckRoute');

  useEffect(() => {
    const checkTimeout = setTimeout(() => {
      apiHandler.fetch(
        { RouteName: name, Parameters: params, ParseResults: true },
        (response) => setResult(response),
        (error) => console.log(error)
      );
    }, 1000);

    return () => {
      clearTimeout(checkTimeout);
      setResult({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, routeParams, queryParams]);
  return result;
};

export default useCheckRoute;
