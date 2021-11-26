/**
 * @description get list of users
 */
import { API_Provider, encodeBase64 } from 'helpers/helpers';
import { GET_USERS, USERS_API } from 'constant/apiConstants';

export const getUsers = (
  SearchText,
  IsOnline = false,
  IsApproved = true,
  LockedStatus = true,
  LastActivityTime = true,
  MainEmail = true,
  MainPhoneNumber = true,
  Count = 16,
  LowerBoundary
) => {
  const getListOfUsersAPI = API_Provider(USERS_API, GET_USERS);

  return new Promise((resolve, reject) => {
    try {
      getListOfUsersAPI.fetch(
        {
          SearchText: encodeBase64(SearchText),
          IsOnline,
          LastActivityTime,
          MainEmail,
          MainPhoneNumber,
          IsApproved,
          Count,
        },
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
