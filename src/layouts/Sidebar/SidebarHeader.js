import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from 'context/ThemeProvider';
import Logo from 'assets/icons/logo.svg';
import { SidebarHeader, ToggleArrow } from './Sidebar.styles';

const Header = () => {
  const { isOpen, setIsOpen } = useContext(ThemeContext);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <SidebarHeader>
      {isOpen && (
        <Link to="/home">
          <img src={Logo} width="120" alt="logo-icon" />
        </Link>
      )}
      <ToggleArrow onClick={toggleMenu} isOpen={isOpen}>
        <i
          className={`fa fa-arrow-${isOpen ? 'right' : 'left'}`}
          aria-hidden={true}
        />
      </ToggleArrow>
    </SidebarHeader>
  );
};

export default Header;
