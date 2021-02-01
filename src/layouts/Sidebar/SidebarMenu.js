import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MenuContainer,
  MenuTitle,
  SubMenuContainer,
  SubMenu,
} from './Sidebar.styles';
import Icons from 'components/Icons';

const SidebarMenu = ({ item }) => {
  const { title, subMenu, path, icon } = item;
  const [show, setShow] = useState(false);
  const handleDropdown = () => setShow(!show);
  return (
    <>
      <MenuContainer
        as={subMenu ? 'div' : Link}
        to={path}
        onClick={subMenu ? handleDropdown : null}>
        <MenuTitle>
          {subMenu
            ? show
              ? Icons['caretDown']
              : Icons['caretLeft']
            : Icons[icon]}
          <span style={{ marginRight: '5px' }}>{title}</span>
        </MenuTitle>
        {subMenu && !show && Icons['moreVertical']}
      </MenuContainer>
      {subMenu && (
        <SubMenuContainer show={show} itemsCount={subMenu.length}>
          {subMenu.map((sub) => {
            return (
              <SubMenu as={Link} to={sub.path}>
                {Icons['home']}
                <span style={{ margin: '0 10px' }}>{sub.title}</span>
              </SubMenu>
            );
          })}
        </SubMenuContainer>
      )}
    </>
  );
};

export default SidebarMenu;
