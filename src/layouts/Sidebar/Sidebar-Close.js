/**
 * Renders close sidebar area for non-mobile screens.
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

const CloseSidebar = () => {
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

  return (
    <Styled.SidebarContainer>
      <SidebarHeader />
      <Styled.ContentWrapper isMainContent={isMainContent}>
        <Suspense fallback={<LogoLoader size={10} />}>
          {isMainContent && <SidebarContentClose />}
        </Suspense>
      </Styled.ContentWrapper>
      {isMainContent && <SidebarFooter />}
    </Styled.SidebarContainer>
  );
};

export default memo(CloseSidebar);
