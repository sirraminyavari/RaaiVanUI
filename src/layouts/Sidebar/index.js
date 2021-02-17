import { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Styled from './Sidebar.styles';
import SidebarHeader from './SidebarHeader';
import { themeSlice } from 'store/reducers/themeReducer';
import getSidebarNodes from 'store/actions/sidebar/sidebarMenuAction';
import LogoLoader from 'components/LogoLoader/LogoLoader';
import SidebarFooter from './SidebarFooter';
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

  useEffect(() => {
    dispatch(getSidebarNodes());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSidebarOpen]);

  return (
    <Styled.SidebarContainer width={isSidebarOpen ? 250 : 55}>
      <SidebarHeader />
      <Styled.ContentWrapper options={{ isSidebarOpen, isSettingShown }}>
        <Suspense fallback={<LogoLoader size={10} />}>
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
