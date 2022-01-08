import {
  GetApplicationPerformanceMonitoring,
  GetApplicationsMonitoring,
} from 'apiHelper/apiFunctions';
import { useEffect, useState } from 'react';

const useTeamMonitoring = (
  appID = '36a00fac-0353-445c-be7b-df3c134e9dc7',
  dateFrom = 'yyyy-mm-dd',
  dateTo = 'yyyy-mm-dd'
) => {
  const [app, setApp] = useState(null);
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const getData = async () => {
      await GetApplicationPerformanceMonitoring({
        appID: '36a00fac-0353-445c-be7b-df3c134e9dc7',
      }).then((res) => {
        console.log(res.Application);
        // setHasMore(res.Applications.length > 0);
        setData(res);
        setUser(res.User);

        setApp(res.Application);

        // if(res.TotalApplicationsCount > 0){
        // setCounts(count=>count + 3)
        // }
        // console.log('hasMore', hasMore);
        setIsLoading(false);
        // setHasMore(false)
        // setHasMore(res.Applications.length > 0)
      });
    };

    getData();
  }, [appID, dateFrom, dateTo]);

  return { data, app, user, isLoading };
};

export { useTeamMonitoring };
