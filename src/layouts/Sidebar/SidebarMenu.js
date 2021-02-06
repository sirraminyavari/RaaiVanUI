import { useDispatch } from 'react-redux';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { Link } from 'react-router-dom';
import * as Styled from './Sidebar.styles';
import Icons from 'components/Icons';
import { decode } from 'js-base64';

const SidebarMenu = ({ item }) => {
  const {
    NodeTypeID: id,
    TypeName: title,
    Sub: subMenu,
    path,
    icon,
    isOpen,
  } = item;
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
          <span style={{ marginRight: '5px' }}>{decode(title)}</span>
        </Styled.MenuTitle>
        {subMenu && !isOpen && Icons.moreVertical}
      </Styled.MenuContainer>
      {subMenu && (
        <Styled.SubMenuContainer isOpen={isOpen} itemsCount={subMenu.length}>
          {subMenu.map((sub, key) => {
            return (
              <Styled.SubMenu as={Link} to={sub.path} key={key}>
                {Icons['preview']({ size: 20 })}
                <span style={{ margin: '0 10px' }}>{decode(sub.TypeName)}</span>
              </Styled.SubMenu>
            );
          })}
        </Styled.SubMenuContainer>
      )}
    </>
  );
};

export default SidebarMenu;
