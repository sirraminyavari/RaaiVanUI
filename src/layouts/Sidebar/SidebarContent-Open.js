import { lazy, Suspense } from 'react';
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
          <span>تیم شاهین</span>
        )}
        <Styled.SettingWrapper onClick={handleSettings}>
          {isSettingShown ? (
            <ArrowIcon dir="left" size={20} />
          ) : (
            <SettingIcon />
          )}
        </Styled.SettingWrapper>
      </Styled.SidebarTitle>
      <Suspense fallback={<div>Loading ..</div>}>
        {isSettingShown ? <SettingsContent /> : <MenuContent />}
      </Suspense>
    </>
  );
};

export default OpenContent;
