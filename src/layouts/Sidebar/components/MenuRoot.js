/**
 * Renders Main(root) menu item that may or may not has sub-menus(branches).
 */
import { memo, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { Link } from 'react-router-dom';
import * as Styled from '../Sidebar.styles';
import { decode } from 'js-base64';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import DragIcon from 'components/Icons/DragIcon/Drag';
import SidebarMenuBranches from './MenuBranches';
import { createSelector } from 'reselect';
import { WindowContext } from 'context/WindowProvider';

const selectOpenMenuID = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.openMenuID
);

const selectSidebarContent = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarContent
);

/**
 * @typedef ItemType
 * @property {string} NodeTypeID -The id of the node.
 * @property {string} TypeName -The name of the node.
 * @property {Array} Sub -An array of sub-nodes.
 * @property {string} IconURL -The url of node's icon.
 */

/**
 * @typedef PropType
 * @property {ItemType} item - The main menu item.
 * @property {boolean} isDragging -A boolean that determines if item is dragging or not.
 * @property {*} dragProps -The props that are provided from react-beautiful-dnd
 * ...and passed to menu item.
 */

/**
 *  @description Renders a menu item for sidebar.
 * @component
 * @param {PropType} props
 */
const SidebarMenuRoot = (props) => {
  const { item, isDragging, dragHandleProps } = props;

  const {
    NodeTypeID: id,
    TypeName: title,
    Sub: childMenus,
    IconURL: iconImage,
  } = item;

  const openMenuID = useSelector(selectOpenMenuID);
  const sidebarContent = useSelector(selectSidebarContent);
  const dispatch = useDispatch();
  const { toggleSidebarMenu } = sidebarMenuSlice.actions;
  const { RV_RevFloat } = useContext(WindowContext);

  //! Toggle an item's sub-menu.
  const handleDropdown = useCallback(() => dispatch(toggleSidebarMenu(id)), []);

  //! Is true, If an item's sub-menu is open.
  const isOpen = () => openMenuID.includes(id);

  return (
    <>
      <Styled.MenuContainer className="BorderRadius4" isDragging={isDragging}>
        <Styled.MenuTitleWrapper>
          {childMenus ? (
            <CaretIcon
              size={20}
              dir={isOpen() ? 'down' : RV_RevFloat}
              onClick={handleDropdown}
            />
          ) : (
            <Styled.MenuItemImage src={iconImage} alt="menu-icon" />
          )}
          <Styled.MenuTitle as={Link} to={`/classes/${id}`}>
            {decode(title)}
          </Styled.MenuTitle>
        </Styled.MenuTitleWrapper>
        {sidebarContent === 'manage' && (
          <Styled.DragIconWrapper
            {...dragHandleProps}
            style={{ cursor: 'row-resize' }}>
            <DragIcon />
          </Styled.DragIconWrapper>
        )}
      </Styled.MenuContainer>
      {childMenus && (
        <SidebarMenuBranches
          parentID={id}
          isOpen={isOpen()}
          menuList={childMenus}
        />
      )}
    </>
  );
};

export default memo(SidebarMenuRoot);
