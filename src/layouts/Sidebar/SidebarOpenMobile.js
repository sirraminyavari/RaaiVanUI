/**
 * Renders open sidebar area for non-mobile screens.
 */
import { lazy, Suspense, memo } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from './Sidebar.styles';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import SidebarHeader from './items/Header';
import SidebarFooter from './items/footer/Footer';
import { MAIN_CONTENT } from 'constant/constants';

const SidebarContentOpenMobile = lazy(() =>
  import(/* webpackChunkName: "sidebar-open-content"*/ './items/ContentOpen')
);

const selectSidebarContent = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarContent
);

const selectHasPattern = createSelector(
  (state) => state.theme,
  (theme) => theme.hasSidebarPattern
);

const selectisSidebarOpen = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarOpen
);

const OpenSidebar = () => {
  const sidebarContent = useSelector(selectSidebarContent);
  const isOpen = useSelector(selectisSidebarOpen);
  const hasPattern = useSelector(selectHasPattern);

  const isMainContent = sidebarContent.current === MAIN_CONTENT;

  return (
    <Styled.SidebarMobileContainer isOpen={isOpen} hasPattern={hasPattern}>
      <SidebarHeader />
      <Styled.ContentWrapper isMainContent={isMainContent}>
        <Suspense fallback={<LogoLoader size={10} />}>
          <SidebarContentOpenMobile />
        </Suspense>
      </Styled.ContentWrapper>
      <SidebarFooter />
    </Styled.SidebarMobileContainer>
  );
};

export default memo(OpenSidebar);
