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

  useEffect(() => {
    GetApplicationsMonitoring({}).then((res) => {
      console.log(res);
      setData(res);
      setIsLoading(false);
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
