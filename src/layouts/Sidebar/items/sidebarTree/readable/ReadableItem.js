/**
 * Renders menu item that may or may not have sub-menus(branches).
 */
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import { Link } from 'react-router-dom';
import { mutateTree } from '@atlaskit/tree';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import getIcon from '../getItemIcon';

const INDENT_PER_LEVEL = 27;

const selectTree = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.dndTree
);

const selectActivePath = createSelector(
  (state) => state.theme,
  (theme) => theme.activePath
);

/**
 * @typedef ItemType
 * @property {Object} item -The item.
 * @property {function} onExpand -The callback function that calls on item expand.
 * @property {function} onCollapse -The callback function that calls on item collapse.
 * @property {*} provided -Provided by dnd.
 * @property {number} depth -Depth of item on tree.
 */

/**
 * @typedef PropType
 * @property {ItemType} itemProps - The item props.
 */

/**
 *  @description Renders a menu item for sidebar.
 * @component
 * @param {PropType} props
 */
const ReadableBranch = (props) => {
  const { itemProps } = props;
  const tree = useSelector(selectTree);
  const activePath = useSelector(selectActivePath);
  const dispatch = useDispatch();
  const { setSidebarDnDTree } = sidebarMenuSlice.actions;

  const { item, onExpand, onCollapse, provided, depth } = itemProps;

  //! Expand tree on click.
  const handleOnClick = () => {
    if (item?.isCategory && !item?.isExpanded) {
      const mutatedTree = mutateTree(tree, item?.id, { isExpanded: true });
      dispatch(setSidebarDnDTree(mutatedTree));
    }
  };

  //! Check if selected item is active.
  const isSelected = activePath === `/classes/${item?.id}`;

  return (
    <>
      <Styled.MenuContainer
        indentStep={depth === 0 ? 0 : `${INDENT_PER_LEVEL * depth}`}
        isExpanded={item?.isExpanded}
        isSelected={isSelected}
        ref={provided.innerRef}
        {...provided.draggableProps}>
        <Styled.MenuTitleWrapper>
          {item?.isCategory ? (
            <Styled.CaretIconWrapper>
              {getIcon(item, onExpand, onCollapse)}
            </Styled.CaretIconWrapper>
          ) : (
            <Styled.MenuItemImage src={item?.data?.iconURL} alt="menu-icon" />
          )}
          <Styled.MenuTitle
            onClick={handleOnClick}
            as={Link}
            to={`/classes/${item?.id}`}>
            {item?.data?.title}
          </Styled.MenuTitle>
        </Styled.MenuTitleWrapper>
      </Styled.MenuContainer>
    </>
  );
};

export default ReadableBranch;
