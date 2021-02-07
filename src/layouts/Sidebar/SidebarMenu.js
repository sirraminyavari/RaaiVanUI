import { useDispatch, useSelector } from 'react-redux';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { Link } from 'react-router-dom';
import * as Styled from './Sidebar.styles';
import { decode } from 'js-base64';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import ShowMoreIcon from 'components/Icons/ShowMoreIcons/ShowMore';
import SidebarIcons from 'components/Icons/SidebarIcons/SidebarIcons';

const SidebarMenu = ({ item }) => {
  const {
    NodeTypeID: id,
    TypeName: title,
    Sub: subMenu,
    IconURL: iconImage,
  } = item;
  const { openMenuID } = useSelector((state) => state.sidebarItems);
  const dispatch = useDispatch();
  const { toggleSidebarMenu } = sidebarMenuSlice.actions;

  const handleDropdown = () => dispatch(toggleSidebarMenu(id));

  const isOpen = () => openMenuID.includes(id);

  return (
    <>
      <Styled.MenuContainer
        as={subMenu ? 'div' : Link}
        to={`/classes/${id}`}
        onClick={subMenu ? handleDropdown : null}>
        <Styled.MenuTitle>
          {subMenu ? (
            isOpen() ? (
              <CaretIcon dir="down" />
            ) : (
              <CaretIcon dir="left" />
            )
          ) : (
            <img src={iconImage} alt="menu-icon" />
          )}
          <span style={{ marginRight: '5px' }}>{decode(title)}</span>
        </Styled.MenuTitle>
        {subMenu && !isOpen() && <ShowMoreIcon dir="vertical" />}
      </Styled.MenuContainer>
      {subMenu && (
        <Styled.SubMenuContainer isOpen={isOpen()} itemsCount={subMenu.length}>
          {subMenu.map((sub, key) => {
            return (
              <Styled.SubMenu
                as={Link}
                to={`/classes/${sub.NodeTypeID}`}
                key={key}>
                {sub.IconName && SidebarIcons[sub.IconName]({ size: 20 })}
                {sub.IconURL && <img src={sub.IconURL} alt="sub-menu-icon" />}
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
