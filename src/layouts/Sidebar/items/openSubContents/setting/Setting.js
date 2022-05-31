/**
 * Renders Settings or config panel links instead of regular menu in sidebar.
 */
import { useSelector, useDispatch } from 'react-redux';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import ArrowIcon from 'components/Icons/ArrowIcons/Arrow';
import SettingItems from './SettingItem';
import UsersContent from './items/users/UsersContent';
import TeamSettings from './items/team-settings/TeamSettings';
import iconList from './iconList';
import EditableTree from 'layouts/Sidebar/items/sidebarTree/editable/EditableTree';
import useWindow from 'hooks/useWindowContext';
import {
  MAIN_CONTENT,
  SETTING_CONTENT,
  SETT_CLASSES_CONTENT,
  SETT_NOTIFS_CONTENT,
  SETT_WORKSPACE_CONTENT,
  SETT_TEAM_CONTENT,
  SETT_USERS_CONTENT,
  SETT_ONBOARDING_CONTENT,
} from 'constant/constants';
import WorkspaceContent from './items/workspace/WorkspaceContent';
import OnboardingContent from './items/onboarding/OnboardingContent';
import { useThemeSlice } from 'store/slice/theme';
import { selectTheme } from 'store/slice/theme/selectors';

const SidebarSettingContent = () => {
  const dispatch = useDispatch();
  const { RV_RevFloat, RVDic } = useWindow();

  const {
    actions: { setSidebarContent },
  } = useThemeSlice();

  const { sidebarContent: selectedContent } = useSelector(selectTheme);

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
      case splitTitle(SETT_WORKSPACE_CONTENT):
        return RVDic.SettingsOfN.replace('[n]', RVDic.Workspace);
      case splitTitle(SETT_ONBOARDING_CONTENT):
        return '';
      default:
        return RVDic.TeamManagement;
    }
  };

  const getContentIcon = (content) => {
    if (content === SETTING_CONTENT) {
      return <SettingIcon />;
    } else {
      return iconList?.[content] ? (
        iconList[content]({ size: 22 })
      ) : (
        <SettingIcon />
      );
    }
  };

  const getSettingContent = (content) => {
    switch (content) {
      case SETT_TEAM_CONTENT:
        return <TeamSettings />;
      case SETT_USERS_CONTENT:
        return <UsersContent />;
      case SETT_CLASSES_CONTENT:
        return <EditableTree />;
      case SETT_NOTIFS_CONTENT:
        return 'notifs';
      case SETT_WORKSPACE_CONTENT:
        return <WorkspaceContent />;
      case SETT_ONBOARDING_CONTENT:
        return <OnboardingContent />;
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
