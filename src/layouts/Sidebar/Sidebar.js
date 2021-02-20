import { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Styled from './Sidebar.styles';
import { themeSlice } from 'store/reducers/themeReducer';
import getSidebarNodes from 'store/actions/sidebar/sidebarMenuAction';
import LogoLoader from 'components/LogoLoader/LogoLoader';
import SidebarHeader from './components/Header';
import SidebarFooter from './components/Footer';

const SidebarContentOpen = lazy(() =>
  import(
    /* webpackChunkName: "sidebar-open-content"*/ './components/ContentOpen'
  )
);
const SidebarContentClose = lazy(() =>
  import(
    /* webpackChunkName: "sidebar-close-content"*/ './components/ContentClose'
  )
);

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
    <Styled.SidebarContainer isSidebarOpen={isSidebarOpen}>
      <SidebarHeader />
      <Styled.ContentWrapper options={{ isSidebarOpen, isSettingShown }}>
        <Suspense fallback={<LogoLoader size={10} />}>
          {isSidebarOpen ? (
            <SidebarContentOpen handleSettings={handleSettings} />
          ) : (
            <SidebarContentClose handleSettings={handleSettings} />
          )}
        </Suspense>
      </Styled.ContentWrapper>
      {!isSettingShown && <SidebarFooter />}
    </Styled.SidebarContainer>
  );
};

export default Sidebar;
