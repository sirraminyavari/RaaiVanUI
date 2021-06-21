import { ApplicationsSlice } from 'store/reducers/applicationsReducer';
import { encodeBase64, loadLocalStorage } from 'helpers/helpers';
import { API_Provider } from 'helpers/helpers';
import {
  RV_API,
  GET_APPLICATIONS,
  REMOVE_APPLICATION,
  RECYCLE_APPLICATION,
  CREATE_APPLICATION,
} from 'constant/apiConstants';

const {
  setApplications,
  deleteApplication,
  addApplication,
  setFetchingApps,
} = ApplicationsSlice.actions;

const getApplicationsAPI = API_Provider(RV_API, GET_APPLICATIONS);
const removeApplicationAPI = API_Provider(RV_API, REMOVE_APPLICATION);
const recycleApplicationAPI = API_Provider(RV_API, RECYCLE_APPLICATION);
const createApplicationAPI = API_Provider(RV_API, CREATE_APPLICATION);

/**
 * @description A function (action) that gets applications list from server.
 * @returns -Dispatch to redux store.
 */
export const getApplications = (archive = false) => async (
  dispatch,
  getState
) => {
  const { auth } = getState();
  try {
    dispatch(setFetchingApps(true));
    getApplicationsAPI.fetch(
      { Archive: archive, ParseResults: true },
      (response) => {
        if (response.Applications) {
          const users = response.ApplicationUsers;
          const appsWithUsers = response.Applications.map((app) => {
            app.Users = users[app.ApplicationID];
            return app;
          });
          getApplicationsAPI.fetch(
            { Archive: true, ParseResults: true },
            (response) => {
              dispatch(setFetchingApps(false));
              const archives = response.Applications || [];
              const archivedList = !!archives.length
                ? [{ ApplicationID: 'archived-apps', archives }]
                : [];
              const localApps = loadLocalStorage(
                'apps_' + auth.authUser.UserID
              );
              if (
                localApps === undefined ||
                localApps?.length - 2 !== appsWithUsers.length
              ) {
                dispatch(
                  setApplications([
                    ...appsWithUsers,
                    ...archivedList,
                    { ApplicationID: 'add-app' },
                  ])
                );
              }
            },
            (error) => console.log(error)
          );
        }
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};

/**
 * @description A function (action) that removes an application from server.
 * @returns -Dispatch to redux store.
 */
export const removeApplication = (appId, done, error) => async (dispatch) => {
  try {
    removeApplicationAPI.fetch(
      { ApplicationID: appId, ParseResults: true },
      (response) => {
        console.log(response);
        if (response.ErrorText) {
          error && error(response.ErrorText);
        } else if (response.Succeed) {
          done && done(appId);
          dispatch(deleteApplication(appId));
          dispatch(getApplications());
        }
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};

/**
 * @description A function (action) that recycles deleted application from server.
 * @returns -Dispatch to redux store.
 */
export const recycleApplication = (appId, done, refresh = true) => async (
  dispatch
) => {
  try {
    recycleApplicationAPI.fetch(
      { ApplicationID: appId, ParseResults: true },
      (response) => {
        if (response.Succeed) {
          done && done(response);
          refresh && dispatch(getApplications());
        }
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};

/**
 * @description A function (action) that creates a new application.
 * @returns -Dispatch to redux store.
 */
export const createApplication = (title, done, error) => async (dispatch) => {
  try {
    createApplicationAPI.fetch(
      { Title: encodeBase64(title), ParseResults: true },
      (response) => {
        if (response.ErrorText) {
          error && error(response.ErrorText);
        } else if (response.Succeed) {
          console.log(response);
          done && done(response);
          const app = response.Application;
          const appUsers = response.ApplicationUsers;
          app.Users = appUsers;
          dispatch(addApplication(app));
        }
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};
