import { lazy } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as Styled from '../Sidebar.styles';
import ArrowIcon from 'components/Icons/ArrowIcons/Arrow';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
const SidebarSettingContent = lazy(() =>
  import(
    /* webpackChunkName: "sidebar-setting-content"*/ './SidebarSettingContent'
  )
);
const SideabrMenuContent = lazy(() =>
  import(/* webpackChunkName: "sidebar-menu-content"*/ './SidebarMenuContent')
);

const SidebarOnOpen = ({ handleSettings }) => {
  const { isSettingShown } = useSelector((state) => state.theme);

  return (
    <>
      <Styled.SidebarTitle>
        {isSettingShown ? (
          <Styled.CenterIcon>
            <SettingIcon />
            <span style={{ padding: '0 10px' }}>مدیریت تیم</span>
          </Styled.CenterIcon>
        ) : (
          <Link to="/classes" style={{ color: '#fff' }}>
            تیم شاهین
          </Link>
        )}
        <Styled.SettingWrapper onClick={handleSettings}>
          {isSettingShown ? (
            <ArrowIcon dir="left" size={20} />
          ) : (
            <SettingIcon />
          )}
        </Styled.SettingWrapper>
      </Styled.SidebarTitle>
      {isSettingShown ? <SidebarSettingContent /> : <SideabrMenuContent />}
    </>
  );
};

export default SidebarOnOpen;
