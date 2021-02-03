import { lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Styled from './Sidebar.styles';
import SidebarHeader from './SidebarHeader';
import { themeSlice } from 'store/reducers/themeReducer';
const SidebarFooter = lazy(() => import('./SidebarFooter'));
const SidebarOpenContent = lazy(() => import('./SidebarContent-Open'));
const SidebarCloseContent = lazy(() => import('./SidebarContent-Close'));

const Sidebar = () => {
  const dispatch = useDispatch();
  const { toggleSidebar, toggleSetting } = themeSlice.actions;
  const { isSidebarOpen, isSettingShown } = useSelector((state) => state.theme);

  const handleSettings = () => {
    if (!isSidebarOpen) {
      dispatch(toggleSidebar(true));
      dispatch(toggleSetting(true));
    } else {
      dispatch(toggleSetting(!isSettingShown));
    }
  };
  return (
    <Styled.SidebarContainer width={isSidebarOpen ? 250 : 55}>
      <SidebarHeader />
      <Styled.ContentWrapper options={{ isSidebarOpen, isSettingShown }}>
        <Suspense fallback={<div>Loading....</div>}>
          {isSidebarOpen ? (
            <SidebarOpenContent handleSettings={handleSettings} />
          ) : (
            <SidebarCloseContent handleSettings={handleSettings} />
          )}
        </Suspense>
      </Styled.ContentWrapper>
      {!isSettingShown && <SidebarFooter />}
    </Styled.SidebarContainer>
  );
};

export default Sidebar;
