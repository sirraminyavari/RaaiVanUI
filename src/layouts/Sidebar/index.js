import { useContext, lazy, Suspense } from 'react';
import { ThemeContext } from 'context/ThemeProvider';
import * as Styled from './Sidebar.styles';
import SidebarHeader from './SidebarHeader';
const SidebarFooter = lazy(() => import('./SidebarFooter'));
const SidebarOpenContent = lazy(() => import('./SidebarContent-Open'));
const SidebarCloseContent = lazy(() => import('./SidebarContent-Close'));

const Sidebar = () => {
  const { isOpen, setIsOpen, showSetting, setShowSetting } = useContext(
    ThemeContext
  );
  const showSettings = () => {
    if (!isOpen) {
      setIsOpen(true);
      setShowSetting(true);
    } else {
      setShowSetting(!showSetting);
    }
  };
  return (
    <Styled.SidebarContainer width={isOpen ? 250 : 55}>
      <SidebarHeader />
      <Styled.ContentWrapper options={{ isOpen, showSetting }}>
        <Suspense fallback={<div>Loading....</div>}>
          {isOpen ? (
            <SidebarOpenContent showSettings={showSettings} />
          ) : (
            <SidebarCloseContent showSettings={showSettings} />
          )}
        </Suspense>
      </Styled.ContentWrapper>
      {!showSetting && <SidebarFooter isOpen={isOpen} />}
    </Styled.SidebarContainer>
  );
};

export default Sidebar;
