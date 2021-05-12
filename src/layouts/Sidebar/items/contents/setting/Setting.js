/**
 * Renders Settings or config panel links instead of regular menu in sidebar.
 */
import { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Styled from '../../../Sidebar.styles';
import { Link } from 'react-router-dom';
import { WindowContext } from 'context/WindowProvider';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import ArrowIcon from 'components/Icons/ArrowIcons/Arrow';
import { themeSlice } from 'store/reducers/themeReducer';
import SettingItem from './SettingItem';

const settingItems = [
  { id: '1', title: 'تنظیمات تیم', icon: 'setting-team' },
  { id: '2', title: 'مدیریت کاربران', icon: 'setting-users' },
  { id: '3', title: 'مدیریت قالب ها', icon: 'setting-classes' },
  { id: '4', title: 'تنظیمات آگاه سازی', icon: 'setting-notifs' },
];

const SidebarSettingContent = () => {
  const dispatch = useDispatch();
  const { RV_RevFloat, RVDic } = useContext(WindowContext);

  const { setSidebarContent } = themeSlice.actions;
  const panels = useSelector((state) => state.sidebarItems.configPanels);

  const handleOnClick = () => {
    dispatch(setSidebarContent({ current: 'main', prev: 'setting' }));
  };

  return (
    <>
      <Styled.SidebarTitle>
        <Styled.CenterIcon>
          <SettingIcon />
          <Styled.TitleText>{RVDic.TeamManagement}</Styled.TitleText>
        </Styled.CenterIcon>
        <Styled.SettingWrapper onClick={handleOnClick}>
          <ArrowIcon dir={RV_RevFloat} size={20} />
        </Styled.SettingWrapper>
      </Styled.SidebarTitle>
      <Styled.PanelListWrapper>
        {settingItems.map((item) => {
          return (
            <SettingItem key={item.id} item={item} />
            // <Styled.PanelWrapper
            //   as={Link}
            //   to={`/configuration/${panel.URL}`}
            //   key={key}>
            //   <Styled.PanelImage
            //     src={`${process.env.PUBLIC_URL}/images/icons/${panel.Icon}`}
            //     alt="panel-icon"
            //   />
            //   <Styled.PanelLink>
            //     {RVDic.PRVC[panel.Name] || RVDic[panel.Name] || panel.Name}
            //   </Styled.PanelLink>
            // </Styled.PanelWrapper>
          );
        })}
      </Styled.PanelListWrapper>
    </>
  );
};

export default SidebarSettingContent;
