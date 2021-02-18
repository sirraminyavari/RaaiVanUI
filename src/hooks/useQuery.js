import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This hook returns a key-value pair object of query params if exist.
 * @hook
 * @returns {Object} The object of all query params at a location as key-value pair.
 */
const useQuery = () => {
  const [query, setQuery] = useState({});
  const location = useLocation();
  useEffect(() => {
    const queryAll = new URLSearchParams(location.search).toString();
    const queryList = queryAll.split('&');
    const query = queryList.reduce((prev, q) => {
      let arr = q.split('=');
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
