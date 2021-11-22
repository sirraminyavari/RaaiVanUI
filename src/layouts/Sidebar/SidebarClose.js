/**
 * Renders close sidebar area for non-mobile screens.
 */
import { lazy, Suspense, memo } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from './Sidebar.styles';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import SidebarHeader from './items/Header';
import SidebarFooter from './items/footer/Footer';
import { MAIN_CONTENT } from 'constant/constants';

const SidebarContentClose = lazy(() =>
  import(/* webpackChunkName: "sidebar-close-content"*/ './items/ContentClose')
);

const selectTeam = createSelector(
  (state) => state.applications,
  (theme) => theme.currentApp
);

const selectSidebarContent = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarContent
);

const selectHasPattern = createSelector(
  (state) => state.theme,
  (theme) => theme.hasSidebarPattern
);

const selectIsSidebarOpen = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarOpen
);

const CloseSidebar = () => {
  const selectedTeam = useSelector(selectTeam);
  const sidebarContent = useSelector(selectSidebarContent);
  const hasPattern = useSelector(selectHasPattern);
  const isOpen = useSelector(selectIsSidebarOpen);

  const isMainContent = sidebarContent.current === MAIN_CONTENT;
  const isTeamSelected = !!selectedTeam?.ApplicationID;

  return (
    <Styled.SidebarContainer isOpen={isOpen} hasPattern={hasPattern}>
      <SidebarHeader />
      <Styled.ContentWrapper isMainContent={isMainContent}>
        <Suspense fallback={<LogoLoader lottieWidth="3rem" />}>
          {isTeamSelected && isMainContent && <SidebarContentClose />}
        </Suspense>
      </Styled.ContentWrapper>
      {isTeamSelected && isMainContent && <SidebarFooter />}
    </Styled.SidebarContainer>
  );
};

export default memo(CloseSidebar);
