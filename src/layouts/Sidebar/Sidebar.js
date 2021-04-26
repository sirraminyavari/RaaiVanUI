/**
 * Renders whole sidebar area for non-mobile screens.
 */
import { lazy, Suspense, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from './Sidebar.styles';
import { getSidebarNodes } from 'store/actions/sidebar/sidebarMenuAction';
import getConfigPanels from 'store/actions/sidebar/sidebarPanelsAction';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import SidebarHeader from './items/Header';
import SidebarFooter from './items/footer/Footer';
import { BG_WARMER, C_WHITE } from 'constant/Colors';

const SidebarContentOpen = lazy(() =>
  import(/* webpackChunkName: "sidebar-open-content"*/ './items/SidebarOpen')
);
const SidebarContentClose = lazy(() =>
  import(/* webpackChunkName: "sidebar-close-content"*/ './items/SidebarClose')
);

const selectIsSidebarOpen = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarOpen
);

const selectSidebarContent = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarContent
);

const Sidebar = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const sidebarContent = useSelector(selectSidebarContent);

  useEffect(() => {
    if (isSidebarOpen) {
      dispatch(getSidebarNodes());
      dispatch(getConfigPanels());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSidebarOpen, dispatch]);

  const isMainContent = sidebarContent === 'main';
  const isManageContent = sidebarContent === 'manage';

  return (
    <Styled.SidebarContainer className={`${BG_WARMER} ${C_WHITE}`}>
      <SidebarHeader />
      <Styled.ContentWrapper isManage={isManageContent}>
        <Suspense fallback={<LogoLoader size={10} />}>
          {isSidebarOpen ? (
            <SidebarContentOpen />
          ) : isMainContent ? (
            <SidebarContentClose />
          ) : null}
        </Suspense>
      </Styled.ContentWrapper>
      {isSidebarOpen ? (
        <SidebarFooter />
      ) : isMainContent ? (
        <SidebarFooter />
      ) : null}
    </Styled.SidebarContainer>
  );
};

export default memo(Sidebar);
