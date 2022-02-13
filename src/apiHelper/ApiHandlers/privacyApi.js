import { API_Provider, encodeBase64 } from 'helpers/helpers';
import { PRIVACY_API } from 'constant/apiConstants';
import { apiCallWrapper } from './apiCallHelpers';
import {
  API_NAME_PRVC_GET_AUDIENCE,
  API_NAME_PRVC_SET_AUDIENCE,
} from 'constant/api-names-privacy';

export const checkAuthority = () => {
  const roles = (window?.RVGlobal?.AccessRoles || []).map((r) => r.Name);
  const checkAuthorityAPI = API_Provider(PRIVACY_API, 'CheckAuthority');

  return apiCallWrapper(checkAuthorityAPI, {
    Permissions: roles.join('|'),
  }).then((res) => {
    return roles.reduce(
      (dic, cur) => ((dic[cur] = !!(res || {})[cur]), dic),
      {}
    );
  });
};

/**
 * @enum {PrivacyObjectTypes}
 */
const PRIVACY_OBJECT_TYPE = {
  Node,
  NodeType,
  FAQCategory,
  QAWorkFlow,
  Poll,
  Report,
  FormElement,
  AccessRole,
};

/**
 * @enum {PermissionType}
 */
const PERMISSION_TYPE = {
  Create,
  CreateBulk,
  View,
  ViewAbstract,
  ViewRelatedItems,
  Modify,
  Delete,
  Download,
};

/**
 * @description fetches the current privacy settings for a number of ObjectIDs
 * @param {string[]} ObjectIDs an array of IDs which their privacy settings will be fetched
 * @param {string} ObjectID a single ID to fetch its privacy settings.
 * If the ObjectIDs array has at least one ID in it, ObjectID will be ignored
 * @param {PrivacyObjectType} Type the type of the object(s)
 */
export const getAudience = ({ ObjectIDs, ObjectID, Type } = {}) => {
  if (!(ObjectIDs || []).length && !!ObjectID) ObjectsIDs = [ObjectID];

  return apiCallWrapper(API_Provider(PRIVACY_API, API_NAME_PRVC_GET_AUDIENCE), {
    ObjectIDs: (ObjectsIDs || []).join('|'),
    ObjectType: Type,
  });
};

/**
 * @description saves the privacy settings of a number of objects
 * @param {PrivacyObjectType} Type the type of the object(s)
 * @param {Object} Data privacy settings
 * Data: {
 *  [objId_1]: {
 *    Confidentiality: { ID: [string] }, //enterprise mode only
 *    CalculateHierarchy: [boolean], //enterprise mode only
 *    Audience: [
 *      {
 *        RoleID: [string], //UserID or GroupID
 *        PermissionType: [string], //from "PermissionType" enum defined above
 *        Allow: [boolean], //if true, access is granted and if false, access is denied
 *        ExpirationDate: ["yyy-mm-dd"] //enterprise mode only
 *      },
 *      ...
 *    ],
 *    DefaultPermissions: [
 *      {
 *        PermissionType: [string], //from "PermissionType" enum defined above
 *        DefaultValue: [bool?]
 *      },
 *      ...
 *    ]
 *  },
 *  ...,
 *  [objId_n]: ...
 * }
 */
export const setAudience = ({ Type, Data } = {}) => {
  return apiCallWrapper(API_Provider(PRIVACY_API, API_NAME_PRVC_SET_AUDIENCE), {
    ObjectType: Type,
    Data: encodeBase64(JSON.stringify(Data)),
  });
};
