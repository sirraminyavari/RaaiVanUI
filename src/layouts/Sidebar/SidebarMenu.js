import { useDispatch } from 'react-redux';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { Link } from 'react-router-dom';
import * as Styled from './Sidebar.styles';
import Icons from 'components/Icons';

const SidebarMenu = ({ item }) => {
  const { id, title, subMenu, path, icon, isOpen } = item;
  const dispatch = useDispatch();
  const { toggleSidebarMenu } = sidebarMenuSlice.actions;
  const handleDropdown = () => dispatch(toggleSidebarMenu(id));
  return (
    <>
      <Styled.MenuContainer
        as={subMenu ? 'div' : Link}
        to={path}
        onClick={subMenu ? handleDropdown : null}>
        <Styled.MenuTitle>
          {subMenu ? (isOpen ? Icons.caretDown : Icons.caretLeft) : Icons[icon]}
          <span style={{ marginRight: '5px' }}>{title}</span>
        </Styled.MenuTitle>
        {subMenu && !isOpen && Icons.moreVertical}
      </Styled.MenuContainer>
      {subMenu && (
        <Styled.SubMenuContainer isOpen={isOpen} itemsCount={subMenu.length}>
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
