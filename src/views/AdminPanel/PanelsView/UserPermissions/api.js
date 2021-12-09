import {
  API_Provider,
  decodeBase64,
  encodeBase64,
} from '../../../../helpers/helpers';
import { PRIVACY_API } from '../../../../constant/apiConstants';

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

export const getAudience = (
  ObjectIDs,
  ObjectType,
  GlobalUtilities,
  sections
) => {
  const getAudienceAPI = API_Provider(PRIVACY_API, 'GetAudience');
  return apiCallWrapper(getAudienceAPI, {
    ObjectType,
    ObjectIDs,
  }).then((results) => {
    results = results || {};
    //this 'confidentialityLevel' won't be used if 'ignoreConfidentialities' parameter is set to 'false'
    let confidentialityLevels = (
      results.ConfidentialityLevels || []
    ).map((conf) =>
      GlobalUtilities.extend(conf, { Title: decodeBase64(conf.Title) })
    );
    //permissions state
    let permissions = (sections || [])
      .map((sec) => sec.Items || [])
      .flat()
      .reduce((obj, itm) => ((obj[itm.ID] = {}), obj), {});
    Object.keys(permissions)
      .filter((key) => !!permissions[key])
      .forEach((key) => {
        permissions[key] = {
          ConfidentialityID: ((results.Items[key] || {}).Confidentiality || {})
            .ID,
          Audience: ((results.Items[key] || {}).Audience || []).map(
            (itm) => itm.RoleID
          ),
        };
      });
    //end of permissions state
    //list of all roles, 'RoleType' may be equal to either 'Node' or 'User'
    let roles = Object.keys(results.Items || {})
      .map((key) => results.Items[key].Audience)
      .flat()
      .reduce((uniqueArray, cur) => {
        if (!uniqueArray.some((x) => x.RoleID == cur.RoleID))
          uniqueArray.push({
            RoleID: cur.RoleID,
            RoleName: decodeBase64(cur.RoleName),
            RoleType: decodeBase64(cur.RoleType),
            AdditionalID: decodeBase64(cur.AdditionalID),
            IconURL: cur.IconURL,
          });
        return uniqueArray;
      }, [])
      .sort((a, b) => a.RoleID < b.RoleID)
      .map((x) => {
        let count = (
          Object.values(permissions)
            .map((p) => p?.Audience)
            .flat()
            .filter((r) => r === x?.RoleID) || []
        )?.length;
        return {
          ...x,
          Permissions: count,
        };
      });

    return { confidentialityLevels, permissions, roles };
  });
};

export const setAudience = (ObjectType, permissions, permissionType) => {
  const setAudienceAPI = API_Provider(PRIVACY_API, 'SetAudience');
  const Data = encodeBase64(
    JSON.stringify(
      Object.keys(permissions || {}).reduce((dic, key) => {
        dic[key] = {
          Confidentiality: {
            ID: permissions[key].ConfidentialityID,
          },
          CalculateHierarchy: false,
          Audience: (permissions[key].Audience || []).map((aud) => ({
            RoleID: aud,
            PermissionType: permissionType,
            Allow: true,
          })),
        };
        return dic;
      }, {})
    )
  );

  return apiCallWrapper(setAudienceAPI, { ObjectType, Data });
};
