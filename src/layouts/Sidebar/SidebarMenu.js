import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MenuContainer,
  MenuTitle,
  SubMenuContainer,
  SubMenu,
} from './Sidebar.styles';

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
          <i
            className={`fa fa-${
              subMenu ? (show ? 'caret-down' : 'caret-left') : icon
            }`}
            aria-hidden="true"
          />
          <span style={{ marginRight: '5px' }}>{title}</span>
        </MenuTitle>
        {subMenu && <i className="fa fa-ellipsis-v" aria-hidden="true"></i>}
      </MenuContainer>
      {subMenu && (
        <SubMenuContainer show={show} itemsCount={subMenu.length}>
          {subMenu.map((sub) => {
            return (
              <SubMenu as={Link} to={sub.path}>
                <i
                  className="fa fa-user"
                  style={{ margin: '0 5px' }}
                  aria-hidden="true"
                />
                <span>{sub.title}</span>
              </SubMenu>
            );
          })}
        </SubMenuContainer>
      )}
    </>
  );
};

export default SidebarMenu;
