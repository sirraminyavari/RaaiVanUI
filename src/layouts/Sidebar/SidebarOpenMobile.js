/**
 * Renders open sidebar area for non-mobile screens.
 */
import { lazy, Suspense, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Styled from './Sidebar.styles';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import SidebarHeader from './items/Header';
import SidebarFooter from './items/footer/Footer';
import { MAIN_CONTENT } from 'constant/constants';
import OnClickAway from 'components/OnClickAway/OnClickAway';
import { useThemeSlice } from 'store/slice/theme';
import { selectTheme } from 'store/slice/theme/selectors';

const SidebarContentOpenMobile = lazy(() =>
  import(/* webpackChunkName: "sidebar-open-content"*/ './items/ContentOpen')
);

const OpenSidebar = () => {
  const dispatch = useDispatch();

  const {
    actions: { toggleSidebar },
  } = useThemeSlice();
  const themeState = useSelector(selectTheme);

  const sidebarContent = themeState.sidebarContent;
  const isOpen = themeState.isSidebarOpen;
  const hasPattern = themeState.hasSidebarPattern;

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
