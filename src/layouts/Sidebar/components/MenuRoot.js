/**
 * Renders Main(root) menu item that may or may not has sub-menus(branches).
 */
import { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { Link } from 'react-router-dom';
import * as Styled from '../Sidebar.styles';
import { decode } from 'js-base64';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import ShowMoreIcon from 'components/Icons/ShowMoreIcons/ShowMore';
import SidebarMenuBranches from './MenuBranches';
import { createSelector } from 'reselect';

// import FallbackImage from 'assets/images/cliqmind_mini.png'

const { RV_RevFloat } = window;

const selectOpenMenuID = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.openMenuID
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
  const { item, isDragging, dragProps } = props;

  const {
    NodeTypeID: id,
    TypeName: title,
    Sub: childMenus,
    IconURL: iconImage,
  } = item;

  const openMenuID = useSelector(selectOpenMenuID);
  const dispatch = useDispatch();
  const { toggleSidebarMenu } = sidebarMenuSlice.actions;

  //! Toggle an item's sub-menu.
  const handleDropdown = useCallback(() => dispatch(toggleSidebarMenu(id)), []);

  //! Is true, If an item's sub-menu is open.
  const isOpen = () => openMenuID.includes(id);

  return (
    <>
      <Styled.MenuContainer
        className="BorderRadius4"
        isDragging={isDragging}
        {...dragProps}
        forwardedAs={childMenus ? 'div' : Link}
        to={`/classes/${id}`}
        onClick={childMenus ? handleDropdown : null}>
        <Styled.MenuTitleWrapper>
          {childMenus ? (
            <CaretIcon dir={isOpen() ? 'down' : RV_RevFloat} />
          ) : (
            <Styled.MenuItemImage src={iconImage} alt="menu-icon" />
          )}
          <Styled.MenuTitle>{decode(title)}</Styled.MenuTitle>
        </Styled.MenuTitleWrapper>
        {childMenus && !isOpen() && <ShowMoreIcon dir="vertical" />}
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
