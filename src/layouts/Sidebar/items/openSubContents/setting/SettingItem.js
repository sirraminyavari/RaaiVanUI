import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import iconList from './iconList';
import {
  SETTING_CONTENT,
  SETT_CLASSES_CONTENT,
  SETT_NOTIFS_CONTENT,
  SETT_TEAM_CONTENT,
  SETT_USERS_CONTENT,
} from 'constant/constants';
import useWindow from 'hooks/useWindowContext';

const SettingItem = () => {
  const dispatch = useDispatch();
  const { setSidebarContent } = themeSlice.actions;
  const { RVDic } = useWindow();

  const settingItems = [
    { id: '1', title: RVDic.Settings, icon: SETT_TEAM_CONTENT },
    // { id: '2', title: RVDic.UserManagement, icon: SETT_USERS_CONTENT },
    { id: '3', title: RVDic.TemplateManagement, icon: SETT_CLASSES_CONTENT },
    // { id: '4', title: RVDic.NotificationSettings, icon: SETT_NOTIFS_CONTENT },
  ];

  //! Change sidebar content on click.
  const onSettingItemClick = useCallback((current) => {
    dispatch(setSidebarContent({ current, prev: SETTING_CONTENT }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {settingItems?.map((item, key) => {
        return (
          <Styled.SettingItemWrapper
            key={key}
            onClick={() => onSettingItemClick(item?.icon)}>
            {iconList[item?.icon]({ size: 20 })}
            <Styled.SettingItemTitle>{item?.title}</Styled.SettingItemTitle>
          </Styled.SettingItemWrapper>
        );
      })}
    </>
  );
};

export default SettingItem;
