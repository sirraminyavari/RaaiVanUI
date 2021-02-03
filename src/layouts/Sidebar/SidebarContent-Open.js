import { useContext, lazy, Suspense } from 'react';
import { ThemeContext } from 'context/ThemeProvider';
import * as Styled from './Sidebar.styles';
import Icons from 'components/Icons';
const SettingsContent = lazy(() => import('./SettingsContent'));
const MenuContent = lazy(() => import('./MenuContent'));

const OpenContent = ({ showSettings }) => {
  const { showSetting } = useContext(ThemeContext);
  return (
    <>
      <Styled.SidebarTitle>
        {showSetting ? (
          <Styled.CenterIcon>
            {Icons.settings}
            <span style={{ padding: '0 10px' }}>مدیریت تیم</span>
          </Styled.CenterIcon>
        ) : (
          <span>تیم شاهین</span>
        )}
        <Styled.SettingWrapper onClick={showSettings}>
          {Icons[showSetting ? 'arrowLeft' : 'settings']}
        </Styled.SettingWrapper>
      </Styled.SidebarTitle>
      <Suspense fallback={<di>Loading ..</di>}>
        {showSetting ? <SettingsContent /> : <MenuContent />}
      </Suspense>
    </>
  );
};

export default OpenContent;
