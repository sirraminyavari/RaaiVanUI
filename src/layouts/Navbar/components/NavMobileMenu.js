import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import NavButtonsList from './buttonsList';
import MenuIcon from 'components/Icons/MenuIcon/HamburgerMenuIcon';
import NavbarIcons from 'components/Icons/NavbarIcons/NavbarIcons';
import * as Styled from '../Navbar.styles';
import OnClickAway from 'components/OnClickAway/OnClickAway';

const NavMenus = () => {
  const [isMenuShown, setIsMenuShown] = useState(false);
  const node = useRef();
  const flattenedNavButtons = NavButtonsList.reduce(
    (acc, val) => acc.concat(val.options ? val.options : val),
    []
  );

  const handleShowMenu = () => {
    setIsMenuShown(!isMenuShown);
  };

  return (
    <OnClickAway onAway={() => setIsMenuShown(false)} ref={node}>
      <Styled.NavMenuContainer>
        <MenuIcon size={30} color="#fff" onClick={handleShowMenu} />
        <Styled.MenuOptionsWrapper isOpen={isMenuShown}>
          {flattenedNavButtons.map((btn, index) => {
            return (
              <Styled.NavMenuOption as={Link} to={btn.linkTo} key={index}>
                {NavbarIcons[btn.icon]({ color: '#2B388F', size: 20 })}
                {btn.title}
              </Styled.NavMenuOption>
            );
          })}
        </Styled.MenuOptionsWrapper>
      </Styled.NavMenuContainer>
    </OnClickAway>
  );
};

export default NavMenus;
