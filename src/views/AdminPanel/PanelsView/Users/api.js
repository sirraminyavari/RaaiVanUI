/**
 * @description get list of users
 */
import { API_Provider, decodeBase64, encodeBase64 } from 'helpers/helpers';
import { CN_API, GET_USERS, RV_API, USERS_API } from 'constant/apiConstants';

/**
 *
 * @param SearchText
 * @param IsOnline
 * @param IsApproved
 * @return {Promise<unknown>}
 */
export const getUsers = (SearchText, IsOnline, IsApproved) => {
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
 * @description get all groups
 * @return {Promise<unknown[]>}
 */
export const getGroupsAll = () => {
  const getGroupsAllAPI = API_Provider(CN_API, 'GetGroupsAll');
  return apiCallWrapper(getGroupsAllAPI, {}).then((res) => {
    return Object.keys(res?.AllGroups || {})
      .map((key) => res.AllGroups[key]?.Nodes || [])
      .flat()
      .map(
        (g) => (
          (g.IsMember = (res?.Groups || []).some((x) => x.NodeID == g.NodeID)),
          g
        )
      );
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

/**
 * @description set username
 */
export const setUserName = (UserName, UserID) => {
  const setUserNameAPI = API_Provider(USERS_API, 'SetUserName');

  return new Promise((resolve, reject) => {
    try {
      setUserNameAPI.fetch(
        {
          UserID,
          UserName: encodeBase64(UserName),
        },
        (res) => {
          console.log(res);
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

/**
 *
 * @param IsApproved
 * @param UserID
 * @return {Promise<unknown>}
 */
export const updateApprovedStatus = (IsApproved, UserID) => {
  const IsApprovedAPI = API_Provider(USERS_API, 'IsApproved');
  return apiCallWrapper(IsApprovedAPI, { IsApproved, UserID });
};

/**
 * @description reset password
 * @param UserID
 * @return {Promise<unknown>}
 */
export const setRandomPassword = (UserID) => {
  const setRandomPasswordAPI = API_Provider(USERS_API, 'SetRandomPassword');
  return apiCallWrapper(setRandomPasswordAPI, { UserID });
};

const apiCallWrapper = (api, data) => {
  return new Promise((resolve, reject) => {
    try {
      api?.fetch(
        data,
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};