/**
 * Renders header component for sidebar.
 */
import { useEffect, memo, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Logo_Fa from 'assets/images/cliqmind_logo_white.svg';
import Logo_En from 'assets/images/cliqmind_logo_white_en.svg';
import * as Styled from '../Sidebar.styles';
import ToggleIcon from 'components/Icons/SidebarToggleIcons/Toggle';
import { useMediaQuery } from 'react-responsive';
import { getURL } from 'helpers/helpers';
import { MOBILE_BOUNDRY } from 'constant/constants';
import { themeSlice } from 'store/reducers/themeReducer';
import { createSelector } from 'reselect';
import { WindowContext } from 'context/WindowProvider';

const selectIsSidebarOpen = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarOpen
);

const SidebarHeader = () => {
  const dispatch = useDispatch();
  const { toggleSidebar, toggleSetting } = themeSlice.actions;
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const { RV_RevFloat, RV_Float, RVGlobal, RV_RTL } = useContext(WindowContext);

  const isSaas = RVGlobal.SAASBasedMultiTenancy;

  const isMobileScreen = useMediaQuery({
    query: `(max-width: ${MOBILE_BOUNDRY})`,
  });
  const isMobileNav = useMediaQuery({
    query: '(max-width: 975px)',
  });

  //! Toggle sidebar drawer on click.
  const toggleDrawer = () => {
    if (isMobileScreen) return;
    dispatch(toggleSidebar(!isSidebarOpen));
    if (isSidebarOpen) {
      dispatch(toggleSetting(false));
    }
  };

  useEffect(() => {
    if (isMobileNav) {
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