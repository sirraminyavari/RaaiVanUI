import { MonitoringSlice } from 'store/reducers/monitoringReducer';
import { RV_API, GET_APPLICATION_MONITORING } from 'constant/apiConstants';
import { API_Provider, setRVGlobal } from 'helpers/helpers';
const { setMonitoring, setFetchingApps } = MonitoringSlice.actions;

/**
 * @description A function (action) that gets NOT archived applications list from server.
 * @returns -Dispatch to redux store.
 */
const GetApplicationsMonitoringAPI = API_Provider(
  RV_API,
  GET_APPLICATION_MONITORING
);
export const getApplicationsMonitoring = () => async (dispatch) => {
  dispatch(setFetchingApps(true));
  GetApplicationsMonitoringAPI.fetch(
    {
      TotalUsersCount: true,
      MembersCount: true,
      LastActivityTime: true,
      LoginsCountSinceNDaysAgo: 30,
      Count: 20,
      LowerBoundary: 1,
    },
    (response) => {
      console.log(response);
      console.log(response.Applications);
      //   if (response.status === 200) {
      if (response?.Applications) {
        const archives = response?.Applications || [];
        if (!!archives.length) {
          dispatch(setMonitoring(archives));
        }
      }
    }
  );
};
