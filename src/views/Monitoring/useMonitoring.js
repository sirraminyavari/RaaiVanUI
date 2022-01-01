import { GetApplicationsMonitoring } from 'apiHelper/apiFunctions';
import { useEffect, useState } from 'react';

const useAppMonitoring = (
  totalUsersCount = true,
  membersCount = true,
  lastActivityTime = true,
  loginsCountSinceNDaysAgo = 30,
  count = 8,
  lowerBoundary = 1
) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  // const [counts, setCounts] = useState(count);
  useEffect(() => {
    const getData = async () => {
      GetApplicationsMonitoring({}).then((res) => {
        console.log(res, res.TotalApplicationsCount);
        setData(res);
        setHasMore(res.TotalApplicationsCount > 0);
        // if(res.TotalApplicationsCount > 0){
        // setCounts(count=>count + 3)
        // }
        console.log('hasMore', hasMore);
        setIsLoading(false);
        console.log('hasMore', hasMore);
      });
    };

    getData();
  }, [
    totalUsersCount,
    membersCount,
    lastActivityTime,
    loginsCountSinceNDaysAgo,
    count,
    lowerBoundary,
  ]);

  return { data, isLoading, hasMore };
};

export { useAppMonitoring };
