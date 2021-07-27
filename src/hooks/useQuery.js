import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This hook returns a key-value pair object of query params if exist.
 * @hook
 * @returns {Object} The object of all query params at a location as key-value pair.
 */
const useQuery = () => {
  const location = useLocation();

  const getQuery = () => {
    const queryAll = new URLSearchParams(location.search).toString();
    const queryList = queryAll.split('&');
    const qr = queryList.reduce((prev, q) => {
      let arr = q.split('=');
      let key = arr[0];
      let value = arr[1];
      return { ...prev, [key]: value };
    }, {});

    return queryAll.length !== 0 ? qr : {};
  };

  const [query, setQuery] = useState(getQuery());

  useEffect(() => {
    console.log('called');
    setQuery(getQuery);
  }, [window.location.href]);

  return query;
};

export default useQuery;
