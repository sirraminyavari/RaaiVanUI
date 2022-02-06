import { API_Provider, encodeBase64 } from 'helpers/helpers';
import {
  CREATE_APPLICATION,
  CREATE_WORKSPACE,
  RENAME_WORKSPACE,
  REMOVE_WORKSPACE_TICKET,
  REMOVE_WORKSPACE_USER,
  RV_API,
  SELECT_APPLICATION,
  REMOVE_WORKSPACE,
} from 'constant/apiConstants';
import { apiCallWrapper } from './apiCallHelpers';

/**
 * @description create workspace
 * @param Name
 * @return {Promise<unknown>}
 */
export const createWorkspace = ({ Name } = {}) => {
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
export const removeWorkspaceUser = ({ UserID, WorkspaceID } = {}) => {
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
export const removeWorkspaceTicket = ({ WorkspaceID, Captcha } = {}) => {
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
export const removeWorkspace = ({ VerificationToken, Code } = {}) => {
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
export const renameWorkspace = ({ Name, WorkspaceID } = {}) => {
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
export const createApplication = ({ WorkspaceID, Title } = {}) => {
  return apiCallWrapper(API_Provider(RV_API, CREATE_APPLICATION), {
    WorkspaceID: WorkspaceID,
    Title: encodeBase64(Title),
  });
};

/**
 * @description select application
 * @param ApplicationID the id of the application
 * @return {Promise<unknown>}
 */
export const selectApplication = ({ ApplicationID } = {}) => {
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
