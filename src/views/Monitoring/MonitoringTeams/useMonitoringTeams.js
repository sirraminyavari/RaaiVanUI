import {
  GetApplicationPerformanceMonitoring,
  GetApplicationsMonitoring,
} from 'apiHelper/apiFunctions';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const useTeamMonitoring = () =>
  // appID = '36a00fac-0353-445c-be7b-df3c134e9dc7'
  // dateFrom = 'yyyy-mm-dd',
  // dateTo = 'yyyy-mm-dd'
  {
    const [app, setApp] = useState(null);
    // const [ApplicationID, setApplicationID] = useState(null)
    const [user, setUser] = useState(null);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // const [hasMore, setHasMore] = useState(false);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    let { ApplicationID } = useParams();
    console.log(ApplicationID, 'ApplicationID');
    useEffect(() => {
      const getData = async () => {
        await GetApplicationPerformanceMonitoring({
          appID: ApplicationID,
          dateFrom: dateFrom,
          dateTo: dateTo,
        }).then((res) => {
          console.log(res.Application);
          // setHasMore(res.Applications.length > 0);
          setData(res);
          setUser(res.User);
          setApp(res.Application);
          // setApplicationID(res.Application)
          setIsLoading(false);
          // setHasMore(false)
          // setHasMore(res.Applications.length > 0)
        });
      };

      getData();
    }, [dateFrom, dateTo, ApplicationID]);

    return {
      data,
      app,
      user,
      isLoading,
      dateFrom,
      setDateFrom,
      dateTo,
      setDateTo,
      ApplicationID,
      // setApplicationID
    };
  };

export { useTeamMonitoring };
