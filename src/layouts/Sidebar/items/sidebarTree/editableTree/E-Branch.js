/**
 * Renders Main(root) menu item that may or may not has sub-menus(branches).
 */
import { memo, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import * as Styled from '../../../Sidebar.styles';
import { decodeBase64 } from 'helpers/helpers';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import EditableSubBranch from './E-SubBranch';
import { createSelector } from 'reselect';
import { WindowContext } from 'context/WindowProvider';
import DragIcon from 'components/Icons/DragIcon/Drag';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import InlineEdit from 'components/InlineEdit/InlineEdit';

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
const EditableBranch = (props) => {
  const { item, isDragging, dragHandleProps } = props;

  const {
    NodeTypeID: id,
    TypeName: title,
    Sub: childMenus,
    IconURL: iconImage,
  } = item;

  const openMenuID = useSelector(selectOpenMenuID);
  const dispatch = useDispatch();
  const { toggleSidebarMenu } = sidebarMenuSlice.actions;
  const { RV_RevFloat } = useContext(WindowContext);

  //! Toggle an item's sub-menu.
  const handleDropdown = useCallback(() => dispatch(toggleSidebarMenu(id)), []);

  //! Is true, If an item's sub-menu is open.
  const isOpen = () => openMenuID.includes(id);

  const handleOnTrashClick = (e) => {
    e.stopPropagation();
    console.log('delete menu');
  };

  return (
    <>
      <Styled.MenuContainer
        isOpen={isOpen()}
        className="BorderRadius4"
        isDragging={isDragging}>
        <Styled.MenuTitleWrapper>
          {childMenus ? (
            <CaretIcon
              onClick={handleDropdown}
              size={20}
              dir={isOpen() ? 'down' : RV_RevFloat}
            />
          ) : (
            <Styled.MenuItemImage src={iconImage} alt="menu-icon" />
          )}
          <Styled.MenuTitle>
            <InlineEdit
              text={decodeBase64(title)}
              onSetText={(text) => console.log(text)}
            />
          </Styled.MenuTitle>
        </Styled.MenuTitleWrapper>
        <Styled.ActionsWrapper>
          <Styled.TrashIconWrapper onClick={handleOnTrashClick}>
            <TrashIcon />
          </Styled.TrashIconWrapper>
          <Styled.DragIconWrapper {...dragHandleProps}>
            <DragIcon />
          </Styled.DragIconWrapper>
        </Styled.ActionsWrapper>
      </Styled.MenuContainer>
      {childMenus && (
        <EditableSubBranch
          parentID={id}
          isOpen={isOpen()}
          menuList={childMenus}
        />
      )}
    </>
  );
};

export default memo(EditableBranch);
