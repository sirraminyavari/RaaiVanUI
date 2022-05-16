/**
 * Renders open sidebar area for non-mobile screens.
 */
import { lazy, Suspense, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from './Sidebar.styles';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import SidebarHeader from './items/Header';
import SidebarFooter from './items/footer/Footer';
import Resizable from 'components/Resizable/Resizable';
import {
  MIN_WIDTH,
  MAX_WIDTH,
  MAIN_CONTENT,
  INTRO_ONBOARD,
} from 'constant/constants';
import useWindow from 'hooks/useWindowContext';
import { selectTheme } from 'store/slice/theme/selectors';
import { useThemeSlice } from 'store/slice/theme';

const SidebarContentOpen = lazy(() =>
  import(/* webpackChunkName: "sidebar-open-content"*/ './items/ContentOpen')
);

const selectOnboardingName = createSelector(
  (state) => state.onboarding,
  (onboarding) => onboarding.name
);

const OpenSidebar = () => {
  const dispatch = useDispatch();
  const { RV_RTL } = useWindow();

  const {
    actions: { setOpenWidth, setCurrentWidth },
  } = useThemeSlice();
  const themeState = useSelector(selectTheme);

  const sidebarContent = themeState.sidebarContent;
  const sidebarOpenWidth = themeState.sidebarOpenWidth;
  const isOpen = themeState.isSidebarOpen;
  const hasPattern = themeState.hasSidebarPattern;
  const onboardingName = useSelector(selectOnboardingName);

  const isMainContent = sidebarContent.current === MAIN_CONTENT;

  //! Check if onboarding is activated on 'intro' mode.
  const isIntroOnboarding =
    !!onboardingName && onboardingName === INTRO_ONBOARD;

  //! Update sidebar open width.
  const handleOnResizeEnd = (size) => {
    dispatch(setOpenWidth(size.width));
  };

  //! Update sidebar current width.
  const handleOnResizing = (size) => {
    dispatch(setCurrentWidth(size.width));
  };

  return (
    <Resizable
      disable={isIntroOnboarding}
      resizableStyles={{
        position: 'fixed',
        top: 0,
        zIndex: 1000,
      }}
      resizerClass="sidebar-resizer"
      size={{ width: sidebarOpenWidth }}
      minConstraints={{ width: MIN_WIDTH }}
      maxConstraints={{ width: MAX_WIDTH }}
      resizeHandles={RV_RTL ? ['w'] : ['e']}
      onResizing={handleOnResizing}
      onResizeEnd={handleOnResizeEnd}
    >
      <Styled.SidebarContainer isOpen={isOpen} hasPattern={hasPattern}>
        <SidebarHeader />
        <Styled.ContentWrapper isMainContent={isMainContent}>
          <Suspense fallback={<LogoLoader />}>
            <SidebarContentOpen />
          </Suspense>
        </Styled.ContentWrapper>
        <SidebarFooter />
      </Styled.SidebarContainer>
    </Resizable>
  );
};

export default memo(OpenSidebar);
