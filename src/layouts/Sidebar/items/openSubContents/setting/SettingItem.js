import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import iconList from './iconList';
import {
  SETTING_CONTENT,
  SETT_CLASSES_CONTENT,
  SETT_TEAM_CONTENT,
} from 'constant/constants';
import useWindow from 'hooks/useWindowContext';
import { useHistory, useLocation } from 'react-router-dom';
import { useThemeSlice } from 'store/slice/theme';
import { selectApplication } from 'store/slice/applications/selectors';
import TeamSettings from './items/team-settings/TeamSettings';

const SettingItem = () => {
  const dispatch = useDispatch();
  const { RVDic } = useWindow();
  const history = useHistory();
  const location = useLocation();
  const {
    currentApp: { ApplicationID: currentApplicationID },
  } = useSelector(selectApplication);

  const {
    actions: { setSidebarContent },
  } = useThemeSlice();

  const settingItems = [
    // { id: '1', title: RVDic.Settings, icon: SETT_TEAM_CONTENT },
    // { id: '2', title: RVDic.UserManagement, icon: SETT_USERS_CONTENT },
    { id: '3', title: RVDic.TemplateManagement, icon: SETT_CLASSES_CONTENT },
    // { id: '4', title: RVDic.NotificationSettings, icon: SETT_NOTIFS_CONTENT },
  ];

  //! Change sidebar content on click.
  const onSettingItemClick = useCallback((current) => {
    if (current === 'setting-classes') {
      history.push('/templates/settings');
    } else if (current === 'teamsettings') {
      history.push(`/teamsettings/${currentApplicationID}`);
    } else {
      dispatch(setSidebarContent({ current, prev: SETTING_CONTENT }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Styled.SettingItemWrapper
        active={location.pathname === `/teamsettings/${currentApplicationID}`}
        onClick={() => onSettingItemClick('teamsettings')}
      >
        {iconList['setting-team']({ size: 20 })}
        <Styled.SettingItemTitle>{RVDic.TeamSettings}</Styled.SettingItemTitle>
      </Styled.SettingItemWrapper>
      <TeamSettings />
      {settingItems?.map((item, key) => {
        return (
          <Styled.SettingItemWrapper
            key={key}
            active={location.pathname === `/templates/settings`}
            onClick={() => onSettingItemClick(item?.icon)}
          >
            {iconList[item?.icon]({ size: 20 })}
            <Styled.SettingItemTitle>{item?.title}</Styled.SettingItemTitle>
          </Styled.SettingItemWrapper>
        );
      })}
    </>
  );
};

export default SettingItem;
