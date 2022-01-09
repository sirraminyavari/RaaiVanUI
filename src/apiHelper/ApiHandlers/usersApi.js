import { API_Provider, decodeBase64, encodeBase64 } from 'helpers/helpers';
import {
  Check_User_Name,
  Create_User,
  Get_User_Invitations,
  GET_USERS,
  Is_Approved,
  RV_API,
  Set_Random_Password,
  Set_User_Name,
  USERS_API,
} from 'constant/apiConstants';
import { apiCallWrapper } from './apiCallHelpers';

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
export const checkUserName = (UserName) => {
  const CheckUserNameAPI = API_Provider(USERS_API, Check_User_Name);
  return apiCallWrapper(CheckUserNameAPI, {
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
export const getUsers = (SearchText, IsApproved, IsOnline) => {
  const getListOfUsersAPI = API_Provider(USERS_API, GET_USERS);
  return apiCallWrapper(getListOfUsersAPI, {
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
