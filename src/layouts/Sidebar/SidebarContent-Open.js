import { lazy } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as Styled from './Sidebar.styles';
import ArrowIcon from 'components/Icons/ArrowIcons/Arrow';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
const SettingsContent = lazy(() => import('./SettingsContent'));
const MenuContent = lazy(() => import('./MenuContent'));

const OpenContent = ({ handleSettings }) => {
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
      {isSettingShown ? <SettingsContent /> : <MenuContent />}
    </>
  );
};

export default OpenContent;
