import { useEffect, useRef } from 'react';
import useWindow from 'hooks/useWindowContext';
import Permissions from './Permission/Permissions';
import { SETT_USERS_CONTENT, SETTING_CONTENT } from 'constant/constants';
import { useDispatch } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';

const { setSidebarContent } = themeSlice.actions;

const UserPermissions = (props) => {
  const { RVGlobal, RVDic } = useWindow();
  const dispatch = useDispatch();
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
