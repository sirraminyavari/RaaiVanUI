import { useContext } from 'react';
import NavBtnComponent from 'components/NavbarButton/NavBotton';
import NavButtons from './NavButtons';
import NavSearch from './NavSearch';
import NavbarStyle from 'assets/jss/components/NavbarStyle';
import * as Buttons from '../ButtonsList';
import { ThemeContext } from 'context/ThemeProvider';

const LogedInNav = () => {
  const { isOpen, setIsOpen } = useContext(ThemeContext);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div className="RevDirection RevTextAlign" style={NavbarStyle.menu}>
        <div style={NavbarStyle.menuChild}></div>
        <NavBtnComponent {...Buttons.Menu} onClickButton={toggleMenu} />
      </div>
      <div
        className="small-12 medium-12 large-12 Direction TextAlign"
        style={NavbarStyle.logedInNav}>
        <NavButtons />
        <NavSearch />
      </div>
    </>
  );
};

export default LogedInNav;
