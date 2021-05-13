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
import { MAIN_CONTENT } from 'constant/constants';

const SidebarContentClose = lazy(() =>
  import(/* webpackChunkName: "sidebar-close-content"*/ './items/ContentClose')
);

const selectTeam = createSelector(
  (state) => state.theme,
  (theme) => theme.selectedTeam
);

const selectSidebarContent = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarContent
);

const CloseSidebar = () => {
  const dispatch = useDispatch();
  const selectedTeam = useSelector(selectTeam);
  const sidebarContent = useSelector(selectSidebarContent);

  useEffect(() => {
    dispatch(getSidebarNodes());
    dispatch(getConfigPanels());
  }, []);

  const isMainContent = sidebarContent.current === MAIN_CONTENT;
  const isTeamSelected = !!selectedTeam?.id;

  return (
    <Styled.SidebarContainer>
      <SidebarHeader />
      <Styled.ContentWrapper isMainContent={isMainContent}>
        <Suspense fallback={<LogoLoader size={5} />}>
          {isTeamSelected && isMainContent && <SidebarContentClose />}
        </Suspense>
      </Styled.ContentWrapper>
      {isTeamSelected && isMainContent && <SidebarFooter />}
    </Styled.SidebarContainer>
  );
};

export default memo(CloseSidebar);
