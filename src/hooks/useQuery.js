import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useQuery = () => {
  const [query, setQuery] = useState({});
  const location = useLocation();
  useEffect(() => {
    const queryAll = new URLSearchParams(location.search).toString();
    const queryList = queryAll.split("&");
    const query = queryList.reduce((prev, q) => {
      let arr = q.split("=");
      let key = arr[0];
      let value = arr[1];
      return { ...prev, [key]: value };
    }, {});

    if (queryAll.length !== 0) {
      setQuery(query);
    }
  }, [location.search]);

  return query;
};

export default useQuery;
