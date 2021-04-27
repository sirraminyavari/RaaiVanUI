/**
 * A component that renders an icon alongside a popup menu in mobile screen.
 */
import { Link } from 'react-router-dom';
import NavButtonsList from './buttonsList';
import MenuIcon from 'components/Icons/MenuIcon/HamburgerMenuIcon';
import NavbarIcons from './NavbarIcons/NavbarIcons';
import * as Styled from '../Navbar.styles';
import PopupMenu from 'components/PopupMenu/PopupMenu';
import { C_WHITE, TC_VERYWARM } from 'constant/Colors';

const NavMenus = () => {
  const flattenedNavButtons = NavButtonsList.reduce(
    (acc, val) => acc.concat(val.actions ? val.actions : val),
    []
  );

  return (
    <PopupMenu
      arrowClass="no-arrow"
      menuStyle={`border: 0; margin: 0.8rem 0.2rem;`}
      trigger="click">
      <div>
        <MenuIcon size={30} className={C_WHITE} style={{ cursor: 'pointer' }} />
      </div>
      <Styled.MenuOptionsWrapper>
        {flattenedNavButtons.map((btn, index) => {
          return (
            <Styled.NavMenuOption as={Link} to={btn.linkTo} key={index}>
              {NavbarIcons[btn.icon]({ className: TC_VERYWARM, size: 20 })}
              {btn.title}
            </Styled.NavMenuOption>
          );
        })}
      </Styled.MenuOptionsWrapper>
    </PopupMenu>
  );
};

export default NavMenus;
