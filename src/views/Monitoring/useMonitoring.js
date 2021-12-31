import { GetApplicationsMonitoring } from 'apiHelper/apiFunctions';
import { useEffect, useState } from 'react';

const useAppMonitoring = (
  totalUsersCount = true,
  membersCount = true,
  lastActivityTime = true,
  loginsCountSinceNDaysAgo = 30,
  count = 10,
  lowerBoundary = 1
) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    GetApplicationsMonitoring({}).then((res) => {
      console.log(res, res.Applications.length);
      setData(res);
      if (res.TotalApplicationsCount > 0) {
        console.log('yyyyyyyyyy');
      }
      // setHasMore(res.TotalApplicationsCount > 0);
      console.log('hasMore', hasMore);
      setIsLoading(false);
      console.log('hasMore', hasMore);
    });
  }, [
    totalUsersCount,
    membersCount,
    lastActivityTime,
    loginsCountSinceNDaysAgo,
    count,
    lowerBoundary,
  ]);
  return { data, isLoading };
};

export { useAppMonitoring };
