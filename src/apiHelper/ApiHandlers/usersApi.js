import {
  API_Provider,
  decodeBase64,
  encodeBase64,
  getCaptchaToken,
} from 'helpers/helpers';
import {
  Check_User_Name,
  Create_User,
  Get_User_Invitations,
  GET_USERS,
  Is_Approved,
  Set_Random_Password,
  Set_User_Name,
  USERS_API,
  Create_User_Token,
  Validate_User_Creation,
  SET_PASSWORD_RESET_TICKET,
  SET_PASSWORD,
  GET_WORKSPACE_USERS,
} from 'constant/apiConstants';
import { API_NAME_USR_BATCH_INVITE_USERS } from 'constant/api-names-users';
import { apiCallWrapper } from './apiCallHelpers';

const { GlobalUtilities } = window;
const reqParams = GlobalUtilities.request_params();

/**
 * @description reset password
 * @param UserID
 * @return {Promise<unknown>}
 */
export const setRandomPassword = (UserID) => {
  const setRandomPasswordAPI = API_Provider(USERS_API, Set_Random_Password);
  return apiCallWrapper(setRandomPasswordAPI, { UserID });
};

/**
 * @description send verification code for 'reset password'
 * @return {Promise<unknown>}
 */
export const setPasswordResetTicket = async ({ UserName, Password } = {}) => {
  return apiCallWrapper(API_Provider(USERS_API, SET_PASSWORD_RESET_TICKET), {
    UserName: encodeBase64(UserName),
    Password: encodeBase64(Password),
    InvitationID: reqParams.get_value('inv'),
    Captcha: await getCaptchaToken(),
  });
};

/**
 * @description a handler for finalizing verification-code-based password reset
 * @param {string} Token the token received from the API that has send the verification code
 * @param {string} Code the code provided by the user
 * @param {boolean} Login if true, the user will automatically login after validating their password reset
 * @return {Promise<ValidationOptions.unknown>}
 */
export const setPassword = ({ Token, Code, Login } = {}) => {
  return apiCallWrapper(API_Provider(USERS_API, SET_PASSWORD), {
    VerificationToken: Token,
    Code: Code,
    Login: Login,
  });
};

/**
 * @description sends an invitation email to a an array of email addresses to join the team with id, ApplicationID
 * @param {string} ApplicationID the id of the team/application
 * @param {object[]} Users an array of users each containing an 'Email' and a 'FullName'
 * User: {
 *  Email: "string",
 *  FullName: "string"
 * }
 * @param {string} Message the invitation message
 */
export const inviteUsersBatch = ({ ApplicationID, Users, Message } = {}) => {
  return apiCallWrapper(
    API_Provider(USERS_API, API_NAME_USR_BATCH_INVITE_USERS),
    {
      ApplicationID,
      Emails: (Users || [])
        .map((u) => encodeBase64(u.Email) + ',' + encodeBase64(u.FullName))
        .join('|'),
      MessageText: Message,
    }
  );
};

/**
 * @description reset password
 * @param UserID
 * @return {Promise<unknown>}
 */
export const getUserInvitations = (ApplicationID, Count = 20) => {
  const getUserInvitationsAPI = API_Provider(USERS_API, Get_User_Invitations);
  return apiCallWrapper(getUserInvitationsAPI, {
    ApplicationID,
    Count,
  }).then(
    (res) =>
      res?.Invitations.map((x) => ({
        ...x,
        Email: decodeBase64(x?.Email),
        ReceiverFirstName: decodeBase64(x?.ReceiverFirstName),
        ReceiverLastName: decodeBase64(x?.ReceiverLastName),
      })) || []
  );
};

/**
 * @description a handler for updating approved status api call
 * @param IsApproved
 * @param UserID
 * @return {Promise<unknown>}
 */
export const updateApprovedStatus = (IsApproved, UserID) => {
  const IsApprovedAPI = API_Provider(USERS_API, Is_Approved);
  return apiCallWrapper(IsApprovedAPI, { IsApproved, UserID });
};

/**
 * @description a handler for setting username api call
 * @param UserName
 * @param UserID
 * @return {Promise<ValidationOptions.unknown>}
 */
export const setUserName = (UserName, UserID) => {
  const setUserNameAPI = API_Provider(USERS_API, Set_User_Name);

  return apiCallWrapper(setUserNameAPI, {
    UserID,
    UserName: encodeBase64(UserName),
  });
};

/**
 * @description a handler for create user token api call
 * @param {string} Contact - it could be email or phone-number (for now, only email is supported)
 * @param {string} Password - the user's password
 * @param {string} FirstName - the user's first-name
 * @param {string} LastName - the user's last-name
 * @return {Promise<ValidationOptions.unknown>}
 */
export const createUserToken = async ({
  FirstName,
  LastName,
  Contact,
  Password,
} = {}) => {
  return apiCallWrapper(API_Provider(USERS_API, Create_User_Token), {
    FirstName: encodeBase64(FirstName),
    LastName: encodeBase64(LastName),
    Contact: encodeBase64(Contact),
    Password: encodeBase64(Password),
    InvitationID: reqParams.get_value('inv'),
    Captcha: await getCaptchaToken(),
  });
};

/**
 * @description a handler for finalizing verification-code-based user creation
 * @param {string} Token the token received from the API that has send the verification code
 * @param {string} Code the code provided by the user
 * @param {boolean} Login if true, the user will automatically login after validating their account creation
 * @return {Promise<ValidationOptions.unknown>}
 */
export const validateUserCreation = ({ Token, Code, Login } = {}) => {
  return apiCallWrapper(API_Provider(USERS_API, Validate_User_Creation), {
    VerificationToken: Token,
    Code: Code,
    Login: Login,
  });
};

/**
 * @description a handler for create user api call
 * @param UserName
 * @param UserID
 * @return {Promise<ValidationOptions.unknown>}
 */
export const createUser = (data) => {
  const { UserName, FirstName, LastName } = data;
  const createUserNameAPI = API_Provider(USERS_API, Create_User);

  return apiCallWrapper(createUserNameAPI, {
    UserName: encodeBase64(UserName),
    FirstName: encodeBase64(FirstName),
    LastName: encodeBase64(LastName),
  });
};

/**
 * @description check validity of a username
 * @param UserName
 * @return {Promise<unknown>}
 */
export const checkUserName = ({ UserName } = {}) => {
  return apiCallWrapper(API_Provider(USERS_API, Check_User_Name), {
    UserName: encodeBase64(UserName),
  });
};

/**
 *
 * @param SearchText
 * @param IsOnline
 * @param IsApproved
 * @return {Promise<unknown>}
 */
export const getUsers = ({ SearchText, IsApproved, IsOnline } = {}) => {
  return apiCallWrapper(API_Provider(USERS_API, GET_USERS), {
    SearchText: encodeBase64(SearchText),
    IsOnline,
    IsApproved,
    LockedStatus: true,
    LastActivityTime: true,
    MainEmailAddress: true,
    MainPhoneNumber: true,
    ApprovedStatus: true,
    SystemAdminStatus: true,
  }).then((res) =>
    res?.Users?.map((x) => ({
      ...x,
      FirstName: decodeBase64(x?.FirstName),
      LastName: decodeBase64(x?.LastName),
      FullName: decodeBase64(x?.FullName),
      JobTitle: decodeBase64(x?.JobTitle),
      AboutMe: decodeBase64(x?.AboutMe),
      City: decodeBase64(x?.City),
      MainEmailAddress: decodeBase64(x?.MainEmailAddress),
      UserName: decodeBase64(x?.UserName),
      Organization: decodeBase64(x?.Organization),
    }))
  );
};

/**
 *
 * @param firstName
 * @returns {Promise<unknown>}
 */
export const updateFirstName = (UserID, firstName) => {
  const setFirstNameAPI = API_Provider(USERS_API, 'SetFirstName');
  return apiCallWrapper(setFirstNameAPI, {
    UserID,
    FirstName: encodeBase64(firstName),
  });
};

/**
 *
 * @param firstName
 * @returns {Promise<unknown>}
 */
export const updateLastName = (UserID, lastName) => {
  const setLastNameAPI = API_Provider(USERS_API, 'SetLastName');
  return apiCallWrapper(setLastNameAPI, {
    UserID,
    LastName: encodeBase64(lastName),
  });
};

/**
 * @description get workspace users
 * @param WorkspaceID
 * @param Count
 * @param LowerBoundary
 * @param SearchText
 * @return {Promise<unknown>}
 */
export const getWorkspaceUsers = ({
  WorkspaceID,
  Count,
  LowerBoundary,
  SearchText,
} = {}) => {
  return apiCallWrapper(API_Provider(USERS_API, GET_WORKSPACE_USERS), {
    WorkspaceID,
    Count,
    LowerBoundary,
    SearchText: encodeBase64(SearchText),
  });
};
