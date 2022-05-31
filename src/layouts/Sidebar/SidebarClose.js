/**
 * Renders close sidebar area for non-mobile screens.
 */
import { lazy, Suspense, memo } from 'react';
import { useSelector } from 'react-redux';
import * as Styled from './Sidebar.styles';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import SidebarHeader from './items/Header';
import SidebarFooter from './items/footer/Footer';
import { MAIN_CONTENT } from 'constant/constants';
import { selectTheme } from 'store/slice/theme/selectors';
import { selectApplication } from 'store/slice/applications/selectors';

const SidebarContentClose = lazy(() =>
  import(/* webpackChunkName: "sidebar-close-content"*/ './items/ContentClose')
);

const CloseSidebar = () => {
  const {
    isSidebarOpen: isOpen,
    hasSidebarPattern: hasPattern,
    sidebarContent,
  } = useSelector(selectTheme);

  const { currentApp: selectedTeam } = useSelector(selectApplication);

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
