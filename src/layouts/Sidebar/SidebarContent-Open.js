import { useContext, lazy, Suspense } from 'react';
import { ThemeContext } from 'context/ThemeProvider';
import { CenterIcon, SidebarTitle, SettingWrapper } from './Sidebar.styles';
import Icons from 'components/Icons';
const SettingsContent = lazy(() => import('./SettingsContent'));
const MenuContent = lazy(() => import('./MenuContent'));

const OpenContent = ({ showSettings }) => {
  const { showSetting } = useContext(ThemeContext);
  return (
    <>
      <SidebarTitle>
        {showSetting ? (
          <CenterIcon>
            {Icons['settings']}
            <span style={{ padding: '0 10px' }}>مدیریت تیم</span>
          </CenterIcon>
        ) : (
          <span>تیم شاهین</span>
        )}
        <SettingWrapper onClick={showSettings}>
          {Icons[showSetting ? 'arrowLeft' : 'settings']}
        </SettingWrapper>
      </SidebarTitle>
      <Suspense fallback={<di>Loading ..</di>}>
        {showSetting ? <SettingsContent /> : <MenuContent />}
      </Suspense>
    </>
  );
};

export default OpenContent;
