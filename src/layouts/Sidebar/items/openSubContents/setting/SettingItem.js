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

const settingItems = [
  { id: '1', title: 'تنظیمات تیم', icon: SETT_TEAM_CONTENT },
  { id: '2', title: 'مدیریت کاربران', icon: SETT_USERS_CONTENT },
  { id: '3', title: 'مدیریت قالب ها', icon: SETT_CLASSES_CONTENT },
  { id: '4', title: 'تنظیمات آگاه سازی', icon: SETT_NOTIFS_CONTENT },
];

const SettingItem = () => {
  const dispatch = useDispatch();
  const { setSidebarContent } = themeSlice.actions;

  //! Change sidebar content on click.
  const onSettingItemClick = useCallback((current) => {
    dispatch(setSidebarContent({ current, prev: SETTING_CONTENT }));
  }, []);

  return (
    <>
      {settingItems.map((item) => {
        return (
          <Styled.SettingItemWrapper
            onClick={() => onSettingItemClick(item.icon)}>
            {iconList[item.icon]({ size: 20 })}
            <Styled.SettingItemTitle>{item.title}</Styled.SettingItemTitle>
          </Styled.SettingItemWrapper>
        );
      })}
    </>
  );
};

export default SettingItem;
