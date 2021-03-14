/**
 * Renders whole sidebar area for non-mobile screens.
 */
import { lazy, Suspense, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from './Sidebar.styles';
import getSidebarNodes from 'store/actions/sidebar/sidebarMenuAction';
import getConfigPanels from 'store/actions/sidebar/sidebarPanelsAction';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import SidebarHeader from './components/Header';
import SidebarFooter from './components/Footer';
import { BG_WARMER } from 'constant/Colors';

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

const selectIsSidebarOpen = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarOpen
);

const selectIsSettingShown = createSelector(
  (state) => state.theme,
  (theme) => theme.isSettingShown
);

const Sidebar = () => {
  console.count('side');
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const isSettingShown = useSelector(selectIsSettingShown);

  useEffect(() => {
    if (isSidebarOpen) {
      dispatch(getSidebarNodes());
      dispatch(getConfigPanels());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSidebarOpen, dispatch]);

  return (
    <Styled.SidebarContainer className={BG_WARMER}>
      <SidebarHeader />
      <Styled.ContentWrapper>
        <Suspense fallback={<LogoLoader size={10} />}>
          {isSidebarOpen ? <SidebarContentOpen /> : <SidebarContentClose />}
        </Suspense>
      </Styled.ContentWrapper>
      {!isSettingShown && <SidebarFooter />}
    </Styled.SidebarContainer>
  );
};

export default memo(Sidebar);
