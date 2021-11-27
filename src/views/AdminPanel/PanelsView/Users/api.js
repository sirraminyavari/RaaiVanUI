/**
 * @description get list of users
 */
import { API_Provider, decodeBase64, encodeBase64 } from 'helpers/helpers';
import { GET_USERS, USERS_API } from 'constant/apiConstants';

export const getUsers = (
  SearchText,
  IsOnline = null,
  IsApproved = false,
  LockedStatus = true,
  LastActivityTime = true,
  MainEmailAddress = true,
  MainPhoneNumber = true,
  ApprovedStatus = true,
  SystemAdminStatus = true,
  Count = 16,
  LowerBoundary
) => {
  const getListOfUsersAPI = API_Provider(USERS_API, GET_USERS);

  return new Promise((resolve, reject) => {
    try {
      getListOfUsersAPI.fetch(
        {
          SearchText: encodeBase64(SearchText),
          LastActivityTime,
          MainEmailAddress,
          IsApproved,
          MainPhoneNumber,
          ApprovedStatus,
          SystemAdminStatus,
          Count,
        },
        (res) => {
          resolve(
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

export const updateApprovedStatus = (IsApproved, UserID) => {
  const IsApprovedAPI = API_Provider(USERS_API, 'IsApproved');
  return httpCall(IsApprovedAPI, { IsApproved, UserID });
};

const httpCall = (api, data) => {
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
