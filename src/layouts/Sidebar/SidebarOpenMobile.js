/**
 * Renders open sidebar area for non-mobile screens.
 */
import { lazy, Suspense, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from './Sidebar.styles';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import SidebarHeader from './items/Header';
import SidebarFooter from './items/footer/Footer';
import { MAIN_CONTENT } from 'constant/constants';
import OnClickAway from 'components/OnClickAway/OnClickAway';
import { themeSlice } from 'store/reducers/themeReducer';

const { toggleSidebar } = themeSlice.actions;

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

const selectIsSidebarOpen = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarOpen
);

const OpenSidebar = () => {
  const dispatch = useDispatch();
  const sidebarContent = useSelector(selectSidebarContent);
  const isOpen = useSelector(selectIsSidebarOpen);
  const hasPattern = useSelector(selectHasPattern);

  const isMainContent = sidebarContent.current === MAIN_CONTENT;

  const closeSidebar = () => {
    dispatch(toggleSidebar(false));
  };

  return (
    <OnClickAway onAway={closeSidebar}>
      <Styled.SidebarMobileContainer isOpen={isOpen} hasPattern={hasPattern}>
        <SidebarHeader />
        <Styled.ContentWrapper isMainContent={isMainContent}>
          <Suspense fallback={<LogoLoader size={10} />}>
            <SidebarContentOpenMobile />
          </Suspense>
        </Styled.ContentWrapper>
        <SidebarFooter />
      </Styled.SidebarMobileContainer>
    </OnClickAway>
  );
};

export default memo(OpenSidebar);
