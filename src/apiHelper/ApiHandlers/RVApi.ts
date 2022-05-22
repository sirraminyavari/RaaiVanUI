import { API_Provider, encodeBase64 } from 'helpers/helpers';
import {
  CREATE_APPLICATION,
  CREATE_WORKSPACE,
  GET_WORKSPACES,
  RENAME_WORKSPACE,
  REMOVE_WORKSPACE_TICKET,
  REMOVE_WORKSPACE_USER,
  RV_API,
  SELECT_APPLICATION,
  REMOVE_WORKSPACE,
  SET_APPLICATION_SIZE,
  SET_APPLICATION_FIELD_OF_EXPERTISE,
  GET_APPLICATIONS,
  REMOVE_APPLICATION,
  RECYCLE_APPLICATION,
} from 'constant/apiConstants';
import { apiCallWrapper } from './apiCallHelpers';

/**
 * @description get all workspaces
 * @return {Promise<unknown>}
 */
export const getWorkspaces = () => {
  return apiCallWrapper(API_Provider(RV_API, GET_WORKSPACES));
};

/**
 * @description create workspace
 * @param Name
 * @return {Promise<unknown>}
 */
export const createWorkspace = ({ Name }) => {
  return apiCallWrapper(API_Provider(RV_API, CREATE_WORKSPACE), {
    Name: encodeBase64(Name),
  });
};

/**
 * @description remove user from workspace
 * @param WorkspaceID
 * @param UserID
 * @return {Promise<unknown>}
 */
export const removeWorkspaceUser = ({ UserID, WorkspaceID }) => {
  return apiCallWrapper(API_Provider(RV_API, REMOVE_WORKSPACE_USER), {
    WorkspaceID,
    UserID,
  });
};

/**
 * @description OTP verification code for removing a workspace
 * @param WorkspaceID
 * @param Captcha
 * @return {Promise<unknown>}
 */
export const removeWorkspaceTicket = ({ WorkspaceID, Captcha }) => {
  return apiCallWrapper(API_Provider(RV_API, REMOVE_WORKSPACE_TICKET), {
    WorkspaceID,
    Captcha,
  });
};

/**
 * @description  remove workspace
 * @param VerificationToken - a verification token from [removeWorkspaceTicket] api
 * @param Code - OTP digits from user input
 * @return {Promise<unknown>}
 */
export const removeWorkspace = ({ VerificationToken, Code }) => {
  return apiCallWrapper(API_Provider(RV_API, REMOVE_WORKSPACE), {
    VerificationToken,
    Code,
  });
};

/**
 * @description rename workspace
 * @param WorkspaceID - workspace uuid hash string
 * @param Name - new workspace name
 * @return {Promise<unknown>}
 */
export const renameWorkspace = ({ Name, WorkspaceID }) => {
  return apiCallWrapper(API_Provider(RV_API, RENAME_WORKSPACE), {
    Name: encodeBase64(Name),
    WorkspaceID,
  });
};

/**
 * @description create application
 * @param WorkspaceID id of the workspace that contains the applications
 * @param Title the title of the application
 * @return {Promise<unknown>}
 */
export const createApplication = ({ WorkspaceID, Title }) => {
  return apiCallWrapper(API_Provider(RV_API, CREATE_APPLICATION), {
    WorkspaceID,
    Title: encodeBase64(Title),
  });
};

export const modifyApplication = ({ ApplicationID, Title } = {}) => {
  return apiCallWrapper(API_Provider(RV_API, CREATE_APPLICATION), {
    ApplicationID,
    Title: encodeBase64(Title),
  });
};

/**
 * @description set application's people count size
 * @param props.ApplicationID ID of the application
 * @param {("1 - 10"|"10 - 20"|"more than 20")} props.Size size of the application people
 * @return {Promise<unknown>}
 */
export const setApplicationSize = ({ ApplicationID, Size }) => {
  return apiCallWrapper(API_Provider(RV_API, SET_APPLICATION_SIZE), {
    ApplicationID,
    Size: encodeBase64(Size),
  });
};

//TODO complete documentation of setApplicationFieldOfExpertise for optional input keys
/**
 * @description set application's field of expertise
 * @param props.ApplicationID ID of the application
 * @param props.FieldID Field ID
 * @param props.FieldName Name of the field
 * @return {Promise<unknown>}
 */
export const setApplicationFieldOfExpertise = ({
  ApplicationID,
  FieldID,
  FieldName,
}) => {
  return apiCallWrapper(
    API_Provider(RV_API, SET_APPLICATION_FIELD_OF_EXPERTISE),
    {
      ApplicationID,
      FieldID,
      FieldName: encodeBase64(FieldName),
    }
  );
};

/**
 * @param {boolean} Archive if true, retrieves archived applications
 */
export const getApplications = ({ Archive } = {}) => {
  return apiCallWrapper(API_Provider(RV_API, GET_APPLICATIONS), {
    Archive: Archive === true,
  }).then((res) => {
    if ((res?.Applications || []).length) {
      res.Applications.forEach((app) => {
        app.Users = (res.ApplicationUsers || {})[app.ApplicationID] || [];
      });
    }

    return res;
  });
};

export const removeApplication = ({ ApplicationID } = {}) => {
  return apiCallWrapper(API_Provider(RV_API, REMOVE_APPLICATION), {
    ApplicationID,
  });
};

export const recoverApplication = ({ ApplicationID } = {}) => {
  return apiCallWrapper(API_Provider(RV_API, RECYCLE_APPLICATION), {
    ApplicationID,
  });
};

/**
 * @description select application
 * @param ApplicationID the id of the application
 * @return {Promise<unknown>}
 */
export const selectApplication = ({ ApplicationID }) => {
  return apiCallWrapper(API_Provider(RV_API, SELECT_APPLICATION), {
    ApplicationID,
  });
};

/**
 * @description set a user as system admin
 * @param UserID
 * @return {Promise<unknown>}
 */
export const addSystemAdmin = (UserID) => {
  const addSystemAdminAPI = API_Provider(RV_API, 'AddSystemAdmin');
  return apiCallWrapper(addSystemAdminAPI, { UserID });
};

/**
 * @description remove user from system admin
 * @param UserID
 * @return {Promise<unknown>}
 */
export const removeSystemAdmin = (UserID) => {
  const removeSystemAdminAPI = API_Provider(RV_API, 'RemoveSystemAdmin');
  return apiCallWrapper(removeSystemAdminAPI, { UserID });
};

/**
 * @description remove user from a team
 * @param UserID
 * @return {Promise<unknown>}
 */
export const removeUserFromApplication = (UserID) => {
  const removeUserFromApplicationAPI = API_Provider(
    RV_API,
    'RemoveUserFromApplication'
  );
  return apiCallWrapper(removeUserFromApplicationAPI, { UserID });
};

export const getThemes = () => {
  return apiCallWrapper(API_Provider(RV_API, 'GetThemes'), {});
};