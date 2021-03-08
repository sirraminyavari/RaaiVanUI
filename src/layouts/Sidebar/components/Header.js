/**
 * Renders header component for sidebar.
 */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import withTheme from 'components/withTheme/withTheme';
import { Link } from 'react-router-dom';
import Logo from 'assets/images/cliqmind_logo_white.svg';
import * as Styled from '../Sidebar.styles';
import ToggleIcon from 'components/Icons/SidebarToggleIcons/Toggle';
import { useMediaQuery } from 'react-responsive';
import { getURL } from 'helpers/helpers';
import { MOBILE_BOUNDRY } from 'constant/constants';
import { BG_WARMER } from 'constant/Colors';

const { RV_RevFloat, RV_Float, RVGlobal } = window;

const isSaas = RVGlobal.SAASBasedMultiTenancy;

const SidebarHeader = (props) => {
  const dispatch = useDispatch();
  const { toggleSidebar, toggleSetting } = props.theme.actions;
  const { isSidebarOpen } = props.theme.states;

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
  }, [isMobileNav]);

  return (
    <Styled.SidebarHeader className={BG_WARMER}>
      {isSidebarOpen && (
        <Link to={getURL('Home')}>
          <img
            src={isSaas ? Logo : RVGlobal.LogoURL}
            width={isSaas ? '120' : '60'}
            alt="logo-icon"
          />
        </Link>
      )}
      <Styled.ToggleArrow onClick={toggleDrawer}>
        <ToggleIcon
          dir={isSidebarOpen ? RV_Float : RV_RevFloat}
          size={25}
          color="#fff"
        />
      </Styled.ToggleArrow>
    </Styled.SidebarHeader>
  );
};

export default withTheme(SidebarHeader);
