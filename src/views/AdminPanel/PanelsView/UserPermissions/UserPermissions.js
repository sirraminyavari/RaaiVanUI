import { useEffect, useRef } from 'react';
import useWindow from 'hooks/useWindowContext';
import Permissions from './Permission/Permissions';
import { SETT_USERS_CONTENT, SETTING_CONTENT } from 'constant/constants';
import { useDispatch } from 'react-redux';
import { useThemeSlice } from 'store/slice/theme';

const UserPermissions = (props) => {
  const { RVGlobal, RVDic } = useWindow();
  const dispatch = useDispatch();

  const {
    actions: { setSidebarContent },
  } = useThemeSlice();

  const permissionData = {
    sections: [
      {
        Title: '',
        Items: (RVGlobal?.AccessRoles || []).map((r) => ({
          ID: r?.ID,
          Title: RVDic?.PRVC[r?.Name] || RVDic[r?.Name] || r?.Name,
          Description: RVDic.PRVC[r.Name + '_Desc'],
        })),
      },
    ],
    type: 'AccessRole',
    permissionType: 'View',
    ignoreConfidentialities: true,
  };

  useEffect(() => {
    dispatch(
      setSidebarContent({
        current: SETT_USERS_CONTENT,
        prev: SETTING_CONTENT,
      })
    );

    return () => {
      dispatch(
        setSidebarContent({
          current: SETTING_CONTENT,
          prev: SETT_USERS_CONTENT,
        })
      );
    };
  }, []);

  return <Permissions {...permissionData} />;
};
export default UserPermissions;
