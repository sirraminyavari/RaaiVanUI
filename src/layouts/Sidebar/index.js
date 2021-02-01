import { useContext, lazy, Suspense } from 'react';
import { ThemeContext } from 'context/ThemeProvider';
import {
  SidebarContainer,
  SidebarContentWrap,
  InnerWrapper,
} from './Sidebar.styles';
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
    <SidebarContainer width={isOpen ? 250 : 55}>
      <Suspense fallback={<div>Loading...</div>}>
        <InnerWrapper isOpen={isOpen}>
          <SidebarContentWrap>
            <SidebarHeader />
            {isOpen ? (
              <SidebarOpenContent showSettings={showSettings} />
            ) : (
              <SidebarCloseContent showSettings={showSettings} />
            )}
          </SidebarContentWrap>
        </InnerWrapper>
        {!showSetting && <SidebarFooter isOpen={isOpen} />}
      </Suspense>
    </SidebarContainer>
  );
};

export default Sidebar;
