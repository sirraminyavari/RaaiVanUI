import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useQuery from "hooks/useQuery";

const useCheckRoute = ({ name }) => {
  const [result, setResult] = useState({});
  const routeParams = useParams();
  const queryParams = useQuery();
  const params = { ...routeParams, ...queryParams };
  useEffect(() => {
    window.RVAPI.CheckRoute({
      RouteName: name,
      Parameters: params,
      ParseResults: true,
      ResponseHandler: (response) => {
        setResult(response);
      },
    });

    return () => {
      setResult({});
    };
  }, [name]);
  return result;
};

export default useCheckRoute;
