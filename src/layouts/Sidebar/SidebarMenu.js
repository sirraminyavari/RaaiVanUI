import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Styled from './Sidebar.styles';
import Icons from 'components/Icons';

const SidebarMenu = ({ item }) => {
  const { title, subMenu, path, icon } = item;
  const [show, setShow] = useState(false);
  const handleDropdown = () => setShow(!show);
  return (
    <>
      <Styled.MenuContainer
        as={subMenu ? 'div' : Link}
        to={path}
        onClick={subMenu ? handleDropdown : null}>
        <Styled.MenuTitle>
          {subMenu ? (show ? Icons.caretDown : Icons.caretLeft) : Icons[icon]}
          <span style={{ marginRight: '5px' }}>{title}</span>
        </Styled.MenuTitle>
        {subMenu && !show && Icons.moreVertical}
      </Styled.MenuContainer>
      {subMenu && (
        <Styled.SubMenuContainer show={show} itemsCount={subMenu.length}>
          {subMenu.map((sub, key) => {
            return (
              <Styled.SubMenu as={Link} to={sub.path} key={key}>
                {Icons.home}
                <span style={{ margin: '0 10px' }}>{sub.title}</span>
              </Styled.SubMenu>
            );
          })}
        </Styled.SubMenuContainer>
      )}
    </>
  );
};

export default SidebarMenu;
