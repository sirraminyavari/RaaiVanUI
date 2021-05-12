/**
 * Renders Settings or config panel links instead of regular menu in sidebar.
 */
import { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Styled from '../../../Sidebar.styles';
import { WindowContext } from 'context/WindowProvider';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import ArrowIcon from 'components/Icons/ArrowIcons/Arrow';
import { themeSlice } from 'store/reducers/themeReducer';
import SettingItem from './SettingItem';
import TeamSetting from './items/team-settings/TeamSettings';
import { createSelector } from 'reselect';
import iconList from './iconList';
import EditableTree from '../../sidebarTree/editable/E-Tree';

const settingItems = [
  { id: '1', title: 'تنظیمات تیم', icon: 'setting-team' },
  { id: '2', title: 'مدیریت کاربران', icon: 'setting-users' },
  { id: '3', title: 'مدیریت قالب ها', icon: 'setting-classes' },
  { id: '4', title: 'تنظیمات آگاه سازی', icon: 'setting-notifs' },
];

const selectSidebarContent = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarContent
);

const SidebarSettingContent = () => {
  const dispatch = useDispatch();
  const { RV_RevFloat, RVDic } = useContext(WindowContext);
  const selectedContent = useSelector(selectSidebarContent);
  const { setSidebarContent } = themeSlice.actions;
  const panels = useSelector((state) => state.sidebarItems.configPanels);

  const currentContent = selectedContent.current;
  const previousContent = selectedContent.prev;

  const getContentTitle = (content) => {
    const contentTitle = content.split('-')[1];

    switch (contentTitle) {
      case 'team':
        return 'تنظیمات تیم';
      case 'users':
        return 'مدیریت کاربران';
      case 'classes':
        return 'مدیریت قالب ها';
      case 'notifs':
        return 'تنظیمات آگاه سازی';
      default:
        return RVDic.TeamManagement;
    }
  };

  const getContentIcon = (content) => {
    if (content === 'setting') {
      return <SettingIcon />;
    } else {
      return iconList[content]({ size: 22 });
    }
  };

  const getSettingContent = (content) => {
    switch (content) {
      case 'setting-team':
        return panels.map((panel, key) => (
          <TeamSetting key={key} panel={panel} />
        ));
      case 'setting-users':
        return 'users';
      case 'setting-classes':
        return <EditableTree />;
      case 'setting-notifs':
        return 'notifs';
      default:
        return settingItems.map((item) => (
          <SettingItem key={item.id} item={item} />
        ));
    }
  };

  //! Handle back arrow click.
  const handleOnClick = () => {
    if (currentContent === 'setting') {
      dispatch(
        setSidebarContent({
          current: 'main',
          prev: 'setting',
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
