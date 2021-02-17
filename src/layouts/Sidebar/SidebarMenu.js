import { useDispatch, useSelector } from 'react-redux';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { Link } from 'react-router-dom';
import * as Styled from './Sidebar.styles';
import { decode } from 'js-base64';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import ShowMoreIcon from 'components/Icons/ShowMoreIcons/ShowMore';
import SubMenus from './components/SubMenus';

const SidebarMenu = ({ item, isDragging, dragProps }) => {
  const {
    NodeTypeID: id,
    TypeName: title,
    Sub: subMenus,
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
        isDragging={isDragging}
        {...dragProps}
        as={subMenus ? 'div' : Link}
        to={`/classes/${id}`}
        onClick={subMenus ? handleDropdown : null}>
        <Styled.MenuTitle>
          {subMenus ? (
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
        {subMenus && !isOpen() && <ShowMoreIcon dir="vertical" />}
      </Styled.MenuContainer>
      {subMenus && <SubMenus isOpen={isOpen()} subList={subMenus} />}
    </>
  );
};

export default SidebarMenu;
