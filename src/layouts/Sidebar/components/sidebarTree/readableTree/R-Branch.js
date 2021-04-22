/**
 * Renders Main(root) menu item that may or may not has sub-menus(branches).
 */
import { memo, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { Link } from 'react-router-dom';
import * as Styled from '../../../Sidebar.styles';
import { decodeBase64 } from 'helpers/helpers';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import ReadableSubBranches from './R-SubBranch';
import { createSelector } from 'reselect';
import { WindowContext } from 'context/WindowProvider';

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
 */

/**
 *  @description Renders a menu item for sidebar.
 * @component
 * @param {PropType} props
 */
const ReadableBranch = (props) => {
  const { item } = props;

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

  return (
    <>
      <Styled.MenuContainer className="BorderRadius4">
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
            {decodeBase64(title)}
          </Styled.MenuTitle>
        </Styled.MenuTitleWrapper>
      </Styled.MenuContainer>
      {childMenus && (
        <ReadableSubBranches
          parentID={id}
          isOpen={isOpen()}
          menuList={childMenus}
        />
      )}
    </>
  );
};

export default memo(ReadableBranch);
