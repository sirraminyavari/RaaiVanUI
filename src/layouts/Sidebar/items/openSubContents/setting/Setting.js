/**
 * Renders Settings or config panel links instead of regular menu in sidebar.
 */
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import ArrowIcon from 'components/Icons/ArrowIcons/Arrow';
import { themeSlice } from 'store/reducers/themeReducer';
import SettingItems from './SettingItem';
import TeamSettings from './items/team-settings/TeamSettings';
import iconList from './iconList';
import EditableTree from 'layouts/Sidebar/items/sidebarTree/editable/EditableTree';
import useWindow from 'hooks/useWindowContext';
import {
  MAIN_CONTENT,
  SETTING_CONTENT,
  SETT_CLASSES_CONTENT,
  SETT_NOTIFS_CONTENT,
  SETT_TEAM_CONTENT,
  SETT_USERS_CONTENT,
} from 'constant/constants';

const selectSidebarContent = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarContent
);

const SidebarSettingContent = () => {
  const dispatch = useDispatch();
  const { RV_RevFloat, RVDic } = useWindow();
  const selectedContent = useSelector(selectSidebarContent);
  const { setSidebarContent } = themeSlice.actions;

  const currentContent = selectedContent.current;
  const previousContent = selectedContent.prev;

  const getContentTitle = (content) => {
    const splitTitle = (title) => title.split('-')[1];

    switch (splitTitle(content)) {
      case splitTitle(SETT_TEAM_CONTENT):
        return RVDic.Settings;
      case splitTitle(SETT_USERS_CONTENT):
        return RVDic.UserManagement;
      case splitTitle(SETT_CLASSES_CONTENT):
        return RVDic.TemplateManagement;
      case splitTitle(SETT_NOTIFS_CONTENT):
        return RVDic.NotificationSettings;
      default:
        return RVDic.TeamManagement;
    }
  };

  const getContentIcon = (content) => {
    if (content === SETTING_CONTENT) {
      return <SettingIcon />;
    } else {
      return iconList[content]({ size: 22 });
    }
  };

  const getSettingContent = (content) => {
    switch (content) {
      case SETT_TEAM_CONTENT:
        return <TeamSettings />;
      case SETT_USERS_CONTENT:
        return 'users';
      case SETT_CLASSES_CONTENT:
        return <EditableTree />;
      case SETT_NOTIFS_CONTENT:
        return 'notifs';
      default:
        return <SettingItems />;
    }
  };

  //! Handle back arrow click.
  const handleOnClick = () => {
    if (currentContent === SETTING_CONTENT) {
      dispatch(
        setSidebarContent({
          current: MAIN_CONTENT,
          prev: SETTING_CONTENT,
        })
      );
    } else {
      dispatch(
        setSidebarContent({
          current: previousContent,
          prev: currentContent,
        })
      );
    }
  };

  return (
    <>
      <Styled.SidebarTitle>
        <Styled.CenterIcon>
          {getContentIcon(currentContent)}
          <Styled.TitleText>{getContentTitle(currentContent)}</Styled.TitleText>
        </Styled.CenterIcon>
        <Styled.SettingWrapper onClick={handleOnClick}>
          <ArrowIcon dir={RV_RevFloat} size={25} />
        </Styled.SettingWrapper>
      </Styled.SidebarTitle>
      <Styled.PanelListWrapper>
        {getSettingContent(currentContent)}
      </Styled.PanelListWrapper>
    </>
  );
};

export default SidebarSettingContent;
