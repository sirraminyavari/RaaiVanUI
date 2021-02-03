import { useDispatch, useSelector } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import { Link } from 'react-router-dom';
import Logo from 'assets/images/logo.svg';
import * as Styled from './Sidebar.styles';
import Icons from 'components/Icons';

const Header = () => {
  const dispatch = useDispatch();
  const { toggleSidebar, toggleSetting } = themeSlice.actions;
  const { isSidebarOpen } = useSelector((state) => state.theme);
  const toggleMenu = () => {
    dispatch(toggleSidebar(!isSidebarOpen));
    if (isSidebarOpen) {
      dispatch(toggleSetting(false));
    }
  };
  return (
    <Styled.SidebarHeader>
      {isSidebarOpen && (
        <Link to="/home">
          <img src={Logo} width="120" alt="logo-icon" />
        </Link>
      )}
      <Styled.ToggleArrow onClick={toggleMenu}>
        {Icons[isSidebarOpen ? 'toggleRight' : 'toggleLeft']}
      </Styled.ToggleArrow>
    </Styled.SidebarHeader>
  );
};

export default Header;
