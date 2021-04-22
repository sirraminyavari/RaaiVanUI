/**
 * A component that renders an icon alongside a popup menu in mobile screen.
 */
import { Link } from 'react-router-dom';
import NavButtonsList from './buttonsList';
import MenuIcon from 'components/Icons/MenuIcon/HamburgerMenuIcon';
import NavbarIcons from '../components/NavbarIcons/NavbarIcons';
import * as Styled from '../Navbar.styles';
import PopupMenu from 'components/PopupMenu/PopupMenu';

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
        <MenuIcon size={30} color="#fff" style={{ cursor: 'pointer' }} />
      </div>
      <Styled.MenuOptionsWrapper>
        {flattenedNavButtons.map((btn, index) => {
          return (
            <Styled.NavMenuOption as={Link} to={btn.linkTo} key={index}>
              {NavbarIcons[btn.icon]({ className: 'WarmColor', size: 20 })}
              {btn.title}
            </Styled.NavMenuOption>
          );
        })}
      </Styled.MenuOptionsWrapper>
    </PopupMenu>
  );
};

export default NavMenus;
