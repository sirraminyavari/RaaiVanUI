import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import { Link } from 'react-router-dom';
import Logo from 'assets/images/logo.svg';
import * as Styled from '../Sidebar.styles';
import ToggleIcon from 'components/Icons/SidebarToggleIcons/Toggle';
import { useMediaQuery } from 'react-responsive';
import { getURL } from 'helpers/helpers';
import { MOBILE_BOUNDRY } from 'constant/constants';

const SidebarHeader = () => {
  const dispatch = useDispatch();
  const { toggleSidebar, toggleSetting } = themeSlice.actions;
  const { isSidebarOpen } = useSelector((state) => state.theme);
  const isMobileScreen = useMediaQuery({
    query: `(max-width: ${MOBILE_BOUNDRY})`,
  });
  const isMobileNav = useMediaQuery({
    query: '(max-width: 975px)',
  });

  const toggleMenu = () => {
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
    <Styled.SidebarHeader isSidebarOpen={isSidebarOpen}>
      {isSidebarOpen && (
        <Link to={getURL('Home')}>
          <img src={Logo} width="120" alt="logo-icon" />
        </Link>
      )}
      <Styled.ToggleArrow onClick={toggleMenu}>
        <ToggleIcon dir={isSidebarOpen ? '' : 'left'} size={25} color="#fff" />
      </Styled.ToggleArrow>
    </Styled.SidebarHeader>
  );
};

export default SidebarHeader;
