import { ApplicationsSlice } from '../../reducers/applicationsReducer';
import APIHandler from 'apiHelper/APIHandler';
// import { decodeBase64, encodeBase64 } from 'helpers/helpers';

const { setApplications } = ApplicationsSlice.actions;

const getApplicationsAPI = new APIHandler('RVAPI', 'GetApplications');

/**
 * @description A function (action) that gets applications list from server.
 * @returns -Dispatch to redux store.
 */
export const getApplications = (archive = false) => async (
  dispatch,
  getState
) => {
  try {
    getApplicationsAPI.fetch(
      { Archive: archive, ParseResults: true },
      (response) => {
        const users = response.ApplicationUsers;
        const applicationsWithUsers = response.Applications.map((app) => {
          app.Users = users[app.ApplicationID];
          return app;
        });
        console.log(applicationsWithUsers);
        dispatch(setApplications(applicationsWithUsers));
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};
