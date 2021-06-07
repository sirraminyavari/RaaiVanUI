/**
 * Renders header component for sidebar.
 */
import { useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { createSelector } from 'reselect';
import Logo_Fa from 'assets/images/cliqmind_logo_white.svg';
import Logo_En from 'assets/images/cliqmind_logo_white_en.svg';
import * as Styled from '../Sidebar.styles';
import ToggleIcon from 'components/Icons/SidebarToggleIcons/Toggle';
import { getURL } from 'helpers/helpers';
import { MOBILE_BOUNDRY } from 'constant/constants';
import { themeSlice } from 'store/reducers/themeReducer';
import useWindow from 'hooks/useWindowContext';

const selectIsSidebarOpen = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarOpen
);

const selectTeam = createSelector(
  (state) => state.theme,
  (theme) => theme.selectedTeam
);

const SidebarHeader = () => {
  const dispatch = useDispatch();
  const { toggleSidebar } = themeSlice.actions;
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const selectedTeam = useSelector(selectTeam);
  const { RV_RevFloat, RV_Float, RVGlobal, RV_RTL } = useWindow();

  const isSaas = RVGlobal.SAASBasedMultiTenancy;

  const isMobileScreen = useMediaQuery({
    query: `(max-width: ${MOBILE_BOUNDRY})`,
  });
  const isMobileNav = useMediaQuery({
    query: '(max-width: 975px)',
  });

  const isTeamSelected = !!selectedTeam?.id;

  //! Toggle sidebar drawer on click.
  const toggleDrawer = () => {
    if (isMobileScreen) return;
    isTeamSelected && dispatch(toggleSidebar(!isSidebarOpen));
  };

  useEffect(() => {
    if (isMobileNav) {
      dispatch(toggleSidebar(false));
    }
    if (!isTeamSelected) {
      dispatch(toggleSidebar(false));
    }
  }, [isMobileNav, dispatch]);

  return (
    <Styled.SidebarHeader>
      {isSidebarOpen && (
        <Link to={getURL('Home')}>
          <img
            src={isSaas ? (RV_RTL ? Logo_Fa : Logo_En) : RVGlobal.LogoURL}
            width={isSaas ? '120' : '60'}
            alt="logo-icon"
          />
        </Link>
      )}
      <Styled.ToggleArrow onClick={toggleDrawer}>
        <ToggleIcon dir={isSidebarOpen ? RV_Float : RV_RevFloat} size={25} />
      </Styled.ToggleArrow>
    </Styled.SidebarHeader>
  );
};

export default memo(SidebarHeader);
