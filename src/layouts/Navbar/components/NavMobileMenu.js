import { Link } from 'react-router-dom';
import NavButtonsList from './buttonsList';
import MenuIcon from 'components/Icons/MenuIcon/HamburgerMenuIcon';
import NavbarIcons from 'components/Icons/NavbarIcons/NavbarIcons';
import * as Styled from '../Navbar.styles';
import PopupMenu from 'components/PopupMenu/PopupMenu';

const NavMenus = () => {
  const flattenedNavButtons = NavButtonsList.reduce(
    (acc, val) => acc.concat(val.actions ? val.actions : val),
    []
  );

  return (
    <PopupMenu trigger="click" align="bottom">
      <div>
        <MenuIcon size={30} color="#fff" />
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
