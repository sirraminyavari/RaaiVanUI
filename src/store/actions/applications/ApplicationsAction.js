import { ApplicationsSlice } from 'store/reducers/applicationsReducer';
import {
  onboardingSlice,
  toggleActivation,
} from 'store/reducers/onboardingReducer';
import {
  getSidebarNodeTypes,
  getUnderMenuPermissions,
} from 'store/actions/sidebar/sidebarMenuAction';
import getConfigPanels from 'store/actions/sidebar/sidebarPanelsAction';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import { API_Provider, setRVGlobal } from 'helpers/helpers';
import {
  RV_API,
  USERS_API,
  GET_APPLICATIONS,
  REMOVE_APPLICATION,
  RECYCLE_APPLICATION,
  CREATE_APPLICATION,
  SELECT_APPLICATION,
  MODIFY_APPLICATION,
  UNSUBSCRIBE_APPLICATION,
  GET_VARIABLE,
  SET_VARIABLE,
  REMOVE_USER_FROM_APPLICATION,
  GET_APPLICATION_USERS,
  GET_APPLICATION_MONITORING,
} from 'constant/apiConstants';
import { CLASSES_PATH, HOME_PATH } from 'constant/constants';

const {
  setApplications,
  deleteApplication,
  addApplication,
  setFetchingApps,
  setSelectingApp,
  setArchivedApplications,
} = ApplicationsSlice.actions;

const { onboardingName, onboardingStep } = onboardingSlice.actions;

const getApplicationsAPI = API_Provider(RV_API, GET_APPLICATIONS);
const GetApplicationsMonitoringAPI = API_Provider(
  RV_API,
  GET_APPLICATION_MONITORING
);
const removeApplicationAPI = API_Provider(RV_API, REMOVE_APPLICATION);
const recycleApplicationAPI = API_Provider(RV_API, RECYCLE_APPLICATION);
const createApplicationAPI = API_Provider(RV_API, CREATE_APPLICATION);
const selectApplicationAPI = API_Provider(RV_API, SELECT_APPLICATION);
const modifyApplicationAPI = API_Provider(RV_API, MODIFY_APPLICATION);
const unsubscribeFromApplicationAPI = API_Provider(
  RV_API,
  UNSUBSCRIBE_APPLICATION
);
const getApplicationsOrderAPI = API_Provider(RV_API, GET_VARIABLE);
const setApplicationsOrderAPI = API_Provider(RV_API, SET_VARIABLE);
const removeUserFromApplicationAPI = API_Provider(
  RV_API,
  REMOVE_USER_FROM_APPLICATION
);
const getApplicationUsersAPI = API_Provider(USERS_API, GET_APPLICATION_USERS);

// /**
//  * @description A function (action) that gets NOT archived applications list from server.
//  * @returns -Dispatch to redux store.
//  */
// export const GetApplicationsMonitoring = (data) => async (dispatch) => {
//   try {
//   dispatch(setFetchingApps(true));
//   GetApplicationsMonitoringAPI.fetch(
//     { Archive: false },
//     (response) => {
//       if(response.status === 200){
//         dispatch(GET_Apps_Monitoring(response.Applications));
//       }
//       console.log(response);
//       // if (response?.Applications) {
//       //   const users = response?.ApplicationUsers;
//       //   const appsWithUsers = response.Applications.map((app) => {
//       //     app.Users = users[app?.ApplicationID];
//       //     return app;
//       //   });

//       //   // dispatch(getApplicationsOrder(appsWithUsers));
//       //   // dispatch(getArchivedApplications());
//       // }
//     },

//     );
//   } catch (err) {
//     // dispatch(setFetchingApps(false));
//     console.log({ err });
//   }
// };

/**
 * @description A function (action) that gets NOT archived applications list from server.
 * @returns -Dispatch to redux store.
 */
export const getApplications = () => async (dispatch) => {
  try {
    dispatch(setFetchingApps(true));
    getApplicationsAPI.fetch(
      { Archive: false },
      (response) => {
        if (response?.Applications) {
          const users = response?.ApplicationUsers;
          const appsWithUsers = response.Applications.map((app) => {
            app.Users = users[app?.ApplicationID];
            return app;
          });
          dispatch(getApplicationsOrder(appsWithUsers));
          dispatch(getArchivedApplications());
        }
      },
      (error) => {
        dispatch(setFetchingApps(false));
        console.log({ error });
      }
    );
  } catch (err) {
    dispatch(setFetchingApps(false));
    console.log({ err });
  }
};

/**
 * @description A function (action) that gets archived applications list from server.
 * @returns -Dispatch to redux store.
 */
export const getArchivedApplications = () => async (dispatch) => {
  try {
    getApplicationsAPI.fetch(
      { Archive: true },
      (response) => {
        if (response?.Applications) {
          const archives = response?.Applications || [];
          if (!!archives.length) {
            dispatch(setArchivedApplications(archives));
          }
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
export const removeApplication =
  (appId, done, error) => async (dispatch, getState) => {
    const { applications } = getState();
    const newApps = applications.userApps.filter(
      (app) => app.ApplicationID !== appId
    );

    try {
      removeApplicationAPI.fetch(
        { ApplicationID: appId },
        (response) => {
          if (response.ErrorText) {
            error && error(response.ErrorText);
          } else if (response.Succeed) {
            done && done(appId);
            dispatch(deleteApplication(newApps));
            dispatch(setApplicationsOrder(newApps));
            // dispatch(getApplications());
            dispatch(getArchivedApplications());
          }
        },
        (err) => {
          error && error(err);
        }
      );
    } catch (err) {
      error && error(err);
    }
  };

/**
 * @description A function (action) that recycles deleted application from server.
 * @returns -Dispatch to redux store.
 */
export const recycleApplication =
  (appId, done, error) => async (dispatch, getState) => {
    const { applications } = getState();
    try {
      recycleApplicationAPI.fetch(
        { ApplicationID: appId },
        (response) => {
          if (response?.Succeed) {
            done && done(response);
            // console.log(response);
            const newArchivedApps = applications.userArchivedApps.filter(
              (app) => app.ApplicationID !== appId
            );
            dispatch(setArchivedApplications(newArchivedApps));
          }

          if (response?.ErrorText) {
            error && error(response?.ErrorText);
          }
        },
        (err) => {
          error && error(err);
        }
      );
    } catch (err) {
      error && error(err.message);
    }
  };

/**
 * @description A function (action) that creates a new application.
 * @returns -Dispatch to redux store.
 */
export const createApplication =
  (title, WorkspaceID, done, error) => async (dispatch, getState) => {
    const { applications } = getState();
    try {
      createApplicationAPI.fetch(
        {
          Title: encodeBase64(title),
          WorkspaceID,
        },
        (response) => {
          if (response.ErrorText) {
            error && error(response.ErrorText);
          } else if (response.Succeed) {
            done && done(response);
            const createdApp = response.Application;
            const appUsers = response.ApplicationUsers;
            createdApp.Users = appUsers;
            const newApps = [...applications.userApps, createdApp];
            dispatch(addApplication(newApps));
            dispatch(setApplicationsOrder(newApps));
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
export const selectApplication = (appId, done, error) => async (dispatch) => {
  try {
    dispatch(
      setSelectingApp({
        isSelecting: true,
        selectingAppId: appId,
      })
    );
    selectApplicationAPI.fetch(
      { ApplicationID: appId },
      (response) => {
        // console.log(response);
        if (response.ErrorText) {
          error && error(response.ErrorText);
        } else if (response.Succeed) {
          setRVGlobal({
            ApplicationID: appId,
            IsSystemAdmin: response.IsSystemAdmin,
          });
          dispatch(getSidebarNodeTypes());
          dispatch(getConfigPanels());
          dispatch(getUnderMenuPermissions(['Reports']));
          // dispatch(getNotificationsCount());
          // dispatch(getNotificationsList());

          if (!!response.ProductTour) {
            dispatch(onboardingName(response.ProductTour?.Name || ''));
            dispatch(onboardingStep(response.ProductTour?.Step || 0));
            //the application has been selected, now activate the product tour ::khalafi

            if (response.ProductTour?.Name) {
              dispatch(toggleActivation());
            }
            done && done(CLASSES_PATH);
          } else {
            done && done(HOME_PATH);
          }
        }
        dispatch(
          setSelectingApp({
            isSelecting: false,
            selectingAppId: null,
          })
        );
      },
      (error) => {
        console.log({ error });
        dispatch(
          setSelectingApp({
            isSelecting: false,
            selectingAppId: null,
          })
        );
      }
    );
  } catch (err) {
    console.log({ err });
    dispatch(
      setSelectingApp({
        isSelecting: false,
        selectingAppId: null,
      })
    );
  }
};

/**
 * @description A function (action) that modifies application.
 * @returns -Dispatch to redux store.
 */
export const modifyApplication =
  (appId, title, done, error) => async (dispatch) => {
    try {
      modifyApplicationAPI.fetch(
        { ApplicationID: appId, Title: encodeBase64(title) },
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

/**
 * @description A function (action) that unsubscribe a user from an application.
 * @returns -Dispatch to redux store.
 */
export const unsubscribeFromApplication =
  (appId, done, error) => async (dispatch) => {
    try {
      unsubscribeFromApplicationAPI.fetch(
        { ApplicationID: appId },
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

/**
 * @description A function (action) that removes a user in an application.
 * @returns -Dispatch to redux store.
 */
export const removeUserFromApplication =
  (appId, userId, done, error) => async (dispatch) => {
    try {
      removeUserFromApplicationAPI.fetch(
        { ApplicationID: appId, UserID: userId },
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

/**
 * @description A function (action) that gets applications order from server.
 * @returns -Dispatch to redux store.
 */
export const getApplicationsOrder =
  (unorderedApps, done, error) => async (dispatch) => {
    const sortVariableName = `ApplicationsOrder_${
      ((window.RVGlobal || {}).CurrentUser || {}).UserID
    }`;
    try {
      getApplicationsOrderAPI.fetch(
        { Name: sortVariableName, ApplicationIndependent: true },
        (response) => {
          dispatch(setFetchingApps(false));
          if (!response.Value) {
            //! New user.
            dispatch(setApplications(unorderedApps));
            dispatch(setArchivedApplications([]));
          } else {
            const orderedIds =
              (
                window.GlobalUtilities.to_json(decodeBase64(response.Value)) ||
                {}
              ).Order || [];
            // console.log(orderedIds);
            // console.log(unorderedApps);
            const orderedApps = orderedIds
              .filter((id) =>
                unorderedApps.some((app) => app.ApplicationID === id)
              )
              .map(
                (id) =>
                  unorderedApps.filter((app) => app.ApplicationID === id)[0]
              );

            const extraApps = unorderedApps.filter(
              (app) => !orderedIds.some((id) => app.ApplicationID === id)
            );
            dispatch(setApplications([...orderedApps, ...extraApps]));
          }

          // dispatch(setApplicationsOrder(unorderedApps));
        },
        (error) => {
          dispatch(setFetchingApps(false));
          console.log({ error });
        }
      );
    } catch (err) {
      dispatch(setFetchingApps(false));
      console.log({ err });
    }
  };

/**
 * @description A function (action) that gets applications order from server.
 * @returns -Dispatch to redux store.
 */
export const setApplicationsOrder =
  (orderedApps, done, error) => async (dispatch) => {
    const sortVariableName = `ApplicationsOrder_${
      ((window.RVGlobal || {}).CurrentUser || {}).UserID
    }`;
    const userAppIds = orderedApps.map((app) => app.ApplicationID);
    const sortVariableValue = encodeBase64(
      JSON.stringify({ Order: userAppIds })
    );

    try {
      setApplicationsOrderAPI.fetch(
        {
          Name: sortVariableName,
          Value: sortVariableValue,
          ApplicationIndependent: true,
        },
        () => {
          done && done();
        },
        (error) => {
          error && error();
          console.log({ error });
        }
      );
    } catch (err) {
      error && error();
      console.log({ err });
    }
  };

/**
 * @description A function (action) that get users of an application from server.
 * @param {String} appId
 * @param {String} text
 * @param {Function} done
 * @param {Function} error
 * @returns -Dispatch to redux store.
 */
export const getApplicationUsers =
  (appId, text = '', done, error) =>
  async (dispatch) => {
    try {
      getApplicationUsersAPI.fetch(
        {
          ApplicationID: appId,
          SearchText: text,
        },
        (response) => {
          done && done(response.Users);
        },
        (err) => {
          error && error(err);
        }
      );
    } catch (err) {
      error && error(err);
    }
  };
