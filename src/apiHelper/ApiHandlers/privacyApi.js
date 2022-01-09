import { API_Provider } from 'helpers/helpers';
import { PRIVACY_API } from 'constant/apiConstants';
import { apiCallWrapper } from './apiCallHelpers';

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
