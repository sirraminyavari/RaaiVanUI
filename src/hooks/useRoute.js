import { useEffect, useState } from "react";

const useRoute = (route) => {
  const [result, setResult] = useState({});
  useEffect(() => {
    window.RVAPI.CheckRoute({
      RouteName: route.name,
      Parameters: route.params,
      ParseResults: true,
      ResponseHandler: (response) => {
        setResult(response);
      },
    });

    return () => {
      setResult({});
    };
  }, [route.name]);
  return result;
};

export default useRoute;
