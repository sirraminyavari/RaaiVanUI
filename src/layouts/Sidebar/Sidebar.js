import { lazy, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as Styled from './Sidebar.styles';
import getSidebarNodes from 'store/actions/sidebar/sidebarMenuAction';
import getConfigPanels from 'store/actions/sidebar/sidebarPanelsAction';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import SidebarHeader from './components/Header';
import SidebarFooter from './components/Footer';
import { BG_WARMER } from 'constant/Colors';
import withTheme from 'components/withTheme/withTheme';

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

const Sidebar = (props) => {
  const dispatch = useDispatch();
  const { toggleSidebar, toggleSetting } = props.theme.actions;
  const { isSidebarOpen, isSettingShown } = props.theme.states;

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
    dispatch(getConfigPanels());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSidebarOpen]);

  return (
    <Styled.SidebarContainer className={BG_WARMER}>
      <SidebarHeader />
      <Styled.ContentWrapper>
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

export default withTheme(Sidebar);
