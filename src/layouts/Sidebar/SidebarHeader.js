import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from 'context/ThemeProvider';
import Logo from 'assets/images/logo.svg';
import { SidebarHeader, ToggleArrow } from './Sidebar.styles';
import Icons from 'components/Icons';

const Header = () => {
  const { isOpen, setIsOpen, setShowSetting } = useContext(ThemeContext);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setShowSetting(false);
    }
  };
  return (
    <SidebarHeader>
      {isOpen && (
        <Link to="/home">
          <img src={Logo} width="120" alt="logo-icon" />
        </Link>
      )}
      <ToggleArrow onClick={toggleMenu}>
        {Icons[isOpen ? 'toggleRight' : 'toggleLeft']}
      </ToggleArrow>
    </SidebarHeader>
  );
};

export default Header;
