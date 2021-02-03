import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import * as Styled from './Sidebar.styles';
import Icons from 'components/Icons';
const SettingsContent = lazy(() => import('./SettingsContent'));
const MenuContent = lazy(() => import('./MenuContent'));

const OpenContent = ({ handleSettings }) => {
  const { isSettingShown } = useSelector((state) => state.theme);

  return (
    <>
      <Styled.SidebarTitle>
        {isSettingShown ? (
          <Styled.CenterIcon>
            {Icons.settings}
            <span style={{ padding: '0 10px' }}>مدیریت تیم</span>
          </Styled.CenterIcon>
        ) : (
          <span>تیم شاهین</span>
        )}
        <Styled.SettingWrapper onClick={handleSettings}>
          {Icons[isSettingShown ? 'arrowLeft' : 'settings']}
        </Styled.SettingWrapper>
      </Styled.SidebarTitle>
      <Suspense fallback={<div>Loading ..</div>}>
        {isSettingShown ? <SettingsContent /> : <MenuContent />}
      </Suspense>
    </>
  );
};

export default OpenContent;
