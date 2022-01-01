import { GetApplicationsMonitoring } from 'apiHelper/apiFunctions';
import { useEffect, useState } from 'react';

const useAppMonitoring = (
  totalUsersCount = true,
  membersCount = true,
  lastActivityTime = true,
  loginsCountSinceNDaysAgo = 30,
  count = 20,
  lowerBoundary = 1
) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [hasNex, setHasNext] = useState(false);
  const [counts, setCounts] = useState(count);
  const [lowerBoundarys, setLowerBoundarys] = useState(lowerBoundary);
  useEffect(() => {
    const getData = async () => {
      GetApplicationsMonitoring({}).then((res) => {
        console.log(res, res.TotalApplicationsCount);
        setHasMore(res.Applications.length > 0);
        setData(res);

        // if(res.TotalApplicationsCount > 0){
        // setCounts(count=>count + 3)
        // }
        console.log('hasMore', hasMore);
        setIsLoading(false);
        // setHasMore(false)
        // setHasMore(res.Applications.length > 0)
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
