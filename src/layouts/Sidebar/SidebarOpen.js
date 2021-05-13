/**
 * Renders open sidebar area for non-mobile screens.
 */
import { lazy, Suspense, useEffect, memo, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from './Sidebar.styles';
import { getSidebarNodes } from 'store/actions/sidebar/sidebarMenuAction';
import getConfigPanels from 'store/actions/sidebar/sidebarPanelsAction';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import SidebarHeader from './items/Header';
import SidebarFooter from './items/footer/Footer';
import Resizable from 'components/Resizable/Resizable';
import { themeSlice } from 'store/reducers/themeReducer';
import { MIN_WIDTH, MAX_WIDTH, MAIN_CONTENT } from 'constant/constants';
import { WindowContext } from 'context/WindowProvider';

const SidebarContentOpen = lazy(() =>
  import(/* webpackChunkName: "sidebar-open-content"*/ './items/ContentOpen')
);

const selectIsSidebarOpen = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarOpen
);

const selectSidebarContent = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarContent
);

const selectOpenWidth = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarOpenWidth
);

const OpenSidebar = () => {
  const dispatch = useDispatch();
  const { setOpenWidth, setCurrentWidth } = themeSlice.actions;
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const sidebarContent = useSelector(selectSidebarContent);
  const sidebarOpenWidth = useSelector(selectOpenWidth);
  const { RV_RTL } = useContext(WindowContext);

  useEffect(() => {
    if (isSidebarOpen) {
      dispatch(getSidebarNodes());
      dispatch(getConfigPanels());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSidebarOpen, dispatch]);

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
      <Styled.SidebarContainer>
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
