import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useQuery from 'hooks/useQuery';
import APIHandler from 'apiHelper/APIHandler';

const useCheckRoute = (name) => {
  const [result, setResult] = useState({});
  const routeParams = useParams();
  const queryParams = useQuery();
  const params = { ...routeParams, ...queryParams };
  const apiHandler = new APIHandler('RVAPI', 'CheckRoute');

  useEffect(() => {
    apiHandler.fetch(
      { RouteName: name, Parameters: params, ParseResults: true },
      (response) => setResult(response),
      (error) => console.log(error)
    );

    return () => {
      setResult({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, routeParams, queryParams]);
  return result;
};

export default useCheckRoute;
