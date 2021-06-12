import { ApplicationsSlice } from 'store/reducers/applicationsReducer';
import APIHandler from 'apiHelper/APIHandler';
import { decodeBase64, encodeBase64, saveLocalStorage } from 'helpers/helpers';

const {
  setApplications,
  deleteApplication,
  addApplication,
} = ApplicationsSlice.actions;

const getApplicationsAPI = new APIHandler('RVAPI', 'GetApplications');
const removeApplicationAPI = new APIHandler('RVAPI', 'RemoveApplication');
const recycleApplicationAPI = new APIHandler('RVAPI', 'RecycleApplication');
const createApplicationAPI = new APIHandler('RVAPI', 'CreateApplication');
const getGlobalParamsAPI = new APIHandler('RVAPI', 'GetGlobalParams');

/**
 * @description A function (action) that gets applications list from server.
 * @returns -Dispatch to redux store.
 */
export const getApplications = (archive = false) => async (
  dispatch,
  getState
) => {
  const { applications } = getState();

  try {
    getApplicationsAPI.fetch(
      { Archive: archive, ParseResults: true },
      (response) => {
        if (response.Applications) {
          const users = response.ApplicationUsers;
          const applicationsWithUsers = response.Applications.map((app) => {
            app.Users = users[app.ApplicationID];
            return app;
          });
          dispatch(setApplications(applicationsWithUsers));
          getGlobalParamsAPI.fetch(
            {},
            (response) => {
              saveLocalStorage(
                response.CurrentUser.UserID,
                applicationsWithUsers
              );
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
export const recycleApplication = (appId, done) => async (dispatch) => {
  try {
    recycleApplicationAPI.fetch(
      { ApplicationID: appId, ParseResults: true },
      (response) => {
        if (response.Succeed) {
          done && done(response);
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
          done && done(response);
          dispatch(getApplications());
        }
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};
