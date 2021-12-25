import { API_Provider } from '../../helpers/helpers';
import { RV_API } from '../../constant/apiConstants';
import { apiCallWrapper } from './apiCallHelpers';

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
