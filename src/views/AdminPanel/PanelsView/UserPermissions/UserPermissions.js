import { useRef } from 'react';
import useWindow from 'hooks/useWindowContext';
import Permissions from './Permission/Permissions';

const UserPermissions = (props) => {
  console.log(props);
  const { RVGlobal, RVDic } = useWindow();
  const permissionData = {
    sections: [
      {
        Title: '',
        Items: (RVGlobal?.AccessRoles || []).map((r) => ({
          ID: r?.ID,
          Title: RVDic?.PRVC[r?.Name] || RVDic[r?.Name] || r?.Name,
        })),
      },
    ],
    type: 'AccessRole',
    permissionType: 'View',
    ignoreConfidentialities: true,
  };

  return <Permissions {...permissionData} />;
};
export default UserPermissions;
