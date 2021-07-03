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
import { themeSlice } from 'store/reducers/themeReducer';
import { MIN_WIDTH, MAX_WIDTH, MAIN_CONTENT } from 'constant/constants';
import useWindow from 'hooks/useWindowContext';

const SidebarContentOpen = lazy(() =>
  import(/* webpackChunkName: "sidebar-open-content"*/ './items/ContentOpen')
);

const selectSidebarContent = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarContent
);

const selectOpenWidth = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarOpenWidth
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
  const dispatch = useDispatch();
  const { setOpenWidth, setCurrentWidth } = themeSlice.actions;
  const sidebarContent = useSelector(selectSidebarContent);
  const sidebarOpenWidth = useSelector(selectOpenWidth);
  const isOpen = useSelector(selectisSidebarOpen);
  const hasPattern = useSelector(selectHasPattern);
  const { RV_RTL } = useWindow();

  const isMainContent = sidebarContent.current === MAIN_CONTENT;

  const handleOnResizeEnd = (size) => {
    dispatch(setOpenWidth(size.width));
  };

  const handleOnResizing = (size) => {
    dispatch(setCurrentWidth(size.width));
  };

  return (
    <Resizable
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
      onResizeEnd={handleOnResizeEnd}>
      <Styled.SidebarContainer isOpen={isOpen} hasPattern={hasPattern}>
        <SidebarHeader />
        <Styled.ContentWrapper isMainContent={isMainContent}>
          <Suspense fallback={<LogoLoader size={10} />}>
            <SidebarContentOpen />
          </Suspense>
        </Styled.ContentWrapper>
        <SidebarFooter />
      </Styled.SidebarContainer>
    </Resizable>
  );
};

export default memo(OpenSidebar);
