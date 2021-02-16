import { lazy } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as Styled from '../Sidebar.styles';
import ArrowIcon from 'components/Icons/ArrowIcons/Arrow';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import { getURL } from 'helpers/helpers';
const SidebarManagement = lazy(() =>
  import(/* webpackChunkName: "sidebar-setting-content"*/ './Management')
);
const SidebarMain = lazy(() =>
  import(/* webpackChunkName: "sidebar-menu-content"*/ './Main')
);

const SidebarOnOpen = ({ handleSettings }) => {
  const { isSettingShown } = useSelector((state) => state.theme);

  return (
    <>
      <Styled.SidebarTitle>
        {isSettingShown ? (
          <Styled.CenterIcon>
            <SettingIcon />
            <Styled.TitleText>مدیریت تیم</Styled.TitleText>
          </Styled.CenterIcon>
        ) : (
          <Styled.TitleText as={Link} to={getURL('Classes')}>
            تیم شاهین
          </Styled.TitleText>
        )}
        <Styled.SettingWrapper onClick={handleSettings}>
          {isSettingShown ? (
            <ArrowIcon dir="left" size={20} />
          ) : (
            <SettingIcon />
          )}
        </Styled.SettingWrapper>
      </Styled.SidebarTitle>
      {isSettingShown ? <SidebarManagement /> : <SidebarMain />}
    </>
  );
};

export default SidebarOnOpen;
